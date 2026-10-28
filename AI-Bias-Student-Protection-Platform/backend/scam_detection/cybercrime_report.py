from datetime import datetime
from typing import Dict, Any, List, Optional

def generate_cybercrime_complaint(
    raw_message: str,
    redacted_message: str,
    extracted_entities: Dict[str, Any],
    threat_analysis: Dict[str, Any],
    complainant_info: Optional[Dict[str, str]] = None
) -> Dict[str, Any]:
    """
    Prepares a formal complaint draft conforming to the National Cyber Crime
    Reporting Portal (cybercrime.gov.in) requirements under Section 66D of the IT Act.
    """
    timestamp = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    claimed_co = threat_analysis.get("claimed_company", "Unspecified Corporate Entity")
    threat_level = threat_analysis.get("threat_level", "HIGH")
    
    # Extract identifiers
    phone = extracted_entities.get("phone", "Not Provided / Obscured")
    upi = extracted_entities.get("upi_id", "Not Provided")
    amount = extracted_entities.get("amount", "Unspecified Amount")
    url = extracted_entities.get("url", "None")
    recruiter = extracted_entities.get("recruiter_name", "Unverified Contact")

    # Missing Information Checklist
    checklist = [
        {"item": "Bank Statement showing debit (if payment was attempted)", "required": True, "present": False},
        {"item": "Transaction Reference / UTR Number from payment app", "required": True, "present": False},
        {"item": "Unedited WhatsApp / SMS / Telegram chat export", "required": True, "present": True},
        {"item": "Full email headers with SPF/DKIM verification (if received via email)", "required": False, "present": bool(extracted_entities.get("email"))},
        {"item": "Copy of the fake offer letter or appointment letter PDF", "required": False, "present": False}
    ]

    # Incident Narrative
    narrative = f"""To,
The Cyber Crime Police Station / National Cyber Crime Reporting Portal (cybercrime.gov.in)

Subject: Formal Complaint regarding Recruitment Scam and Financial Impersonation under Section 66D IT Act, 2000

Respected Officer,

I wish to formally report an attempted / executed employment fraud targeting students and job-seekers. 

1. INCIDENT DETAILS:
- Date of Detection: {timestamp}
- Platform / Medium: Electronic Communication (SMS / WhatsApp / Job Portal)
- Impersonated Organization: {claimed_co}
- Claimed Recruiter / Suspect Identity: {recruiter}
- Demand / Extortion Amount: {amount} (labeled as training fee / security deposit)
- Suspect Mobile Number: {phone}
- Suspect UPI Handle: {upi}
- Phishing Website Link: {url}

2. CHRONOLOGY & MODUS OPERANDI:
The suspect contacted me falsely claiming recruitment selection for {claimed_co}. The suspect demanded an immediate upfront payment of {amount} as a prerequisite for issuing or releasing an employment offer letter. The suspect used urgent pressure tactics to coerce money transfer to the private payment handle {upi}.

3. LEGAL VIOLATIONS OBSERVED:
- Section 66D, Information Technology Act, 2000 (Punishment for cheating by personation by using computer resource).
- Section 318(4), Bharatiya Nyaya Sanhita (BNS) / Sec 420 IPC (Cheating and dishonestly inducing delivery of property).
- Section 336(3), BNS / Sec 468 IPC (Forgery for purpose of cheating).

4. RELIEF SOUGHT:
- Formal registration of this complaint and tracking of the suspect mobile number {phone} and UPI ID {upi}.
- Freezing of the fraudulent recipient account to prevent victimization of other student candidates.

I declare that the information provided above is true to the best of my knowledge and belief.

Complainant: [Student / Candidate Name]
Contact: [Complainant Phone / Email]
Attached Evidence: Redacted incident transcript, electronic message text, threat pattern fingerprint.
"""

    return {
        "complaint_id": f"COMPL-DRAFT-{int(datetime.utcnow().timestamp())}",
        "filing_portal": "National Cyber Crime Reporting Portal (https://cybercrime.gov.in)",
        "applicable_laws": [
            "Section 66D, Information Technology Act, 2000 (Cheating by Personation)",
            "Section 318(4), Bharatiya Nyaya Sanhita (Cheating)",
            "Section 336(3), Bharatiya Nyaya Sanhita (Forgery)"
        ],
        "generated_timestamp": timestamp,
        "incident_summary": f"Recruitment extortion targeting {claimed_co} candidates with upfront {amount} payment demand.",
        "suspect_identifiers": {
            "claimed_company": claimed_co,
            "recruiter_alias": recruiter,
            "phone_number": phone,
            "upi_identifier": upi,
            "phishing_url": url,
            "demanded_amount": amount
        },
        "evidence_checklist": checklist,
        "formatted_draft": narrative.strip(),
        "status": "DRAFT_READY_FOR_STUDENT_REVIEW",
        "legal_notice": "EquiLens prepares structured complaint drafts to assist victims. This draft has not been automatically filed with law enforcement. The student must review and submit the formal report at cybercrime.gov.in."
    }
