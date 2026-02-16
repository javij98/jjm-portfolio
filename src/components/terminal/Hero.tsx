import type { ReactNode } from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Terminal, Copy, Check, Download } from "lucide-react";
import resumeData from "../../data/resume.json";

// ─── Types ───
interface ProfileOutput {
  name: string;
  role: string;
  status: string;
  location: string;
  stack: string[];
  tagline: string;
}

type AnimationPhase = "idle" | "typing" | "executing" | "output" | "done";

// ─── Constants ───
const COMMAND = "./show-profile.sh";
const TYPING_SPEED = 38;
const EXECUTION_DELAY = 260;
const EXECUTION_TIME = 760;
const OUTPUT_SETTLE_DELAY = 280;

const profileOutput: ProfileOutput = {
  name: resumeData.profile.name,
  role: resumeData.profile.role,
  status: resumeData.profile.status,
  location: resumeData.profile.location,
  stack: resumeData.skills.core,
  tagline: resumeData.profile.tagline,
};

const yearsMatch = resumeData.summary.match(/\+(\d+)/);
const yearsExperience = yearsMatch ? `+${yearsMatch[1]} años` : "+4 años";

const heroKpis = [
  {
    label: resumeData.metrics[0]?.label ?? "Deploy Time",
    value: resumeData.metrics[0]?.value ?? "80%",
  },
  {
    label: resumeData.metrics[1]?.label ?? "Disponibilidad",
    value: resumeData.metrics[1]?.value ?? "99.9%",
  },
  {
    label: "Experiencia",
    value: yearsExperience,
  },
];

const quickSummary = [
  `Rol: ${profileOutput.role}`,
  `Impacto: ${resumeData.metrics[0]?.value ?? "80%"} de reducción en tiempos de despliegue`,
  `Fiabilidad: ${resumeData.metrics[1]?.value ?? "99.9%"} de disponibilidad en Kubernetes`,
  `Ubicación: ${profileOutput.location}`,
];

// ─── JSON Syntax Highlighting ───
function JsonHighlight({ data }: { data: ProfileOutput }) {
  const renderValue = (value: unknown, indent: number): ReactNode[] => {
    const pad = "  ".repeat(indent);

    if (Array.isArray(value)) {
      const items: ReactNode[] = [];
      items.push(
        <span key="arr-open" className="text-slate-300">
          [
        </span>,
      );
      value.forEach((item, i) => {
        items.push(
          <span key={`arr-item-${i}`}>
            {"\n"}
            {pad} <span className="text-operational-400">"{item}"</span>
            {i < value.length - 1 && <span className="text-slate-500">,</span>}
          </span>,
        );
      });
      items.push(
        <span key="arr-close">
          {"\n"}
          {pad}
          <span className="text-slate-300">]</span>
        </span>,
      );
      return items;
    }

    return [
      <span key="str" className="text-operational-400">
        "{String(value)}"
      </span>,
    ];
  };

  const entries = Object.entries(data);

  return (
    <code className="block whitespace-pre text-[13px] leading-relaxed">
      <span className="text-slate-300">{"{"}</span>
      {"\n"}
      {entries.map(([key, value], idx) => (
        <span key={key}>
          {"  "}
          <span className="text-accent-400">"{key}"</span>
          <span className="text-slate-500">: </span>
          {renderValue(value, 1)}
          {idx < entries.length - 1 && (
            <span className="text-slate-500">,</span>
          )}
          {"\n"}
        </span>
      ))}
      <span className="text-slate-300">{"}"}</span>
    </code>
  );
}

// ─── Terminal Line ───
function TerminalPrompt({
  typed,
  showCursor,
}: {
  typed: string;
  showCursor: boolean;
}) {
  return (
    <div className="flex items-center gap-2 font-mono text-xs sm:text-sm">
      <span className="text-operational-400">❯</span>
      <span className="text-slate-300">{typed}</span>
      {showCursor && (
        <span className="inline-block h-4 w-[2px] animate-blink bg-operational-400" />
      )}
    </div>
  );
}

