import React, { useState, useEffect } from 'react';
import { getIdentidade, saveIdentidade, subscribeStorage } from '../../services/storageService';
import { ConfigIdentidade } from '../../types/database';
import { ShieldCheck, Check } from 'lucide-react';

export const AdminIdentidade: React.FC = () => {
  const [identidade, setIdentidade] = useState<ConfigIdentidade>(getIdentidade());
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    return subscribeStorage(() => {
      setIdentidade(getIdentidade());
    });
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveIdentidade(identidade);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="p-4 sm:p-8 space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-amber-400" /> Configuração da Identidade do Colégio
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Altere o nome da instituição, ano letivo, logos, marcas e texto institucional.
        </p>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 p-3 text-xs text-emerald-300 font-bold">
          <Check className="h-4 w-4" /> Dados de identidade atualizados com sucesso!
        </div>
      )}

      <form onSubmit={handleSave} className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Nome do Colégio</label>
            <input
              type="text"
              required
              value={identidade.nomeColegio}
              onChange={(e) => setIdentidade({ ...identidade, nomeColegio: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Nome da Feira Cultural</label>
            <input
              type="text"
              required
              value={identidade.nomeFeira}
              onChange={(e) => setIdentidade({ ...identidade, nomeFeira: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Ano da Feira</label>
            <input
              type="text"
              value={identidade.anoFeira}
              onChange={(e) => setIdentidade({ ...identidade, anoFeira: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Título Principal</label>
            <input
              type="text"
              value={identidade.tituloPrincipal}
              onChange={(e) => setIdentidade({ ...identidade, tituloPrincipal: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-slate-300">Texto Institucional</label>
            <textarea
              value={identidade.textoInstitucional}
              onChange={(e) => setIdentidade({ ...identidade, textoInstitucional: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400"
          >
            Salvar Identidade
          </button>
        </div>
      </form>
    </div>
  );
};
