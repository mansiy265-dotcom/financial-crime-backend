import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';
import { SuspiciousCase } from '../../types';
import { formatCurrency, formatDateTime } from '../../utils';

export function Cases() {
  const navigate = useNavigate();
  const [cases, setCases] = useState<SuspiciousCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await api.getSuspiciousCases();
        setCases(data);
      } catch (error) {
        console.error("Failed to load cases", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredCases = cases.filter(c => 
    c.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.accountId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-2rem)]">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#3b2b20]">Suspicious Cases</h1>
          <p className="text-[#6b584b] mt-1">Manage and investigate flagged activities.</p>
        </div>
      </div>

      <Card className="shrink-0">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8c7a6b]" />
            <input
              type="text"
              placeholder="Search cases by ID or account..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#e6e2d8] rounded-lg text-sm text-[#3b2b20] placeholder:text-[#8c7a6b] focus:outline-none focus:ring-2 focus:ring-[#4a3525]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="secondary" className="flex-1 sm:flex-none">
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="flex-1 flex flex-col overflow-hidden">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <RefreshCw className="h-8 w-8 animate-spin text-[#4a3525]" />
          </div>
        ) : (
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-sm text-[#3b2b20] relative">
              <thead className="bg-[#f5f4ef]/80 backdrop-blur-sm text-xs uppercase text-[#6b584b] sticky top-0 z-10">
                <tr>
                  <th scope="col" className="px-6 py-4 font-medium">Case ID</th>
                  <th scope="col" className="px-6 py-4 font-medium">Primary Account</th>
                  <th scope="col" className="px-6 py-4 font-medium">Risk Score</th>
                  <th scope="col" className="px-6 py-4 font-medium">Suspicious Pattern</th>
                  <th scope="col" className="px-6 py-4 font-medium">Amount</th>
                  <th scope="col" className="px-6 py-4 font-medium">Detected At</th>
                  <th scope="col" className="px-6 py-4 font-medium">Status</th>
                  <th scope="col" className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6e2d8]">
                {filteredCases.map((c) => (
                  <tr key={c.id} className="hover:bg-[#fdfbf7] transition-colors">
                    <td className="px-6 py-4 font-medium text-[#3b2b20]">{c.id}</td>
                    <td className="px-6 py-4">
                      <div className="text-[#3b2b20] font-medium">{c.accountName}</div>
                      <div className="text-xs text-[#8c7a6b] mt-1">{c.accountId} • {c.connectedAccountsCount} connected accounts</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="mr-2 text-[#3b2b20] font-medium">{c.riskScore}</span>
                        <Badge variant="risk" level={c.riskLevel}>{c.riskLevel}</Badge>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#6b584b] max-w-[200px] truncate" title={c.pattern}>
                      {c.pattern}
                    </td>
                    <td className="px-6 py-4 font-medium text-rose-700">{formatCurrency(c.suspiciousAmount)}</td>
                    <td className="px-6 py-4 text-[#8c7a6b]">{formatDateTime(c.detectedAt)}</td>
                    <td className="px-6 py-4">
                      <Badge variant="status" status={c.status}>{c.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button onClick={() => navigate(`/cases/${c.id}`)}>
                        Investigate
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredCases.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-[#8c7a6b]">
                      No cases found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
