import React from 'react';
import {
  LayoutDashboard,
  BarChart3,
  Layers,
  Home,
  Map,
  Building2,
  Camera,
  Landmark,
  ShoppingBag,
  Compass,
  Utensils,
  Palette,
  Sparkles,
  History,
  HelpCircle,
  Award,
  Image,
  Sliders,
  Menu as MenuIcon,
  Eye,
  ShieldCheck,
  Play,
  Users,
  FileText,
  Trash2,
  X
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  trashCount?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onChangeTab,
  isOpenMobile,
  onCloseMobile,
  trashCount = 0
}) => {
  const menuGroups = [
    {
      title: 'GERAL',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'metricas', label: 'Estatísticas & Acessos', icon: BarChart3 },
        { id: 'secoes', label: 'Seções do Site', icon: Layers },
        { id: 'home', label: 'Página Inicial (Home)', icon: Home },
        { id: 'mapa', label: 'Mapa de São Paulo', icon: Map }
      ]
    },
    {
      title: 'CONTEÚDOS E LOCAIS',
      items: [
        { id: 'cidades', label: 'Cidades', icon: Building2 },
        { id: 'pontos', label: 'Pontos Turísticos', icon: Camera },
        { id: 'paulista', label: 'Avenida Paulista', icon: Landmark },
        { id: 'mercadao', label: 'Mercadão', icon: ShoppingBag },
        { id: 'liberdade', label: 'Liberdade', icon: Compass }
      ]
    },
    {
      title: 'CULTURA E ARTE',
      items: [
        { id: 'culinaria', label: 'Culinária Paulista', icon: Utensils },
        { id: 'artesanato', label: 'Artesanato', icon: Palette },
        { id: 'cultura', label: 'Cultura Paulista', icon: Sparkles },
        { id: 'historia', label: 'História de SP', icon: History },
        { id: 'curiosidades', label: 'Você Sabia?', icon: HelpCircle },
        { id: 'quiz', label: 'Quiz Cultural', icon: Award }
      ]
    },
    {
      title: 'MIDIA E ESTRUTURA',
      items: [
        { id: 'media', label: 'Biblioteca de Mídia', icon: Image },
        { id: 'banners', label: 'Banners', icon: Sliders },
        { id: 'menu', label: 'Menu do Site', icon: MenuIcon }
      ]
    },
    {
      title: 'CONFIGURAÇÕES E SISTEMA',
      items: [
        { id: 'aparencia', label: 'Aparência & Temas', icon: Eye },
        { id: 'identidade', label: 'Identidade Colégio', icon: ShieldCheck },
        { id: 'modo_feira', label: 'Modo Feira', icon: Play },
        { id: 'usuarios', label: 'Administradores', icon: Users },
        { id: 'historico', label: 'Histórico de Logs', icon: FileText },
        { id: 'lixeira', label: 'Lixeira', icon: Trash2, badge: trashCount }
      ]
    }
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-950 text-slate-300 border-r border-slate-800 w-64 shrink-0">
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800">
        <span className="font-serif text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2.5">
          <div className="h-7 w-7 overflow-hidden rounded-full border border-amber-500/40 p-0.5 bg-slate-900 shrink-0">
            <img src="/logo-simetria.jpg" alt="Simetria" className="h-full w-full object-contain rounded-full" />
          </div>
          SIMETRIA CMS
        </span>
        {isOpenMobile && (
          <button onClick={onCloseMobile} className="lg:hidden text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            <h4 className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
              {group.title}
            </h4>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onChangeTab(item.id);
                    if (isOpenMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="rounded-full bg-rose-500/20 border border-rose-500/40 px-2 py-0.2 text-[10px] font-bold text-rose-300">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-screen sticky top-0">
        {sidebarContent}
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onCloseMobile} />
          <div className="relative z-10 w-64 h-full">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
