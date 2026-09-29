import React, { useState, useEffect } from 'react';
import { getAparencia, saveAparencia, subscribeStorage } from '../../services/storageService';
import { ConfigAparencia, ThemeStyle } from '../../types/database';
import { Eye, Sparkles, Check } from 'lucide-react';

export const AdminAparencia: React.FC = () => {
  const [aparencia, setAparencia] = useState<ConfigAparencia>(getAparencia());
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    return subscribeStorage(() => {
      setAparencia(getAparencia());
    });
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveAparencia(aparencia);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const themes: { style: ThemeStyle; label: string; desc: string; preview: string }[] = [
    { style: 'FUTURISTA', label: 'FUTURISTA', desc: 'Fundo escuro profundo, bordas neon e transparências cibernéticas.', preview: 'from-blue-600 to-indigo-900' },
    { style: 'CULTURAL', label: 'CULTURAL', desc: 'Cores quentes da terra, tons de terracota, ouro e pergaminho histórico.', preview: 'from-amber-600 to-amber-950' },
    { style: 'MODERNO', label: 'MODERNO', desc: 'Design limpo, cartões sólidos, contraste marcante e azul vibrante.', preview: 'from-slate-800 to-slate-950' },
    { style: 'MINIMALISTA', label: 'MINIMALISTA', desc: 'Foco total nas imagens e na tipografia com elegância e sobriedade.', preview: 'from-zinc-900 to-black' }
  ];

  return (
    <div className="p-4 sm:p-8 space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
          <Eye className="h-6 w-6 text-amber-400" /> Configurações Visuais & Temas
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Controle a paleta de cores, tipografia, estilos de cards e tema geral do site da feira.
        </p>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 p-3 text-xs text-emerald-300 font-bold">
          <Check className="h-4 w-4" /> Alterações de aparência salvas com sucesso!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Selector de Temas */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-400" /> Seletor de Temas do Site
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {themes.map((t) => {
              const isSelected = aparencia.tema === t.style;
              return (
                <div
                  key={t.style}
                  onClick={() => setAparencia({ ...aparencia, tema: t.style })}
                  className={`rounded-2xl border-2 p-5 space-y-2 cursor-pointer transition ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/10 shadow-xl shadow-amber-500/10'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  <div className={`h-12 w-full rounded-xl bg-gradient-to-r ${t.preview}`} />
                  <h4 className="font-bold text-sm text-white">{t.label}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{t.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detalhes Visuais */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <h3 className="font-serif text-lg font-bold text-white">
            Personalização Fina de Cores e Tipografia
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Cor Primária</label>
              <input
                type="color"
                value={aparencia.corPrimaria}
                onChange={(e) => setAparencia({ ...aparencia, corPrimaria: e.target.value })}
                className="h-10 w-full rounded-xl border border-slate-800 bg-slate-950 p-1 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Cor dos Botões</label>
              <input
                type="color"
                value={aparencia.corBotoes}
                onChange={(e) => setAparencia({ ...aparencia, corBotoes: e.target.value })}
                className="h-10 w-full rounded-xl border border-slate-800 bg-slate-950 p-1 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Tipografia Principal</label>
              <select
                value={aparencia.tipografia}
                onChange={(e) => setAparencia({ ...aparencia, tipografia: e.target.value as any })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white"
              >
                <option value="Plus Jakarta Sans">Plus Jakarta Sans (Moderno)</option>
                <option value="Cinzel">Cinzel (Clássico / Editorial)</option>
                <option value="Cormorant Garamond">Cormorant Garamond (Elegante)</option>
                <option value="Syne">Syne (Exibição Futurista)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition shadow-lg"
          >
            Salvar Aparência Visual
          </button>
        </div>
      </form>
    </div>
  );
};
