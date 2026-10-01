import React, { useState, useEffect, useRef } from 'react';
import {
  getIdentidade,
  getMenu,
  getAparencia,
  toggleThemeMode,
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
  Award,
  QrCode,
  Sun,
  Moon,
  ChevronDown,
  Sparkles,
  MapPin,
  Compass,
  Utensils,
  BookOpen,
  Camera
} from 'lucide-react';
import { toggleAmbientSound, isAmbientSoundActive, playClickSound } from '../services/audioService';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenFairMode: () => void;
  onOpenQRCodeModal: (topic?: string) => void;
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
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const session = getAuthSession();

  useEffect(() => {
    return subscribeStorage(() => {
      setIdentidade(getIdentidade());
      setMenuItems(getMenu());
      setAparencia(getAparencia());
    });
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMoreDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleAudio = () => {
    playClickSound();
    const newState = toggleAmbientSound(!isAudioActive);
    setIsAudioActive(newState);
  };

  const handleNavClick = (path: string) => {
    playClickSound();
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
    if (path === '/#quiz') {
      onNavigateToQuiz();
    } else if (path === '/#paulista') {
      window.location.hash = 'paulista';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (path === '/#mercadao') {
      window.location.hash = 'mercadao';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (path === '/#liberdade') {
      window.location.hash = 'liberdade';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (path.startsWith('/#')) {
      if (onNavigateToHome) {
        onNavigateToHome();
      }
      const targetId = path.replace('/#', '');
      window.location.hash = targetId;
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
      window.location.hash = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const publishedMenu = menuItems
    .filter((m) => m.status === 'PUBLICADO')
    .sort((a, b) => a.ordem - b.ordem);

  // Top 5 primary items for the desktop bar; remaining items cleanly housed in "Mais ▾"
  const primaryMenuItems = publishedMenu.slice(0, 5);
  const secondaryMenuItems = publishedMenu.slice(5);

  const isDark = (aparencia.modoTema || 'escuro') === 'escuro';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl transition-colors shadow-lg">
      <div className="mx-auto flex h-16 sm:h-[70px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ================= ZONE 1: BRAND TITLE & BADGE ================= */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('/#');
            }}
            className="flex items-center gap-2.5 sm:gap-3 group select-none"
          >
            <div className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center overflow-hidden rounded-xl bg-slate-900 p-0.5 border border-amber-500/40 shadow-sm group-hover:border-amber-400 transition shrink-0">
              <img
                src={identidade.logoUrl || '/logo-simetria.jpg'}
                alt={identidade.nomeColegio}
                className="h-full w-full object-contain rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo-simetria.jpg';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-base sm:text-lg font-bold tracking-tight text-white leading-tight group-hover:text-amber-300 transition">
                {identidade.nomeColegio}
              </span>
              <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-amber-400 leading-none mt-0.5">
                {identidade.nomeFeira}
              </span>
            </div>
          </a>
        </div>

        {/* ================= ZONE 2: PRIMARY NAVIGATION (DESKTOP) ================= */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {primaryMenuItems.map((item) => {
            const isQuiz = item.path === '/#quiz';
            const targetId = item.path.replace('/#', '');
            const isActive = activeSection === targetId;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                className={`px-3 py-1.5 text-xs xl:text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
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

          {/* "Mais ▾" Dropdown for remaining sections */}
          {secondaryMenuItems.length > 0 && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs xl:text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                  moreDropdownOpen
                    ? 'text-white bg-slate-900 border border-slate-700'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span>Mais</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${moreDropdownOpen ? 'rotate-180 text-amber-400' : ''}`} />
              </button>

              {moreDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 rounded-2xl border border-slate-800 bg-slate-950/98 p-2 shadow-2xl backdrop-blur-xl animate-fade-in-scale z-50">
                  <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold border-b border-slate-800/80 mb-1">
                    Outras Seções
                  </div>
                  <div className="space-y-0.5">
                    {secondaryMenuItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.path)}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-xl transition flex items-center justify-between"
                      >
                        <span>{item.label}</span>
                        {item.path === '/#quiz' && (
                          <span className="inline-flex items-center rounded-full bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold text-amber-300">
                            Quiz
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-slate-800/80 mt-1.5 pt-1.5 space-y-0.5">
                    <button
                      onClick={() => {
                        setMoreDropdownOpen(false);
                        onOpenQRCodeModal();
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-xl transition flex items-center gap-2"
                    >
                      <QrCode className="h-3.5 w-3.5" />
                      <span>Imprimir QR Code Mesa</span>
                    </button>
                    <button
                      onClick={() => {
                        setMoreDropdownOpen(false);
                        onNavigateToAdmin();
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition flex items-center gap-2"
                    >
                      <Lock className="h-3.5 w-3.5 text-slate-500" />
                      <span>{session ? 'Painel CMS (Ativo)' : 'Área do Professor (Admin)'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* ================= ZONE 3: ACTIONS CLUSTER ================= */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Search Trigger */}
          <button
            onClick={() => {
              playClickSound();
              onOpenSearch();
            }}
            title="Pesquisar conteúdo"
            className="flex h-9 sm:h-10 items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-2.5 sm:px-3 text-xs font-medium text-slate-300 hover:border-slate-700 hover:text-white transition shadow-sm"
          >
            <Search className="h-4 w-4 text-blue-400" />
            <span className="hidden md:inline font-semibold">Buscar</span>
          </button>

          {/* Theme Toggle (☀️ / 🌙) */}
          <button
            onClick={() => {
              playClickSound();
              toggleThemeMode();
            }}
            title={isDark ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/80 text-amber-400 hover:border-amber-500/40 hover:text-amber-300 transition shadow-sm"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4 text-slate-700" />}
          </button>

          {/* Ambient Sound Toggle */}
          <button
            onClick={handleToggleAudio}
            title={isAudioActive ? 'Desativar Som da Feira' : 'Ativar Som da Feira'}
            className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border transition shadow-sm ${
              isAudioActive
                ? 'border-amber-500/50 bg-amber-500/20 text-amber-300'
                : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            {isAudioActive ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>

          {/* Primary Action CTA: Modo Feira */}
          <button
            onClick={() => {
              playClickSound();
              onOpenFairMode();
            }}
            className="hidden sm:flex h-9 sm:h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-3.5 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition whitespace-nowrap"
          >
            <Play className="h-3.5 w-3.5 fill-slate-950" />
            <span className="uppercase tracking-wider">Modo Feira</span>
          </button>

          {/* PWA Install Button (if available) */}
          <div className="hidden xl:block">
            <PWAInstallButton />
          </div>

          {/* Admin Indicator (only shown directly if logged in) */}
          {session && (
            <button
              onClick={() => {
                playClickSound();
                onNavigateToAdmin();
              }}
              title="Acessar Painel Administrativo"
              className="hidden lg:flex h-9 sm:h-10 items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>Painel</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir Menu"
            className="flex lg:hidden h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white transition"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ================= MOBILE NAVIGATION DRAWER ================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800/80 bg-slate-950/98 backdrop-blur-2xl px-4 py-4 space-y-3 shadow-2xl animate-fade-in">
          {/* Quick Primary Actions in Mobile Drawer */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenFairMode();
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:bg-amber-400 transition"
            >
              <Play className="h-3.5 w-3.5 fill-slate-950" /> Modo Feira
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQRCodeModal();
              }}
              className="flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 py-2.5 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition"
            >
              <QrCode className="h-3.5 w-3.5 text-amber-400" /> QR Code Mesa
            </button>
          </div>

          {/* All Menu Items in Mobile Drawer */}
          <div className="space-y-1 pt-2 border-t border-slate-800/80 max-h-[60vh] overflow-y-auto">
            {publishedMenu.map((item) => {
              const targetId = item.path.replace('/#', '');
              const isActive = activeSection === targetId;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.path)}
                  className={`w-full text-left px-3.5 py-2.5 text-xs font-semibold rounded-xl transition flex items-center justify-between ${
                    isActive
                      ? 'bg-blue-600/30 text-white border border-blue-500/40'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.path === '/#quiz' && (
                    <span className="inline-flex items-center rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                      <Award className="mr-1 h-3 w-3" /> Quiz
                    </span>
                  )}
                </button>
              );
            })}

            {/* Admin Link at the bottom of Drawer */}
            <div className="pt-2 border-t border-slate-800/60 mt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateToAdmin();
                }}
                className="w-full text-left px-3.5 py-2.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition flex items-center gap-2"
              >
                <Lock className="h-3.5 w-3.5 text-slate-500" />
                <span>{session ? 'Painel Administrativo CMS (Conectado)' : 'Área do Professor / Acesso Admin'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
