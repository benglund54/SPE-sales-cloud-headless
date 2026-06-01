interface BarItem {
  label: string;
  value: number;
  displayValue: string;
  color?: string;
}

interface HBarChartProps {
  items: BarItem[];
  title?: string;
}

export function HBarChart({ items, title }: HBarChartProps) {
  const maxVal = Math.max(...items.map(b => b.value));

  return (
    <div className="chart-hbar">
      {title && <div className="chart-hbar-title">{title}</div>}
      {items.map((item, i) => {
        const widthPct = Math.max((item.value / maxVal) * 100, 5);
        return (
          <div key={i} className="chart-hbar-row">
            <div className="chart-hbar-label">{item.label}</div>
            <div className="chart-hbar-track">
              <div
                className="chart-hbar-fill"
                style={{
                  width: `${widthPct}%`,
                  backgroundColor: item.color || 'var(--accent)',
                }}
              />
            </div>
            <div className="chart-hbar-value">{item.displayValue}</div>
          </div>
        );
      })}
    </div>
  );
}
