import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Shield, Code2, BarChart3, Rocket } from "lucide-react";
import type { ResumeData, UiLabels } from "../../i18n/ui";

type SkillCategoryKey = keyof ResumeData["skills"];

interface CategoryConfig {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  borderColor: string;
  bgColor: string;
  badgeColor: string;
  spotlightColor: string;
}

function buildCategoryConfig(labels: UiLabels["skills"]): Record<SkillCategoryKey, CategoryConfig> {
  return {
    core: {
      label: labels.categories.core,
      icon: Shield,
      color: "text-operational-400",
      borderColor: "border-operational-500/20",
      bgColor: "bg-operational-500/10",
      badgeColor:
        "border-operational-500/30 bg-operational-500/10 text-operational-300",
      spotlightColor: "rgba(52, 211, 153, 0.45)",
    },
    dev: {
      label: labels.categories.dev,
      icon: Code2,
      color: "text-accent-400",
      borderColor: "border-accent-500/20",
      bgColor: "bg-accent-500/10",
      badgeColor: "border-accent-500/30 bg-accent-500/10 text-accent-300",
      spotlightColor: "rgba(34, 211, 238, 0.45)",
    },
    observability: {
      label: labels.categories.observability,
      icon: BarChart3,
      color: "text-purple-400",
      borderColor: "border-purple-500/20",
      bgColor: "bg-purple-500/10",
      badgeColor: "border-purple-500/30 bg-purple-500/10 text-purple-300",
      spotlightColor: "rgba(192, 132, 252, 0.45)",
    },
    learning: {
      label: labels.categories.learning,
      icon: Rocket,
      color: "text-building-400",
      borderColor: "border-building-500/20",
      bgColor: "bg-building-500/10",
      badgeColor: "border-building-500/30 bg-building-500/10 text-building-300",
      spotlightColor: "rgba(251, 191, 36, 0.5)",
    },
  };
}

function SkillBadge({
  skill,
  config,
  index,
  isLearning,
  isInView,
}: {
  skill: string;
  config: CategoryConfig;
  index: number;
  isLearning: boolean;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-sm transition-all duration-300 hover:scale-105 ${config.badgeColor}`}
    >
      <span>{skill.replace(/\s\((En progreso|In progress)\)$/i, "")}</span>
      {isLearning && (
        <span className="flex items-center gap-1">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-building-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-building-400" />
          </span>
        </span>
      )}
    </motion.div>
  );
}

function SkillCategory({
  categoryKey,
  skills,
  index,
  labels,
  config,
}: {
  categoryKey: SkillCategoryKey;
  skills: string[];
  index: number;
  labels: UiLabels["skills"];
  config: CategoryConfig;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const IconComponent = config.icon;
  const isLearning = categoryKey === "learning";

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    event.currentTarget.style.setProperty("--spotlight-x", `${x}px`);
    event.currentTarget.style.setProperty("--spotlight-y", `${y}px`);
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty("--spotlight-x", "50%");
    event.currentTarget.style.setProperty("--spotlight-y", "50%");
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative overflow-hidden rounded-xl border bg-slate-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-slate-900/70 ${config.borderColor}`}
      style={
        {
          "--spotlight-x": "50%",
          "--spotlight-y": "50%",
        } as React.CSSProperties
      }
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(220px circle at var(--spotlight-x) var(--spotlight-y), ${config.spotlightColor}, transparent 70%)`,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-px rounded-[11px] bg-slate-900/85"
      />

      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${config.bgColor}`}
            >
              <IconComponent className={`h-4 w-4 ${config.color}`} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{config.label}</h3>
              <span className="font-mono text-[11px] text-slate-500">
                {skills.length} {isLearning ? labels.inProgress : labels.skillsWord}
              </span>
            </div>
          </div>

          {isLearning ? (
            <span className="flex items-center gap-1.5 rounded-full border border-building-500/30 bg-building-500/10 px-2.5 py-1 font-mono text-[10px] font-medium text-building-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-building-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-building-400" />
              </span>
              {labels.compiling}
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full border border-operational-500/30 bg-operational-500/10 px-2.5 py-1 font-mono text-[10px] font-medium text-operational-400">
              <span className="h-1.5 w-1.5 rounded-full bg-operational-400" />
              {labels.stable}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {skills.map((skill, i) => (
            <SkillBadge
              key={skill}
              skill={skill}
              config={config}
              index={i}
              isLearning={isLearning}
              isInView={isInView}
            />
          ))}
        </div>

        {isLearning && (
          <div className="mt-4">
            <div className="mb-1 flex justify-between">
              <span className="font-mono text-[11px] text-slate-500">
                {labels.progress}
              </span>
              <span className="font-mono text-[11px] text-building-400">
                {labels.building}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <motion.div
                initial={{ width: 0 }}
                animate={isInView ? { width: "35%" } : {}}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                className="h-full rounded-full bg-linear-to-r from-building-600 to-building-400"
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export interface SkillsProps {
  data: ResumeData;
  labels: UiLabels["skills"];
}

export default function Skills({ data, labels }: SkillsProps) {
  const categoryConfig = buildCategoryConfig(labels);
  const categoryOrder: SkillCategoryKey[] = [
    "core",
    "dev",
    "observability",
    "learning",
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-12">
        <div className="mb-3 flex items-center gap-3">
          <div className="h-px flex-1 bg-linear-to-r from-building-500/50 to-transparent" />
          <span className="font-mono text-xs font-medium uppercase tracking-widest text-building-400">
            {labels.eyebrow}
          </span>
          <div className="h-px flex-1 bg-linear-to-l from-building-500/50 to-transparent" />
        </div>
        <h2 className="text-center text-3xl font-bold text-white">
          {labels.title}
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center font-mono text-sm text-slate-500">
          {labels.description}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {categoryOrder.map((key, index) => (
          <SkillCategory
            key={key}
            categoryKey={key}
            skills={data.skills[key]}
            index={index}
            labels={labels}
            config={categoryConfig[key]}
          />
        ))}
      </div>
    </div>
  );
}
