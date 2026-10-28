import numpy as np
import pandas as pd
from typing import Dict, Any, List, Optional
from scipy.stats import chi2_contingency

def calculate_cramers_v(confusion_matrix: np.ndarray) -> float:
    """Computes Cramer's V statistic for categorical-categorical association."""
    chi2 = chi2_contingency(confusion_matrix)[0]
    n = confusion_matrix.sum()
    if n == 0:
        return 0.0
    phi2 = chi2 / n
    r, k = confusion_matrix.shape
    if min(r - 1, k - 1) == 0:
        return 0.0
    return float(np.sqrt(phi2 / min(r - 1, k - 1)))

def analyze_proxy_leakage(
    df: pd.DataFrame,
    protected_attr: str,
    feature_columns: Optional[List[str]] = None
) -> Dict[str, Any]:
    """
    Surfaces latent indirect correlations between apparently neutral features
    (e.g., postal codes, college tier, graduation year) and protected groups.
    """
    if protected_attr not in df.columns:
        raise ValueError(f"Protected attribute '{protected_attr}' not found in dataset.")

    if not feature_columns:
        # Default to all other columns except ID and targets
        feature_columns = [
            c for c in df.columns 
            if c not in [protected_attr, "candidate_id", "hired_ground_truth", "selected_predicted", "model_probability", "id", "target"]
        ]

    proxy_findings = []
    
    for feat in feature_columns:
        if feat == protected_attr:
            continue

        try:
            # Check if categorical or numerical
            is_categorical = df[feat].dtype == "object" or df[feat].nunique() < 10
            
            if is_categorical:
                # Use Cramer's V on contingency table
                contingency_table = pd.crosstab(df[feat], df[protected_attr]).to_numpy()
                assoc_score = calculate_cramers_v(contingency_table)
                method = "Cramer's V (Categorical Association)"
            else:
                # Use Correlation or ANOVA F-statistic
                # If protected attr is categorical with >2 classes, use ANOVA
                if df[protected_attr].dtype == "object":
                    groups = [group[feat].dropna().values for _, group in df.groupby(protected_attr)]
                    from scipy.stats import f_oneway
                    f_val, p_val = f_oneway(*groups)
                    # Convert F to eta-squared (0 to 1)
                    k = len(groups)
                    n = len(df)
                    eta_sq = (f_val * (k - 1)) / (f_val * (k - 1) + (n - k)) if (f_val * (k - 1) + (n - k)) > 0 else 0
                    assoc_score = float(np.sqrt(max(0, min(1, eta_sq))))
                    method = "Eta Association (ANOVA F-statistic)"
                else:
                    corr = df[feat].corr(df[protected_attr])
                    assoc_score = float(abs(corr)) if pd.notna(corr) else 0.0
                    method = "Pearson Correlation"

            assoc_score = round(assoc_score, 4)

            # Classify Proxy Risk
            if assoc_score >= 0.40:
                risk_level = "HIGH"
                recommendation = f"Feature '{feat}' acts as a strong surrogate for {protected_attr}. Removing '{protected_attr}' from model features will NOT prevent discrimination unless '{feat}' is transformed, binned, or regularized."
            elif assoc_score >= 0.20:
                risk_level = "MEDIUM"
                recommendation = f"Moderate statistical correlation detected. Monitor during adversarial debiasing."
            else:
                risk_level = "LOW"
                recommendation = f"Low statistical association. Safe for standard qualification evaluation."

            proxy_findings.append({
                "feature": feat,
                "protected_attribute": protected_attr,
                "association_score": assoc_score,
                "method": method,
                "risk_level": risk_level,
                "recommendation": recommendation
            })
        except Exception:
            continue

    # Sort by association score descending
    proxy_findings.sort(key=lambda x: x["association_score"], reverse=True)

    high_risk_count = sum(1 for p in proxy_findings if p["risk_level"] == "HIGH")

    return {
        "protected_attribute": protected_attr,
        "features_evaluated_count": len(proxy_findings),
        "high_risk_proxy_count": high_risk_count,
        "proxy_findings": proxy_findings,
        "overall_summary": (
            f"Found {high_risk_count} high-risk proxy feature(s) that covertly leak {protected_attr} "
            f"information into downstream recruitment scoring models."
            if high_risk_count > 0 else
            f"No severe proxy leakage detected between evaluated non-sensitive features and {protected_attr}."
        )
    }
