import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';
import { Account, Transaction } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency, formatDateTime } from '../../utils';
import { useNavigate } from 'react-router-dom';

export function Accounts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm) return;
    
    setIsLoading(true);
    setSearched(true);
    try {
      // Very basic mock search: just try to get the ID directly
      const acc = await api.getAccountById(searchTerm.toUpperCase());
      if (acc) {
        setAccount(acc);
        const txns = await api.getAccountTransactions(acc.id);
        setTransactions(txns);
      } else {
        setAccount(null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#3b2b20]">Account Investigation</h1>
        <p className="text-[#6b584b] mt-1">Search and analyze specific accounts.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="flex gap-4 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8c7a6b]" />
              <input
                type="text"
                placeholder="Enter Account ID (e.g. ACC-1042)..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-[#e6e2d8] rounded-lg text-[#3b2b20] placeholder:text-[#8c7a6b] focus:outline-none focus:ring-2 focus:ring-[#4a3525] shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button type="submit" isLoading={isLoading} size="lg">Search</Button>
          </form>
        </CardContent>
      </Card>

      {searched && !isLoading && !account && (
        <Card>
          <CardContent className="p-12 text-center text-[#8c7a6b]">
            No account found with ID "{searchTerm}". Try "ACC-1042" or "ACC-0015".
          </CardContent>
        </Card>
      )}

      {account && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Account Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#3b2b20]">{account.name}</h2>
                  <p className="text-[#6b584b]">{account.id}</p>
                </div>
                
                <div className="flex justify-between items-center py-4 border-y border-[#e6e2d8]">
                  <span className="text-[#8c7a6b]">Risk Score</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#3b2b20]">{account.riskScore}</span>
                    <Badge variant="risk" level={account.riskLevel}>{account.riskLevel}</Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[#8c7a6b]">Status</span>
                    <span className="text-emerald-700 font-medium">{account.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8c7a6b]">Total Incoming</span>
                    <span className="text-[#3b2b20] font-medium">{formatCurrency(account.totalIncoming)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8c7a6b]">Total Outgoing</span>
                    <span className="text-[#3b2b20] font-medium">{formatCurrency(account.totalOutgoing)}</span>
                  </div>
                </div>

                <Button className="w-full" onClick={() => navigate(`/network?id=${account.id}`)}>
                  <Search className="w-4 h-4 mr-2" /> Trace Network
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-[#3b2b20]">
                  <thead className="bg-[#f5f4ef] text-xs uppercase text-[#6b584b]">
                    <tr>
                      <th className="px-4 py-3 font-medium rounded-tl-lg">Txn ID</th>
                      <th className="px-4 py-3 font-medium">Counterparty</th>
                      <th className="px-4 py-3 font-medium">Amount</th>
                      <th className="px-4 py-3 font-medium rounded-tr-lg">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e6e2d8]">
                    {transactions.map((tx) => {
                      const isIncoming = tx.receiverId === account.id;
                      return (
                        <tr key={tx.id} className="hover:bg-[#fdfbf7]">
                          <td className="px-4 py-4 font-medium">{tx.id}</td>
                          <td className="px-4 py-4">
                            <span className="text-[#8c7a6b]">{isIncoming ? 'From: ' : 'To: '}</span>
                            <span className="font-medium text-[#3b2b20]">{isIncoming ? tx.senderId : tx.receiverId}</span>
                          </td>
                          <td className={`px-4 py-4 font-bold ${isIncoming ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {isIncoming ? '+' : '-'}{formatCurrency(tx.amount)}
                          </td>
                          <td className="px-4 py-4 text-[#8c7a6b]">{formatDateTime(tx.timestamp)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
