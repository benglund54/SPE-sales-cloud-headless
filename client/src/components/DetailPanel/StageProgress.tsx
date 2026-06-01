interface StageProgressProps {
  stages: string[];
  currentStageIndex: number;
  stageName: string;
}

export function StageProgress({ stages, currentStageIndex, stageName }: StageProgressProps) {
  return (
    <div className="stage-progress">
      <div className="stage-progress-label">{stageName}</div>
      <div className="stage-progress-dots">
        {stages.map((_, i) => {
          let className = 'stage-dot';
          if (i < currentStageIndex) className += ' stage-dot-completed';
          else if (i === currentStageIndex) className += ' stage-dot-current';
          else className += ' stage-dot-upcoming';

          return (
            <div key={i} className={className}>
              {i < currentStageIndex && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
