export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type CaseStatus = 'OPEN' | 'INVESTIGATING' | 'ESCALATED' | 'CLEARED' | 'MONITORING';

export interface Account {
  id: string;
  name: string;
  type: string;
  status: 'ACTIVE' | 'FROZEN' | 'CLOSED';
  riskScore: number;
  riskLevel: RiskLevel;
  totalIncoming: number;
  totalOutgoing: number;
  connectedAccounts: number;
  transactionFrequency: number;
  avgTransactionAmount: number;
  lastActivity: string;
}

export interface Transaction {
  id: string;
  senderId: string;
  receiverId: string;
  amount: number;
  timestamp: string;
  direction: 'INCOMING' | 'OUTGOING' | 'INTERNAL';
  riskIndicator?: string;
}

export interface SuspiciousCase {
  id: string;
  accountId: string;
  accountName: string;
  riskScore: number;
  riskLevel: RiskLevel;
  suspiciousAmount: number;
  pattern: string;
  connectedAccountsCount: number;
  detectedAt: string;
  status: CaseStatus;
  explanation: string;
  indicators: string[];
}

export interface NetworkNode {
  id: string;
  label: string;
  riskLevel: RiskLevel;
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  amount: number;
  timestamp: string;
}

export interface NetworkData {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
}

export interface DashboardStats {
  totalTransactions: number;
  totalTransactionsTrend: number;
  suspiciousTransactions: number;
  suspiciousTransactionsTrend: number;
  highRiskAccounts: number;
  highRiskAccountsTrend: number;
  activeInvestigations: number;
  activeInvestigationsTrend: number;
  escalatedCases: number;
  escalatedCasesTrend: number;
}
