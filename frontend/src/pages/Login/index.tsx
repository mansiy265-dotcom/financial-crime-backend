import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock authentication
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden px-4">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none mix-blend-overlay"></div>
      <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-slate-900/80 backdrop-blur-md p-8 rounded-2xl border border-slate-800 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-indigo-500/20 p-3 rounded-xl mb-4 border border-indigo-500/30">
              <ShieldAlert className="h-10 w-10 text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">FCIS Investigator</h1>
            <p className="text-slate-400 mt-2 text-sm text-center">
              Financial Crime Investigation System
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Investigator ID or Email
              </label>
              <input
                id="email"
                type="email"
                required
                defaultValue="investigator@fcis.gov"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-white outline-none"
                placeholder="Enter your ID"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                defaultValue="password123"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-white outline-none"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              className="w-full py-3"
              isLoading={isLoading}
            >
              Secure Login
            </Button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-500 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
              Secure Connection Established
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
