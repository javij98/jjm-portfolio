import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, Minus, ArrowUpRight } from "lucide-react";
import type { ResumeData, UiLabels } from "../../i18n/ui";

// ─── Counter Animation Hook ───
function useCountUp(
  target: string,
  isInView: boolean,
  duration = 2000,
): string {
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!isInView) return;

    const numericMatch = target.match(/[\d.]+/);
    if (!numericMatch) {
      setDisplay(target);
      return;
    }

    const numericTarget = parseFloat(numericMatch[0]);
    const prefix = target.slice(0, target.indexOf(numericMatch[0]));
    const suffix = target.slice(
      target.indexOf(numericMatch[0]) + numericMatch[0].length,
    );
    const hasDecimal = numericMatch[0].includes(".");
    const decimalPlaces = hasDecimal ? numericMatch[0].split(".")[1].length : 0;

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = numericTarget * eased;

      setDisplay(`${prefix}${currentValue.toFixed(decimalPlaces)}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, target, duration]);

  return display;
}

// ─── Trend Icon ───
function TrendIcon({ trend }: { trend: ResumeData["metrics"][number]["trend"] }) {
  if (trend === "up") {
    return <TrendingUp className="h-4 w-4 text-operational-400" />;
  }
  if (trend === "stable") {
    return <Minus className="h-4 w-4 text-accent-400" />;
  }
  return <ArrowUpRight className="h-4 w-4 text-building-400" />;
}

// ─── Single Metric Card ───
function MetricCard({
  label,
  value,
  trend,
  index,
  labels,
}: {
  label: string;
  value: string;
  trend: ResumeData["metrics"][number]["trend"];
  index: number;
  labels: UiLabels["metrics"];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const displayValue = useCountUp(value, isInView);

  const trendLabel =
    trend === "up"
      ? labels.trendUp
      : trend === "stable"
        ? labels.trendStable
        : labels.trendProcessing;

  const trendColor =
    trend === "up"
      ? "text-operational-400"
      : trend === "stable"
        ? "text-accent-400"
        : "text-building-400";

  const borderColor =
    trend === "up"
      ? "border-operational-500/20 hover:border-operational-500/40"
      : trend === "stable"
        ? "border-accent-500/20 hover:border-accent-500/40"
        : "border-building-500/20 hover:border-building-500/40";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className={`group relative rounded-xl border bg-slate-900/50 p-6 backdrop-blur-sm transition-all duration-300 ${borderColor}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500">
          {label}
        </span>
        <div className="flex items-center gap-1.5">
          <TrendIcon trend={trend} />
          <span className={`font-mono text-[11px] ${trendColor}`}>
            {trendLabel}
          </span>
        </div>
      </div>

      <div className="mb-3">
        <span className="font-mono text-4xl font-bold tracking-tight text-white">
          {displayValue}
        </span>
      </div>

      <div className="h-1 w-full overflow-hidden rounded-full bg-slate-800">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: "100%" } : {}}
          transition={{
            duration: 1.5,
            delay: index * 0.15 + 0.3,
            ease: "easeOut",
          }}
          className={`h-full rounded-full ${
            trend === "up"
              ? "bg-linear-to-r from-operational-600 to-operational-400"
              : trend === "stable"
                ? "bg-linear-to-r from-accent-600 to-accent-400"
                : "bg-linear-to-r from-building-600 to-building-400"
          }`}
        />
      </div>
    </motion.div>
  );
}

// ─── Main Component ───
export default function Metrics({
  data,
  labels,
}: {
  data: ResumeData;
  labels: UiLabels["metrics"];
}) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-12">
        <div className="mb-3 flex items-center gap-3">
          <div className="h-px flex-1 bg-linear-to-r from-operational-500/50 to-transparent" />
          <span className="font-mono text-xs font-medium uppercase tracking-widest text-operational-400">
            {labels.eyebrow}
          </span>
          <div className="h-px flex-1 bg-linear-to-l from-operational-500/50 to-transparent" />
        </div>
        <h2 className="text-center text-3xl font-bold text-white">
          {labels.title}
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center font-mono text-sm text-slate-500">
          {labels.description}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.metrics.map((metric, index) => (
          <MetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            trend={metric.trend}
            index={index}
            labels={labels}
          />
        ))}
      </div>
    </div>
  );
}
