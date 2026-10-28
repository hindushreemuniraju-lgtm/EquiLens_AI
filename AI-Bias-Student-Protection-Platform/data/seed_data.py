import json
import hashlib
import re

def normalize_text(text: str) -> str:
    """Normalize text by lowercasing, stripping extra whitespace, and standardizing punctuation."""
    text = text.lower().strip()
    text = re.sub(r'\s+', ' ', text)
    return text

def compute_fingerprint(normalized_pattern: str) -> str:
    return hashlib.sha256(normalized_pattern.encode('utf-8')).hexdigest()

# Seed Scam Reports for Community Registry
scam_seed_entries = [
    {
        "report_id": "SCAM-REG-001",
        "raw_text": "Pay ₹2500 training fee to HR Ramesh at 98450-XXXXX for Google Bangalore offer letter.",
        "normalized_pattern": "pay [amount] training fee to [person] at [phone] for [company] offer letter",
        "redacted_text": "Pay [AMOUNT] training fee to [PERSON] at [PHONE] for Google Bangalore offer letter.",
        "threat_category": "Training Fee / Fake Offer",
        "threat_level": "HIGH",
        "claimed_company": "Google Bangalore",
        "indicators": [
            "Mandatory upfront training fee",
            "Unverified recruiter identity (HR Ramesh)",
            "Unsolicited offer letter claim",
            "Urgent direct money transfer"
        ],
        "extracted_entities": {
            "amount": "₹2500",
            "person": "HR Ramesh",
            "phone": "98450-XXXXX",
            "company": "Google"
        },
        "reported_count": 42,
        "first_reported": "2026-10-15T10:30:00Z",
        "verified_by_moderator": True
    },
    {
        "report_id": "SCAM-REG-002",
        "raw_text": "Urgent: Deposit ₹4999 refundable security charge to upi hr-amazon-verify@okaxis to confirm your software engineer internship letter. Offer expires in 2 hours.",
        "normalized_pattern": "urgent deposit [amount] refundable security charge to [upi] to confirm your [role] offer expires in [time]",
        "redacted_text": "Urgent: Deposit [AMOUNT] refundable security charge to [UPI] to confirm your software engineer internship letter. Offer expires in 2 hours.",
        "threat_category": "Security Deposit / Urgency Scam",
        "threat_level": "CRITICAL",
        "claimed_company": "Amazon",
        "indicators": [
            "Fake UPI handle impersonating company",
            "Refundable security deposit demand",
            "Artificial deadline pressure (2 hours)",
            "Immediate internship confirmation lure"
        ],
        "extracted_entities": {
            "amount": "₹4999",
            "upi": "hr-amazon-verify@okaxis",
            "company": "Amazon"
        },
        "reported_count": 87,
        "first_reported": "2026-10-18T14:15:00Z",
        "verified_by_moderator": True
    },
    {
        "report_id": "SCAM-REG-003",
        "raw_text": "बधाई हो! आपका चयन Microsoft में हुआ है। नियुक्ति पत्र प्राप्त करने के लिए ₹1500 रजिस्ट्रेशन शुल्क 9876543210 पर GPay करें।",
        "normalized_pattern": "बधाई हो आपका चयन [company] में हुआ है नियुक्ति पत्र प्राप्त करने के लिए [amount] रजिस्ट्रेशन शुल्क [phone] पर gpay करें",
        "redacted_text": "बधाई हो! आपका चयन Microsoft में हुआ है। नियुक्ति पत्र प्राप्त करने के लिए [AMOUNT] रजिस्ट्रेशन शुल्क [PHONE] पर GPay करें।",
        "threat_category": "Multilingual Indic Scam (Hindi)",
        "threat_level": "HIGH",
        "claimed_company": "Microsoft",
        "indicators": [
            "Hindi recruitment lure with upfront registration fee",
            "Direct mobile number payment demand (GPay)",
            "Unsolicited selection confirmation"
        ],
        "extracted_entities": {
            "amount": "₹1500",
            "phone": "9876543210",
            "company": "Microsoft"
        },
        "reported_count": 29,
        "first_reported": "2026-10-20T09:00:00Z",
        "verified_by_moderator": True
    },
    {
        "report_id": "SCAM-REG-004",
        "raw_text": "ಅಭಿನಂದನೆಗಳು! Infosys ಕ್ಯಾಂಪಸ್ ಆಯ್ಕೆ ಖಚಿತವಾಗಿದೆ. ಲ್ಯಾಪ್ಟಾಪ್ ವಿಮೆಗಾಗಿ ₹3000 ಹಣವನ್ನು ಈ ಲಿಂಕ್ ಮೂಲಕ ಪಾವತಿಸಿ: http://infosys-careers-portal.fakejobs.in",
        "normalized_pattern": "ಅಭಿನಂದನೆಗಳು [company] ಕ್ಯಾಂಪಸ್ ಆಯ್ಕೆ ಖಚಿತವಾಗಿದೆ ಲ್ಯಾಪ್ಟಾಪ್ ವಿಮೆಗಾಗಿ [amount] ಹಣವನ್ನು ಈ ಲಿಂಕ್ ಮೂಲಕ ಪಾವತಿಸಿ [url]",
        "redacted_text": "ಅಭಿನಂದನೆಗಳು! Infosys ಕ್ಯಾಂಪಸ್ ಆಯ್ಕೆ ಖಚಿತವಾಗಿದೆ. ಲ್ಯಾಪ್ಟಾಪ್ ವಿಮೆಗಾಗಿ [AMOUNT] ಹಣವನ್ನು ಈ ಲಿಂಕ್ ಮೂಲಕ ಪಾವತಿಸಿ: [URL]",
        "threat_category": "Multilingual Indic Scam (Kannada)",
        "threat_level": "CRITICAL",
        "claimed_company": "Infosys",
        "indicators": [
            "Kannada language regional targeting",
            "Bogus 'Laptop Insurance' fee requirement",
            "Phishing domain spoofing corporate careers portal"
        ],
        "extracted_entities": {
            "amount": "₹3000",
            "url": "http://infosys-careers-portal.fakejobs.in",
            "company": "Infosys"
        },
        "reported_count": 53,
        "first_reported": "2026-10-22T16:45:00Z",
        "verified_by_moderator": True
    },
    {
        "report_id": "SCAM-REG-005",
        "raw_text": "Dear candidate, your profile is shortlisted for TCS off-campus. You must clear document verification charges of ₹1999 to recruiter Suresh on WhatsApp 9123456789.",
        "normalized_pattern": "dear candidate your profile is shortlisted for [company] off-campus you must clear document verification charges of [amount] to recruiter [person] on whatsapp [phone]",
        "redacted_text": "Dear candidate, your profile is shortlisted for TCS off-campus. You must clear document verification charges of [AMOUNT] to recruiter [PERSON] on WhatsApp [PHONE].",
        "threat_category": "Document Verification Fee",
        "threat_level": "HIGH",
        "claimed_company": "TCS",
        "indicators": [
            "Document verification charge request",
            "Informal WhatsApp recruiter contact",
            "Unsolicited off-campus shortlisting"
        ],
        "extracted_entities": {
            "amount": "₹1999",
            "person": "Suresh",
            "phone": "9123456789",
            "company": "TCS"
        },
        "reported_count": 38,
        "first_reported": "2026-10-25T11:20:00Z",
        "verified_by_moderator": True
    }
]

