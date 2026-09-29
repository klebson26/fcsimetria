import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff, Database } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-2xl bg-amber-500 border border-amber-400 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-2xl shadow-amber-500/30 animate-bounce">
      <WifiOff className="h-4 w-4 shrink-0" />
      <div className="flex items-center gap-1.5">
        <Database className="h-3.5 w-3.5" />
        <span>Modo Offline Ativo — Acessando dados locais salvos.</span>
      </div>
    </div>
  );
};
