import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface QuotaGaugeProps {
  value: number;
  label: string;
  subLabel?: string;
  color?: string;
}

export function QuotaGauge({ value, label, subLabel, color = 'var(--accent)' }: QuotaGaugeProps) {
  const clamped = Math.min(value, 100);
  const data = [
    { value: clamped },
    { value: 100 - clamped },
  ];

  return (
    <div className="chart-gauge">
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="85%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={color} />
            <Cell fill="var(--msg-bg, #e8e8e8)" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="chart-gauge-label">
        <span className="chart-gauge-value">{value}%</span>
        <span className="chart-gauge-text">{label}</span>
        {subLabel && <span className="chart-gauge-sub">{subLabel}</span>}
      </div>
    </div>
  );
}
