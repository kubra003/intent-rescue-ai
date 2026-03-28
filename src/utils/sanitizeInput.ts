/**
 * IntentRescue AI: Clinical-grade PII Sanitization & Safety Layer
 * Redacts sensitive personal information and escapes basic HTML for UI safety.
 */
export function sanitizeInput(text: string): string {
  if (!text) return '';

  let sanitized = text;

  // 1. Redact Emails
  sanitized = sanitized.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL REDACTED]');

  // 2. Redact Phone Numbers (Multi-format)
  sanitized = sanitized.replace(/\b(\+?\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g, '[PHONE REDACTED]');

  // 3. Redact Social Security Numbers / Passports (Approximate)
  sanitized = sanitized.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[ID REDACTED]');

  // 4. Escape Basic HTML tags for UI safety (DOMPurify-light)
  sanitized = sanitized
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  return sanitized;
}
