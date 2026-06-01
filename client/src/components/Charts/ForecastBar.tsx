interface ForecastSegment {
  label: string;
  value: number;
  displayValue: string;
  color: string;
}

interface ForecastBarProps {
  segments: ForecastSegment[];
  target: number;
  targetLabel: string;
}

export function ForecastBar({ segments, target, targetLabel }: ForecastBarProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const scale = Math.max(total, target);

  return (
    <div className="chart-forecast">
      <div className="chart-forecast-bar-container">
        <div className="chart-forecast-bar">
          {segments.map((seg, i) => (
            <div
              key={i}
              className="chart-forecast-segment"
              style={{
                width: `${(seg.value / scale) * 100}%`,
                backgroundColor: seg.color,
              }}
              title={`${seg.label}: ${seg.displayValue}`}
            />
          ))}
        </div>
        <div
          className="chart-forecast-target"
          style={{ left: `${(target / scale) * 100}%` }}
        >
          <div className="chart-forecast-target-line" />
          <div className="chart-forecast-target-label">{targetLabel}</div>
        </div>
      </div>
      <div className="chart-forecast-legend">
        {segments.map((seg, i) => (
          <div key={i} className="chart-forecast-legend-item">
            <span className="chart-forecast-legend-dot" style={{ backgroundColor: seg.color }} />
            <span>{seg.label}: {seg.displayValue}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
