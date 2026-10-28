from typing import Dict, Any, List

def generate_safe_reply_templates(
    claimed_company: str = "your company",
    recruiter_name: str = "Hiring Team",
    demanded_amount: str = "the specified amount"
) -> Dict[str, Any]:
    """
    Generates polite, assertive, and professional responses asking for official recruiter
    verification without compromising candidate safety or burning legitimate opportunities.
    """
    options = [
        {
            "id": "OFFICIAL_DOMAIN_VERIFICATION",
            "title": "Corporate Domain Verification Request (Recommended)",
            "tone": "Polite & Professional",
            "text": f"""Dear {recruiter_name},

Thank you for reaching out regarding the opportunity with {claimed_company}.

To ensure compliance with standard recruitment security guidelines, could you kindly forward this communication and the job requisition details from your official @{claimed_company.lower().replace(' ', '')}.com corporate email address?

Additionally, please share the official Job ID so I can verify the opening on {claimed_company}'s verified career portal. Please note that as a student policy, I do not make advance payments for training, registration, or equipment deposits.

Looking forward to your official email confirmation.

Best regards,
[Your Full Name]
[Your Phone Number]"""
        },
        {
            "id": "CIN_AND_REGISTRATION_CHECK",
            "title": "Corporate Identification (CIN) & Placement Cell Verification",
            "tone": "Formal & Assertive",
            "text": f"""Dear {recruiter_name},

Thank you for your message. 

Before proceeding further with {claimed_company}, our university placement cell requires all recruitment partners to provide their Corporate Identification Number (CIN) and authorized office address for verification on the Ministry of Corporate Affairs (MCA) portal.

Furthermore, our institution strictly mandates that no student may transfer fees ({demanded_amount}) for offer letters or onboarding. Please confirm the authorized college recruitment coordinator you are liaising with.

Thank you for your understanding.

Sincerely,
[Your Full Name]"""
        },
        {
            "id": "DIRECT_DECLINE_FRAUD",
            "title": "Direct Notification of Fraud Policy",
            "tone": "Firm & Final",
            "text": f"""Dear {recruiter_name},

I am declining this request. Legitimate recruitment at {claimed_company} never involves upfront monetary transfers or personal UPI accounts. 

This communication has been flagged for review by the student protection registry. Please cease further unsolicited messages.

Regards,
[Your Name]"""
        }
    ]

    security_reminders = [
        "NEVER share OTPs (One Time Passwords) sent to your mobile phone.",
        "NEVER send payment to any personal UPI handle (e.g. name@okhdfcbank, name@paytm).",
        "NEVER upload scans of your original Aadhaar or PAN card to personal WhatsApp numbers.",
        "Verify all offer letters on the company's official public careers website."
    ]

    return {
        "claimed_company": claimed_company,
        "templates": options,
        "security_reminders": security_reminders
    }