// ─── Hero Component ───
export default function Hero() {
  const [phase, setPhase] = useState<AnimationPhase>("idle");
  const [typedCommand, setTypedCommand] = useState("");
  const [copied, setCopied] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Start animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setPhase("typing"), 320);
    return () => clearTimeout(timer);
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (phase !== "typing") return;

    let charIndex = 0;
    const interval = setInterval(() => {
      charIndex++;
      setTypedCommand(COMMAND.slice(0, charIndex));
      if (charIndex >= COMMAND.length) {
        clearInterval(interval);
        timeoutRef.current = setTimeout(
          () => setPhase("executing"),
          EXECUTION_DELAY,
        );
      }
    }, TYPING_SPEED);

    return () => {
      clearInterval(interval);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [phase]);

  // Execution → output
  useEffect(() => {
    if (phase !== "executing") return;
    const timer = setTimeout(() => setPhase("output"), EXECUTION_TIME);
    return () => clearTimeout(timer);
  }, [phase]);

  // Mark done after output renders
  useEffect(() => {
    if (phase !== "output") return;
    const timer = setTimeout(() => setPhase("done"), OUTPUT_SETTLE_DELAY);
    return () => clearTimeout(timer);
  }, [phase]);

  const handleCopy = useCallback(() => {
    void navigator.clipboard.writeText(JSON.stringify(profileOutput, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleScrollToMetrics = useCallback(() => {
    document.getElementById("metrics")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleSkipAnimation = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setTypedCommand(COMMAND);
    setPhase("done");
  }, []);

  return (
    <div className="relative flex min-h-[calc(100svh-5rem)] items-center justify-center px-3 py-8 sm:min-h-[calc(100vh-5rem)] sm:px-6 sm:py-20">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-500/3 blur-[150px]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        {/* ─── Value Proposition ─── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mx-auto mb-5 max-w-3xl text-center sm:mb-8"
        >
          <p className="font-mono text-[10px] uppercase tracking-wider text-operational-400 sm:text-xs">
            // DevOps & Platform Engineering
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:mt-3 sm:text-4xl">
            {resumeData.profile.role}
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-xs leading-relaxed text-slate-300 sm:mt-4 sm:text-base">
            {resumeData.summary}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:mt-6 sm:gap-2.5">
            {heroKpis.map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-full border border-white/10 bg-slate-900/70 px-2.5 py-1 backdrop-blur-sm sm:px-3 sm:py-1.5"
              >
                <span className="font-mono text-[10px] text-slate-400 sm:text-[11px]">
                  {kpi.label}:{" "}
                </span>
                <span className="font-mono text-[10px] font-semibold text-accent-300 sm:text-[11px]">
                  {kpi.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ─── Terminal Window ─── */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-xl border border-white/10 bg-slate-900/80 shadow-2xl shadow-black/40 backdrop-blur-sm"
        >
          {/* Title bar */}
          <div className="flex items-center justify-between border-b border-white/5 bg-slate-900/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-green-500/80" />
            </div>
            <div className="flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-slate-500" />
              <span className="font-mono text-xs text-slate-500">
                jjimenez@devops ~ $
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {phase !== "done" && (
                <button
                  onClick={handleSkipAnimation}
                  className="rounded px-2 py-1 font-mono text-[11px] text-building-400 transition-colors hover:bg-white/5 hover:text-building-300"
                >
                  Saltar
                </button>
              )}
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 rounded px-2 py-1 text-slate-500 transition-colors hover:bg-white/5 hover:text-slate-300"
                aria-label="Copiar output"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-operational-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Terminal body */}
          <div className="min-h-[220px] p-3 font-mono sm:min-h-[350px] sm:p-5">
            {/* Command line */}
            <TerminalPrompt typed={typedCommand} showCursor={phase === "typing" || phase === "idle"} />

            {/* Execution indicator */}
            <AnimatePresence>
              {phase === "executing" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 flex items-center gap-2"
                >
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-building-400/30 border-t-building-400" />
                  <span className="text-xs text-building-400">
                    Loading profile data...
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* JSON Output */}
            <AnimatePresence>
              {(phase === "output" || phase === "done") && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="mt-4"
                >
                  <div className="mb-2 flex items-center justify-between text-[11px] text-slate-500 sm:text-xs">
                    <span>─── profile summary ───</span>
                    <button
                      onClick={() => setShowRawJson((prev) => !prev)}
                      className="rounded px-2 py-1 font-mono text-[11px] text-accent-300 transition-colors hover:bg-white/5 hover:text-accent-200"
                    >
                      {showRawJson ? "Ocultar JSON" : "Ver JSON"}
                    </button>
                  </div>
                  <div className="overflow-x-auto rounded-lg border border-white/5 bg-slate-950/50 p-4">
                    <ul className="space-y-1.5 text-xs leading-relaxed sm:space-y-2 sm:text-[13px]">
                      {quickSummary.map((line, index) => (
                        <li
                          key={line}
                          className={`${index === 3 ? "hidden sm:flex" : "flex"} items-start gap-2 text-slate-300`}
                        >
                          <span className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-operational-400" />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>

                    {showRawJson && (
                      <div className="mt-4 border-t border-white/5 pt-4">
                        <JsonHighlight data={profileOutput} />
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Prompt after done */}
            {phase === "done" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 hidden sm:block"
              >
                <div className="flex items-center gap-2 font-mono text-sm">
                  <span className="text-operational-400">❯</span>
                  <span className="inline-block h-4 w-[2px] animate-blink bg-operational-400" />
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* ─── CTA Button ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-5 flex flex-col items-center gap-3 sm:mt-8 sm:gap-4"
        >
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={handleScrollToMetrics}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg border border-accent-500/30 bg-accent-500/10 px-4 py-2.5 font-mono text-xs font-medium text-accent-300 transition-all duration-300 hover:border-accent-400/50 hover:bg-accent-500/20 hover:text-accent-200 hover:shadow-lg hover:shadow-accent-500/10 sm:px-6 sm:py-3 sm:text-sm"
            >
              <span className="absolute inset-0 -z-10 bg-linear-to-r from-accent-500/0 via-accent-500/10 to-accent-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              <span>Ver impacto</span>
            </button>

            <a
              href="/JavierJimenezMolina_cv_es.pdf"
              download
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg border border-operational-500/30 bg-operational-500/10 px-4 py-2.5 font-mono text-xs font-medium text-operational-300 transition-all duration-300 hover:border-operational-400/50 hover:bg-operational-500/20 hover:text-operational-200 hover:shadow-lg hover:shadow-operational-500/10 sm:px-6 sm:py-3 sm:text-sm"
            >
              <span className="absolute inset-0 -z-10 bg-linear-to-r from-operational-500/0 via-operational-500/10 to-operational-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <Download className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              <span>Descargar CV</span>
            </a>
          </div>

          <p className="hidden font-mono text-xs text-slate-600 sm:block">
            {resumeData.profile.tagline}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
