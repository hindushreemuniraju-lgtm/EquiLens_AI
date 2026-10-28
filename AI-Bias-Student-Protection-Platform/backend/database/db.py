import sqlite3
import json
import os
from datetime import datetime
from typing import Dict, Any, List, Optional

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "equilens.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA foreign_keys=ON;")
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # 1. Datasets Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS datasets (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        file_path TEXT NOT NULL,
        row_count INTEGER NOT NULL,
        column_count INTEGER NOT NULL,
        schema_json TEXT NOT NULL,
        protected_attributes_json TEXT NOT NULL,
        data_quality_json TEXT NOT NULL,
        created_at TEXT NOT NULL
    );
    """)

    # 2. Fairness Audits Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS fairness_audits (
        id TEXT PRIMARY KEY,
        dataset_id TEXT NOT NULL,
        model_name TEXT NOT NULL,
        protected_attribute TEXT NOT NULL,
        reference_group TEXT NOT NULL,
        target_column TEXT NOT NULL,
        prediction_column TEXT NOT NULL,
        dpr REAL,
        dpd REAL,
        eod REAL,
        aod REAL,
        disparate_impact_ratio REAL,
        disparate_impact_flag INTEGER NOT NULL,
        executive_fairness_score REAL NOT NULL,
        confusion_matrix_json TEXT NOT NULL,
        group_stats_json TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (dataset_id) REFERENCES datasets(id) ON DELETE CASCADE
    );
    """)

    # 3. Remediation Experiments Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS remediation_experiments (
        id TEXT PRIMARY KEY,
        dataset_id TEXT NOT NULL,
        baseline_audit_id TEXT,
        technique_stage TEXT NOT NULL,
        technique_name TEXT NOT NULL,
        parameters_json TEXT NOT NULL,
        baseline_metrics_json TEXT NOT NULL,
        remediated_metrics_json TEXT NOT NULL,
        trade_off_json TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (dataset_id) REFERENCES datasets(id) ON DELETE CASCADE
    );
    """)

    # 4. Scam Reports / Community Registry
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS scam_reports (
        id TEXT PRIMARY KEY,
        raw_text TEXT NOT NULL,
        redacted_text TEXT NOT NULL,
        normalized_pattern TEXT NOT NULL,
        sha256_fingerprint TEXT UNIQUE NOT NULL,
        threat_category TEXT NOT NULL,
        threat_level TEXT NOT NULL,
        claimed_company TEXT,
        indicators_json TEXT NOT NULL,
        extracted_entities_json TEXT NOT NULL,
        reported_count INTEGER DEFAULT 1,
        verified_by_moderator INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
    );
    """)

    # 5. Candidate Rejection & Bias Verification Records
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS candidate_verifications (
        id TEXT PRIMARY KEY,
        candidate_id TEXT NOT NULL,
        features_json TEXT NOT NULL,
        prediction INTEGER NOT NULL,
        confidence REAL NOT NULL,
        shap_values_json TEXT NOT NULL,
        sanity_status TEXT NOT NULL,
        feedback_json TEXT NOT NULL,
        created_at TEXT NOT NULL
    );
    """)

    # 6. Granular Consent Records
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS consent_records (
        id TEXT PRIMARY KEY,
        user_pseudo_id TEXT NOT NULL,
        purpose TEXT NOT NULL,
        consented INTEGER NOT NULL,
        ip_hash TEXT NOT NULL,
        language TEXT NOT NULL,
        timestamp TEXT NOT NULL
    );
    """)

    # 7. Privacy Requests (Right to Erasure, Data Export)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS privacy_requests (
        id TEXT PRIMARY KEY,
        request_type TEXT NOT NULL,
        target_identifier TEXT NOT NULL,
        status TEXT NOT NULL,
        details_json TEXT NOT NULL,
        created_at TEXT NOT NULL
    );
    """)

    # 8. Immutable System Audit Trail
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audit_trail (
        id TEXT PRIMARY KEY,
        action_type TEXT NOT NULL,
        pillar TEXT NOT NULL,
        details_json TEXT NOT NULL,
        actor TEXT NOT NULL,
        timestamp TEXT NOT NULL
    );
    """)

    conn.commit()

    # Seed Sample Dataset if table is empty
    cursor.execute("SELECT COUNT(*) FROM datasets;")
    if cursor.fetchone()[0] == 0:
        csv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data", "recruitment_fairness_audit.csv")
        if os.path.exists(csv_path):
            import pandas as pd
            df = pd.read_csv(csv_path)
            schema = {col: str(df[col].dtype) for col in df.columns}
            protected_attrs = ["gender", "caste_category", "age_group"]
            quality_report = {
                "missing_values": {col: int(df[col].isna().sum()) for col in df.columns},
                "duplicate_rows": int(df.duplicated().sum()),
                "total_rows": len(df),
                "total_columns": len(df.columns)
            }
            cursor.execute("""
            INSERT OR REPLACE INTO datasets (
                id, name, file_path, row_count, column_count, schema_json,
                protected_attributes_json, data_quality_json, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
            """, (
                "DATASET-SAMPLE-01",
                "Recruitment Fairness Audit Baseline (1,200 Applicants)",
                csv_path,
                len(df),
                len(df.columns),
                json.dumps(schema),
                json.dumps(protected_attrs),
                json.dumps(quality_report),
                datetime.utcnow().isoformat() + "Z"
            ))
            conn.commit()

    # Seed Scam Registry from seed_data.json if table is empty
    cursor.execute("SELECT COUNT(*) FROM scam_reports;")
    if cursor.fetchone()[0] == 0:
        seed_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data", "scam_registry_seed.json")
        if os.path.exists(seed_path):
            with open(seed_path, "r", encoding="utf-8") as f:
                seeds = json.load(f)
                for s in seeds:
                    cursor.execute("""
                    INSERT OR IGNORE INTO scam_reports (
                        id, raw_text, redacted_text, normalized_pattern, sha256_fingerprint,
                        threat_category, threat_level, claimed_company, indicators_json,
                        extracted_entities_json, reported_count, verified_by_moderator, created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                    """, (
                        s["report_id"],
                        s["raw_text"],
                        s["redacted_text"],
                        s["normalized_pattern"],
                        s["sha256_fingerprint"],
                        s["threat_category"],
                        s["threat_level"],
                        s["claimed_company"],
                        json.dumps(s["indicators"]),
                        json.dumps(s["extracted_entities"]),
                        s["reported_count"],
                        1 if s["verified_by_moderator"] else 0,
                        s["first_reported"]
                    ))
            conn.commit()

    conn.close()

def log_audit_event(action_type: str, pillar: str, details: Dict[str, Any], actor: str = "System"):
    """Record an immutable entry in the audit trail."""
    import uuid
    conn = get_connection()
    try:
        conn.execute("""
        INSERT INTO audit_trail (id, action_type, pillar, details_json, actor, timestamp)
        VALUES (?, ?, ?, ?, ?, ?);
        """, (
            str(uuid.uuid4()),
            action_type,
            pillar,
            json.dumps(details),
            actor,
            datetime.utcnow().isoformat() + "Z"
        ))
        conn.commit()
    finally:
        conn.close()

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully at:", DB_PATH)
