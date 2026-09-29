import React, { useState, useEffect } from 'react';
import { getHistoria, saveEntity, moveToTrash, subscribeStorage, KEYS } from '../../services/storageService';
import { EventoHistorico } from '../../types/database';
import { History, Plus, Search, Edit2, Trash2, Image, Calendar } from 'lucide-react';
import { MediaPickerModal } from '../../components/MediaPickerModal';

export const AdminHistoria: React.FC = () => {
  const [items, setItems] = useState<EventoHistorico[]>(getHistoria());
  const [filterQuery, setFilterQuery] = useState('');
  const [editingItem, setEditingItem] = useState<Partial<EventoHistorico> | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  useEffect(() => {
    return subscribeStorage(() => {
      setItems(getHistoria());
    });
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.titulo) return;

    const toSave: EventoHistorico = {
      id: editingItem.id || 'hist_' + Date.now(),
      titulo: editingItem.titulo,
      descricao: editingItem.descricao || '',
      periodo: editingItem.periodo || 'Século XX',
      dataOuAno: editingItem.dataOuAno || '1900',
      imagem: editingItem.imagem || '/src/assets/images/sp_hero_banner_1790701710531.jpg',
      galeria: editingItem.galeria || [],
      curiosidade: editingItem.curiosidade || '',
      status: editingItem.status || 'PUBLICADO',
      ordem: editingItem.ordem || items.length + 1,
      dataCriacao: editingItem.dataCriacao || new Date().toISOString(),
      dataAtualizacao: new Date().toISOString()
    };

    saveEntity(KEYS.HISTORIA, toSave, 'História');
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja mover este marco histórico para a lixeira?')) {
      moveToTrash(KEYS.HISTORIA, id, 'História');
    }
  };

  const filtered = items.filter(
    (i) =>
      i.titulo.toLowerCase().includes(filterQuery.toLowerCase()) ||
      i.dataOuAno.toLowerCase().includes(filterQuery.toLowerCase()) ||
      i.periodo.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <History className="h-6 w-6 text-amber-400" /> Linha do Tempo & História de SP
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gerencie os marcos decisivos da história paulista desde 1554 até a contemporaneidade.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingItem({
              titulo: '',
              descricao: '',
              periodo: 'Século XX',
              dataOuAno: '1932',
              imagem: '/src/assets/images/sp_hero_banner_1790701710531.jpg',
              curiosidade: '',
              status: 'PUBLICADO'
            })
          }
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition shadow-lg shadow-amber-500/20"
        >
          <Plus className="h-4 w-4" /> Novo Marco Histórico
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <input
          type="text"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder="Pesquisar por ano, século ou título do evento..."
          className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
        />
      </div>

      {/* Editor Modal */}
      {editingItem && (
        <form onSubmit={handleSave} className="rounded-2xl border border-amber-500/40 bg-slate-900 p-6 space-y-4 shadow-2xl">
          <h3 className="font-serif text-lg font-bold text-white">
            {editingItem.id ? 'Editar Marco Histórico' : 'Cadastrar Novo Marco Histórico'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300">Título do Marco Histórico</label>
              <input
                type="text"
                required
                value={editingItem.titulo || ''}
                onChange={(e) => setEditingItem({ ...editingItem, titulo: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Ano / Data</label>
              <input
                type="text"
                required
                value={editingItem.dataOuAno || ''}
                onChange={(e) => setEditingItem({ ...editingItem, dataOuAno: e.target.value })}
                placeholder="Ex: 1554, 1822, 1932"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Período / Século</label>
              <input
                type="text"
                value={editingItem.periodo || ''}
                onChange={(e) => setEditingItem({ ...editingItem, periodo: e.target.value })}
                placeholder="Ex: Século XVI, Século XIX, Século XX"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-300">Descrição do Acontecimento</label>
              <textarea
                rows={3}
                required
                value={editingItem.descricao || ''}
                onChange={(e) => setEditingItem({ ...editingItem, descricao: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-300">Imagem Ilustrativa (URL da Web ou Galeria)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={editingItem.imagem || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, imagem: e.target.value })}
                  placeholder="https://... ou caminho local"
                  className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowMediaPicker(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-slate-800 px-3 py-2 text-xs font-bold text-white hover:bg-slate-700"
                >
                  <Image className="h-4 w-4" /> Mídia
                </button>
              </div>

              {editingItem.imagem && (
                <div className="mt-2 h-28 w-44 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                  <img src={editingItem.imagem} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-300">Curiosidade Histórica</label>
              <textarea
                rows={2}
                value={editingItem.curiosidade || ''}
                onChange={(e) => setEditingItem({ ...editingItem, curiosidade: e.target.value })}
                placeholder="Ex: O local onde ocorreu o fato histórico hoje abriga o Museu tal..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="rounded-xl border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400"
            >
              Salvar Marco
            </button>
          </div>
        </form>
      )}

      {/* Events Timeline List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-mono font-bold text-sm">
                <span>{item.dataOuAno}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {item.periodo}
                </span>
                <h4 className="font-serif text-base font-bold text-white">{item.titulo}</h4>
                <p className="text-xs text-slate-300 max-w-2xl">{item.descricao}</p>
                {item.curiosidade && (
                  <p className="text-[11px] text-amber-300/80 font-mono">💡 {item.curiosidade}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                onClick={() => setEditingItem(item)}
                className="flex items-center gap-1 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-700"
              >
                <Edit2 className="h-3.5 w-3.5" /> Editar
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="flex items-center gap-1 rounded-lg bg-rose-600/20 border border-rose-500/30 px-3 py-1.5 text-xs font-bold text-rose-300 hover:bg-rose-600 hover:text-white"
              >
                <Trash2 className="h-3.5 w-3.5" /> Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {showMediaPicker && (
        <MediaPickerModal
          onClose={() => setShowMediaPicker(false)}
          onSelectImage={(url) => {
            if (editingItem) setEditingItem({ ...editingItem, imagem: url });
            setShowMediaPicker(false);
          }}
        />
      )}
    </div>
  );
};
