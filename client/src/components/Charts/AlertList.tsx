interface AlertItem {
  severity: 'critical' | 'warning' | 'info';
  title: string;
  detail: string;
  metric?: string;
}

interface AlertListProps {
  items: AlertItem[];
}

const SEVERITY_ICONS = { critical: '🔴', warning: '⚠️', info: 'ℹ️' };

export function AlertList({ items }: AlertListProps) {
  return (
    <div className="chart-alerts">
      {items.map((item, i) => (
        <div key={i} className={`chart-alert chart-alert-${item.severity}`}>
          <span className="chart-alert-icon">{SEVERITY_ICONS[item.severity]}</span>
          <div className="chart-alert-body">
            <div className="chart-alert-title">{item.title}</div>
            <div className="chart-alert-detail">{item.detail}</div>
          </div>
          {item.metric && <div className="chart-alert-metric">{item.metric}</div>}
        </div>
      ))}
    </div>
  );
}
