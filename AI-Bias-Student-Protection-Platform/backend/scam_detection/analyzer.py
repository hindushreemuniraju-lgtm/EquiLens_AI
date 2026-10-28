import re
import hashlib
from typing import Dict, Any, List, Optional, Tuple

INDICATORS_DICTIONARY = [
    {
        "id": "TRAINING_FEE",
        "name": "Upfront Training / Registration Fee",
        "weight": 35,
        "regex": r"(training\s+fee|registration\s+fee|onboarding\s+charges|admission\s+fee|process(?:ing)?\s+fee|रजिस्ट्रेशन\s+शुल्क|ತರಬೇತಿ\s+ಶುಲ್ಕ|பயிற்சி\s+கட்டணம்|ఫీజు)",
        "explanation": "Legitimate employers never demand candidates pay money for training, onboarding, or interview registration.",
        "category": "Financial Extortion"
    },
    {
        "id": "SECURITY_DEPOSIT",
        "name": "Refundable Security Deposit / Laptop Charge",
        "weight": 30,
        "regex": r"(security\s+deposit|refundable\s+amount|caution\s+deposit|laptop\s+(?:insurance|deposit|charge)|ಲ್ಯಾಪ್ಟಾಪ್\s+ವಿಮೆ|ಸೆಕ್ಯೂರಿಟಿ\s+ಡೆಪಾಸಿಟ್)",
        "explanation": "Scammers claim security deposits will be refunded on day one to lower candidate suspicion.",
        "category": "Advance Fee Fraud"
    },
    {
        "id": "DIRECT_UPI_PAYMENT",
        "name": "Direct UPI / Mobile Wallet Payment Request",
        "weight": 25,
        "regex": r"([a-zA-Z0-9.\-_]{2,256}@(okaxis|okhdfcbank|okicici|oksbi|paytm|ybl|gpay|upi|axl|ibl)|gpay|phonepe|paytm\s+karo|upi\s+id)",
        "explanation": "Direct requests to transfer funds to personal or informal UPI IDs circumvent corporate accounting and cannot be reversed.",
        "category": "Untraceable Financial Transfer"
    },
    {
        "id": "UNVERIFIED_RECRUITER",
        "name": "Unverified Recruiter Identity / Informality",
        "weight": 15,
        "regex": r"(hr\s+[a-zA-Z]+|contact\s+on\s+whatsapp|whatsapp\s+me|send\s+resume\s+to\s+whatsapp|reach\s+out\s+on\s+telegram)",
        "explanation": "Official recruitment at established firms is conducted through enterprise ATS and verifiable corporate email domains, not personal messaging apps.",
        "category": "Social Engineering"
    },
    {
        "id": "URGENCY_TACTIC",
        "name": "Artificial Urgency & Pressure Deadline",
        "weight": 20,
        "regex": r"(offer\s+expires|urgent\s+confirmation|within\s+\d+\s+hours?|immediate\s+payment|last\s+chance|slot\s+will\s+be\s+cancelled|turant|ಇಂದೇ\s+ಪಾವತಿಸಿ|तुरंत)",
        "explanation": "Artificial time limits induce panic and prevent candidates from verifying claims with university placement cells or corporate portals.",
        "category": "Psychological Manipulation"
    },
    {
        "id": "SUSPICIOUS_DOMAIN",
        "name": "Suspicious / Spoofed Domain",
        "weight": 25,
        "regex": r"(https?://[a-zA-Z0-9.\-_]*(careers|jobs|placement|offer)[a-zA-Z0-9.\-_]*\.(fakejobs|tk|ml|ga|cf|xyz|online|site|in\.net|top)[a-zA-Z0-9./\-_]*)",
        "explanation": "Lookalike domains mimicking reputable tech companies are registered to host fake offer portals.",
        "category": "Phishing & Spoofing"
    },
    {
        "id": "OFFER_LETTER_FOR_SALE",
        "name": "Paid Offer Letter / Direct Appointment",
        "weight": 30,
        "regex": r"(offer\s+letter\s+(?:charges?|fee|payment)|appointment\s+letter\s+fee|नियुक्ति\s+पत्र|ಆಯ್ಕೆ\s+ಖಚಿತ)",
        "explanation": "Offering immediate employment letters conditioned on monetary transfer is fraudulent.",
        "category": "Impersonation Scam"
    }
]

