import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { GraduationCap, MapPin, Calendar } from "lucide-react";
import resumeData from "../../data/resume.json";

// ─── Education Card ───
function EducationCard({
  degree,
  institution,
  faculty,
  location,
  period,
  index,
}: {
  degree: string;
  institution: string;
  faculty: string;
  location: string;
  period: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="group rounded-xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-accent-500/30"
    >
      {/* Header */}
      <div className="mb-4 flex items-start gap-4">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.4, delay: index * 0.15 + 0.1 }}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-accent-500/30 bg-accent-500/10"
        >
          <GraduationCap className="h-6 w-6 text-accent-400" />
        </motion.div>

        {/* Degree + Institution */}
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-white">{degree}</h3>
          <p className="mt-0.5 text-sm text-accent-300">{institution}</p>
          <p className="mt-0.5 text-xs text-slate-500">{faculty}</p>
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-4 border-t border-white/5 pt-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <MapPin className="h-3.5 w-3.5 text-slate-500" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Calendar className="h-3.5 w-3.5 text-slate-500" />
          <span>{period}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───
export default function Education() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-24">
      {/* Section header */}
      <div className="mb-12">
        <div className="mb-3 flex items-center gap-3">
          <div className="h-px flex-1 bg-linear-to-r from-accent-500/50 to-transparent" />
          <span className="font-mono text-xs font-medium uppercase tracking-widest text-accent-400">
            // Credentials
          </span>
          <div className="h-px flex-1 bg-linear-to-l from-accent-500/50 to-transparent" />
        </div>
        <h2 className="text-center text-3xl font-bold text-white">Educación</h2>
        <p className="mx-auto mt-3 max-w-lg text-center font-mono text-sm text-slate-500">
          Formación académica en ingeniería y telecomunicaciones.
        </p>
      </div>

      {/* Education cards */}
      <div className="grid gap-6">
        {resumeData.education.map((edu, index) => (
          <EducationCard
            key={edu.institution}
            degree={edu.degree}
            institution={edu.institution}
            faculty={edu.faculty}
            location={edu.location}
            period={edu.period}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
