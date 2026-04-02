import DOMPurify from "dompurify";

export function sanitizeHtml(dirty: string): string {
  if (typeof window === 'undefined') {
    throw new Error('sanitizeHtml is client-only');
  }
  return DOMPurify.sanitize(dirty);
}
