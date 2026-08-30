import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  Users, 
  Network, 
  Settings,
  FileText,
  Activity,
  ShieldAlert
} from 'lucide-react';
import { cn } from '../../utils';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Suspicious Cases', path: '/cases', icon: AlertTriangle },
  { name: 'Network Explorer', path: '/network', icon: Network },
  { name: 'Accounts', path: '/accounts', icon: Users },
  { name: 'Transactions', path: '/transactions', icon: Activity },
  { name: 'Reports', path: '/reports', icon: FileText },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col border-r border-[#e6e2d8] bg-[#f5f4ef]">
      <div className="flex h-16 items-center px-6 border-b border-[#e6e2d8]">
        <ShieldAlert className="h-8 w-8 text-[#4a3525] mr-3" />
        <span className="text-lg font-bold tracking-tight text-[#3b2b20]">FCIS<span className="text-[#4a3525]">.</span></span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[#e8e4db] text-[#3b2b20]'
                    : 'text-[#6b584b] hover:bg-[#e8e4db]/50 hover:text-[#3b2b20]'
                )
              }
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="border-t border-[#e6e2d8] p-4 bg-white/50 m-2 rounded-xl">
        <div className="flex items-center">
          <div className="h-9 w-9 rounded-full bg-[#4a3525] flex items-center justify-center text-sm font-bold text-white shadow-sm">
            IA
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-[#3b2b20]">Investigator</p>
            <p className="text-xs font-medium text-[#6b584b]">ID: INV-8924</p>
          </div>
        </div>
      </div>
    </div>
  );
}
