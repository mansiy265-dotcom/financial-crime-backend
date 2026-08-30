import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  AlertTriangle, 
  ShieldAlert, 
  TrendingUp, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';
import { DashboardStats, SuspiciousCase } from '../../types';
import { formatCurrency, formatDateTime } from '../../utils';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

// Mock chart data
const timelineData = [
  { name: 'Mon', transactions: 400, suspicious: 24 },
  { name: 'Tue', transactions: 300, suspicious: 13 },
  { name: 'Wed', transactions: 550, suspicious: 45 },
  { name: 'Thu', transactions: 480, suspicious: 39 },
  { name: 'Fri', transactions: 600, suspicious: 58 },
  { name: 'Sat', transactions: 200, suspicious: 12 },
  { name: 'Sun', transactions: 150, suspicious: 5 },
];

const riskDistData = [
  { name: 'Low', value: 120, fill: '#34d399' },
  { name: 'Medium', value: 85, fill: '#fbbf24' },
  { name: 'High', value: 34, fill: '#fb923c' },
  { name: 'Critical', value: 12, fill: '#fb7185' },
];

const topRiskyAccounts = [
  { id: 'ACC1042', score: 94, level: 'CRITICAL', connections: 27 },
  { id: 'ACC2091', score: 88, level: 'HIGH', connections: 19 },
  { id: 'ACC5567', score: 76, level: 'HIGH', connections: 14 },
];

