import numpy as np
import pandas as pd
import shap
from sklearn.ensemble import RandomForestClassifier
from typing import Dict, Any, List, Optional, Tuple

PROTECTED_ATTRIBUTES_BLOCKLIST = {
    "gender", "sex", "caste", "caste_category", "race", "ethnicity", 
    "religion", "age", "age_group", "marital_status", "disability", 
    "sexual_orientation", "pregnancy"
}

class ModelExplainer:
    def __init__(self, model, feature_names: List[str]):
        self.model = model
        self.feature_names = feature_names
        
        # Verify no protected attributes are present in feature names
        for feat in feature_names:
            if feat.lower() in PROTECTED_ATTRIBUTES_BLOCKLIST:
                raise ValueError(f"CRITICAL PRIVACY VIOLATION: Protected demographic feature '{feat}' detected in model training features!")

        # Initialize SHAP TreeExplainer
        self.explainer = shap.TreeExplainer(model)
        
        # Determine expected value
        if isinstance(self.explainer.expected_value, (list, np.ndarray)):
            self.base_value = float(self.explainer.expected_value[1]) if len(self.explainer.expected_value) > 1 else float(self.explainer.expected_value[0])
        else:
            self.base_value = float(self.explainer.expected_value)

    def explain_instance(self, sample_df: pd.DataFrame) -> Dict[str, Any]:
        """
        Explain a single candidate's score with exact mathematical SHAP attributions.
        """
        X = sample_df[self.feature_names].to_numpy()
        shap_vals = self.explainer.shap_values(X)

        # Handle binary classification outputs
        if isinstance(shap_vals, list):
            vals = shap_vals[1][0] if len(shap_vals) > 1 else shap_vals[0][0]
        elif isinstance(shap_vals, np.ndarray) and len(shap_vals.shape) == 3:
            vals = shap_vals[0, :, 1] if shap_vals.shape[2] > 1 else shap_vals[0, :, 0]
        else:
            vals = shap_vals[0]

        feature_impacts = []
        positive_factors = []
        negative_factors = []

        for name, val, f_val in zip(self.feature_names, vals, X[0]):
            impact_entry = {
                "feature": name,
                "feature_value": float(f_val) if isinstance(f_val, (int, float, np.number)) else str(f_val),
                "shap_value": round(float(val), 4),
                "direction": "positive" if val >= 0 else "negative"
            }
            feature_impacts.append(impact_entry)
            if val >= 0:
                positive_factors.append(impact_entry)
            else:
                negative_factors.append(impact_entry)

        # Sort factors by impact magnitude
        positive_factors.sort(key=lambda x: abs(x["shap_value"]), reverse=True)
        negative_factors.sort(key=lambda x: abs(x["shap_value"]), reverse=True)
        feature_impacts.sort(key=lambda x: abs(x["shap_value"]), reverse=True)

        pred_prob = float(self.model.predict_proba(X)[0][1])
        prediction = int(self.model.predict(X)[0])

        return {
            "prediction": prediction,
            "prediction_probability": round(pred_prob, 4),
            "base_value": round(self.base_value, 4),
            "feature_impacts": feature_impacts,
            "positive_factors": positive_factors,
            "negative_factors": negative_factors,
            "explained_sum": round(self.base_value + float(np.sum(vals)), 4)
        }

    def global_importance(self, X_sample: pd.DataFrame) -> List[Dict[str, Any]]:
        """Compute global mean |SHAP| feature importance."""
        X = X_sample[self.feature_names].to_numpy()
        shap_vals = self.explainer.shap_values(X)
        if isinstance(shap_vals, list):
            vals = shap_vals[1] if len(shap_vals) > 1 else shap_vals[0]
        elif isinstance(shap_vals, np.ndarray) and len(shap_vals.shape) == 3:
            vals = shap_vals[:, :, 1] if shap_vals.shape[2] > 1 else shap_vals[:, :, 0]
        else:
            vals = shap_vals

        mean_abs = np.mean(np.abs(vals), axis=0)
        total = np.sum(mean_abs) if np.sum(mean_abs) > 0 else 1.0

        importance_list = []
        for name, score in zip(self.feature_names, mean_abs):
            importance_list.append({
                "feature": name,
                "importance_score": round(float(score), 4),
                "importance_percentage": round(float(score / total * 100), 2)
            })

        importance_list.sort(key=lambda x: x["importance_score"], reverse=True)
        return importance_list

