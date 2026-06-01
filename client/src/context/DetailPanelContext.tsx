import { createContext, useState, useCallback, type ReactNode } from 'react';

export interface OpportunityRecord {
  name: string;
  accountName: string;
  ownerName: string;
  amount: number;
  closeDate: string;
  stage: string;
  forecastCategory: string;
  managerForecast: string;
  recordType: string;
  type: string;
  probability: number;
  leadSource: string;
  nextStep: string;
  lastActivity: string;
  seComments: string;
  seNextSteps: string;
  productFit: string;
  seEngagement: string;
  segment: string;
  seAttached: boolean;
  seInvolved: boolean;
  productFeedbacks: number;
  functionalSelection: boolean;
  technicalSelection: boolean;
  solutionsJudgement: string;
  stages: string[];
  currentStageIndex: number;
}

export interface DealNote {
  date: string;
  text: string;
  color: string;
}

export interface DealWindow {
  name: string;
  status: string;
  scope: string;
}

export interface DealRecord {
  company: string;
  parent: string;
  amount: string;
  status: string;
  rights: string;
  window: string;
  territories: number;
  contact: string;
  notes: DealNote[];
  windows: DealWindow[];
}

export type PanelRecord =
  | { type: 'opportunity'; data: OpportunityRecord }
  | { type: 'deal'; data: DealRecord };

export interface DetailPanelContextValue {
  isOpen: boolean;
  record: PanelRecord | null;
  openPanel: (data: OpportunityRecord) => void;
  openDealPanel: (data: DealRecord) => void;
  closePanel: () => void;
}

export const DetailPanelContext = createContext<DetailPanelContextValue>({
  isOpen: false,
  record: null,
  openPanel: () => {},
  openDealPanel: () => {},
  closePanel: () => {},
});

export function DetailPanelProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [record, setRecord] = useState<PanelRecord | null>(null);

  const openPanel = useCallback((data: OpportunityRecord) => {
    setRecord({ type: 'opportunity', data });
    setIsOpen(true);
  }, []);

  const openDealPanel = useCallback((data: DealRecord) => {
    setRecord({ type: 'deal', data });
    setIsOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <DetailPanelContext.Provider value={{ isOpen, record, openPanel, openDealPanel, closePanel }}>
      {children}
    </DetailPanelContext.Provider>
  );
}