def analyze_recruitment_message(text: str) -> Dict[str, Any]:
    """
    Analyzes message for recruitment scam indicators, extracts evidence,
    and computes structured threat assessment.
    """
    findings = []
    total_score = 0
    categories = set()

    # Match indicators
    for ind in INDICATORS_DICTIONARY:
        match = re.search(ind["regex"], text, re.IGNORECASE)
        if match:
            matched_phrase = match.group(0)
            total_score += ind["weight"]
            categories.add(ind["category"])
            findings.append({
                "indicator_id": ind["id"],
                "name": ind["name"],
                "matched_text": matched_phrase,
                "category": ind["category"],
                "weight": ind["weight"],
                "explanation": ind["explanation"]
            })

    # Normalized risk score (0 - 100)
    risk_score = min(100, total_score)

    if risk_score >= 60:
        threat_level = "CRITICAL"
        verdict = "Severe recruitment fraud detected. Do NOT transfer funds or provide sensitive documents."
    elif risk_score >= 35:
        threat_level = "HIGH"
        verdict = "Multiple high-risk indicators found. High probability of fraudulent recruitment lure."
    elif risk_score >= 15:
        threat_level = "MEDIUM"
        verdict = "Suspicious informal elements present. Proceed with strict caution and require official domain verification."
    else:
        threat_level = "LOW"
        verdict = "No dominant predatory scam indicators identified in the provided text."

    # Extract Entities
    extracted_entities = extract_entities(text)

    # Claimed company inference
    claimed_company = extracted_entities.get("company")
    if not claimed_company:
        company_match = re.search(r"\b(Google|Microsoft|Amazon|Infosys|TCS|Wipro|Cognizant|Accenture|Meta|Apple|Deloitte)\b", text, re.IGNORECASE)
        if company_match:
            claimed_company = company_match.group(1).title()

    return {
        "risk_score": risk_score,
        "threat_level": threat_level,
        "verdict": verdict,
        "claimed_company": claimed_company,
        "threat_categories": list(categories),
        "findings": findings,
        "extracted_entities": extracted_entities,
        "is_scam": risk_score >= 35
    }

def extract_entities(text: str) -> Dict[str, Any]:
    """Extract phone numbers, UPI handles, amounts, email addresses, and URLs."""
    entities = {}

    # UPI IDs
    upi_match = re.search(r"([a-zA-Z0-9.\-_]{2,256}@(okaxis|okhdfcbank|okicici|oksbi|paytm|ybl|gpay|upi|axl|ibl))", text, re.IGNORECASE)
    if upi_match:
        entities["upi_id"] = upi_match.group(0)

    # Phone numbers (Indian formats)
    phone_match = re.search(r"(\+91[\-\s]?)?[6-9]\d{4}[\-\s]?\d{5}", text)
    if not phone_match:
        # Check for masked format like 98450-XXXXX
        phone_match = re.search(r"[6-9]\d{4}[\-\s]?[Xx0-9]{5}", text)
    if phone_match:
        entities["phone"] = phone_match.group(0)

    # Amounts
    amount_match = re.search(r"(₹\s*\d+(?:,\d+)*|\b\d+(?:,\d+)*\s*(?:rs|rupees|inr)\b)", text, re.IGNORECASE)
    if amount_match:
        entities["amount"] = amount_match.group(0)

    # Emails
    email_match = re.search(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", text)
    if email_match:
        entities["email"] = email_match.group(0)

    # URLs
    url_match = re.search(r"https?://[^\s]+", text)
    if url_match:
        entities["url"] = url_match.group(0)

    # Recruiter Names
    recruiter_match = re.search(r"(?:hr|recruiter|coordinator)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)", text, re.IGNORECASE)
    if recruiter_match:
        entities["recruiter_name"] = recruiter_match.group(1).title()

    return entities
