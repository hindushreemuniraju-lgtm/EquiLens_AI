import re
from typing import Dict, Any, List

EXCLUSIONARY_PATTERNS = [
    {
        "id": "PREMIER_INSTITUTES",
        "regex": r"\b(premier\s+institutes?\s+only|tier[- ]?1\s+(?:colleges?|universit(?:y|ies))\s+only|iit\s*/?\s*bits\s*/?\s*nit\s+only|top[- ]?tier\s+institutions?\s+only)\b",
        "category": "Socioeconomic & Institutional Privilege",
        "concern": "Exclusionary Institutional Gatekeeping",
        "affected_groups": ["Tier 2/3 engineering colleges", "Rural and non-metro candidates", "Underrepresented socioeconomic backgrounds"],
        "explanation": "Strict institutional cutoffs exclude highly competent self-taught and state university engineers who lacked coaching resources for entrance exams.",
        "evidence": "Studies show college tier correlates heavily with regional socioeconomic privilege rather than on-the-job software engineering capability.",
        "suggested_alternative": "Demonstrated technical proficiency in core engineering concepts, verified GitHub portfolio, or equivalent practical coding experience regardless of university tier."
    },
    {
        "id": "NATIVE_ENGLISH",
        "regex": r"\b(native[- ]?level\s+english|flawless\s+western\s+accent|accent[- ]?free\s+english|native\s+english\s+speaker)\b",
        "category": "Linguistic & Regional Discrimination",
        "concern": "Linguistic Discrimination",
        "affected_groups": ["Regional-medium educated students", "Non-metro and vernacular-language backgrounds"],
        "explanation": "Requiring 'native western accents' creates an unlawful barrier for Indian students whose primary education occurred in vernacular or regional languages.",
        "evidence": "Clarity of technical communication does not require western accents or native-level linguistic idioms.",
        "suggested_alternative": "Clear, effective technical communication and collaborative verbal/written skills."
    },
    {
        "id": "IMMEDIATE_RELOCATION",
        "regex": r"\b(must\s+relocate\s+immediately|immediate\s+relocation\s+mandatory|relocate\s+within\s+\d+\s+days?|no\s+relocation\s+assistance)\b",
        "category": "Geographic & Economic Inequity",
        "concern": "Unreasonable Geographic Relocation Barrier",
        "affected_groups": ["Economically disadvantaged freshers", "Candidates with eldercare / family obligations", "Women candidates with relocation constraints"],
        "explanation": "Immediate mandatory relocation without notice periods or relocation stipend forces lower-income students to decline legitimate opportunities.",
        "evidence": "Graduates from non-metro areas require transition buffers to secure housing in metropolitan tech hubs.",
        "suggested_alternative": "Flexible start dates with standard 30-day onboarding transition period and comprehensive relocation support."
    },
    {
        "id": "HYPER_MASCULINE_CODING",
        "regex": r"\b(rockstar|ninja|guru|aggressive|dominant|crush\s+competition|work\s+hard\s+play\s+hard|combat\s+environment)\b",
        "category": "Gendered Language & Culture",
        "concern": "Hyper-Masculine & Combative Culture Framing",
        "affected_groups": ["Women in engineering", "Collaborative and diverse candidates"],
        "explanation": "Phrases like 'aggressive ninja' and 'crush competition' statistically deter female candidates from applying.",
        "evidence": "Linguistic analysis (Gaucher et al., 2011) proves masculine-coded job postings significantly depress female applicant pools.",
        "suggested_alternative": "Results-oriented, thoughtful engineer who excels in collaborative, high-trust cross-functional teams."
    },
    {
        "id": "AGE_AND_EXTREME_HOURS",
        "regex": r"\b(young\s+and\s+energetic|recent\s+graduates?\s+only|class\s+of\s+202[345]\s+only|70[- ]?hour\s+work\s+weeks?|weekend\s+war\s+rooms?)\b",
        "category": "Ageism & Work-Life Disparity",
        "concern": "Age Discrimination & Burnout Culture",
        "affected_groups": ["Candidates over 30", "Working parents and caregivers"],
        "explanation": "Restricting roles to 'young and energetic' candidates violates age discrimination standards and signals non-compliant labor conditions.",
        "evidence": "Age descriptors mask biases against experience and penalize candidates with families.",
        "suggested_alternative": "Passionate, curious professionals at any career stage committed to sustainable excellence and balanced execution."
    },
    {
        "id": "NO_CAREER_GAPS",
        "regex": r"\b(no\s+career\s+gaps?|continuous\s+employment\s+only|without\s+any\s+breaks?|zero\s+gap\s+years?)\b",
        "category": "Caregiver & Medical Inequity",
        "concern": "Blanket Career Gap Penalization",
        "affected_groups": ["Women re-entering workforce after maternity", "Candidates with medical leaves", "Candidates from economically disrupted families"],
        "explanation": "Zero gap policies disproportionately penalize women returning from parental leave or candidates who paused studies due to financial hardship.",
        "evidence": "Career breaks do not diminish technical competency when given equal evaluation opportunities.",
        "suggested_alternative": "Continuous or cumulative relevant experience; candidates returning to the workforce are warmly encouraged to apply."
    }
]

def trace_rubric_bias(job_description: str) -> Dict[str, Any]:
    """
    Scans job descriptions and rubrics for exclusionary and biased language,
    providing structured evidence and suggested inclusive rewrites.
    """
    flagged_phrases = []
    revised_text = job_description

    for pattern in EXCLUSIONARY_PATTERNS:
        for match in re.finditer(pattern["regex"], job_description, re.IGNORECASE):
            phrase = match.group(0)
            flagged_phrases.append({
                "id": pattern["id"],
                "flagged_phrase": phrase,
                "category": pattern["category"],
                "concern": pattern["concern"],
                "affected_groups": pattern["affected_groups"],
                "explanation": pattern["explanation"],
                "evidence": pattern["evidence"],
                "suggested_alternative": pattern["suggested_alternative"],
                "confidence_score": 0.94
            })
            
            # Suggest revised replacement in text
            revised_text = re.sub(
                re.escape(phrase), 
                f"[INCLUSIVE REVISION: {pattern['suggested_alternative']}]", 
                revised_text, 
                flags=re.IGNORECASE
            )

    bias_score = min(100, len(flagged_phrases) * 20)

    return {
        "original_text": job_description,
        "total_flagged_count": len(flagged_phrases),
        "inclusivity_index": max(0, 100 - bias_score),
        "flagged_phrases": flagged_phrases,
        "revised_text": revised_text,
        "summary": (
            f"Detected {len(flagged_phrases)} potentially exclusionary phrase(s) across {len(set(f['category'] for f in flagged_phrases))} categories. Review suggestions to broaden your candidate funnel."
            if flagged_phrases else
            "Job description exhibits inclusive, competency-focused framing with zero high-risk exclusionary triggers."
        )
    }
