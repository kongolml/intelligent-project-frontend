import DOMPurify from "dompurify";

export function sanitizeHtml(dirty: string): string {
  // doesnt work on server side
  return DOMPurify.sanitize(dirty);
}
