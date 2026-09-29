import React from 'react';
import { getAuthSession, setAuthSession } from '../../services/storageService';
import { Search, ExternalLink, LogOut, Menu as MenuIcon, User } from 'lucide-react';

interface AdminHeaderProps {
  onOpenMobileMenu: () => void;
  onNavigateToPublicSite: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onOpenMobileMenu,
  onNavigateToPublicSite,
  searchQuery,
  onSearchChange
}) => {
  const session = getAuthSession();

  const handleLogout = () => {
    setAuthSession(null);
    window.location.hash = '';
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-950/90 px-4 sm:px-8 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300"
        >
          <MenuIcon className="h-5 w-5" />
        </button>

        {/* Global Admin Search Input */}
        <div className="relative w-48 sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Busca global no painel (cidade, prato, etc)..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none transition"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* View Public Site button */}
        <button
          onClick={onNavigateToPublicSite}
          className="hidden sm:flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:border-blue-500/40 hover:text-white transition"
        >
          <ExternalLink className="h-3.5 w-3.5 text-blue-400" />
          <span>Ver Site Público</span>
        </button>

        {/* User Info Badge */}
        {session && (
          <div className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 font-bold text-xs">
              <User className="h-4 w-4" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-white truncate max-w-[120px]">
                {session.nome}
              </p>
              <span className="text-[10px] font-mono text-amber-400 font-semibold">
                {session.role}
              </span>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          title="Sair do Painel"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};
