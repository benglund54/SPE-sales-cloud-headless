import { useContext, useState, useEffect } from 'react';
import { DetailPanelContext, type OpportunityRecord } from '../../context/DetailPanelContext';
import { StageProgress } from './StageProgress';
import { FieldRow } from './FieldRow';
import { DealDetailPanel } from './DealDetailPanel';

function getBadgeVariant(value: string): 'purple' | 'orange' | 'green' | 'blue' | 'gray' {
  const v = value.toLowerCase();
  if (v.includes('commit') || v.includes('closed')) return 'blue';
  if (v.includes('best') || v.includes('good')) return 'green';
  if (v.includes('up') || v.includes('strong')) return 'orange';
  if (v.includes('pipeline') || v.includes('omitted')) return 'gray';
  return 'purple';
}

function OpportunityPanelBody({ data }: { data: OpportunityRecord }) {
  const [localData, setLocalData] = useState(data);

  useEffect(() => {
    setLocalData({ ...data });
  }, [data]);

  const update = <K extends keyof OpportunityRecord>(key: K, value: OpportunityRecord[K]) => {
    setLocalData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <StageProgress
        stages={localData.stages}
        currentStageIndex={localData.currentStageIndex}
        stageName={localData.stage}
      />
      <div className="detail-panel-fields">
        <FieldRow type="text" label="Opportunity Owner" value={localData.ownerName} onChange={(v) => update('ownerName', v)} />
        <FieldRow type="text" label="Name" value={localData.name} onChange={(v) => update('name', v)} />
        <FieldRow type="text" label="Account Name" value={localData.accountName} onChange={(v) => update('accountName', v)} />
        <FieldRow type="text" label="Amount" value={`USD ${localData.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} onChange={(v) => { const num = parseFloat(v.replace(/[^0-9.]/g, '')); if (!isNaN(num)) update('amount', num); }} />
        <FieldRow type="text" label="Close Date" value={localData.closeDate} onChange={(v) => update('closeDate', v)} />
        <FieldRow type="badge" label="Opportunity Type" value={localData.type} variant={getBadgeVariant(localData.type)} />
        <FieldRow type="badge" label="Manager Forecast Judgement" value={localData.managerForecast} variant={getBadgeVariant(localData.managerForecast)} />
        <FieldRow type="textarea" label="SE Comments" value={localData.seComments} onChange={(v) => update('seComments', v)} />
        <FieldRow type="text" label="SE Next Steps" value={localData.seNextSteps} onChange={(v) => update('seNextSteps', v)} />
        <FieldRow type="badge" label="Product Fit" value={localData.productFit} variant={getBadgeVariant(localData.productFit)} />
        <FieldRow type="badge" label="SE Engagement" value={localData.seEngagement} variant={getBadgeVariant(localData.seEngagement)} />
        <FieldRow type="dropdown" label="Segment" value={localData.segment} options={['Enterprise', 'Mid-Market', 'SMB', 'Strategic']} onChange={(v) => update('segment', v)} />
        <FieldRow type="checkbox" label="SE Attached" value={localData.seAttached} onChange={(v) => update('seAttached', v)} />
        <FieldRow type="checkbox" label="SE Involved" value={localData.seInvolved} onChange={(v) => update('seInvolved', v)} />
        <FieldRow type="number" label="# of Product Feedbacks" value={localData.productFeedbacks} onChange={(v) => update('productFeedbacks', v)} />
        <FieldRow type="checkbox" label="Functional Selection?" value={localData.functionalSelection} onChange={(v) => update('functionalSelection', v)} />
        <FieldRow type="checkbox" label="Technical Selection?" value={localData.technicalSelection} onChange={(v) => update('technicalSelection', v)} />
        <FieldRow type="dropdown" label="Solutions Judgement" value={localData.solutionsJudgement} options={['Strong', 'Good', 'Neutral', 'Weak', 'N/A']} onChange={(v) => update('solutionsJudgement', v)} />
      </div>
    </>
  );
}

export function DetailPanel() {
  const { isOpen, record, closePanel } = useContext(DetailPanelContext);

  if (!record) return null;

  return (
    <>
      {isOpen && <div className="detail-panel-overlay" onClick={closePanel} />}
      <div className={`detail-panel ${isOpen ? 'detail-panel-open' : ''} ${record.type === 'deal' ? 'detail-panel-dark' : ''}`}>
        <button className={`detail-panel-close ${record.type === 'deal' ? 'detail-panel-close-dark' : ''}`} onClick={closePanel}>✕</button>
        <div className="detail-panel-content">
          {record.type === 'opportunity' ? (
            <OpportunityPanelBody data={record.data} />
          ) : (
            <DealDetailPanel data={record.data} onClose={closePanel} />
          )}
        </div>
      </div>
    </>
  );
}
