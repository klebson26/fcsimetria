import React from 'react';
import { getIdentidade } from '../services/storageService';
import { Sparkles, Lock, MapPin, Heart } from 'lucide-react';

interface FooterProps {
  onNavigateToAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateToAdmin }) => {
  const identidade = getIdentidade();

  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Col 1: Identity */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30">
                <Sparkles className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white">
                  {identidade.nomeColegio}
                </h3>
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest">
                  {identidade.nomeFeira}
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 max-w-md">
              {identidade.textoInstitucional}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <MapPin className="h-4 w-4 text-blue-400" />
              <span>Estado de São Paulo — Cultura, História e Diversidade</span>
            </div>
          </div>

          {/* Col 2: Highlighed Topics */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200 mb-4">
              Destiques da Feira
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#mapa" className="hover:text-amber-400 transition">
                  Mapa Interativo do Estado
                </a>
              </li>
              <li>
                <a href="#paulista" className="hover:text-amber-400 transition">
                  Especial Av. Paulista
                </a>
              </li>
              <li>
                <a href="#mercadao" className="hover:text-amber-400 transition">
                  Mercadão Municipal
                </a>
              </li>
              <li>
                <a href="#liberdade" className="hover:text-amber-400 transition">
                  Bairro da Liberdade
                </a>
              </li>
              <li>
                <a href="#culinaria" className="hover:text-amber-400 transition">
                  Culinária & Gastronomia
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Admin & Credits */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200 mb-4">
              Acesso Restrito
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              Área de controle do corpo docente e administradores da feira cultural.
            </p>
            <button
              onClick={onNavigateToAdmin}
              className="inline-flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-xs font-medium text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/50 transition"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>Painel Administrativo CMS</span>
            </button>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {identidade.anoFeira} {identidade.nomeColegio}. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            Desenvolvido com <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> pelos estudantes do Colégio Simetria.
          </p>
        </div>
      </div>
    </footer>
  );
};
