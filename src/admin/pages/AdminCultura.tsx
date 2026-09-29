import React, { useState, useEffect } from 'react';
import { getCultura, saveEntity, moveToTrash, subscribeStorage, KEYS } from '../../services/storageService';
import { ItemCultura } from '../../types/database';
import { Sparkles, Plus, Search, Edit2, Trash2, Image, MapPin } from 'lucide-react';
import { MediaPickerModal } from '../../components/MediaPickerModal';

export const AdminCultura: React.FC = () => {
  const [items, setItems] = useState<ItemCultura[]>(getCultura());
  const [filterQuery, setFilterQuery] = useState('');
  const [editingItem, setEditingItem] = useState<Partial<ItemCultura> | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  useEffect(() => {
    return subscribeStorage(() => {
      setItems(getCultura());
    });
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.titulo) return;

    const toSave: ItemCultura = {
      id: editingItem.id || 'cult_' + Date.now(),
      titulo: editingItem.titulo,
      descricao: editingItem.descricao || '',
      imagem: editingItem.imagem || '/images/sp_hero_banner_1790701710531.jpg',
      galeria: editingItem.galeria || [],
      cidadeOuRegiao: editingItem.cidadeOuRegiao || 'Todo o Estado de SP',
      categoria: (editingItem.categoria as any) || 'manifestações culturais',
      destaque: editingItem.destaque || '',
      status: editingItem.status || 'PUBLICADO',
      ordem: editingItem.ordem || items.length + 1,
      dataCriacao: editingItem.dataCriacao || new Date().toISOString(),
      dataAtualizacao: new Date().toISOString()
    };

    saveEntity(KEYS.CULTURA, toSave, 'Cultura');
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja mover esta manifestação cultural para a lixeira?')) {
      moveToTrash(KEYS.CULTURA, id, 'Cultura');
    }
  };

  const filtered = items.filter(
    (i) =>
      i.titulo.toLowerCase().includes(filterQuery.toLowerCase()) ||
      i.cidadeOuRegiao.toLowerCase().includes(filterQuery.toLowerCase()) ||
      i.categoria.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-amber-400" /> Cultura & Manifestações Paulistas
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gerencie as manifestações culturais: Folia de Reis, Catira, Moda de Viola, Festas Tradicionais e expressões urbanas.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingItem({
              titulo: '',
              descricao: '',
              cidadeOuRegiao: 'Interior e Vale do Paraíba',
              categoria: 'cultura caipira',
              imagem: '/images/sp_hero_banner_1790701710531.jpg',
              destaque: 'Patrimônio Imaterial Paulista',
              status: 'PUBLICADO'
            })
          }
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition shadow-lg shadow-amber-500/20"
        >
          <Plus className="h-4 w-4" /> Nova Manifestação Cultural
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <input
          type="text"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder="Pesquisar por manifestação, região ou categoria..."
          className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
        />
      </div>

      {/* Editor Modal */}
      {editingItem && (
        <form onSubmit={handleSave} className="rounded-2xl border border-amber-500/40 bg-slate-900 p-6 space-y-4 shadow-2xl">
          <h3 className="font-serif text-lg font-bold text-white">
            {editingItem.id ? 'Editar Manifestação Cultural' : 'Cadastrar Nova Manifestação'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Título / Nome</label>
              <input
                type="text"
                required
                value={editingItem.titulo || ''}
                onChange={(e) => setEditingItem({ ...editingItem, titulo: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Categoria</label>
              <select
                value={editingItem.categoria || 'cultura caipira'}
                onChange={(e) => setEditingItem({ ...editingItem, categoria: e.target.value as any })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="música">Música</option>
                <option value="dança">Dança</option>
                <option value="festas">Festas Tradicionais</option>
                <option value="tradições">Tradições</option>
                <option value="literatura">Literatura</option>
                <option value="teatro">Teatro</option>
                <option value="arte urbana">Arte Urbana</option>
                <option value="cultura caipira">Cultura Caipira</option>
                <option value="cultura caiçara">Cultura Caiçara</option>
                <option value="manifestações culturais">Manifestações Culturais</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Cidade ou Região</label>
              <input
                type="text"
                required
                value={editingItem.cidadeOuRegiao || ''}
                onChange={(e) => setEditingItem({ ...editingItem, cidadeOuRegiao: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Destaque / Selo</label>
              <input
                type="text"
                value={editingItem.destaque || ''}
                onChange={(e) => setEditingItem({ ...editingItem, destaque: e.target.value })}
                placeholder="Ex: Tradição Centenária, Tombado pelo Condephaat"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-300">Descrição</label>
              <textarea
                rows={3}
                required
                value={editingItem.descricao || ''}
                onChange={(e) => setEditingItem({ ...editingItem, descricao: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-300">Imagem (URL da Web ou Galeria)</label>
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
              Salvar Manifestação
            </button>
          </div>
        </form>
      )}

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="h-40 w-full overflow-hidden rounded-xl bg-slate-950 border border-slate-800">
                <img src={item.imagem} alt={item.titulo} className="h-full w-full object-cover" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                  {item.categoria}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {item.cidadeOuRegiao}
                </span>
              </div>
              <h4 className="font-serif text-base font-bold text-white">{item.titulo}</h4>
              <p className="text-xs text-slate-300 line-clamp-2">{item.descricao}</p>
              {item.destaque && (
                <span className="inline-block text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {item.destaque}
                </span>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
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
