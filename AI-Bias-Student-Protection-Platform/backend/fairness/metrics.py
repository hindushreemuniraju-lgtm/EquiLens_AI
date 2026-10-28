import numpy as np
import pandas as pd
from typing import Dict, Any, List, Optional, Tuple

def compute_group_confusion_matrix(y_true: np.ndarray, y_pred: np.ndarray) -> Dict[str, int]:
    """Calculate TP, FP, TN, FN for a group."""
    tp = int(np.sum((y_true == 1) & (y_pred == 1)))
    fp = int(np.sum((y_true == 0) & (y_pred == 1)))
    tn = int(np.sum((y_true == 0) & (y_pred == 0)))
    fn = int(np.sum((y_true == 1) & (y_pred == 0)))
    return {"tp": tp, "fp": fp, "tn": tn, "fn": fn}

def calculate_fairness_scorecard(
    df: pd.DataFrame,
    protected_attr: str,
    target_col: str,
    pred_col: str,
    reference_group: Optional[str] = None
) -> Dict[str, Any]:
    """
    Computes Demographic Parity, Equal Opportunity Difference, Average Odds Difference,
    and EEOC 80% Disparate Impact across subgroups.
    """
    if protected_attr not in df.columns:
        raise ValueError(f"Protected attribute '{protected_attr}' not found in dataset.")
    if pred_col not in df.columns:
        raise ValueError(f"Prediction column '{pred_col}' not found in dataset.")
    
    has_ground_truth = bool(target_col in df.columns and df[target_col].notna().any())

    # Identify distinct groups
    groups = df[protected_attr].dropna().unique().tolist()
    if len(groups) < 2:
        return {
            "error": "At least two distinct groups are required for fairness auditing.",
            "groups": [str(g) for g in groups]
        }

    # Determine reference group (default to highest selection rate or largest group)
    group_stats = {}
    for g in groups:
        sub = df[df[protected_attr] == g]
        n_total = int(len(sub))
        n_selected = int(sub[pred_col].sum())
        sel_rate = float(n_selected / n_total) if n_total > 0 else 0.0

        stats: Dict[str, Any] = {
            "group": str(g),
            "sample_size": n_total,
            "selected_count": n_selected,
            "selection_rate": round(sel_rate, 4),
            "small_sample_warning": bool(n_total < 30)
        }

        if has_ground_truth:
            cm = compute_group_confusion_matrix(sub[target_col].to_numpy(), sub[pred_col].to_numpy())
            stats["confusion_matrix"] = cm
            # Rates
            positives = int(cm["tp"] + cm["fn"])
            negatives = int(cm["fp"] + cm["tn"])
            stats["tpr"] = round(float(cm["tp"] / positives), 4) if positives > 0 else None
            stats["fpr"] = round(float(cm["fp"] / negatives), 4) if negatives > 0 else None
            stats["accuracy"] = round(float((cm["tp"] + cm["tn"]) / n_total), 4) if n_total > 0 else 0.0
        
        group_stats[str(g)] = stats

    if not reference_group or str(reference_group) not in group_stats:
        # Default reference to group with highest selection rate (standard EEOC benchmark)
        reference_group = max(group_stats.keys(), key=lambda k: group_stats[k]["selection_rate"])

    ref_stats = group_stats[reference_group]
    ref_sr = float(ref_stats["selection_rate"])

    # Calculate Pairwise & Aggregated Metrics
    disparate_impact_ratios = {}
    dpr_values = {}
    eod_values = {}
    aod_values = {}
    adverse_impact_flags = {}

    for g, stats in group_stats.items():
        if g == reference_group:
            disparate_impact_ratios[g] = 1.0
            dpr_values[g] = 1.0
            adverse_impact_flags[g] = False
            continue

        g_sr = float(stats["selection_rate"])
        
        # 80% Rule Disparate Impact Ratio
        if ref_sr > 0:
            di_ratio = round(float(g_sr / ref_sr), 4)
        else:
            di_ratio = 1.0 if g_sr == 0 else 2.0
        
        disparate_impact_ratios[g] = float(di_ratio)
        adverse_impact_flags[g] = bool(di_ratio < 0.80)

        # Demographic Parity Ratio (symmetric min/max)
        if max(g_sr, ref_sr) > 0:
            dpr = round(float(min(g_sr, ref_sr) / max(g_sr, ref_sr)), 4)
        else:
            dpr = 1.0
        dpr_values[g] = float(dpr)

        # Equal Opportunity Difference & Average Odds Difference (if ground truth available)
        if has_ground_truth:
            ref_tpr = ref_stats.get("tpr")
            g_tpr = stats.get("tpr")
            ref_fpr = ref_stats.get("fpr")
            g_fpr = stats.get("fpr")

            if ref_tpr is not None and g_tpr is not None:
                eod = round(float(abs(g_tpr - ref_tpr)), 4)
                eod_values[g] = float(eod)
            else:
                eod_values[g] = None

            if ref_tpr is not None and g_tpr is not None and ref_fpr is not None and g_fpr is not None:
                aod = round(float(0.5 * (abs(g_fpr - ref_fpr) + abs(g_tpr - ref_tpr))), 4)
                aod_values[g] = float(aod)
            else:
                aod_values[g] = None

    # Overall Summary Metrics
    min_dpr = float(min(dpr_values.values())) if dpr_values else 1.0
    min_di_ratio = float(min(disparate_impact_ratios.values())) if disparate_impact_ratios else 1.0
    max_eod = float(max([v for v in eod_values.values() if v is not None], default=0.0))
    max_aod = float(max([v for v in aod_values.values() if v is not None], default=0.0))

    # Demographic Parity Difference (max sel rate - min sel rate)
    sel_rates = [s["selection_rate"] for s in group_stats.values()]
    dpd = round(float(max(sel_rates) - min(sel_rates)), 4)

    # Executive Fairness Health Index (0 - 100)
    # Formula: 100 - (1 - min_dpr)*35 - (max_eod)*35 - (max_aod)*30
    exec_score = 100.0 - ((1.0 - min_dpr) * 35.0) - (max_eod * 35.0) - (max_aod * 30.0)
    exec_score = round(float(max(0.0, min(100.0, exec_score))), 1)

    # Compliance Status
    has_violation = bool(any(adverse_impact_flags.values()))
    if has_violation:
        compliance_status = "ADVERSE_IMPACT_DETECTED"
        recommendation = "Model exhibits disparate impact (<80% Four-Fifths rule). Algorithmic remediation strongly advised before deployment."
    elif exec_score < 75.0:
        compliance_status = "MODERATE_FAIRNESS_RISK"
        recommendation = "Selection rates pass 80% rule but equal opportunity gaps exist between subgroups. Review threshold tuning."
    else:
        compliance_status = "AUDIT_COMPLIANT"
        recommendation = "Meets regulatory 80% rule and displays well-balanced opportunity odds across evaluated subgroups."

    return {
        "protected_attribute": protected_attr,
        "reference_group": reference_group,
        "has_ground_truth": has_ground_truth,
        "group_stats": group_stats,
        "metrics": {
            "demographic_parity_ratio": min_dpr,
            "demographic_parity_difference": dpd,
            "equal_opportunity_difference": max_eod,
            "average_odds_difference": max_aod,
            "min_disparate_impact_ratio": min_di_ratio,
            "executive_fairness_score": exec_score
        },
        "pairwise_metrics": {
            "disparate_impact_ratios": disparate_impact_ratios,
            "demographic_parity_ratios": dpr_values,
            "equal_opportunity_differences": eod_values,
            "average_odds_differences": aod_values,
            "adverse_impact_flags": adverse_impact_flags
        },
        "compliance_status": compliance_status,
        "recommendation": recommendation
    }

def recalculate_threshold_sandbox(
    df: pd.DataFrame,
    protected_attr: str,
    target_col: str,
    prob_col: str,
    group_thresholds: Dict[str, float]
) -> Dict[str, Any]:
    """
    Recalculates group selection rates and confusion matrices given custom group thresholds.
    Allows real-time interactive sandbox tuning.
    """
    updated_predictions = np.zeros(len(df), dtype=int)
    
    for g, thresh in group_thresholds.items():
        mask = (df[protected_attr].astype(str) == str(g))
        updated_predictions[mask] = (df.loc[mask, prob_col] >= thresh).astype(int)

    temp_df = df.copy()
    temp_df["sandbox_pred"] = updated_predictions
    
    return calculate_fairness_scorecard(
        temp_df,
        protected_attr=protected_attr,
        target_col=target_col,
        pred_col="sandbox_pred"
    )
