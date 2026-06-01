import { useContext } from 'react';
import { DetailPanelContext, type DealRecord } from '../../context/DetailPanelContext';

interface DealCardProps {
  company: string;
  parent: string;
  amount: string;
  status: string;
  content: string;
  territories: number;
  rights: string;
  risk?: string;
  licensing?: string;
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: '#22c55e',
  RENEWAL: '#3b82f6',
  PROSPECT: '#eab308',
  'AT RISK': '#ef4444',
};

const DEAL_DETAILS: Record<string, DealRecord> = {};

DEAL_DETAILS['QuantumStream Media'] = {
  company: 'QuantumStream Media',
  parent: 'Horizon Media Group',
  amount: '$42M',
  status: 'Active',
  rights: 'Theatrical + SVOD',
  window: '2026-09-01',
  territories: 18,
  contact: 'Sarah Langford',
  notes: [
    { date: '2026-05-12', text: 'Sarah confirmed board approval for $42M. Awaiting final territory schedule sign-off.', color: '#22c55e' },
    { date: '2026-05-08', text: 'Negotiated 3-year SVOD window (was requesting 5). Theatrical holdback reduced to 90 days.', color: '#3b82f6' },
    { date: '2026-04-28', text: 'Initial LOI received. Horizon pushing for exclusive SVOD in all 18 territories.', color: '#eab308' },
    { date: '2026-04-15', text: 'Introductory call with Sarah Langford. Strong interest in Starfall S3 after S2 overperformed 140% in their markets.', color: '#9ca3af' },
  ],
  windows: [
    { name: 'Theatrical', status: 'Sold', scope: 'Global' },
    { name: 'Premium SVOD (0-90 days)', status: 'Holdback', scope: 'All' },
    { name: 'SVOD (91+ days)', status: 'In Negotiation', scope: '18 territories' },
    { name: 'AVOD', status: 'Available', scope: 'LATAM, SEA, India' },
    { name: 'Linear TV', status: 'Available', scope: 'All except NA' },
  ],
};

DEAL_DETAILS['Pinnacle Studios'] = {
  company: 'Pinnacle Studios',
  parent: 'Constellation Media',
  amount: '$35M',
  status: 'At Risk',
  rights: 'SVOD + Linear',
  window: '2026-08-01',
  territories: 22,
  contact: 'James Whitaker',
  notes: [
    { date: '2026-05-14', text: 'URGENT: James informed us Paramount+ submitted competing bid at $38M for same territory package. Need response by May 20.', color: '#ef4444' },
    { date: '2026-05-09', text: 'James pushing for MFN clause (most favored nation) on pricing if we sell to additional platforms in overlapping territories.', color: '#eab308' },
    { date: '2026-05-01', text: 'Deal stalled — Pinnacle board reviewing Q1 content spend. Internal budget pressure from their Warner acquisition integration.', color: '#9ca3af' },
    { date: '2026-04-22', text: 'Strong verbal commitment at $35M for Neon Requiem S1-S3 bundle. 22 territories, 3-year SVOD+Linear.', color: '#22c55e' },
  ],
  windows: [
    { name: 'SVOD (Global)', status: 'At Risk', scope: '22 territories — Pinnacle or Paramount+' },
    { name: 'Linear TV (NA)', status: 'Available', scope: 'North America' },
    { name: 'Linear TV (Europe)', status: 'Available', scope: 'UK, Germany, France, Nordics' },
    { name: 'AVOD (Global)', status: 'Available', scope: 'All territories' },
    { name: 'Theatrical', status: 'N/A', scope: 'Streaming-first title' },
  ],
};

export function DealCard({ company, parent, amount, status, content, territories, rights, risk, licensing }: DealCardProps) {
  const { openDealPanel } = useContext(DetailPanelContext);
  const badgeColor = STATUS_COLORS[status.toUpperCase()] || '#9ca3af';
  const dealDetail = DEAL_DETAILS[company];
  const isClickable = !!dealDetail;

  const handleClick = () => {
    if (dealDetail) openDealPanel(dealDetail);
  };

  return (
    <div
      className={`deal-card ${isClickable ? 'deal-card-clickable' : ''}`}
      onClick={handleClick}
    >
      <div className="deal-card-company">{company}</div>
      <div className="deal-card-parent">{parent}</div>
      <div className="deal-card-row">
        <span className="deal-card-amount">{amount}</span>
        <span className="deal-card-badge" style={{ backgroundColor: badgeColor }}>
          {status.toUpperCase()}
        </span>
      </div>
      <div className="deal-card-content">{content}</div>
      <div className="deal-card-meta">{territories} territories · {rights}</div>
      {(risk || licensing) && (
        <div className="deal-card-context-row">
          {risk && <span className="deal-card-context-pill">Risk: {risk}</span>}
          {licensing && <span className="deal-card-context-pill">Licensing: {licensing}</span>}
        </div>
      )}
    </div>
  );
}
