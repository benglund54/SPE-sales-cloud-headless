interface KpiItem {
  label: string;
  value: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
}

interface KpiCardsProps {
  items: KpiItem[];
}

export function KpiCards({ items }: KpiCardsProps) {
  return (
    <div className="chart-kpi-grid">
      {items.map((item, i) => (
        <div key={i} className="chart-kpi-card">
          <div className="chart-kpi-value">{item.value}</div>
          <div className="chart-kpi-label">{item.label}</div>
          {item.trend && (
            <div className={`chart-kpi-trend trend-${item.trendDirection || 'neutral'}`}>
              {item.trendDirection === 'up' ? '▲' : item.trendDirection === 'down' ? '▼' : '—'} {item.trend}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
