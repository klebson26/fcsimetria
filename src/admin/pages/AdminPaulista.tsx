import React, { useState, useEffect } from 'react';
import { getPaulistaContent, savePaulista, subscribeStorage } from '../../services/storageService';
import { PaulistaContent, PaulistaMilestone } from '../../types/database';
import { Landmark, Plus, Edit2, Trash2, ArrowUp, ArrowDown, Image } from 'lucide-react';
import { MediaPickerModal } from '../../components/MediaPickerModal';

export const AdminPaulista: React.FC = () => {
  const [paulista, setPaulista] = useState<PaulistaContent>(getPaulistaContent());
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Partial<PaulistaMilestone> | null>(null);

  useEffect(() => {
    return subscribeStorage(() => {
      setPaulista(getPaulistaContent());
    });
  }, []);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    savePaulista(paulista);
  };

  const handleSaveMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMilestone?.titulo) return;

    const list = [...paulista.linhaDoTempo];
    const index = list.findIndex((m) => m.id === editingMilestone.id);

    if (index >= 0) {
      list[index] = editingMilestone as PaulistaMilestone;
    } else {
      list.push({
        id: 'p_milestone_' + Date.now(),
        ano: editingMilestone.ano || 2026,
        titulo: editingMilestone.titulo,
        descricao: editingMilestone.descricao || '',
        imagem: editingMilestone.imagem || '',
        ordem: list.length + 1
      });
    }

    const updated = {
      ...paulista,
      linhaDoTempo: list.sort((a, b) => a.ano - b.ano)
    };

    savePaulista(updated);
    setEditingMilestone(null);
  };

  const handleDeleteMilestone = (id: string) => {
    const updated = {
      ...paulista,
      linhaDoTempo: paulista.linhaDoTempo.filter((m) => m.id !== id)
    };
    savePaulista(updated);
  };

  return (
    <div className="p-4 sm:p-8 space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
          <Landmark className="h-6 w-6 text-amber-400" /> Gerenciador de Conteúdo — Avenida Paulista
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Edite as informações gerais, os pontos de interesse e a linha do tempo histórica da Avenida Paulista.
        </p>
      </div>

      {/* General Settings */}
      <form onSubmit={handleSaveGeneral} className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
        <h3 className="font-serif text-lg font-bold text-white border-b border-slate-800 pb-2">
          Informações Principais
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Título Principal</label>
            <input
              type="text"
              value={paulista.titulo}
              onChange={(e) => setPaulista({ ...paulista, titulo: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Subtítulo</label>
            <input
              type="text"
              value={paulista.subtitulo}
              onChange={(e) => setPaulista({ ...paulista, subtitulo: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-slate-300">Descrição Geral</label>
            <textarea
              value={paulista.descricao}
              onChange={(e) => setPaulista({ ...paulista, descricao: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Imagem de Capa</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={paulista.imagemPrincipal}
                onChange={(e) => setPaulista({ ...paulista, imagemPrincipal: e.target.value })}
                className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowMediaPicker(true)}
                className="flex items-center gap-1.5 rounded-xl bg-slate-800 px-3 py-2 text-xs font-bold text-white"
              >
                <Image className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400"
          >
            Salvar Alterações Gerais
          </button>
        </div>
      </form>

      {/* Linha do Tempo Editor */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-serif text-lg font-bold text-white">
            Linha do Tempo da Avenida Paulista ({paulista.linhaDoTempo.length} marcos)
          </h3>
          <button
            onClick={() => setEditingMilestone({ ano: 2026, titulo: '', descricao: '' })}
            className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400"
          >
            <Plus className="h-3.5 w-3.5" /> Adicionar Ano
          </button>
        </div>

        {editingMilestone && (
          <form onSubmit={handleSaveMilestone} className="rounded-xl bg-slate-950 p-4 border border-amber-500/40 space-y-3">
            <h4 className="text-xs font-bold uppercase text-amber-400">
              {editingMilestone.id ? 'Editar Marco' : 'Novo Marco na Linha do Tempo'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="number"
                placeholder="Ano (ex: 1891)"
                value={editingMilestone.ano || ''}
                onChange={(e) => setEditingMilestone({ ...editingMilestone, ano: parseInt(e.target.value) || 0 })}
                className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white"
              />
              <input
                type="text"
                placeholder="Título do acontecimento"
                value={editingMilestone.titulo || ''}
                onChange={(e) => setEditingMilestone({ ...editingMilestone, titulo: e.target.value })}
                className="sm:col-span-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white"
              />
              <textarea
                placeholder="Descrição resumida"
                value={editingMilestone.descricao || ''}
                onChange={(e) => setEditingMilestone({ ...editingMilestone, descricao: e.target.value })}
                rows={2}
                className="sm:col-span-3 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingMilestone(null)}
                className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-xl bg-amber-500 px-4 py-1.5 text-xs font-bold text-slate-950"
              >
                Salvar Marco
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {paulista.linhaDoTempo.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-xl bg-slate-950 p-3 border border-slate-800">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md">
                  {item.ano}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-white">{item.titulo}</h4>
                  <p className="text-[11px] text-slate-400">{item.descricao}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditingMilestone(item)}
                  className="p-1.5 text-blue-400 hover:bg-blue-500/20 rounded-lg"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteMilestone(item.id)}
                  className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded-lg"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showMediaPicker && (
        <MediaPickerModal
          onClose={() => setShowMediaPicker(false)}
          onSelectImage={(url) => setPaulista({ ...paulista, imagemPrincipal: url })}
        />
      )}
    </div>
  );
};
