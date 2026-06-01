import type { DealRecord } from '../../context/DetailPanelContext';

const WINDOW_STATUS_COLORS: Record<string, string> = {
  SOLD: '#6b7280',
  HOLDBACK: '#14b8a6',
  'IN NEGOTIATION': '#eab308',
  AVAILABLE: '#22c55e',
  'AT RISK': '#ef4444',
  'N/A': '#6b7280',
};

const DEAL_STATUS_COLORS: Record<string, string> = {
  ACTIVE: '#22c55e',
  RENEWAL: '#3b82f6',
  PROSPECT: '#eab308',
  'AT RISK': '#ef4444',
};

interface Props {
  data: DealRecord;
  onClose: () => void;
}

export function DealDetailPanel({ data, onClose }: Props) {
  return (
    <div className="deal-detail">
      <div className="deal-detail-header">
        <div>
          <div className="deal-detail-title">{data.company}</div>
          <div className="deal-detail-subtitle">{data.parent}</div>
        </div>
        <button className="deal-detail-deselect" onClick={onClose}>Deselect Client</button>
      </div>

      <div className="deal-detail-grid">
        <div className="deal-detail-field">
          <div className="deal-detail-field-label">Deal Value</div>
          <div className="deal-detail-field-value deal-detail-amount">{data.amount}</div>
        </div>
        <div className="deal-detail-field">
          <div className="deal-detail-field-label">Status</div>
          <div className="deal-detail-field-value">
            <span
              className="deal-detail-window-badge"
              style={{ backgroundColor: DEAL_STATUS_COLORS[data.status.toUpperCase()] || '#6b7280' }}
            >
              {data.status.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="deal-detail-field">
          <div className="deal-detail-field-label">Rights Type</div>
          <div className="deal-detail-field-value">{data.rights}</div>
        </div>
        <div className="deal-detail-field">
          <div className="deal-detail-field-label">Window</div>
          <div className="deal-detail-field-value">{data.window}</div>
        </div>
        <div className="deal-detail-field">
          <div className="deal-detail-field-label">Territories</div>
          <div className="deal-detail-field-value">{data.territories}</div>
        </div>
        <div className="deal-detail-field">
          <div className="deal-detail-field-label">Contact</div>
          <div className="deal-detail-field-value">{data.contact}</div>
        </div>
      </div>

      <div className="deal-detail-section">
        <div className="deal-detail-section-title">Recent Notes</div>
        <div className="deal-detail-notes">
          {data.notes.map((note, i) => (
            <div key={i} className="deal-detail-note" style={{ borderLeftColor: note.color }}>
              <div className="deal-detail-note-date">{note.date}</div>
              <div className="deal-detail-note-text">{note.text}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="deal-detail-section">
        <div className="deal-detail-section-title">Available Windows</div>
        <div className="deal-detail-windows">
          {data.windows.map((w, i) => {
            const statusColor = WINDOW_STATUS_COLORS[w.status.toUpperCase()] || '#6b7280';
            return (
              <div key={i} className="deal-detail-window">
                <div className="deal-detail-window-name">{w.name}</div>
                <div className="deal-detail-window-row">
                  <span className="deal-detail-window-badge" style={{ backgroundColor: statusColor }}>
                    {w.status.toUpperCase()}
                  </span>
                  <span className="deal-detail-window-scope">{w.scope}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
