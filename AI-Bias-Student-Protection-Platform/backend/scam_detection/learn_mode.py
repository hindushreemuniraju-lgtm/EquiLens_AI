from typing import Dict, Any, List

LEARN_MODE_MODULES = [
    {
        "id": "CASE-01",
        "title": "The Upfront 'Training & Onboarding Fee' Trap",
        "category": "Advance Fee Fraud",
        "difficulty": "Beginner",
        "scenario": """You receive an email from 'careers@google-placement-india.xyz':
'Congratulations! You have been selected for the Associate Software Engineer role at Google Bangalore. Your annual CTC will be ₹18,00,000. To confirm your joining batch and initiate background verification, please transfer ₹2,500 training registration fee to our recruitment executive via UPI within 24 hours.'""",
        "interactive_question": "What is the primary indicator that this job offer is fraudulent?",
        "options": [
            "The salary offer of ₹18,00,000 is too high for a fresh graduate.",
            "Legitimate companies never require candidates to pay upfront fees for training, onboarding, or background checks.",
            "The email asks for a response within 24 hours.",
            "Google only hires candidates who studied abroad."
        ],
        "correct_answer_index": 1,
        "explanation": "No reputable company (such as Google, Microsoft, Amazon, Infosys, TCS, etc.) will EVER ask an applicant to pay an onboarding fee, training charge, or security deposit. Any request for money is an immediate red flag.",
        "red_flags": [
            "Demand for upfront training fee (₹2,500)",
            "Spoofed domain ('google-placement-india.xyz' instead of 'google.com')",
            "Urgency trigger ('within 24 hours')",
            "Informal UPI transfer requirement"
        ]
    },
    {
        "id": "CASE-02",
        "title": "The 'Refundable Laptop Security Deposit' Scam",
        "category": "Hardware & Asset Fraud",
        "difficulty": "Intermediate",
        "scenario": """A recruiter contacts you on WhatsApp with an Amazon logo:
'Hi! Your resume on Naukri was shortlisted for Work-From-Home Customer Tech Support. We will courier a brand new MacBook Pro and dual monitors to your address. However, as per company asset policy, you must deposit a refundable security caution amount of ₹4,999 to guarantee asset safety. This amount will be returned with your first month salary.'""",
        "interactive_question": "Why is the promise of a 'refundable deposit' deceptive?",
        "options": [
            "Companies only provide Windows laptops, never MacBooks.",
            "Scammers use the word 'refundable' to lower your psychological guard; once funds are sent via UPI, the recruiter blocks you.",
            "Work from home jobs are completely outlawed in India.",
            "Security deposits are legally restricted to ₹1,000."
        ],
        "correct_answer_index": 1,
        "explanation": "Corporate IT assets are shipped at 100% employer expense. Employers manage asset security through internal asset agreements and tax deductions, never by asking freshers to transfer personal cash.",
        "red_flags": [
            "Deposit requested for hardware delivery",
            "WhatsApp-based recruiter outreach",
            "Fake promise of 'refund with first salary'",
            "Unsolicited shortlisting without technical interview"
        ]
    },
    {
        "id": "CASE-03",
        "title": "The Fake Interview Domain & Phishing Portal",
        "category": "Credential Harvesting",
        "difficulty": "Advanced",
        "scenario": """You receive an SMS:
'TCS Off-Campus Drive: Test scheduled today at 4:00 PM. Click to log in to TCS iON Assessment Engine: http://tcs-ion-exam-portal.online/login. Enter your Aadhaar number, college roll number, and date of birth to unlock the test window.'""",
        "interactive_question": "How can you verify if the test link is genuine before entering personal credentials?",
        "options": [
            "Check if the link contains the letters 'tcs'.",
            "Verify the domain suffix: official TCS assessments are hosted strictly on '*.tcsion.com' or '*.tcs.com', never unregistered generic domains like '.online'.",
            "Click the link and see if the website looks pretty.",
            "Assume it's genuine because it includes college roll number."
        ],
        "correct_answer_index": 1,
        "explanation": "Phishing operators register deceptive domains like 'tcs-ion-exam-portal.online' to harvest Aadhaar numbers, phone numbers, and student credentials. Always verify the domain name in the browser address bar.",
        "red_flags": [
            "Fake domain with '.online' TLD",
            "Requests sensitive Aadhaar numbers before any evaluation",
            "SMS transmission with shortened/unverified URL",
            "Lacks HTTPS security certificate from legitimate parent firm"
        ]
    },
    {
        "id": "CASE-04",
        "title": "Telegram 'Part-Time Rating' & Task Scams",
        "category": "Cyber Task Extortion",
        "difficulty": "Intermediate",
        "scenario": """A Telegram message arrives:
'Earn ₹3000 daily from home! Simply like YouTube videos and rate hotels on Google Maps. We will send ₹150 for the first 3 reviews as proof. Afterward, upgrade to VIP level by investing ₹5000 to unlock high-payout crypto tasks.'""",
        "interactive_question": "What is the psychological trap in this task scam?",
        "options": [
            "The initial small payout (₹150) builds false trust so the victim willingly deposits larger amounts (₹5000) that can never be withdrawn.",
            "Google Maps pays its reviewers directly in Bitcoin.",
            "YouTube requires users to pay to like videos.",
            "Telegram is owned by cryptocurrency exchanges."
        ],
        "correct_answer_index": 0,
        "explanation": "This is known as the 'Pig Butchering' or Task-based advance fraud. Scammers pay a nominal amount initially to gain trust, then trick the student into transferring significant savings into simulated 'crypto wallets' that are completely inaccessible.",
        "red_flags": [
            "Unrealistic returns for trivial tasks (₹3,000/day for video likes)",
            "Requests to 'invest' money to unlock earned wages",
            "Anonymous Telegram recruiter with no corporate footprint",
            "Pyramid task structure"
        ]
    }
]

def get_learn_mode_modules() -> List[Dict[str, Any]]:
    return LEARN_MODE_MODULES

def submit_quiz_answer(case_id: str, selected_option_index: int) -> Dict[str, Any]:
    for case in LEARN_MODE_MODULES:
        if case["id"] == case_id:
            is_correct = (selected_option_index == case["correct_answer_index"])
            return {
                "case_id": case_id,
                "is_correct": is_correct,
                "selected_option": selected_option_index,
                "correct_option": case["correct_answer_index"],
                "explanation": case["explanation"],
                "red_flags": case["red_flags"]
            }
    return {"error": "Case not found."}
