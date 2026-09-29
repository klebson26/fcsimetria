import React, { useState, useEffect } from 'react';
import {
  getCuriosidades,
  saveEntity,
  moveToTrash,
  KEYS,
  subscribeStorage
} from '../../services/storageService';
import { CuriosidadeVoceSabia } from '../../types/database';
import { HelpCircle, Plus, Edit2, Trash2, Search } from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';

export const AdminCuriosidades: React.FC = () => {
  const [curiosidades, setCuriosidades] = useState<CuriosidadeVoceSabia[]>(getCuriosidades());
  const [filterQuery, setFilterQuery] = useState('');
  const [editingItem, setEditingItem] = useState<Partial<CuriosidadeVoceSabia> | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    return subscribeStorage(() => {
      setCuriosidades(getCuriosidades());
    });
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.pergunta) return;

    const newCur: CuriosidadeVoceSabia = {
      id: editingItem.id || 'cur_' + Date.now(),
      titulo: editingItem.pergunta,
      descricao: editingItem.resposta || '',
      pergunta: editingItem.pergunta,
      resposta: editingItem.resposta || '',
      categoria: editingItem.categoria || 'Geral',
      cidadeOuRegiao: editingItem.cidadeOuRegiao || 'São Paulo',
      status: editingItem.status || 'PUBLICADO',
      ordem: editingItem.ordem || curiosidades.length + 1,
      dataCriacao: editingItem.dataCriacao || new Date().toISOString(),
      dataAtualizacao: new Date().toISOString()
    };

    saveEntity(KEYS.CURIOSIDADES, newCur, 'Curiosidade');
    setEditingItem(null);
  };

  const filtered = curiosidades.filter(
    (c) =>
      c.pergunta.toLowerCase().includes(filterQuery.toLowerCase()) ||
      c.resposta.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-amber-400" /> Você Sabia? — Curiosidades
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Cadastre perguntas e respostas instigantes sobre o Estado de São Paulo.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingItem({
              pergunta: '',
              resposta: '',
              categoria: 'Geral',
              cidadeOuRegiao: 'São Paulo',
              status: 'PUBLICADO'
            })
          }
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
        >
          <Plus className="h-4 w-4" /> Nova Curiosidade
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <input
          type="text"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder="Pesquisar por pergunta ou resposta..."
          className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
        />
      </div>

      {editingItem && (
        <form onSubmit={handleSave} className="rounded-2xl border border-amber-500/40 bg-slate-900 p-6 space-y-4 shadow-2xl">
          <h3 className="font-serif text-lg font-bold text-white">
            {editingItem.id ? 'Editar Curiosidade' : 'Cadastrar Curiosidade'}
          </h3>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Pergunta / Fato ("Você Sabia?")</label>
              <input
                type="text"
                required
                value={editingItem.pergunta || ''}
                onChange={(e) => setEditingItem({ ...editingItem, pergunta: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Resposta / Explicação</label>
              <textarea
                required
                value={editingItem.resposta || ''}
                onChange={(e) => setEditingItem({ ...editingItem, resposta: e.target.value })}
                rows={3}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Categoria</label>
                <input
                  type="text"
                  value={editingItem.categoria || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, categoria: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Cidade / Região</label>
                <input
                  type="text"
                  value={editingItem.cidadeOuRegiao || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, cidadeOuRegiao: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs font-semibold text-slate-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400"
            >
              Salvar
            </button>
          </div>
        </form>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((cur) => (
          <div
            key={cur.id}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase text-purple-400">{cur.categoria} · {cur.cidadeOuRegiao}</span>
              <h3 className="font-serif text-base font-bold text-white">{cur.pergunta}</h3>
              <p className="text-xs text-slate-300 line-clamp-3">{cur.resposta}</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setEditingItem(cur)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-950 text-blue-400 hover:bg-blue-500/20"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setDeleteConfirmId(cur.id)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-950 text-rose-400 hover:bg-rose-500/20"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={Boolean(deleteConfirmId)}
        title="Mover Curiosidade para a Lixeira?"
        message="Ela poderá ser restaurada a qualquer momento."
        onConfirm={() => {
          if (deleteConfirmId) {
            moveToTrash(KEYS.CURIOSIDADES, deleteConfirmId, 'Curiosidade');
            setDeleteConfirmId(null);
          }
        }}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
};
