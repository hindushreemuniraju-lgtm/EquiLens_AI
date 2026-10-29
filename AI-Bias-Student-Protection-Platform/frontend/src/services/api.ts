import {
  OverviewStats,
  DatasetItem,
  FairnessScorecardData,
  ProxyLeakageResult,
  RubricTraceResult,
  ShapExplanationResult,
  RemediationResult,
  ScamDemonstrationResult,
  AuditTrailItem
} from '../types';

const API_BASE = (import.meta as any).env?.VITE_API_URL || '/api';

export const api = {
  // Overview
  async getOverviewStats(): Promise<OverviewStats> {
    const res = await fetch(`${API_BASE}/overview/stats`);
    if (!res.ok) throw new Error("Failed to fetch overview stats");
    return res.json();
  },

  // Datasets
  async getDatasets(): Promise<DatasetItem[]> {
    const res = await fetch(`${API_BASE}/data/list`);
    if (!res.ok) throw new Error("Failed to fetch datasets list");
    return res.json();
  },

  async getDatasetDetails(datasetId: string): Promise<DatasetItem> {
    const res = await fetch(`${API_BASE}/data/${datasetId}`);
    if (!res.ok) throw new Error("Failed to fetch dataset details");
    return res.json();
  },

  async uploadDataset(file: File): Promise<any> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_BASE}/data/upload`, {
      method: "POST",
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Upload failed" }));
      throw new Error(err.detail || "Dataset upload failed");
    }
    return res.json();
  },

  // Fairness
  async runFairnessAudit(params: {
    dataset_id: string;
    protected_attribute: string;
    target_column?: string;
    prediction_column?: string;
    reference_group?: string;
  }): Promise<FairnessScorecardData> {
    const res = await fetch(`${API_BASE}/fairness/audit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error("Fairness audit failed");
    return res.json();
  },

  async runThresholdSandbox(params: {
    dataset_id: string;
    protected_attribute: string;
    target_column?: string;
    prob_column?: string;
    group_thresholds: Record<string, number>;
  }): Promise<FairnessScorecardData> {
    const res = await fetch(`${API_BASE}/fairness/sandbox`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error("Threshold sandbox recalculation failed");
    return res.json();
  },

  // Proxy Leakage
  async runProxyAnalysis(params: {
    dataset_id: string;
    protected_attribute: string;
    feature_columns?: string[];
  }): Promise<ProxyLeakageResult> {
    const res = await fetch(`${API_BASE}/proxy/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error("Proxy leakage analysis failed");
    return res.json();
  },

  // Rubric Tracer
  async traceRubric(text: string): Promise<RubricTraceResult> {
    const res = await fetch(`${API_BASE}/rubric/trace`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    if (!res.ok) throw new Error("Job rubric scan failed");
    return res.json();
  },

  async getSampleRubrics(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/rubric/samples`);
    return res.json();
  },

  // Explainability & SHAP
  async explainCandidate(params: {
    candidate_id?: string;
    candidate_name?: string;
    features?: Record<string, number>;
  }): Promise<ShapExplanationResult> {
    const res = await fetch(`${API_BASE}/explainability/candidate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error("Candidate SHAP attribution failed");
    return res.json();
  },

  // Remediation Lab
  async runRemediation(params: {
    dataset_id: string;
    protected_attribute?: string;
    technique_stage: string;
    technique_type?: string;
  }): Promise<RemediationResult> {
    const res = await fetch(`${API_BASE}/remediation/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error("Remediation experiment failed");
    return res.json();
  },

  // Scam Shield (10-Step Demonstration)
  async analyzeScam(message: string): Promise<ScamDemonstrationResult> {
    const res = await fetch(`${API_BASE}/scam/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });
    if (!res.ok) throw new Error("Scam analysis failed");
    return res.json();
  },

  async getCommunityRegistry(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/scam/registry`);
    return res.json();
  },

  // Multilingual Scanner
  async scanMultilingual(text: string): Promise<any> {
    const res = await fetch(`${API_BASE}/multilingual/scan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    return res.json();
  },

  // Learn Mode
  async getLearnModules(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/learn/modules`);
    return res.json();
  },

  async submitQuizAnswer(case_id: string, selected_option_index: number): Promise<any> {
    const res = await fetch(`${API_BASE}/learn/quiz`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ case_id, selected_option_index })
    });
    return res.json();
  },

  // Privacy & DPDP
  async getConsentPurposes(): Promise<any> {
    const res = await fetch(`${API_BASE}/privacy/consent-purposes`);
    return res.json();
  },

  async submitConsent(user_pseudo_id: string, consents: Record<string, boolean>, language = "en"): Promise<any> {
    const res = await fetch(`${API_BASE}/privacy/consent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_pseudo_id, consents, language })
    });
    return res.json();
  },

  async executeErasure(target_identifier: string, reason?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/privacy/erasure`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target_identifier, reason })
    });
    return res.json();
  },

  async getRetentionStatus(): Promise<any> {
    const res = await fetch(`${API_BASE}/privacy/retention`);
    return res.json();
  },

  // Audit Trail
  async getAuditTrail(limit = 50): Promise<AuditTrailItem[]> {
    const res = await fetch(`${API_BASE}/audit-trail?limit=${limit}`);
    return res.json();
  },

  // Device Twin
  async simulateDeviceTwin(transformation_type: string): Promise<any> {
    const res = await fetch(`${API_BASE}/device-twin/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transformation_type })
    });
    return res.json();
  },

  // Hidden Prompt
  async auditHiddenPrompt(resume_text: string): Promise<any> {
    const res = await fetch(`${API_BASE}/hidden-prompt/audit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume_text })
    });
    return res.json();
  },

  // Vendor Monoculture
  async getVendorMonoculture(): Promise<any> {
    const res = await fetch(`${API_BASE}/vendor-monoculture/analysis`);
    return res.json();
  },

  // Live ATS Evaluation API
  async liveEvalCandidate(candidateData: any): Promise<any> {
    const res = await fetch(`${API_BASE}/live-eval/candidate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(candidateData)
    });
    return res.json();
  },

  // Export
  async exportAuditReport(auditId?: string): Promise<{ markdown_content: string }> {
    const res = await fetch(`${API_BASE}/export/audit-report${auditId ? `?audit_id=${auditId}` : ''}`);
    return res.json();
  }
};
