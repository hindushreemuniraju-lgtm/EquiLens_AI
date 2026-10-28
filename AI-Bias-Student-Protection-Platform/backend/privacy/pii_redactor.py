import re
from typing import Dict, Any, List, Tuple

def redact_pii(text: str) -> Dict[str, Any]:
    """
    Detects and redacts sensitive Personally Identifiable Information (PII)
    including personal names, Indian phone numbers, emails, Aadhaar-like numbers,
    PAN numbers, and personal UPI IDs.
    Returns the redacted text and a list of redactions with character spans for animation.
    """
    redactions = []
    redacted_text = text

    # Pattern definitions
    patterns = [
        # Indian Phone numbers (+91, standard 10 digit, or masked like 98450-XXXXX)
        ("PHONE", r"(\+91[\-\s]?)?[6-9]\d{4}[\-\s]?[Xx0-9]{5}|\b\d{10}\b"),
        # Emails
        ("EMAIL", r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b"),
        # Indian Aadhaar number pattern (XXXX-XXXX-XXXX or 12 digits)
        ("AADHAAR", r"\b\d{4}[-\s]\d{4}[-\s]\d{4}\b"),
        # Indian PAN card pattern (5 letters, 4 digits, 1 letter)
        ("PAN", r"\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b"),
        # UPI handles
        ("UPI", r"\b[a-zA-Z0-9.\-_]{2,256}@(okaxis|okhdfcbank|okicici|oksbi|paytm|ybl|gpay|upi|axl|ibl)\b"),
        # Recruiter / Person names (e.g., "HR Ramesh", "Mr. Sharma", "Ramesh Kumar")
        ("PERSON", r"(?:HR\s+|recruiter\s+|Mr\.\s+|Ms\.\s+)([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)")
    ]

    for label, pattern in patterns:
        for match in re.finditer(pattern, text):
            original_val = match.group(0)
            # Avoid replacing already redacted tags
            if "[" in original_val and "]" in original_val:
                continue
            
            # For PERSON group with prefix, replace specifically the name part
            if label == "PERSON" and match.lastindex and match.lastindex >= 1:
                person_name = match.group(1)
                replacement = f"[{label}]"
                redactions.append({
                    "label": label,
                    "original": person_name,
                    "start": match.start(1),
                    "end": match.end(1),
                    "replacement": replacement
                })
            else:
                replacement = f"[{label}]"
                redactions.append({
                    "label": label,
                    "original": original_val,
                    "start": match.start(0),
                    "end": match.end(0),
                    "replacement": replacement
                })

    # Sort redactions by start position descending to safely replace without offset invalidation
    redactions.sort(key=lambda x: x["start"], reverse=True)
    for r in redactions:
        redacted_text = redacted_text[:r["start"]] + r["replacement"] + redacted_text[r["end"]:]

    # Reverse back for chronological display
    redactions.reverse()

    return {
        "original_text": text,
        "redacted_text": redacted_text,
        "redactions_count": len(redactions),
        "redactions": redactions
    }

def normalize_redacted_pattern(redacted_text: str) -> str:
    """
    Standardize the redacted text for privacy-preserving SHA-256 fingerprinting.
    Strips punctuation, lowercases, and regularizes spacing.
    """
    text = redacted_text.lower()
    # Normalize amounts to [amount]
    text = re.sub(r"₹\s*\d+(?:,\d+)*|\b\d+(?:,\d+)*\s*(?:rs|rupees|inr)\b", "[amount]", text)
    # Remove punctuation except brackets
    text = re.sub(r"[^\w\s\[\]]", "", text)
    # Collapse multiple whitespaces
    text = re.sub(r"\s+", " ", text).strip()
    return text
