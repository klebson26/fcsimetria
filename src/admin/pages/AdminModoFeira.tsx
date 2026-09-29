import React, { useState, useEffect } from 'react';
import { getModoFeira, saveModoFeira, subscribeStorage } from '../../services/storageService';
import { ConfigModoFeira } from '../../types/database';
import { Play, Check } from 'lucide-react';

interface AdminModoFeiraProps {
  onOpenFairMode: () => void;
}

export const AdminModoFeira: React.FC<AdminModoFeiraProps> = ({ onOpenFairMode }) => {
  const [modoFeira, setModoFeira] = useState<ConfigModoFeira>(getModoFeira());
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    return subscribeStorage(() => {
      setModoFeira(getModoFeira());
    });
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveModoFeira(modoFeira);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="p-4 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <Play className="h-6 w-6 text-amber-400" /> Configuração do Modo Feira / Apresentação
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Ajuste o comportamento do modo de exibição contínua para totens, TVs e estandes na feira.
          </p>
        </div>

        <button
          onClick={onOpenFairMode}
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition shadow-lg shadow-amber-500/20"
        >
          <Play className="h-4 w-4 fill-slate-950" /> Iniciar Apresentação
        </button>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 p-3 text-xs text-emerald-300 font-bold">
          <Check className="h-4 w-4" /> Configurações do Modo Feira atualizadas!
        </div>
      )}

      <form onSubmit={handleSave} className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Tempo de Transição (Segundos)</label>
            <input
              type="number"
              min={3}
              max={60}
              value={modoFeira.tempoTransicaoSegundos}
              onChange={(e) => setModoFeira({ ...modoFeira, tempoTransicaoSegundos: parseInt(e.target.value) || 8 })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Velocidade das Animações</label>
            <select
              value={modoFeira.velocidadeAnimacoes}
              onChange={(e) => setModoFeira({ ...modoFeira, velocidadeAnimacoes: e.target.value as any })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
            >
              <option value="Lenta">Lenta</option>
              <option value="Normal">Normal</option>
              <option value="Rápida">Rápida</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Autoplay Habilitado</label>
            <select
              value={modoFeira.autoplay ? 'SIM' : 'NAO'}
              onChange={(e) => setModoFeira({ ...modoFeira, autoplay: e.target.value === 'SIM' })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white font-bold"
            >
              <option value="SIM">SIM (Avançar slides automaticamente)</option>
              <option value="NAO">NÃO (Apenas navegação manual)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400"
          >
            Salvar Configurações
          </button>
        </div>
      </form>
    </div>
  );
};
