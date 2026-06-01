interface FunnelStage {
  stage: string;
  deals: number;
  amount: string;
  amountNum: number;
  probability: string;
}

interface PipelineFunnelProps {
  stages: FunnelStage[];
}

export function PipelineFunnel({ stages }: PipelineFunnelProps) {
  const maxAmount = Math.max(...stages.map(s => s.amountNum));

  return (
    <div className="chart-funnel">
      {stages.map((stage, i) => {
        const widthPct = Math.max((stage.amountNum / maxAmount) * 100, 20);
        return (
          <div key={i} className="chart-funnel-row">
            <div className="chart-funnel-label">
              <span className="chart-funnel-stage">{stage.stage}</span>
              <span className="chart-funnel-prob">{stage.probability}</span>
            </div>
            <div className="chart-funnel-bar-container">
              <div
                className="chart-funnel-bar"
                style={{
                  width: `${widthPct}%`,
                  opacity: 1 - (i * 0.15),
                }}
              >
                <span className="chart-funnel-bar-text">
                  {stage.deals} deal{stage.deals !== 1 ? 's' : ''} · {stage.amount}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
