import { useContext } from 'react';
import { DetailPanelContext, type OpportunityRecord } from '../../context/DetailPanelContext';

function formatCurrency(amount: number): string {
  return `USD ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatTime(): string {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function getBadgeClass(value: string): string {
  const v = value.toLowerCase();
  if (v.includes('commit') || v.includes('closed')) return 'badge-blue';
  if (v.includes('best') || v.includes('good')) return 'badge-green';
  if (v.includes('up') || v.includes('strong')) return 'badge-orange';
  if (v.includes('pipeline') || v.includes('omitted')) return 'badge-gray';
  return 'badge-purple';
}

export function OpportunityCard(props: OpportunityRecord) {
  const { openPanel } = useContext(DetailPanelContext);

  return (
    <div className="record-card" onClick={() => openPanel(props)}>
      <div className="record-card-header">
        <div className="record-card-icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1L10 5H14L11 8L12 12L8 10L4 12L5 8L2 5H6L8 1Z" fill="currentColor"/>
          </svg>
        </div>
        <div className="record-card-title">
          <div className="record-card-name">{props.name}</div>
          <div className="record-card-subtitle">Open opportunity</div>
        </div>
        <div className="record-card-actions">
          <span className="record-card-action-icon">↗</span>
          <span className="record-card-action-icon">#</span>
          <span className="record-card-action-icon">⋮</span>
        </div>
      </div>

      <div className="record-card-body">
        <div className="record-card-grid">
          <div className="record-card-field">
            <div className="record-card-field-label">Opportunity Owner</div>
            <div className="record-card-field-value">
              <span className="record-card-pill pill-user">
                <span className="pill-avatar">👤</span>
                {props.ownerName}
              </span>
            </div>
          </div>
          <div className="record-card-field">
            <div className="record-card-field-label">Account Name</div>
            <div className="record-card-field-value">
              <span className="record-card-pill pill-account">
                <span className="pill-icon">🏢</span>
                {props.accountName}
              </span>
            </div>
          </div>
          <div className="record-card-field">
            <div className="record-card-field-label">Close Date</div>
            <div className="record-card-field-value">{props.closeDate}</div>
          </div>
          <div className="record-card-field">
            <div className="record-card-field-label">Amount</div>
            <div className="record-card-field-value">{formatCurrency(props.amount)}</div>
          </div>
          <div className="record-card-field">
            <div className="record-card-field-label">Forecast Category</div>
            <div className="record-card-field-value">
              <span className={`record-card-badge ${getBadgeClass(props.forecastCategory)}`}>
                {props.forecastCategory}
              </span>
            </div>
          </div>
          <div className="record-card-field">
            <div className="record-card-field-label">Manager Forecast Judgement</div>
            <div className="record-card-field-value">
              <span className={`record-card-badge ${getBadgeClass(props.managerForecast)}`}>
                {props.managerForecast}
              </span>
            </div>
          </div>
        </div>

        <div className="record-card-field record-card-field-full">
          <div className="record-card-field-label">Name</div>
          <div className="record-card-field-value">{props.name}</div>
        </div>

        <div className="record-card-field record-card-field-full">
          <div className="record-card-field-label">Opportunity Record Type</div>
          <div className="record-card-field-value">{props.recordType}</div>
        </div>
      </div>

      <div className="record-card-footer">
        As of today at {formatTime()}
      </div>
    </div>
  );
}
