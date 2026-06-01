import { QuotaGauge } from './QuotaGauge';
import { KpiCards } from './KpiCards';
import { PipelineFunnel } from './PipelineFunnel';
import { HBarChart } from './HBarChart';
import { ForecastBar } from './ForecastBar';
import { AlertList } from './AlertList';
import { MiniTable } from './MiniTable';
import { OpportunityCard } from './OpportunityCard';
import { DealCard } from './DealCard';

interface ChartBlockProps {
  chartType: string;
  dataJson: string;
}

export function ChartBlock({ chartType, dataJson }: ChartBlockProps) {
  try {
    const data = JSON.parse(dataJson);
    switch (chartType) {
      case 'gauge':
        return <QuotaGauge {...data} />;
      case 'kpi':
        return <KpiCards {...data} />;
      case 'funnel':
        return <PipelineFunnel {...data} />;
      case 'hbar':
        return <HBarChart {...data} />;
      case 'forecast':
        return <ForecastBar {...data} />;
      case 'alerts':
        return <AlertList {...data} />;
      case 'table':
        return <MiniTable {...data} />;
      case 'record-card':
        return <OpportunityCard {...data} />;
      case 'deal-card':
        return <DealCard {...data} />;
      default:
        return <pre>{dataJson}</pre>;
    }
  } catch {
    return <pre>{dataJson}</pre>;
  }
}
