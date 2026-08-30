import { Account, SuspiciousCase, Transaction, DashboardStats, NetworkData } from '../types';
import { mockAccounts, mockCases, mockDashboardStats, mockTransactions } from '../data/mockData';

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  async getDashboardStats(): Promise<DashboardStats> {
    await delay(500);
    return mockDashboardStats;
  },

  async getSuspiciousCases(): Promise<SuspiciousCase[]> {
    await delay(600);
    return mockCases;
  },

  async getCaseById(id: string): Promise<SuspiciousCase | null> {
    await delay(400);
    return mockCases.find((c) => c.id === id) || null;
  },

  async getAccountById(id: string): Promise<Account | null> {
    await delay(400);
    return mockAccounts.find((a) => a.id === id) || null;
  },

  async getAccountTransactions(accountId: string): Promise<Transaction[]> {
    await delay(500);
    return mockTransactions.filter(
      (t) => t.senderId === accountId || t.receiverId === accountId
    );
  },

  async updateCaseStatus(id: string, status: SuspiciousCase['status']): Promise<SuspiciousCase | null> {
    await delay(800);
    const caseIndex = mockCases.findIndex((c) => c.id === id);
    if (caseIndex > -1) {
      mockCases[caseIndex].status = status;
      return mockCases[caseIndex];
    }
    return null;
  },

  async getNetwork(accountId: string): Promise<NetworkData> {
    await delay(700);
    
    // In a real app, this would recursively fetch 1-hop, 2-hop, 3-hop based on params.
    // Here we generate a realistic static network for demonstration based on the mock data.
    
    // Default network nodes (we can dynamically construct this based on mockTransactions, but static is fine for demo)
    const nodes = [
      { id: 'ACC-1042', label: 'TechCorp Solutions', riskLevel: 'CRITICAL' as const },
      { id: 'ACC-9901', label: 'ACC-9901', riskLevel: 'MEDIUM' as const },
      { id: 'ACC-9902', label: 'ACC-9902', riskLevel: 'MEDIUM' as const },
      { id: 'ACC-9903', label: 'ACC-9903', riskLevel: 'MEDIUM' as const },
      { id: 'ACC-3310', label: 'Shell Company Alpha', riskLevel: 'CRITICAL' as const },
    ];
    
    const edges = [
      { id: 'e1', source: 'ACC-9901', target: 'ACC-1042', amount: 500000, timestamp: '2026-08-30T09:00:00Z' },
      { id: 'e2', source: 'ACC-9902', target: 'ACC-1042', amount: 450000, timestamp: '2026-08-30T09:05:00Z' },
      { id: 'e3', source: 'ACC-9903', target: 'ACC-1042', amount: 550000, timestamp: '2026-08-30T09:10:00Z' },
      { id: 'e4', source: 'ACC-1042', target: 'ACC-3310', amount: 1450000, timestamp: '2026-08-30T09:15:00Z' },
      { id: 'e5', source: 'ACC-3310', target: 'ACC-9901', amount: 1400000, timestamp: '2026-08-30T09:20:00Z' }, // Circular back
    ];

    if (accountId === 'ACC-0015') {
       return {
         nodes: [
            { id: 'ACC-0015', label: 'Global Imports LLC', riskLevel: 'HIGH' as const },
            { id: 'ACC-8801', label: 'ACC-8801', riskLevel: 'LOW' as const },
            { id: 'ACC-8802', label: 'ACC-8802', riskLevel: 'LOW' as const },
            { id: 'ACC-8803', label: 'ACC-8803', riskLevel: 'LOW' as const },
         ],
         edges: [
            { id: 'e6', source: 'ACC-8801', target: 'ACC-0015', amount: 49000, timestamp: '2026-08-29T14:00:00Z' },
            { id: 'e7', source: 'ACC-8802', target: 'ACC-0015', amount: 49500, timestamp: '2026-08-29T14:15:00Z' },
            { id: 'e8', source: 'ACC-8803', target: 'ACC-0015', amount: 48000, timestamp: '2026-08-29T14:30:00Z' },
         ]
       }
    }

    return { nodes, edges };
  }
};
