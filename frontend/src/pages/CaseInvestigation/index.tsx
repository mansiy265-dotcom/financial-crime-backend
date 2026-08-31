import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  BrainCircuit, 
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Eye,
  ShieldAlert,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { NetworkGraph } from '../../components/shared/NetworkGraph';
import { api } from '../../services/api';
import { SuspiciousCase, NetworkData, Transaction, Account } from '../../types';
import { formatCurrency, formatDateTime } from '../../utils';

export function CaseInvestigation() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [suspectCase, setSuspectCase] = useState<SuspiciousCase | null>(null);
  const [networkData, setNetworkData] = useState<NetworkData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      setIsLoading(true);
      try {
        const caseData = await api.getCaseById(id);
        if (caseData) {
          setSuspectCase(caseData);
          const [netData, txns] = await Promise.all([
            api.getNetwork(caseData.accountId),
            api.getAccountTransactions(caseData.accountId)
          ]);
          setNetworkData(netData);
          setTransactions(txns);
          
          const primaryAcc = await api.getAccountById(caseData.accountId);
          setSelectedAccount(primaryAcc);
        }
      } catch (error) {
        console.error("Failed to load case data", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleAction = async (action: 'CLEARED' | 'MONITORING' | 'ESCALATED') => {
    if (!suspectCase) return;
    const confirmMsg = `Are you sure you want to ${action.toLowerCase()} Case #${suspectCase.id}?`;
    if (!window.confirm(confirmMsg)) return;

    setIsActionLoading(true);
    try {
      const updatedCase = await api.updateCaseStatus(suspectCase.id, action);
      if (updatedCase) {
        setSuspectCase({ ...updatedCase });
      }
    } catch (error) {
      console.error("Failed to update case", error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleNodeClick = async (nodeId: string) => {
    try {
      const acc = await api.getAccountById(nodeId);
      if (acc) setSelectedAccount(acc);
    } catch (error) {
      console.error("Failed to load account details", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!suspectCase) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-center">
        <AlertTriangle className="h-12 w-12 text-[#d97757] mb-4" />
        <h2 className="text-2xl font-bold text-[#3b2b20] mb-2">Case Not Found</h2>
        <p className="text-[#6b584b] mb-6">The requested case could not be located.</p>
        <Button onClick={() => navigate('/cases')}>Return to Cases</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center shrink-0 gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/cases')}
            className="p-2 rounded-full hover:bg-[#e8e4db] transition-colors text-[#8c7a6b] hover:text-[#3b2b20]"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-[#3b2b20]">CASE #{suspectCase.id}</h1>
              <Badge variant="status" status={suspectCase.status} className="text-sm px-3 py-1">
                {suspectCase.status}
              </Badge>
            </div>
            <p className="text-[#6b584b] mt-1">Detected: {formatDateTime(suspectCase.detectedAt)}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-[#e6e2d8] shadow-sm">
          <div className="text-right mr-2">
            <p className="text-xs text-[#8c7a6b] uppercase tracking-wider font-semibold">Risk Score</p>
            <p className="text-2xl font-bold text-[#3b2b20] leading-none">{suspectCase.riskScore}</p>
          </div>
          <Badge variant="risk" level={suspectCase.riskLevel} className="text-sm px-3 py-1">
            {suspectCase.riskLevel}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* Left Column: AI & Network */}
        <div className="lg:col-span-2 flex flex-col gap-6 h-full min-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          
          {/* AI Explanation */}
          <Card className="border-[#d4cec3] bg-[#f5f4ef] shrink-0">
            <CardHeader className="pb-3 flex flex-row items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-[#4a3525]" />
              <CardTitle className="text-[#3b2b20]">AI Detection Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#6b584b] leading-relaxed text-sm sm:text-base">
                {suspectCase.explanation}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {suspectCase.indicators.map((indicator, idx) => (
                  <Badge key={idx} variant="outline" className="border-[#d4cec3] text-[#4a3525] bg-white">
                    {indicator}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Network Graph */}
          <Card className="flex-1 flex flex-col min-h-[400px]">
            <CardHeader className="pb-3 shrink-0 flex flex-row items-center justify-between border-b border-[#e6e2d8]">
              <CardTitle>Financial Network</CardTitle>
              <span className="text-xs text-[#8c7a6b]">Interactive: Zoom, Pan, Click Nodes</span>
            </CardHeader>
            <CardContent className="flex-1 p-0 rounded-b-xl overflow-hidden">
              {networkData && (
                <NetworkGraph data={networkData} onNodeClick={handleNodeClick} />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Actions, Timeline, Account Details */}
        <div className="flex flex-col gap-6 h-full overflow-y-auto pr-2 custom-scrollbar">
          
          {/* Actions */}
          <Card className="shrink-0 bg-[#f5f4ef]">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-[#8c7a6b] mb-3 uppercase tracking-wider">Investigator Actions</p>
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant="ghost" 
                  className="flex-col h-auto py-3 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100 border border-emerald-200 bg-white"
                  onClick={() => handleAction('CLEARED')}
                  isLoading={isActionLoading && suspectCase.status !== 'CLEARED'}
                  disabled={suspectCase.status === 'CLEARED'}
                >
                  <ShieldCheck className="h-5 w-5 mb-1" />
                  <span className="text-xs">CLEAR</span>
                </Button>
                <Button 
                  variant="ghost"
                  className="flex-col h-auto py-3 text-amber-700 hover:text-amber-800 hover:bg-amber-100 border border-amber-200 bg-white"
                  onClick={() => handleAction('MONITORING')}
                  isLoading={isActionLoading && suspectCase.status !== 'MONITORING'}
                  disabled={suspectCase.status === 'MONITORING'}
                >
                  <Eye className="h-5 w-5 mb-1" />
                  <span className="text-xs">MONITOR</span>
                </Button>
                <Button 
                  variant="ghost"
                  className="flex-col h-auto py-3 text-rose-700 hover:text-rose-800 hover:bg-rose-100 border border-rose-200 bg-white"
                  onClick={() => handleAction('ESCALATED')}
                  isLoading={isActionLoading && suspectCase.status !== 'ESCALATED'}
                  disabled={suspectCase.status === 'ESCALATED'}
                >
                  <ShieldAlert className="h-5 w-5 mb-1" />
                  <span className="text-xs">ESCALATE</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Account Details (Selected Node) */}
          <Card className="shrink-0">
            <CardHeader className="pb-3">
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedAccount ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-[#3b2b20] text-lg">{selectedAccount.name}</p>
                      <p className="text-sm text-[#8c7a6b]">{selectedAccount.id}</p>
                    </div>
                    <Badge variant="risk" level={selectedAccount.riskLevel}>{selectedAccount.riskLevel}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm pt-2 border-t border-[#e6e2d8]">
                    <div>
                      <p className="text-[#8c7a6b] text-xs">Total Incoming</p>
                      <p className="text-emerald-700 font-medium">{formatCurrency(selectedAccount.totalIncoming)}</p>
                    </div>
                    <div>
                      <p className="text-[#8c7a6b] text-xs">Total Outgoing</p>
                      <p className="text-rose-700 font-medium">{formatCurrency(selectedAccount.totalOutgoing)}</p>
                    </div>
                    <div>
                      <p className="text-[#8c7a6b] text-xs">Type & Status</p>
                      <p className="text-[#3b2b20]">{selectedAccount.type} • <span className="text-emerald-600">{selectedAccount.status}</span></p>
                    </div>
                    <div>
                      <p className="text-[#8c7a6b] text-xs">Connections</p>
                      <p className="text-[#3b2b20]">{selectedAccount.connectedAccounts} Accounts</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[#8c7a6b] italic">Select a node in the graph to view details.</p>
              )}
            </CardContent>
          </Card>

          {/* Money Trail Timeline */}
          <Card className="flex-1 min-h-[300px]">
            <CardHeader className="pb-3 sticky top-0 bg-white z-10 rounded-t-xl border-b border-[#e6e2d8]">
              <CardTitle>Money Trail</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="relative border-l border-[#d4cec3] ml-3 space-y-6 pb-4">
                {transactions.map((tx, idx) => (
                  <div key={tx.id} className="relative pl-6">
                    <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-[#4a3525] ring-4 ring-white"></div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center text-xs text-[#8c7a6b] gap-2">
                        <Clock className="h-3 w-3" />
                        {formatDateTime(tx.timestamp)}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-medium text-[#3b2b20] text-sm">{tx.senderId}</span>
                        <ArrowRight className="h-3 w-3 text-[#8c7a6b]" />
                        <span className="font-medium text-[#3b2b20] text-sm">{tx.receiverId}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-rose-700">{formatCurrency(tx.amount)}</span>
                        {tx.riskIndicator && (
                          <Badge variant="outline" className="text-[10px] py-0">{tx.riskIndicator}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