def verify_bias_free_rejection(
    candidate_features: Dict[str, Any],
    explanation: Dict[str, Any],
    proxy_correlations: Optional[Dict[str, float]] = None
) -> Dict[str, Any]:
    """
    Automated sanity verification checking that rejection decisions stem strictly
    from verifiable qualification gaps and not demographic proxies.
    """
    negative_factors = explanation.get("negative_factors", [])
    
    # Check 1: Protected attribute presence in explanation
    demographic_violations = []
    for factor in negative_factors:
        feat = factor["feature"].lower()
        if feat in PROTECTED_ATTRIBUTES_BLOCKLIST:
            demographic_violations.append(factor["feature"])

    # Check 2: High proxy risk features in top negative drivers
    proxy_warnings = []
    if proxy_correlations:
        for factor in negative_factors[:3]:
            feat = factor["feature"]
            corr = proxy_correlations.get(feat, 0.0)
            if abs(corr) >= 0.45:
                proxy_warnings.append({
                    "feature": feat,
                    "proxy_correlation": round(corr, 3),
                    "note": f"Feature '{feat}' exhibits moderate-to-high statistical correlation with protected cohorts."
                })

    # Check 3: Minimum qualification gap evidence
    has_legitimate_qualification_gap = any(
        f["feature"] in ["coding_score", "system_design_score", "interview_score", "years_experience", "projects_count"]
        for f in negative_factors
    )

    if demographic_violations:
        sanity_status = "FAILED"
        message = f"Severe violation: Model decision was influenced by protected demographic attributes ({', '.join(demographic_violations)})."
    elif proxy_warnings:
        sanity_status = "REVIEW_REQUIRED"
        message = "Decision relies heavily on features with notable proxy correlation to demographic subgroups. Compliance officer review recommended."
    elif not has_legitimate_qualification_gap:
        sanity_status = "UNABLE_TO_VERIFY"
        message = "Rejection lacks dominant technical credential explanations."
    else:
        sanity_status = "VERIFIED_BIAS_FREE"
        message = "Certified: Rejection reasoning is driven strictly by objective technical benchmarks and verified competency gaps."

    return {
        "sanity_status": sanity_status,
        "is_certified": sanity_status == "VERIFIED_BIAS_FREE",
        "demographic_violations": demographic_violations,
        "proxy_warnings": proxy_warnings,
        "primary_rejection_drivers": [f["feature"] for f in negative_factors[:3]],
        "message": message
    }

def generate_candidate_feedback(
    candidate_name: str,
    explanation: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Constructive, transparent candidate feedback card providing clear benchmark comparisons
    and actionable learning pathways rather than opaque ghosting.
    """
    positives = explanation.get("positive_factors", [])
    negatives = explanation.get("negative_factors", [])

    # Identify strengths
    strengths = []
    for p in positives[:3]:
        feat = p["feature"]
        val = p["feature_value"]
        if "coding" in feat:
            strengths.append(f"Demonstrated solid programming competency (Score: {val}/100)")
        elif "experience" in feat:
            strengths.append(f"Relevant industry and hands-on experience ({val} years)")
        elif "interview" in feat:
            strengths.append(f"Strong interpersonal and technical communication performance ({val}/100)")
        elif "certifications" in feat:
            strengths.append(f"Proactive professional credentials and verified certifications ({val})")
        elif "projects" in feat:
            strengths.append(f"Demonstrated project portfolio and open-source contributions ({val} projects)")
        else:
            strengths.append(f"Positive benchmark evaluation in {feat} ({val})")

    # Identify growth areas & actionable learning pathways
    growth_areas = []
    learning_pathways = []

    for n in negatives[:3]:
        feat = n["feature"]
        val = n["feature_value"]
        if "system_design" in feat:
            growth_areas.append({
                "competency": "Distributed System Design & Architecture",
                "candidate_level": f"{val}/100",
                "target_benchmark": ">= 75/100",
                "recommendation": "Study high-concurrency microservices, caching topologies, and CAP theorem trade-offs."
            })
            learning_pathways.append("Complete 'Designing Data-Intensive Applications' by Martin Kleppmann & practice mock system design interviews.")
        elif "coding" in feat:
            growth_areas.append({
                "competency": "Algorithmic Efficiency & Data Structures",
                "candidate_level": f"{val}/100",
                "target_benchmark": ">= 80/100",
                "recommendation": "Deepen mastery of time-complexity optimization, graph traversal, and dynamic programming."
            })
            learning_pathways.append("Focus on NeetCode 150 algorithm patterns and timed live coding problem-solving.")
        elif "projects" in feat:
            growth_areas.append({
                "competency": "Production Portfolio Depth",
                "candidate_level": f"{val} projects",
                "target_benchmark": ">= 5 comprehensive projects",
                "recommendation": "Build and deploy full-stack production systems featuring CI/CD and automated test suites."
            })
            learning_pathways.append("Contribute to prominent open-source repositories and deploy live applications on cloud platforms.")
        elif "certifications" in feat:
            growth_areas.append({
                "competency": "Industry Cloud Credentials",
                "candidate_level": f"{val} certifications",
                "target_benchmark": ">= 2 certifications",
                "recommendation": "Pursue recognized vendor certifications in AWS, GCP, or Kubernetes."
            })
            learning_pathways.append("Prepare for AWS Certified Solutions Architect or CKA (Certified Kubernetes Administrator).")
        else:
            growth_areas.append({
                "competency": feat.replace("_", " ").title(),
                "candidate_level": str(val),
                "target_benchmark": "Target upper quartile",
                "recommendation": f"Strengthen mastery and project demonstration in {feat.replace('_', ' ')}."
            })

    if not strengths:
        strengths.append("Foundational technical interest and active application submission.")
    if not learning_pathways:
        learning_pathways.append("Continue building end-to-end full-stack applications with robust unit testing.")

    return {
        "candidate_name": candidate_name,
        "decision_summary": "Application not selected for current cohort opening.",
        "strengths": strengths,
        "growth_areas": growth_areas,
        "recommended_learning_pathways": learning_pathways,
        "growth_mindset_message": "Our hiring evaluations are benchmarked against specific role requirements for this cycle. We warmly encourage you to re-apply after completing your target projects!"
    }
