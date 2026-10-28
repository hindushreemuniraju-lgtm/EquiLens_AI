import pytest
import numpy as np
import pandas as pd
import json

from fairness.metrics import calculate_fairness_scorecard, recalculate_threshold_sandbox
from services.proxy_guard import analyze_proxy_leakage
from services.rubric_tracer import trace_rubric_bias
from scam_detection.analyzer import analyze_recruitment_message
from scam_detection.fingerprint import create_threat_fingerprint
from scam_detection.multilingual import detect_language_and_regional_scam
from privacy.pii_redactor import redact_pii
from privacy.consent_engine import record_user_consent
from privacy.isolated_auditing import execute_right_to_erasure

@pytest.fixture
def sample_fairness_df():
    return pd.DataFrame({
        "gender": ["Male"] * 50 + ["Female"] * 50,
        "hired_ground_truth": [1] * 30 + [0] * 20 + [1] * 30 + [0] * 20,
        "selected_predicted": [1] * 40 + [0] * 10 + [1] * 20 + [0] * 30, # Male sel rate = 0.80, Female sel rate = 0.40 -> DI Ratio = 0.50 (Violates 80% rule!)
        "model_probability": [0.85] * 40 + [0.35] * 10 + [0.55] * 20 + [0.25] * 30,
        "postal_code": ["560001"] * 50 + ["570001"] * 50,
        "college_tier": ["Tier-1"] * 50 + ["Tier-3"] * 50
    })

def test_fairness_scorecard_and_80_percent_rule(sample_fairness_df):
    card = calculate_fairness_scorecard(
        sample_fairness_df,
        protected_attr="gender",
        target_col="hired_ground_truth",
        pred_col="selected_predicted",
        reference_group="Male"
    )
    
    # Selection rate for Male should be 0.8, Female 0.4
    assert card["group_stats"]["Male"]["selection_rate"] == 0.8
    assert card["group_stats"]["Female"]["selection_rate"] == 0.4
    
    # Disparate Impact Ratio should be 0.4 / 0.8 = 0.5
    assert card["pairwise_metrics"]["disparate_impact_ratios"]["Female"] == 0.5
    # Should trigger Adverse Impact
    assert card["compliance_status"] == "ADVERSE_IMPACT_DETECTED"
    assert card["pairwise_metrics"]["adverse_impact_flags"]["Female"] is True
    assert card["metrics"]["executive_fairness_score"] < 75.0

def test_proxy_leakage_detection(sample_fairness_df):
    results = analyze_proxy_leakage(
        sample_fairness_df,
        protected_attr="gender",
        feature_columns=["postal_code", "college_tier"]
    )
    assert results["features_evaluated_count"] == 2
    # In fixture, postal_code and college_tier are completely correlated with gender
    findings = {f["feature"]: f["risk_level"] for f in results["proxy_findings"]}
    assert findings["postal_code"] == "HIGH"
    assert findings["college_tier"] == "HIGH"

def test_rubric_tracer_exclusionary_language():
    jd = "Seeking a rockstar engineer. Must be from Premier institutes only (IIT/BITS) and possess native-level English."
    res = trace_rubric_bias(jd)
    assert res["total_flagged_count"] >= 3
    phrase_ids = [p["id"] for p in res["flagged_phrases"]]
    assert "PREMIER_INSTITUTES" in phrase_ids
    assert "NATIVE_ENGLISH" in phrase_ids
    assert "HYPER_MASCULINE_CODING" in phrase_ids
    assert "[INCLUSIVE REVISION" in res["revised_text"]

def test_pii_redaction_and_fingerprinting():
    sample_msg = "Pay ₹2500 training fee to HR Ramesh at 98450-12345 for Google Bangalore offer letter."
    redaction = redact_pii(sample_msg)
    
    assert "[PERSON]" in redaction["redacted_text"]
    assert "[PHONE]" in redaction["redacted_text"]
    assert "HR Ramesh" not in redaction["redacted_text"]
    assert "98450-12345" not in redaction["redacted_text"]

    fp_meta = create_threat_fingerprint(redaction["redacted_text"])
    assert len(fp_meta["sha256_fingerprint"]) == 64
    assert fp_meta["hashing_algorithm"].startswith("SHA-256")

def test_multilingual_regional_scam_detection():
    hindi_msg = "बधाई हो! नियुक्ति पत्र के लिए तुरंत ₹1500 रजिस्ट्रेशन शुल्क जमा करें।"
    res = detect_language_and_regional_scam(hindi_msg)
    assert "Hindi (Devanagari)" in res["detected_languages"]
    assert res["is_regional_targeted"] is True
    assert len(res["matched_regional_indicators"]) >= 1

def test_granular_consent_and_erasure():
    user_id = "TEST-USER-9999"
    # 1. Record consent
    consent_res = record_user_consent(user_id, {"RESUME_SKILL_EVALUATION": True, "ISOLATED_FAIRNESS_AUDIT": True})
    assert consent_res["status"] == "CONSENT_RECORDED"

    # 2. Execute Right to Erasure
    erasure_res = execute_right_to_erasure(user_id, reason="Test GDPR Right to be Forgotten")
    assert erasure_res["status"] == "ERASURE_COMPLETED"
    assert "erasure_certificate_id" in erasure_res
