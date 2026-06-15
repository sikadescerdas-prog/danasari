// components/ui/StrengthPass.tsx

interface StrengthPassProps {
  score: number;
  label: string;
}

function getColor(score: number): string {
  const colorMap: Record<number, string> = {
    0: "bg-gray-200",
    1: "bg-red-600",
    2: "bg-red-400",
    3: "bg-yellow-500",
    4: "bg-green-500",
    5: "bg-cyan-500",
  };
  return colorMap[score] || "bg-gray-200";
}

function getTextColor(score: number): string {
  const labelColorMap: Record<number, string> = {
    0: "text-gray-400",
    1: "text-red-600",
    2: "text-red-500",
    3: "text-yellow-600",
    4: "text-green-600",
    5: "text-cyan-600",
  };
  return labelColorMap[score] || "text-gray-400";
}

function getWidth(score: number): string {
  return `${(score / 5) * 100}%`;
}

export default function StrengthPass({ score, label }: StrengthPassProps) {
  if (score === 0 || label === "Password minimal 8 karakter") return null;

  return (
    <div className="mt-2 space-y-1">
      {/* LABEL */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">Password strength</span>
        <span className={`text-xs font-semibold ${getTextColor(score)}`}>
          {label}
        </span>
      </div>

      {/* BAR */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-300 ${getColor(
            score
          )}`}
          style={{ width: getWidth(score) }}
        />
      </div>
    </div>
  );
}