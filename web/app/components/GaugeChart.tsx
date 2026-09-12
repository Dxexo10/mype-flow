"use client";

interface GaugeChartProps {
  value: number;
  color: string;
  label?: string;
}

const CX = 100;
const CY = 100;
const RADIUS = 80;

export default function GaugeChart({ value, color, label }: GaugeChartProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const angleDeg = (180 + (clamped / 100) * 180) * (Math.PI / 180);
  const x = CX + RADIUS * Math.cos(angleDeg);
  const y = CY + RADIUS * Math.sin(angleDeg);

  const progressPath = `M 20 100 A ${RADIUS} ${RADIUS} 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)}`;

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 120" className="w-full max-w-[220px]">
        <path
          d={`M 20 100 A ${RADIUS} ${RADIUS} 0 0 1 180 100`}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={14}
          strokeLinecap="round"
        />
        {clamped > 0 && (
          <path
            d={progressPath}
            fill="none"
            stroke={color}
            strokeWidth={14}
            strokeLinecap="round"
          />
        )}
      </svg>
      <div className="text-center">
        <p className="text-2xl font-bold text-gray-900">{Math.round(clamped)}%</p>
        {label && <p className="text-xs text-gray-500 mt-1">{label}</p>}
      </div>
    </div>
  );
}