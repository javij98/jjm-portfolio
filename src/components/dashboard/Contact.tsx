import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Check, Mail, Linkedin } from "lucide-react";
import resumeData from "../../data/resume.json";

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const copyResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [isCopied, setIsCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (copyResetTimeoutRef.current) clearTimeout(copyResetTimeoutRef.current);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const handleCopyEmail = useCallback(async () => {
    const email = resumeData.profile.email;

    try {
      await navigator.clipboard.writeText(email);
      setIsCopied(true);
      setToastMessage(`Email copiado: ${email}`);

      if (copyResetTimeoutRef.current) clearTimeout(copyResetTimeoutRef.current);
      copyResetTimeoutRef.current = setTimeout(() => setIsCopied(false), 1800);
    } catch {
      setToastMessage("No se pudo copiar el email");
    }

    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setToastMessage(null), 2400);
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-6 py-24">
      {/* Section header */}
      <div className="mb-12">
        <div className="mb-3 flex items-center gap-3">
          <div className="h-px flex-1 bg-linear-to-r from-operational-500/50 to-transparent" />
          <span className="font-mono text-xs font-medium uppercase tracking-widest text-operational-400">
            // Connect
          </span>
          <div className="h-px flex-1 bg-linear-to-l from-operational-500/50 to-transparent" />
        </div>
        <h2 className="text-center text-3xl font-bold text-white">Contacto</h2>
        <p className="mx-auto mt-3 max-w-lg text-center font-mono text-sm text-slate-500">
          ¿Tienes un proyecto o una propuesta? No dudes en contactarme.
        </p>
      </div>

      {/* Contact buttons */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center gap-4 sm:flex-row"
      >
        {/* Email */}
        <button
          type="button"
          onClick={() => void handleCopyEmail()}
          className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl border border-accent-500/30 bg-accent-500/10 px-8 py-4 font-mono text-sm font-medium text-accent-300 transition-all duration-300 hover:border-accent-400/50 hover:bg-accent-500/20 hover:text-accent-200 hover:shadow-lg hover:shadow-accent-500/10 sm:w-auto"
          aria-label={`Copiar email ${resumeData.profile.email}`}
        >
          <span className="absolute inset-0 -z-10 bg-linear-to-r from-accent-500/0 via-accent-500/10 to-accent-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          {isCopied ? (
            <Check className="h-5 w-5 text-operational-400" />
          ) : (
            <Mail className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
          )}
          <span>{isCopied ? "¡Copiado!" : resumeData.profile.email}</span>
        </button>

        {/* LinkedIn */}
        <a
          href={`https://${resumeData.profile.linkedin}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl border border-operational-500/30 bg-operational-500/10 px-8 py-4 font-mono text-sm font-medium text-operational-300 transition-all duration-300 hover:border-operational-400/50 hover:bg-operational-500/20 hover:text-operational-200 hover:shadow-lg hover:shadow-operational-500/10 sm:w-auto"
        >
          <span className="absolute inset-0 -z-10 bg-linear-to-r from-operational-500/0 via-operational-500/10 to-operational-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <Linkedin className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
          <span>LinkedIn</span>
        </a>
      </motion.div>

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none fixed inset-x-4 bottom-6 z-50 mx-auto w-fit rounded-lg border border-operational-500/40 bg-slate-950/95 px-4 py-2 font-mono text-xs text-operational-300 shadow-lg shadow-black/30 backdrop-blur"
            role="status"
            aria-live="polite"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
