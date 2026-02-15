import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { GitCommitHorizontal, CheckCircle2, Briefcase } from "lucide-react";
import resumeData from "../../data/resume.json";

// ─── Single Pipeline Stage ───
function PipelineStage({
  company,
  role,
  period,
  achievements,
  index,
  isLast,
}: {
  company: string;
  role: string;
  period: string;
  achievements: string[];
  index: number;
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const isPresent = period.toLowerCase().includes("presente");

  return (
    <div ref={ref} className="relative flex gap-6">
      {/* Pipeline line + node */}
      <div className="flex flex-col items-center">
        {/* Node */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: index * 0.2 }}
          className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
            isPresent
              ? "border-operational-500/50 bg-operational-500/10"
              : "border-accent-500/30 bg-accent-500/10"
          }`}
        >
          {isPresent ? (
            <GitCommitHorizontal className="h-5 w-5 text-operational-400" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-accent-400" />
          )}
          {/* Pulse for current job */}
          {isPresent && (
            <span className="absolute inset-0 animate-ping rounded-full border border-operational-400/20" />
          )}
        </motion.div>

        {/* Connecting line */}
        {!isLast && (
          <motion.div
            initial={{ height: 0 }}
            animate={isInView ? { height: "100%" } : {}}
            transition={{ duration: 0.6, delay: index * 0.2 + 0.2 }}
            className="w-px bg-linear-to-b from-slate-600 to-slate-800"
          />
        )}
      </div>

      {/* Content card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: index * 0.2 + 0.1 }}
        className={`mb-10 flex-1 rounded-xl border bg-slate-900/50 p-6 backdrop-blur-sm transition-all duration-300 ${
          isPresent
            ? "border-operational-500/20 hover:border-operational-500/40"
            : "border-white/10 hover:border-white/20"
        }`}
      >
        {/* Header */}
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-slate-500" />
              <h3 className="text-lg font-semibold text-white">{company}</h3>
              {isPresent && (
                <span className="rounded-full border border-operational-500/30 bg-operational-500/10 px-2 py-0.5 font-mono text-[10px] font-medium text-operational-400">
                  ACTIVE
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-slate-400">{role}</p>
          </div>
          <span className="shrink-0 rounded-md border border-white/10 bg-slate-800/50 px-3 py-1 font-mono text-xs text-slate-400">
            {period}
          </span>
        </div>

        {/* Achievements */}
        <ul className="space-y-2">
          {achievements.map((achievement, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{
                duration: 0.3,
                delay: index * 0.2 + 0.3 + i * 0.08,
              }}
              className="flex items-start gap-2 text-sm text-slate-400"
            >
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-400" />
              <span>{achievement}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

// ─── Main Component ───
export default function Experience() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-24">
      {/* Section header */}
      <div className="mb-12">
        <div className="mb-3 flex items-center gap-3">
          <div className="h-px flex-1 bg-linear-to-r from-accent-500/50 to-transparent" />
          <span className="font-mono text-xs font-medium uppercase tracking-widest text-accent-400">
            // Deployment Pipeline
          </span>
          <div className="h-px flex-1 bg-linear-to-l from-accent-500/50 to-transparent" />
        </div>
        <h2 className="text-center text-3xl font-bold text-white">
          Experiencia Profesional
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center font-mono text-sm text-slate-500">
          Trayectoria desde desarrollo de software hasta ingeniería de
          plataformas y DevOps.
        </p>
      </div>

      {/* Pipeline timeline */}
      <div>
        {resumeData.experience.map((exp, index) => (
          <PipelineStage
            key={exp.company}
            company={exp.company}
            role={exp.role}
            period={exp.period}
            achievements={exp.achievements}
            index={index}
            isLast={index === resumeData.experience.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
