import re
from typing import Dict, Any, List

REGIONAL_SCAM_LEXICON = {
    "hindi": {
        "script": "Devanagari",
        "keywords": [
            ("रजिस्ट्रेशन शुल्क", "Registration Fee", 35),
            ("प्रशिक्षण शुल्क", "Training Fee", 35),
            ("नियुक्ति पत्र", "Appointment / Offer Letter", 25),
            ("तुरंत भुगतान", "Immediate Payment", 25),
            ("सुरक्षा जमा", "Security Deposit", 30),
            ("चयन हुआ है", "Selection Confirmed", 20),
            ("पैसे जमा करें", "Deposit Money", 30),
            ("सीमित सीटें", "Limited Slots Urgency", 15)
        ],
        "hinglish_keywords": [
            ("turant payment karo", "Immediate Payment Demand", 30),
            ("registration fees lagegi", "Registration Fee Demand", 35),
            ("offer letter ke liye deposit", "Deposit for Offer Letter", 35),
            ("selection confirm ho gaya hai", "Unsolicited Selection Confirmation", 25),
            ("laptop charges wapas mil jayenge", "Fake Refundable Laptop Lure", 30)
        ]
    },
    "kannada": {
        "script": "Kannada",
        "keywords": [
            ("ತರಬೇತಿ ಶುಲ್ಕ", "Training Fee", 35),
            ("ಆಯ್ಕೆ ಖಚಿತವಾಗಿದೆ", "Selection Confirmed", 25),
            ("ಪಾವತಿಸಿ", "Make Payment", 25),
            ("ಲ್ಯಾಪ್ಟಾಪ್ ವಿಮೆ", "Laptop Insurance Charge", 30),
            ("ಠೇವಣಿ ಹಣ", "Deposit Money", 30),
            ("ನೇಮಕಾತಿ ಪತ್ರ", "Appointment Letter", 20),
            ("ಇಂದೇ ಕಳುಹಿಸಿ", "Send Today Urgency", 20)
        ],
        "kanglish_keywords": [
            ("selection aagidhe", "Selection Confirmed", 20),
            ("dhuddu kodi", "Demand for Money", 25),
            ("training fee katti", "Pay Training Fee", 35),
            ("offer letter barbekadre pay maadi", "Pay for Offer Letter", 35)
        ]
    },
    "tamil": {
        "script": "Tamil",
        "keywords": [
            ("பயிற்சி கட்டணம்", "Training Fee", 35),
            ("வேலை உறுதி", "Job Guaranteed", 25),
            ("பணம் செலுத்துங்கள்", "Deposit Money", 30),
            ("முன்பணம்", "Advance Payment", 30),
            ("உடனடியாக", "Urgent / Immediately", 20),
            ("பணி நியமன கடிதம்", "Appointment Letter", 20)
        ],
        "tanglish_keywords": [
            ("advance kudu", "Pay Advance Money", 30),
            ("training fees kattanum", "Must Pay Training Fee", 35),
            ("offer letter varum pay pannunga", "Pay to Receive Offer Letter", 35),
            ("selection aayiduchu", "Selection Confirmed", 20)
        ]
    },
    "telugu": {
        "script": "Telugu",
        "keywords": [
            ("రిజిస్ట్రేషన్ ఫీజు", "Registration Fee", 35),
            ("ఉద్యోగం ఖరారు", "Job Confirmed", 25),
            ("చెల్లించండి", "Make Payment", 25),
            ("డిపాజిట్", "Deposit Money", 30),
            ("శిక్షణ రుసుము", "Training Fee", 35),
            ("నియామక పత్రం", "Appointment Letter", 20),
            ("వెంటనే", "Immediately", 20)
        ],
        "telugish_keywords": [
            ("selection ayyindi", "Selection Confirmed", 20),
            ("ventane payment cheyandi", "Make Immediate Payment", 30),
            ("offer letter kosam fee kattali", "Pay Fee for Offer Letter", 35)
        ]
    }
}

def detect_language_and_regional_scam(text: str) -> Dict[str, Any]:
    """
    Detects regional Indian languages (Hindi, Kannada, Tamil, Telugu, Hinglish, Tanglish)
    and searches for regional scam indicators.
    """
    text_lower = text.lower()
    detected_languages = []
    matched_regional_indicators = []
    total_regional_weight = 0

    # Script regexes
    devanagari_regex = r"[\u0900-\u097F]"
    kannada_regex = r"[\u0C80-\u0CFF]"
    tamil_regex = r"[\u0B80-\u0BFF]"
    telugu_regex = r"[\u0C00-\u0C7F]"

    if re.search(devanagari_regex, text):
        detected_languages.append("Hindi (Devanagari)")
    if re.search(kannada_regex, text):
        detected_languages.append("Kannada (ಕನ್ನಡ)")
    if re.search(tamil_regex, text):
        detected_languages.append("Tamil (தமிழ்)")
    if re.search(telugu_regex, text):
        detected_languages.append("Telugu (తెలుగు)")

    # Scan for keywords across all regional entries
    for lang_code, data in REGIONAL_SCAM_LEXICON.items():
        # Native script matches
        for kw, meaning, weight in data["keywords"]:
            if kw in text:
                matched_regional_indicators.append({
                    "language": lang_code.capitalize(),
                    "matched_term": kw,
                    "english_translation": meaning,
                    "weight": weight,
                    "type": "Native Script Indicator"
                })
                total_regional_weight += weight
                if lang_code.capitalize() not in [l.split()[0] for l in detected_languages]:
                    detected_languages.append(f"{lang_code.capitalize()} (Lexicon Match)")

        # Code-mixed (Hinglish/Tanglish/Kanglish/Telugish) matches
        code_mixed_key = f"{lang_code[:4]}lish_keywords" if lang_code != "kannada" else "kanglish_keywords"
        if lang_code == "hindi": code_mixed_key = "hinglish_keywords"
        elif lang_code == "tamil": code_mixed_key = "tanglish_keywords"
        elif lang_code == "telugu": code_mixed_key = "telugish_keywords"

        for phrase, meaning, weight in data.get(code_mixed_key, []):
            if phrase in text_lower:
                matched_regional_indicators.append({
                    "language": f"{lang_code.capitalize()} (Code-Mixed / Romanized)",
                    "matched_term": phrase,
                    "english_translation": meaning,
                    "weight": weight,
                    "type": "Code-Mixed Romanized Indicator"
                })
                total_regional_weight += weight
                detected_languages.append(f"{lang_code.capitalize()} Code-Mixed")

    if not detected_languages:
        detected_languages.append("English (Standard)")

    return {
        "detected_languages": list(set(detected_languages)),
        "is_regional_targeted": len(matched_regional_indicators) > 0,
        "matched_regional_indicators": matched_regional_indicators,
        "regional_threat_score": min(100, total_regional_weight),
        "supported_locales": ["English", "Hindi", "Kannada", "Tamil", "Telugu", "Hinglish", "Tanglish", "Kanglish", "Telugish"]
    }
