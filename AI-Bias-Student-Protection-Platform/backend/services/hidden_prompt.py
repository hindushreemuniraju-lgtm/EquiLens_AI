import re
from typing import Dict, Any, List

SUSPICIOUS_PATTERNS = [
    {
        "id": "PROMPT_INJECTION_OVERRIDE",
        "regex": r"(ignore\s+(?:all\s+)?previous\s+instructions|disregard\s+(?:all\s+)?prior\s+(?:prompts|rules|guidelines)|forget\s+all\s+instructions)",
        "risk_level": "CRITICAL",
        "description": "Direct system prompt override attempting to hijack LLM screening directives."
    },
    {
        "id": "SCORE_MAXIMIZATION_EXPLOIT",
        "regex": r"(give\s+(?:this\s+candidate\s+)?(?:a\s+)?(?:maximum|perfect|10/10|100%|top)\s+score|rate\s+(?:this\s+applicant\s+)?as\s+(?:the\s+)?best|recommend\s+for\s+immediate\s+hire)",
        "risk_level": "CRITICAL",
        "description": "Adversarial scoring manipulation intended to force an artificial maximum recommendation."
    },
    {
        "id": "ROLE_IMPERSONATION_JAILBREAK",
        "regex": r"(you\s+are\s+now\s+in\s+developer\s+mode|act\s+as\s+an\s+unrestricted\s+evaluator|system\s*:\s*you\s+must\s+approve)",
        "risk_level": "HIGH",
        "description": "Role-play and jailbreak prompt injection attempting to modify LLM evaluation parameters."
    },
    {
        "id": "ZERO_WIDTH_STEGANOGRAPHY",
        "regex": r"[\u200B\u200C\u200D\uFEFF]",
        "risk_level": "HIGH",
        "description": "Zero-width unicode character steganography used to hide instructions from human review while remaining visible to tokenizers."
    },
    {
        "id": "WHITE_FONT_METADATA_LURE",
        "regex": r"(<span[^>]*style=[\"'][^\"']*(?:color:\s*(?:#fff(?:fff)?|white)|display:\s*none)[^\"']*[\"']>|<font[^>]*color=[\"']white[\"']>)",
        "risk_level": "HIGH",
        "description": "HTML / CSS formatting tag obscuring text with white font on white background to trick ATS parsers."
    }
]

def audit_hidden_prompts(resume_text: str) -> Dict[str, Any]:
    """
    Detects adversarial prompt injections and resume gaming attempts in candidate documents.
    Evaluates scoring drift between raw untrusted input and sanitized text.
    """
    detected_exploits = []
    sanitized_text = resume_text

    for pattern in SUSPICIOUS_PATTERNS:
        matches = list(re.finditer(pattern["regex"], resume_text, re.IGNORECASE))
        if matches:
            for m in matches:
                detected_exploits.append({
                    "exploit_id": pattern["id"],
                    "matched_snippet": m.group(0),
                    "risk_level": pattern["risk_level"],
                    "description": pattern["description"],
                    "span": [m.start(), m.end()]
                })
            # Remove exploit from sanitized text
            sanitized_text = re.sub(pattern["regex"], "[REMOVED_SUSPICIOUS_INJECTION]", sanitized_text, flags=re.IGNORECASE)

    # Check for zero width count
    zero_width_chars = len(re.findall(r"[\u200B\u200C\u200D\uFEFF]", resume_text))
    if zero_width_chars > 0:
        detected_exploits.append({
            "exploit_id": "ZERO_WIDTH_CHARS",
            "matched_snippet": f"{zero_width_chars} hidden zero-width characters detected",
            "risk_level": "HIGH",
            "description": f"Detected {zero_width_chars} invisible unicode characters embedded in document stream.",
            "span": [0, 0]
        })

    is_compromised = len(detected_exploits) > 0

    # Calculate simulated scoring drift
    if is_compromised:
        untrusted_candidate_score = 98.5
        sanitized_legitimate_score = 64.0
        score_drift = untrusted_candidate_score - sanitized_legitimate_score
        verdict = "RESUME_GAMING_ATTEMPT_DETECTED"
        recommendation = "Reject automated score inflation. Candidate document contains adversarial prompt injections intended to manipulate GenAI screening."
    else:
        untrusted_candidate_score = 78.0
        sanitized_legitimate_score = 78.0
        score_drift = 0.0
        verdict = "DOCUMENT_INTEGRITY_VERIFIED"
        recommendation = "No covert instructions or adversarial gaming markers identified. Document is safe for standardized evaluation."

    return {
        "verdict": verdict,
        "is_compromised": is_compromised,
        "exploits_count": len(detected_exploits),
        "detected_exploits": detected_exploits,
        "scoring_drift_analysis": {
            "raw_untrusted_evaluation": untrusted_candidate_score,
            "sanitized_authentic_evaluation": sanitized_legitimate_score,
            "score_drift": score_drift,
            "drift_percentage": f"{score_drift:+.1f}%"
        },
        "recommendation": recommendation,
        "sanitized_text_preview": sanitized_text[:400] + ("..." if len(sanitized_text) > 400 else "")
    }