export function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentCases, setRecentCases] = useState<SuspiciousCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [statsData, casesData] = await Promise.all([
          api.getDashboardStats(),
          api.getSuspiciousCases()
        ]);
        setStats(statsData);
        setRecentCases(casesData.slice(0, 5));
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading || !stats) {
    return (
      <div className="flex h-full items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-[#4a3525]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#3b2b20]">Dashboard Overview</h1>
          <p className="text-sm text-[#6b584b] mt-1">Real-time overview of financial crime monitoring and investigations</p>
        </div>
        <Button onClick={() => navigate('/cases')}>
          New Investigation <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-[#8c7a6b] uppercase tracking-wider">Total Transactions</p>
                <p className="text-3xl font-bold text-[#3b2b20] mt-1">{stats.totalTransactions.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-[#f5f4ef] rounded-full">
                <Activity className="h-5 w-5 text-[#6b584b]" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="mr-1 h-4 w-4 text-emerald-600" />
              <span className="text-emerald-600 font-medium">+{stats.totalTransactionsTrend}%</span>
              <span className="ml-2 text-[#8c7a6b]">vs last week</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-[#8c7a6b] uppercase tracking-wider">Suspicious Activity</p>
                <p className="text-3xl font-bold text-[#3b2b20] mt-1">{stats.suspiciousTransactions.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-full">
                <AlertTriangle className="h-5 w-5 text-amber-700" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="mr-1 h-4 w-4 text-rose-600" />
              <span className="text-rose-600 font-medium">+{stats.suspiciousTransactionsTrend}%</span>
              <span className="ml-2 text-[#8c7a6b]">vs last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-[#8c7a6b] uppercase tracking-wider">High-Risk Accounts</p>
                <p className="text-3xl font-bold text-[#3b2b20] mt-1">{stats.highRiskAccounts}</p>
              </div>
              <div className="p-3 bg-rose-100 rounded-full">
                <ShieldAlert className="h-5 w-5 text-rose-700" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="mr-1 h-4 w-4 text-rose-600" />
              <span className="text-rose-600 font-medium">+{stats.highRiskAccountsTrend}%</span>
              <span className="ml-2 text-[#8c7a6b]">vs last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-[#8c7a6b] uppercase tracking-wider">Active Investigations</p>
                <p className="text-3xl font-bold text-[#3b2b20] mt-1">{stats.activeInvestigations}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <ShieldAlert className="h-5 w-5 text-blue-700" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="mr-1 h-4 w-4 text-emerald-600" />
              <span className="text-emerald-600 font-medium">{stats.activeInvestigationsTrend}%</span>
              <span className="ml-2 text-[#8c7a6b]">vs last week</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Suspicious Activity Trend</CardTitle>
            <div className="flex items-center gap-2 text-sm text-[#6b584b] bg-[#f5f4ef] px-3 py-1.5 rounded-md cursor-pointer hover:bg-[#e8e4db] transition-colors">
              This Week <ChevronDown className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSuspicious" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4a3525" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4a3525" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e6e2d8" vertical={false} />
                  <XAxis dataKey="name" stroke="#8c7a6b" tick={{fill: '#8c7a6b', fontSize: 12}} axisLine={false} tickLine={false} />
                  <YAxis stroke="#8c7a6b" tick={{fill: '#8c7a6b', fontSize: 12}} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e6e2d8', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#3b2b20' }}
                  />
                  <Area type="monotone" dataKey="suspicious" stroke="#4a3525" strokeWidth={2} fillOpacity={1} fill="url(#colorSuspicious)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {riskDistData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e6e2d8', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#3b2b20' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-col items-center">
              <p className="text-sm text-[#8c7a6b]">Total Flagged Amount</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-[#3b2b20]">₹42.8 Cr</p>
                <span className="flex items-center text-xs font-medium text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-full">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  8.3%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent High-Risk Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#3b2b20]">
                <thead className="bg-[#f5f4ef] text-xs uppercase text-[#6b584b]">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-medium rounded-tl-lg">Case ID</th>
                    <th scope="col" className="px-4 py-3 font-medium">Account</th>
                    <th scope="col" className="px-4 py-3 font-medium">Risk Score</th>
                    <th scope="col" className="px-4 py-3 font-medium">Pattern</th>
                    <th scope="col" className="px-4 py-3 font-medium">Amount</th>
                    <th scope="col" className="px-4 py-3 font-medium">Time</th>
                    <th scope="col" className="px-4 py-3 font-medium">Status</th>
                    <th scope="col" className="px-4 py-3 font-medium rounded-tr-lg text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e6e2d8]">
                  {recentCases.map((c) => (
                    <tr key={c.id} className="hover:bg-[#fdfbf7] transition-colors">
                      <td className="px-4 py-4 font-medium text-[#3b2b20]">{c.id}</td>
                      <td className="px-4 py-4">
                        <div>
                          <div className="text-[#3b2b20] font-medium">{c.accountName}</div>
                          <div className="text-xs text-[#8c7a6b]">{c.accountId}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-[#3b2b20]">{c.riskScore}</span>
                          <Badge variant="risk" level={c.riskLevel}>{c.riskLevel}</Badge>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-[#6b584b]">{c.pattern}</td>
                      <td className="px-4 py-4 font-medium text-[#3b2b20]">{formatCurrency(c.suspiciousAmount)}</td>
                      <td className="px-4 py-4 text-[#8c7a6b]">{formatDateTime(c.detectedAt)}</td>
                      <td className="px-4 py-4">
                        <Badge variant="status" status={c.status}>{c.status}</Badge>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/cases/${c.id}`)}>
                          Investigate
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Risky Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topRiskyAccounts.map((account) => (
                <div 
                  key={account.id} 
                  className="flex flex-col p-3 rounded-lg border border-[#e6e2d8] hover:border-[#d4cec3] hover:shadow-sm transition-all cursor-pointer bg-white"
                  onClick={() => navigate(`/accounts`)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-[#3b2b20]">{account.id}</span>
                    <Badge variant="risk" level={account.level as any}>{account.level}</Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#6b584b]">Score: <span className="font-bold text-[#3b2b20]">{account.score}/100</span></span>
                    <span className="text-[#8c7a6b]">{account.connections} Connections</span>
                  </div>
                  <div className="w-full bg-[#f5f4ef] h-1.5 rounded-full mt-3 overflow-hidden">
                    <div 
                      className={`h-full ${account.score > 90 ? 'bg-rose-500' : 'bg-orange-500'}`} 
                      style={{ width: `${account.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button variant="secondary" className="w-full mt-4 text-sm">
              View All Risky Accounts
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
