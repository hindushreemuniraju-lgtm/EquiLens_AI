import uuid
import hashlib
from datetime import datetime
from typing import Dict, Any, List, Optional
from database.db import get_connection, log_audit_event

CONSENT_PURPOSES = [
    {
        "id": "RESUME_SKILL_EVALUATION",
        "title": "Objective Competency Evaluation",
        "description": "Permission to parse technical skills, projects, and work experience strictly for role evaluation.",
        "default": True,
        "is_mandatory_for_evaluation": True
    },
    {
        "id": "ISOLATED_FAIRNESS_AUDIT",
        "title": "Algorithmic Fairness & Bias Auditing",
        "description": "Permission to store demographic attributes in a separate, isolated audit vault strictly to verify that AI scoring is non-discriminatory.",
        "default": True,
        "is_mandatory_for_evaluation": False
    },
    {
        "id": "SCAM_THREAT_FINGERPRINT",
        "title": "Community Anti-Scam Protection",
        "description": "Permission to generate an anonymized SHA-256 fingerprint from reported suspicious messages to protect fellow students.",
        "default": True,
        "is_mandatory_for_evaluation": False
    },
    {
        "id": "MODEL_RETRAINING_OPT_OUT",
        "title": "Opt-Out of LLM / Model Training",
        "description": "Strict guarantee that personal resume text will never be used to train external generative AI foundation models.",
        "default": True,
        "is_mandatory_for_evaluation": False
    }
]

REGIONAL_PRIVACY_NOTICES = {
    "en": "EquiLens processes personal data under strict purpose limitation principles. Your demographic information is stored in an isolated vault and never enters recruitment prediction features.",
    "hi": "इक्विलेंस आपके व्यक्तिगत डेटा को सख्त गोपनीयता नियमों के तहत सुरक्षित रखता है। मॉडल स्कोरिंग में आपकी जाति, लिंग या आयु का कभी भी इनपुट के रूप में उपयोग नहीं किया जाता है।",
    "kn": "EquiLens ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಡೇಟಾವನ್ನು ಸಂಪೂರ್ಣ ರಕ್ಷಣೆಯೊಂದಿಗೆ ನಿರ್ವಹಿಸುತ್ತದೆ. ಜಾತಿ, ಲಿಂಗ ಅಥವಾ ವಯಸ್ಸಿನ ವಿವರಗಳನ್ನು ನೇಮಕಾತಿ ಸ್ಕೋರಿಂಗ್ ಮಾಡೆಲ್‌ಗಳಿಗೆ ಇನ್‌ಪುಟ್ ಆಗಿ ಎಂದಿಗೂ ಬಳಸಲಾಗುವುದಿಲ್ಲ.",
    "ta": "EquiLens உங்கள் தனிப்பட்ட தரவை மிக பாதுகாப்பாக கையாள்கிறது. சாதி, பாலினம் அல்லது வயது போன்ற தகவல்கள் பணி நியமன மதிப்பீட்டு மாடல்களுக்கு ஒருபோதும் பயன்படுத்தப்படாது."
}

def record_user_consent(
    user_pseudo_id: str,
    consents: Dict[str, bool],
    ip_address: str = "127.0.0.1",
    language: str = "en"
) -> Dict[str, Any]:
    """Records granular purpose-specific consent in the persistent database."""
    conn = get_connection()
    ip_hash = hashlib.sha256(ip_address.encode("utf-8")).hexdigest()[:16]
    now = datetime.utcnow().isoformat() + "Z"
    
    recorded_entries = []
    try:
        for purpose, is_consented in consents.items():
            record_id = str(uuid.uuid4())
            conn.execute("""
            INSERT INTO consent_records (id, user_pseudo_id, purpose, consented, ip_hash, language, timestamp)
            VALUES (?, ?, ?, ?, ?, ?, ?);
            """, (
                record_id,
                user_pseudo_id,
                purpose,
                1 if is_consented else 0,
                ip_hash,
                language,
                now
            ))
            recorded_entries.append({
                "record_id": record_id,
                "purpose": purpose,
                "consented": is_consented
            })
        conn.commit()
    finally:
        conn.close()

    log_audit_event("CONSENT_UPDATE", "Privacy & Consent", {
        "user_pseudo_id": user_pseudo_id,
        "updated_purposes": recorded_entries
    })

    return {
        "status": "CONSENT_RECORDED",
        "user_pseudo_id": user_pseudo_id,
        "timestamp": now,
        "recorded_consents": recorded_entries,
        "notice": REGIONAL_PRIVACY_NOTICES.get(language, REGIONAL_PRIVACY_NOTICES["en"])
    }

def withdraw_user_consent(user_pseudo_id: str, purpose: str) -> Dict[str, Any]:
    """Instantly withdraws consent and blocks downstream processing."""
    conn = get_connection()
    now = datetime.utcnow().isoformat() + "Z"
    try:
        record_id = str(uuid.uuid4())
        conn.execute("""
        INSERT INTO consent_records (id, user_pseudo_id, purpose, consented, ip_hash, language, timestamp)
        VALUES (?, ?, ?, 0, 'WITHDRAWN_BY_USER', 'en', ?);
        """, (record_id, user_pseudo_id, purpose, now))
        conn.commit()
    finally:
        conn.close()

    log_audit_event("CONSENT_WITHDRAWAL", "Privacy & Consent", {
        "user_pseudo_id": user_pseudo_id,
        "withdrawn_purpose": purpose
    })

    return {
        "status": "CONSENT_WITHDRAWN",
        "user_pseudo_id": user_pseudo_id,
        "purpose": purpose,
        "effective_timestamp": now,
        "message": f"Consent for '{purpose}' has been revoked. All related isolated processing has been blocked."
    }
