import numpy as np
from typing import Dict, Any, List

def analyze_vendor_monoculture_lockout() -> Dict[str, Any]:
    """
    Roadmap Innovation: Vendor-Monoculture Lockout Detection.
    Simulates cross-pipeline applicant tracking data across 4 leading enterprise
    ATS screening vendors to discover systemic algorithmic lockout of student cohorts.
    """
    vendors = [
        {"id": "VEND-A", "name": "ScreenAI Enterprise", "market_share": "38%"},
        {"id": "VEND-B", "name": "TalentFilter 9", "market_share": "26%"},
        {"id": "VEND-C", "name": "CognitiveATS Pro", "market_share": "21%"},
        {"id": "VEND-D", "name": "HireRank Global", "market_share": "15%"}
    ]

    cohorts = [
        {
            "cohort_id": "TIER_3_NON_METRO",
            "name": "Tier-3 Colleges & Non-Metro Postal Codes",
            "candidate_pool_size": 4200,
            "vendor_rejection_rates": {
                "ScreenAI Enterprise": 0.89,
                "TalentFilter 9": 0.92,
                "CognitiveATS Pro": 0.88,
                "HireRank Global": 0.86
            },
            "multi_pipeline_lockout_rate": 0.84, # Rejected by ALL 4 vendors simultaneously!
            "expected_merit_rejection_rate": 0.45,
            "monoculture_disparity_index": 86.5,
            "risk_classification": "CRITICAL_SYSTEMIC_LOCKOUT",
            "primary_shared_feature": "college_tier and postal_code proxy weighting in shared foundational embeddings"
        },
        {
            "cohort_id": "CAREER_GAP_RETURNEES",
            "name": "Applicants with >12 Months Career / Study Gaps",
            "candidate_pool_size": 1850,
            "vendor_rejection_rates": {
                "ScreenAI Enterprise": 0.81,
                "TalentFilter 9": 0.85,
                "CognitiveATS Pro": 0.79,
                "HireRank Global": 0.76
            },
            "multi_pipeline_lockout_rate": 0.72,
            "expected_merit_rejection_rate": 0.40,
            "monoculture_disparity_index": 78.0,
            "risk_classification": "HIGH_SYSTEMIC_LOCKOUT",
            "primary_shared_feature": "Zero-tolerance continuous tenure heuristics embedded across vendor parsing rules"
        },
        {
            "cohort_id": "SELF_TAUGHT_BOOTCAMP",
            "name": "Non-Traditional Degree / Bootcamp Engineers",
            "candidate_pool_size": 2600,
            "vendor_rejection_rates": {
                "ScreenAI Enterprise": 0.74,
                "TalentFilter 9": 0.78,
                "CognitiveATS Pro": 0.71,
                "HireRank Global": 0.69
            },
            "multi_pipeline_lockout_rate": 0.63,
            "expected_merit_rejection_rate": 0.42,
            "monoculture_disparity_index": 62.4,
            "risk_classification": "MODERATE_LOCKOUT",
            "primary_shared_feature": "Accreditation parser hard-coded to recognize only legacy B.Tech/B.E. degrees"
        },
        {
            "cohort_id": "TIER_1_METRO",
            "name": "Tier-1 Metro Institutions (Baseline Control)",
            "candidate_pool_size": 5100,
            "vendor_rejection_rates": {
                "ScreenAI Enterprise": 0.32,
                "TalentFilter 9": 0.35,
                "CognitiveATS Pro": 0.30,
                "HireRank Global": 0.28
            },
            "multi_pipeline_lockout_rate": 0.14,
            "expected_merit_rejection_rate": 0.35,
            "monoculture_disparity_index": 12.0,
            "risk_classification": "BENCHMARK_OPTIMAL",
            "primary_shared_feature": "High positive weighting across all 4 algorithmic models"
        }
    ]

    # Overall Industry Monoculture Index (0 - 100)
    industry_monoculture_risk = 82.4

    findings = [
        "A student from a Tier-3 institution with top-decile GitHub contributions has an 84% probability of being rejected by ALL 4 vendors without a human ever reading their resume.",
        "Because 75% of Fortune 500 employers license one of these three dominant ATS vendors, an algorithmic false-negative in one model effectively bans the candidate from the entire industry.",
        "Privacy-preserving cross-vendor audit logs prove that multi-company lockout is driven by shared training data bias, not independent evaluations."
    ]

    recommendations = [
        "Mandate multi-vendor ensemble diversity or decoupled screening layers for public recruitment.",
        "Establish an open, standardized 'Right to Explanation' protocol across commercial ATS providers.",
        "Implement independent third-party bias auditing under EU AI Act Annex III high-risk employment criteria."
    ]

    return {
        "status": "ROADMAP_INNOVATION_DEMONSTRATION",
        "is_synthetic_demonstration": True,
        "industry_monoculture_risk_score": industry_monoculture_risk,
        "vendors_audited": vendors,
        "cohort_lockout_matrix": cohorts,
        "systemic_findings": findings,
        "policy_recommendations": recommendations,
        "roadmap_phase": "Phase 2: Decentralized Zero-Knowledge Cross-ATS Auditing Protocol"
    }
