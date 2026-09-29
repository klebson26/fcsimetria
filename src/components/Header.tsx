import React, { useState, useEffect } from 'react';
import {
  getIdentidade,
  getMenu,
  getAparencia,
  subscribeStorage,
  getAuthSession
} from '../services/storageService';
import {
  Volume2,
  VolumeX,
  Play,
  Search,
  Lock,
  Menu as MenuIcon,
  X,
  Sparkles,
  Award,
  QrCode
} from 'lucide-react';
import { toggleAmbientSound, isAmbientSoundActive, playClickSound } from '../services/audioService';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenFairMode: () => void;
  onOpenQRCodeModal: (topic?: 'geral' | 'paulista' | 'mercadao' | 'liberdade' | 'quiz') => void;
  onNavigateToAdmin: () => void;
  onNavigateToQuiz: () => void;
  onNavigateToHome?: () => void;
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenFairMode,
  onOpenQRCodeModal,
  onNavigateToAdmin,
  onNavigateToQuiz,
  onNavigateToHome,
  activeSection
}) => {
  const [identidade, setIdentidade] = useState(getIdentidade());
  const [menuItems, setMenuItems] = useState(getMenu());
  const [aparencia, setAparencia] = useState(getAparencia());
  const [isAudioActive, setIsAudioActive] = useState(isAmbientSoundActive());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const session = getAuthSession();

  useEffect(() => {
    return subscribeStorage(() => {
      setIdentidade(getIdentidade());
      setMenuItems(getMenu());
      setAparencia(getAparencia());
    });
  }, []);

  const handleToggleAudio = () => {
    playClickSound();
    const newState = toggleAmbientSound(!isAudioActive);
    setIsAudioActive(newState);
  };

  const handleNavClick = (path: string) => {
    playClickSound();
    setMobileMenuOpen(false);
    if (path === '/#quiz') {
      onNavigateToQuiz();
    } else if (path.startsWith('/#')) {
      if (onNavigateToHome) {
        onNavigateToHome();
      }
      const targetId = path.replace('/#', '');
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    } else if (path === '/') {
      if (onNavigateToHome) {
        onNavigateToHome();
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const publishedMenu = menuItems
    .filter((m) => m.status === 'PUBLICADO')
    .sort((a, b) => a.ordem - b.ordem);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Title & School Badge */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            onClick={() => handleNavClick('/#')}
            className="flex items-center gap-3 transition hover:opacity-90"
          >
            <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-slate-950 p-0.5 shadow-lg shadow-amber-500/10 border-2 border-amber-500/40 shrink-0">
              <img
                src={identidade.logoUrl || '/logo-simetria.jpg'}
                alt={identidade.nomeColegio}
                className="h-full w-full object-contain rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo-simetria.jpg';
                }}
              />
            </div>
            <div>
              <span className="font-serif text-lg font-bold tracking-tight text-white sm:text-xl">
                {identidade.nomeColegio}
              </span>
              <p className="text-[11px] font-medium uppercase tracking-widest text-amber-400">
                {identidade.nomeFeira} · SP
              </p>
            </div>
          </a>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {publishedMenu.map((item) => {
            const isQuiz = item.path === '/#quiz';
            const targetId = item.path.replace('/#', '');
            const isActive = activeSection === targetId;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                className={`relative px-3 py-1.5 text-xs xl:text-sm font-medium rounded-lg transition-all ${
                  isActive
                    ? 'text-white bg-blue-600/30 border border-blue-500/40 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                {item.label}
                {isQuiz && (
                  <span className="ml-1.5 inline-flex items-center rounded-full bg-amber-500/20 px-1.5 py-0.2 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                    <Award className="mr-0.5 h-3 w-3" /> Quiz
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* QR Code Printable Table Stand Button */}
          <button
            onClick={() => {
              playClickSound();
              onOpenQRCodeModal();
            }}
            title="Imprimir QR Code para Mesas"
            className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/20 hover:text-white transition shadow-sm"
          >
            <QrCode className="h-4 w-4 text-amber-400" />
            <span className="hidden xl:inline">QR Code Mesa</span>
          </button>
          <button
            onClick={() => {
              playClickSound();
              onOpenSearch();
            }}
            title="Pesquisar no site"
            className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white"
          >
            <Search className="h-4 w-4 text-blue-400" />
            <span className="hidden sm:inline">Buscar</span>
          </button>

          {/* Ambient Audio Toggle */}
          <button
            onClick={handleToggleAudio}
            title={isAudioActive ? 'Desativar Som da Feira' : 'Ativar Som da Feira'}
            className={`flex items-center justify-center h-10 w-10 rounded-xl border transition ${
              isAudioActive
                ? 'border-amber-500/50 bg-amber-500/20 text-amber-300 shadow-md shadow-amber-500/10'
                : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            {isAudioActive ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>

          {/* Fair Presentation Mode Button */}
          <button
            onClick={() => {
              playClickSound();
              onOpenFairMode();
            }}
            className="hidden sm:flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-3.5 py-2 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 transition hover:from-amber-400 hover:to-amber-500"
          >
            <Play className="h-3.5 w-3.5 fill-slate-950" />
            <span className="uppercase tracking-wider">Modo Feira</span>
          </button>

          {/* Admin Panel Button */}
          <button
            onClick={() => {
              playClickSound();
              onNavigateToAdmin();
            }}
            title="Painel Administrativo"
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition ${
              session
                ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-blue-500/40 hover:text-blue-400'
            }`}
          >
            <Lock className="h-3.5 w-3.5" />
            <span className="hidden md:inline">{session ? 'Painel (On)' : 'Admin'}</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex lg:hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950/95 px-4 pt-2 pb-6 space-y-2">
          <div className="grid grid-cols-2 gap-2 pb-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenFairMode();
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-2.5 text-xs font-bold text-slate-950"
            >
              <Play className="h-3.5 w-3.5 fill-slate-950" /> Modo Feira
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateToAdmin();
              }}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 py-2.5 text-xs font-medium text-slate-300"
            >
              <Lock className="h-3.5 w-3.5" /> {session ? 'Painel Admin' : 'Acesso Admin'}
            </button>
          </div>

          <div className="space-y-1">
            {publishedMenu.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                className="w-full text-left px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-900 hover:text-white rounded-lg transition"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