# Calculate fingerprints for each
for item in scam_seed_entries:
    norm = normalize_text(item["normalized_pattern"])
    item["sha256_fingerprint"] = compute_fingerprint(norm)

with open("AI-Bias-Student-Protection-Platform/data/scam_registry_seed.json", "w", encoding="utf-8") as f:
    json.dump(scam_seed_entries, f, indent=2, ensure_ascii=False)

print(f"Generated scam_registry_seed.json with {len(scam_seed_entries)} records.")

# Sample Job Descriptions for Bias Tracer
sample_job_descriptions = [
    {
        "id": "JD-001",
        "title": "Senior Backend Architect (Biased Baseline)",
        "department": "Core Infrastructure",
        "text": """We are looking for a rockstar, aggressive ninja engineer who thrives in high-stress combat environments. 
Requirements:
- Graduate from Premier institutes only (IIT / BITS / NIT) - Tier 2/3 candidates will not be evaluated.
- Native-level English speaker with flawless western communication accent.
- Must relocate immediately to Bangalore HQ; remote work is strictly forbidden.
- Young, energetic culture with 70-hour work weeks and weekend war rooms.
- Minimum 8 years continuous experience with no career gaps or personal leaves.
- High GPA (>= 8.5) from top-tier institutions."""
    },
    {
        "id": "JD-002",
        "title": "AI / ML Research Associate (Gendered & Exclusionary)",
        "department": "Applied Machine Learning",
        "text": """Seeking a dominant, assertive coder to spearhead our autonomous trading algorithmic bots.
Requirements:
- Proven track record of crushing competition in intense algorithmic hackathons.
- Unencumbered by family commitments; mandatory late-night deployments.
- Candidates must possess recent graduation dates (Class of 2023 or 2024 only; older candidates need not apply).
- Able to handle physical server rack installations and lift 50 lbs equipment without accommodations."""
    },
    {
        "id": "JD-003",
        "title": "Full-Stack Software Engineer (Inclusive Example)",
        "department": "Platform Services",
        "text": """We are looking for an experienced Software Engineer to build scalable microservices and user-facing features.
Requirements:
- Strong proficiency in modern TypeScript, Python, or Go.
- Experience with relational and distributed database systems.
- Demonstrated ability to collaborate thoughtfully across cross-functional teams.
- Degree in Computer Science, related technical field, or equivalent practical experience.
- Flexible hybrid working arrangements available with supportive parental leave policies."""
    }
]

with open("AI-Bias-Student-Protection-Platform/data/sample_job_descriptions.json", "w", encoding="utf-8") as f:
    json.dump(sample_job_descriptions, f, indent=2, ensure_ascii=False)

print(f"Generated sample_job_descriptions.json with {len(sample_job_descriptions)} sample JDs.")
