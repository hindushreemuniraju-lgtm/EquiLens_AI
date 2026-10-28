export interface OverviewStats {
  datasets_count: number;
  audits_count: number;
  adverse_impact_count: number;
  remediations_count: number;
  scam_reports_count: number;
  consent_records_count: number;
  privacy_requests_count: number;
  latest_fairness_health_index: number;
  recent_activity: AuditTrailItem[];
}

export interface DatasetItem {
  id: string;
  name: string;
  row_count: number;
  column_count: number;
  created_at: string;
  schema: Record<string, string>;
  protected_attributes: string[];
  data_quality?: {
    missing_values: Record<string, number>;
    duplicate_rows: number;
    total_rows: number;
    total_columns: number;
  };
  preview_rows?: Record<string, any>[];
  summary_stats?: Record<string, any>;
}

export interface FairnessScorecardData {
  protected_attribute: string;
  reference_group: string;
  has_ground_truth: boolean;
  group_stats: Record<string, {
    group: string;
    sample_size: number;
    selected_count: number;
    selection_rate: number;
    small_sample_warning: boolean;
    confusion_matrix?: { tp: number; fp: number; tn: number; fn: number };
    tpr?: number | null;
    fpr?: number | null;
    accuracy?: number;
  }>;
  metrics: {
    demographic_parity_ratio: number;
    demographic_parity_difference: number;
    equal_opportunity_difference: number;
    average_odds_difference: number;
    min_disparate_impact_ratio: number;
    executive_fairness_score: number;
  };
  pairwise_metrics: {
    disparate_impact_ratios: Record<string, number>;
    demographic_parity_ratios: Record<string, number>;
    equal_opportunity_differences: Record<string, number | null>;
    average_odds_differences: Record<string, number | null>;
    adverse_impact_flags: Record<string, boolean>;
  };
  compliance_status: "AUDIT_COMPLIANT" | "MODERATE_FAIRNESS_RISK" | "ADVERSE_IMPACT_DETECTED";
  recommendation: string;
  audit_id?: string;
  created_at?: string;
}

export interface ProxyLeakageResult {
  protected_attribute: string;
  features_evaluated_count: number;
  high_risk_proxy_count: number;
  overall_summary: string;
  proxy_findings: {
    feature: string;
    protected_attribute: string;
    association_score: number;
    method: string;
    risk_level: "HIGH" | "MEDIUM" | "LOW";
    recommendation: string;
  }[];
}

export interface RubricTraceResult {
  original_text: string;
  total_flagged_count: number;
  inclusivity_index: number;
  summary: string;
  revised_text: string;
  flagged_phrases: {
    id: string;
    flagged_phrase: string;
    category: string;
    concern: string;
    affected_groups: string[];
    explanation: string;
    evidence: string;
    suggested_alternative: string;
    confidence_score: number;
  }[];
}

export interface ShapExplanationResult {
  candidate_id: string;
  features: Record<string, any>;
  explanation: {
    prediction: number;
    prediction_probability: number;
    base_value: number;
    feature_impacts: {
      feature: string;
      feature_value: any;
      shap_value: number;
      direction: "positive" | "negative";
    }[];
    positive_factors: any[];
    negative_factors: any[];
    explained_sum: number;
  };
  global_importance: {
    feature: string;
    importance_score: number;
    importance_percentage: number;
  }[];
  bias_free_verification: {
    sanity_status: "VERIFIED_BIAS_FREE" | "REVIEW_REQUIRED" | "FAILED" | "UNABLE_TO_VERIFY";
    is_certified: boolean;
    demographic_violations: string[];
    proxy_warnings: { feature: string; proxy_correlation: number; note: string }[];
    primary_rejection_drivers: string[];
    message: string;
  };
  candidate_feedback_card: {
    candidate_name: string;
    decision_summary: string;
    strengths: string[];
    growth_areas: {
      competency: string;
      candidate_level: string;
      target_benchmark: string;
      recommendation: string;
    }[];
    recommended_learning_pathways: string[];
    growth_mindset_message: string;
  };
}

export interface RemediationResult {
  experiment_id: string;
  technique_stage: string;
  technique_name: string;
  description: string;
  baseline: {
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
    fairness: FairnessScorecardData;
  };
  remediated: {
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
    fairness: FairnessScorecardData;
  };
  pareto_tradeoff_curve: {
    epsilon: number;
    accuracy: number;
    f1_score: number;
    demographic_parity_ratio: number;
    equal_opportunity_difference: number;
    executive_fairness_score: number;
  }[];
  created_at: string;
}

export interface ScamDemonstrationResult {
  step_1_input: string;
  step_2_analysis: {
    risk_score: number;
    threat_level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    verdict: string;
    claimed_company?: string;
    threat_categories: string[];
    findings: {
      indicator_id: string;
      name: string;
      matched_text: string;
      category: string;
      weight: number;
      explanation: string;
    }[];
    extracted_entities: Record<string, string>;
    is_scam: boolean;
  };
  step_3_redaction: {
    original_text: string;
    redacted_text: string;
    redactions_count: number;
    redactions: {
      label: string;
      original: string;
      start: number;
      end: number;
      replacement: string;
    }[];
  };
  step_4_fingerprint: {
    normalized_pattern: string;
    sha256_fingerprint: string;
    hashing_algorithm: string;
    explanation: string;
  };
  step_5_community_registry: {
    matched: boolean;
    report_id?: string;
    reported_count?: number;
    first_reported?: string;
    threat_category?: string;
    threat_level?: string;
    claimed_company?: string;
    is_new_signature?: boolean;
    similar_reports?: any[];
    note?: string;
  };
  step_6_threat_level: string;
  step_7_safe_reply: {
    claimed_company: string;
    templates: { id: string; title: string; tone: string; text: string }[];
    security_reminders: string[];
  };
  step_8_cybercrime_draft: {
    complaint_id: string;
    filing_portal: string;
    applicable_laws: string[];
    generated_timestamp: string;
    incident_summary: string;
    suspect_identifiers: Record<string, string>;
    evidence_checklist: { item: string; required: boolean; present: boolean }[];
    formatted_draft: string;
    status: string;
    legal_notice: string;
  };
  step_9_audit_status: string;
  step_10_completion_summary: {
    is_demonstration_ready: boolean;
    overall_status: string;
    message: string;
  };
}

export interface AuditTrailItem {
  id: string;
  action_type: string;
  pillar: string;
  actor: string;
  timestamp: string;
  details?: Record<string, any>;
  details_json?: string;
}
