import type { Locale } from "../i18n/content";
import { SITE_URL } from "../config/url.mjs";

/** Opens a draft with a link; no recipient is prefilled and no email is sent. */
export function cvEmailHref(interfaceLanguage: Locale, pdfLanguage: Locale): string {
  const subject = interfaceLanguage === "es" ? "CV de Javier Jiménez Molina" : "Javier Jiménez Molina's CV";
  const body = interfaceLanguage === "es" ? "Aquí tienes el enlace al CV de Javier Jiménez Molina:" : "Here is the link to Javier Jiménez Molina's CV:";
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`${body}\n\n${SITE_URL}/${pdfLanguage}/cv.pdf`)}`;
}
