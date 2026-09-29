import React, { useState, useEffect } from 'react';
import {
  getMercadaoProdutos,
  saveEntity,
  moveToTrash,
  KEYS,
  subscribeStorage
} from '../../services/storageService';
import { MercadaoProduto } from '../../types/database';
import { ShoppingBag, Plus, Edit2, Trash2, Search, Image } from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';
import { MediaPickerModal } from '../../components/MediaPickerModal';

export const AdminMercadao: React.FC = () => {
  const [produtos, setProdutos] = useState<MercadaoProduto[]>(getMercadaoProdutos());
  const [filterQuery, setFilterQuery] = useState('');
  const [editingItem, setEditingItem] = useState<Partial<MercadaoProduto> | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  useEffect(() => {
    return subscribeStorage(() => {
      setProdutos(getMercadaoProdutos());
    });
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.titulo) return;

    const newProd: MercadaoProduto = {
      id: editingItem.id || 'mer_' + Date.now(),
      titulo: editingItem.titulo,
      descricao: editingItem.descricao || '',
      categoria: editingItem.categoria || 'Produtos regionais',
      imagem: editingItem.imagem || '/src/assets/images/mercadao_sp_1790701738265.jpg',
      curiosidade: editingItem.curiosidade || '',
      origem: editingItem.origem || 'Mercadão de SP',
      utilizacao: editingItem.utilizacao || '',
      status: editingItem.status || 'PUBLICADO',
      ordem: editingItem.ordem || produtos.length + 1,
      dataCriacao: editingItem.dataCriacao || new Date().toISOString(),
      dataAtualizacao: new Date().toISOString()
    };

    saveEntity(KEYS.MERCADAO, newProd, 'Produto Mercadão');
    setEditingItem(null);
  };

  const filtered = produtos.filter(
    (p) =>
      p.titulo.toLowerCase().includes(filterQuery.toLowerCase()) ||
      p.categoria.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-amber-400" /> Mercadão de São Paulo — Produtos
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Cadastre e edite os produtos, lanches, frutas e iguarias do Mercadão.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingItem({
              titulo: '',
              descricao: '',
              categoria: 'Produtos regionais',
              imagem: '/src/assets/images/mercadao_sp_1790701738265.jpg',
              status: 'PUBLICADO'
            })
          }
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
        >
          <Plus className="h-4 w-4" /> Novo Produto
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <input
          type="text"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder="Pesquisar produto ou categoria..."
          className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
        />
      </div>

      {editingItem && (
        <form onSubmit={handleSave} className="rounded-2xl border border-amber-500/40 bg-slate-900 p-6 space-y-4 shadow-2xl">
          <h3 className="font-serif text-lg font-bold text-white">
            {editingItem.id ? 'Editar Produto' : 'Cadastrar Produto'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Nome do Produto</label>
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
                value={editingItem.categoria || 'Produtos regionais'}
                onChange={(e) => setEditingItem({ ...editingItem, categoria: e.target.value as any })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="Frutas">Frutas</option>
                <option value="Temperos">Temperos</option>
                <option value="Queijos">Queijos</option>
                <option value="Doces">Doces</option>
                <option value="Carnes">Carnes</option>
                <option value="Bebidas">Bebidas</option>
                <option value="Produtos regionais">Produtos regionais</option>
                <option value="Lanches">Lanches</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Imagem</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editingItem.imagem || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, imagem: e.target.value })}
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

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Origem</label>
              <input
                type="text"
                value={editingItem.origem || ''}
                onChange={(e) => setEditingItem({ ...editingItem, origem: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-300">Descrição</label>
              <textarea
                value={editingItem.descricao || ''}
                onChange={(e) => setEditingItem({ ...editingItem, descricao: e.target.value })}
                rows={2}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
              />
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

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="h-36 w-full overflow-hidden rounded-xl bg-slate-950">
                <img src={item.imagem} alt={item.titulo} className="h-full w-full object-cover" />
              </div>
              <span className="text-[10px] font-bold uppercase text-amber-400">{item.categoria}</span>
              <h3 className="font-serif text-base font-bold text-white">{item.titulo}</h3>
              <p className="text-xs text-slate-400 line-clamp-2">{item.descricao}</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setEditingItem(item)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-950 text-blue-400 hover:bg-blue-500/20"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setDeleteConfirmId(item.id)}
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
        title="Mover Produto para a Lixeira?"
        message="O produto poderá ser restaurado a qualquer momento."
        onConfirm={() => {
          if (deleteConfirmId) {
            moveToTrash(KEYS.MERCADAO, deleteConfirmId, 'Produto Mercadão');
            setDeleteConfirmId(null);
          }
        }}
        onCancel={() => setDeleteConfirmId(null)}
      />

      {showMediaPicker && (
        <MediaPickerModal
          onClose={() => setShowMediaPicker(false)}
          onSelectImage={(url) => {
            if (editingItem) setEditingItem({ ...editingItem, imagem: url });
          }}
        />
      )}
    </div>
  );
};
