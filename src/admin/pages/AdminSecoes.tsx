import React, { useState, useEffect } from 'react';
import {
  getSecoes,
  saveEntity,
  moveToTrash,
  reorderEntities,
  KEYS,
  subscribeStorage
} from '../../services/storageService';
import { SecaoSite, ContentStatus } from '../../types/database';
import { Layers, Plus, Edit2, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, Check } from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';

export const AdminSecoes: React.FC = () => {
  const [secoes, setSecoes] = useState<SecaoSite[]>(getSecoes());
  const [editingItem, setEditingItem] = useState<Partial<SecaoSite> | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    return subscribeStorage(() => {
      setSecoes(getSecoes());
    });
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.titulo) return;

    const newSecao: SecaoSite = {
      id: editingItem.id || 'sec_' + Date.now(),
      titulo: editingItem.titulo,
      subtitulo: editingItem.subtitulo || '',
      descricao: editingItem.descricao || '',
      icone: editingItem.icone || 'Layers',
      ordem: editingItem.ordem || secoes.length + 1,
      status: editingItem.status || 'PUBLICADO',
      cor: editingItem.cor || '#3B82F6',
      layout: editingItem.layout || 'GRID',
      chaveSecao: editingItem.chaveSecao || 'secao_' + Date.now()
    };

    saveEntity(KEYS.SECOES, newSecao, 'Seção');
    setEditingItem(null);
  };

  const handleMove = (index: number, direction: 'UP' | 'DOWN') => {
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= secoes.length) return;

    const list = [...secoes];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    reorderEntities(KEYS.SECOES, list);
  };

  const handleToggleStatus = (item: SecaoSite) => {
    const nextStatus: ContentStatus = item.status === 'PUBLICADO' ? 'DESATIVADO' : 'PUBLICADO';
    saveEntity(KEYS.SECOES, { ...item, status: nextStatus }, 'Seção');
  };

  return (
    <div className="p-4 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <Layers className="h-6 w-6 text-amber-400" /> Gerenciamento de Seções do Site
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Crie, edite, ative/desative e reordene a estrutura da página principal.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingItem({
              titulo: '',
              subtitulo: '',
              descricao: '',
              status: 'PUBLICADO',
              layout: 'GRID',
              cor: '#3B82F6',
              icone: 'Layers'
            })
          }
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
        >
          <Plus className="h-4 w-4" /> Nova Seção
        </button>
      </div>

      {/* Editor Modal / Form */}
      {editingItem && (
        <form onSubmit={handleSave} className="rounded-2xl border border-amber-500/40 bg-slate-900 p-6 space-y-4 shadow-2xl">
          <h3 className="font-serif text-lg font-bold text-white">
            {editingItem.id ? 'Editar Seção' : 'Criar Nova Seção'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Título da Seção</label>
              <input
                type="text"
                required
                value={editingItem.titulo || ''}
                onChange={(e) => setEditingItem({ ...editingItem, titulo: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Subtítulo</label>
              <input
                type="text"
                value={editingItem.subtitulo || ''}
                onChange={(e) => setEditingItem({ ...editingItem, subtitulo: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-300">Descrição</label>
              <textarea
                value={editingItem.descricao || ''}
                onChange={(e) => setEditingItem({ ...editingItem, descricao: e.target.value })}
                rows={2}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Layout</label>
              <select
                value={editingItem.layout || 'GRID'}
                onChange={(e) => setEditingItem({ ...editingItem, layout: e.target.value as any })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="GRID">GRID DE CARDS</option>
                <option value="CAROUSEL">CARROSSEL SLIDER</option>
                <option value="LISTA">LISTA VERTICAL</option>
                <option value="DESTAQUE_HERO">DESTAQUE HERO</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Status</label>
              <select
                value={editingItem.status || 'PUBLICADO'}
                onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value as any })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="PUBLICADO">PUBLICADO</option>
                <option value="RASCUNHO">RASCUNHO</option>
                <option value="DESATIVADO">DESATIVADO</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400"
            >
              Salvar Seção
            </button>
          </div>
        </form>
      )}

      {/* Reorderable List */}
      <div className="space-y-3">
        {secoes.map((sec, index) => (
          <div
            key={sec.id}
            className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-4 transition hover:border-slate-700"
          >
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-1">
                <button
                  disabled={index === 0}
                  onClick={() => handleMove(index, 'UP')}
                  className="text-slate-500 hover:text-amber-400 disabled:opacity-20"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  disabled={index === secoes.length - 1}
                  onClick={() => handleMove(index, 'DOWN')}
                  className="text-slate-500 hover:text-amber-400 disabled:opacity-20"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>

              <span className="font-mono text-xs font-bold text-slate-500">
                #{sec.ordem}
              </span>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{sec.titulo}</h4>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                      sec.status === 'PUBLICADO'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {sec.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{sec.subtitulo}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggleStatus(sec)}
                title={sec.status === 'PUBLICADO' ? 'Desativar' : 'Ativar'}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
              >
                {sec.status === 'PUBLICADO' ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setEditingItem(sec)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-950 text-blue-400 hover:bg-blue-500/20"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setDeleteConfirmId(sec.id)}
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
        title="Mover Seção para a Lixeira?"
        message="A seção poderá ser restaurada a qualquer momento a partir da Lixeira do painel."
        onConfirm={() => {
          if (deleteConfirmId) {
            moveToTrash(KEYS.SECOES, deleteConfirmId, 'Seção');
            setDeleteConfirmId(null);
          }
        }}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
};
