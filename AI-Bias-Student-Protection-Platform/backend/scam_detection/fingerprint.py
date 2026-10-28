import hashlib
import hmac
from typing import Dict, Any, Optional
from privacy.pii_redactor import normalize_redacted_pattern

SECRET_REGISTRY_SALT = b"EquiLens-Salt-2026-Secure-HMAC"

def generate_sha256_fingerprint(normalized_pattern: str) -> str:
    """Generate deterministic cryptographic SHA-256 fingerprint from normalized pattern."""
    return hashlib.sha256(normalized_pattern.encode("utf-8")).hexdigest()

def generate_keyed_hmac(identifier: str) -> str:
    """Keyed HMAC for sensitive identifier lookups without revealing raw phone or email."""
    return hmac.new(SECRET_REGISTRY_SALT, identifier.strip().lower().encode("utf-8"), hashlib.sha256).hexdigest()

def create_threat_fingerprint(redacted_text: str) -> Dict[str, Any]:
    """
    Transforms redacted text into a normalized threat pattern and hashes it.
    Excludes private identifiers and includes structural scam characteristics.
    """
    normalized = normalize_redacted_pattern(redacted_text)
    fingerprint = generate_sha256_fingerprint(normalized)

    return {
        "normalized_pattern": normalized,
        "sha256_fingerprint": fingerprint,
        "hashing_algorithm": "SHA-256 (NIST FIPS 180-4)",
        "explanation": "The SHA-256 fingerprint is calculated strictly over the normalized structural pattern after all personal identifiers (names, numbers, UPI accounts) have been abstracted into tokens. This enables real-time community threat matching without sharing student identity."
    }
