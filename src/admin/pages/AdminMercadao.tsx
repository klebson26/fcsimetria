import React, { useState, useEffect } from 'react';
import {
  getMercadaoProdutos,
  getMercadaoHeader,
  saveMercadaoHeader,
  saveEntity,
  moveToTrash,
  KEYS,
  subscribeStorage
} from '../../services/storageService';
import { MercadaoProduto, MercadaoHeader } from '../../types/database';
import {
  ShoppingBag,
  Plus,
  Edit2,
  Trash2,
  Search,
  Image as ImageIcon,
  Building2,
  Utensils,
  Check,
  Info
} from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';
import { MediaPickerModal } from '../../components/MediaPickerModal';

export const AdminMercadao: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'HEADER' | 'PRODUTOS'>('HEADER');
  const [headerInfo, setHeaderInfo] = useState<MercadaoHeader>(getMercadaoHeader());
  const [produtos, setProdutos] = useState<MercadaoProduto[]>(getMercadaoProdutos());
  const [filterQuery, setFilterQuery] = useState('');

  const [editingItem, setEditingItem] = useState<Partial<MercadaoProduto> | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState<
    'HEADER_IMG' | 'PRODUCT_IMG' | null
  >(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    return subscribeStorage(() => {
      setProdutos(getMercadaoProdutos());
      setHeaderInfo(getMercadaoHeader());
    });
  }, []);

  const handleSaveHeader = (e: React.FormEvent) => {
    e.preventDefault();
    saveMercadaoHeader(headerInfo);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSaveProduto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.titulo) return;

    const newProd: MercadaoProduto = {
      id: editingItem.id || 'mer_' + Date.now(),
      titulo: editingItem.titulo,
      descricao: editingItem.descricao || '',
      categoria: editingItem.categoria || 'Produtos regionais',
      imagem: editingItem.imagem || 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=800&auto=format&fit=crop',
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
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const filteredProdutos = produtos.filter(
    (p) =>
      p.titulo.toLowerCase().includes(filterQuery.toLowerCase()) ||
      p.categoria.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-amber-400" /> Especial Mercadão Municipal de São Paulo
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gerencie distintamente a foto principal da arquitetura do prédio e as fotos das comidas e iguarias típicas.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveSubTab('HEADER')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeSubTab === 'HEADER'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="h-3.5 w-3.5" /> Imagem do Prédio & História
          </button>
          <button
            onClick={() => setActiveSubTab('PRODUTOS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeSubTab === 'PRODUTOS'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Utensils className="h-3.5 w-3.5" /> Comidas & Produtos ({produtos.length})
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 p-3 text-xs text-emerald-300 font-bold">
          <Check className="h-4 w-4" /> Alterações salvas com sucesso!
        </div>
      )}

      {/* TAB 1: ARCHITECTURE HEADER & BUILDING IMAGE */}
      {activeSubTab === 'HEADER' && (
        <form onSubmit={handleSaveHeader} className="rounded-2xl border border-amber-500/40 bg-slate-900 p-6 space-y-5 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="h-5 w-5 text-amber-400" /> Imagem Principal & Arquitetura do Prédio do Mercadão
            </h3>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
              CABEÇALHO DA SEÇÃO
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Image Preview & Selector */}
            <div className="lg:col-span-5 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Foto Principal do Edifício / Vitrais do Mercadão:
              </label>
              <div className="relative h-56 w-full overflow-hidden rounded-2xl border-2 border-amber-500/40 bg-slate-950 shadow-xl group">
                <img
                  src={headerInfo.imagemPrincipal || '/images/mercadao_sp_1790701738265.jpg'}
                  alt="Foto do Mercadão"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setShowMediaPicker('HEADER_IMG')}
                  className="absolute bottom-3 right-3 bg-slate-950/90 border border-amber-500/40 text-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-amber-500 hover:text-slate-950 transition flex items-center gap-1.5 shadow-lg"
                >
                  <ImageIcon className="h-4 w-4" /> Trocar Foto do Prédio
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">URL da Foto do Prédio:</label>
                <input
                  type="text"
                  value={headerInfo.imagemPrincipal || ''}
                  onChange={(e) => setHeaderInfo({ ...headerInfo, imagemPrincipal: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Title & Texts */}
            <div className="lg:col-span-7 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Título Principal da Seção</label>
                <input
                  type="text"
                  required
                  value={headerInfo.titulo || ''}
                  onChange={(e) => setHeaderInfo({ ...headerInfo, titulo: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Subtítulo / Resumo da Arquitetura</label>
                <input
                  type="text"
                  value={headerInfo.subtitulo || ''}
                  onChange={(e) => setHeaderInfo({ ...headerInfo, subtitulo: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">História Completa do Edifício & Vitrais</label>
                <textarea
                  value={headerInfo.historia || ''}
                  onChange={(e) => setHeaderInfo({ ...headerInfo, historia: e.target.value })}
                  rows={5}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 leading-relaxed"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              type="submit"
              className="rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition shadow-lg shadow-amber-500/20"
            >
              Salvar Imagem e Texto do Prédio
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: TYPICAL FOODS & PRODUCTS */}
      {activeSubTab === 'PRODUTOS' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Pesquisar produto ou prato do Mercadão..."
                className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <button
              onClick={() =>
                setEditingItem({
                  titulo: '',
                  descricao: '',
                  categoria: 'Lanches',
                  imagem: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=800&auto=format&fit=crop',
                  status: 'PUBLICADO'
                })
              }
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition shrink-0"
            >
              <Plus className="h-4 w-4" /> Cadastrar Nova Comida / Produto
            </button>
          </div>

          {/* Product Editor Modal */}
          {editingItem && (
            <form onSubmit={handleSaveProduto} className="rounded-2xl border border-amber-500/40 bg-slate-900 p-6 space-y-4 shadow-2xl animate-fade-in">
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Utensils className="h-5 w-5 text-amber-400" />
                {editingItem.id ? `Editar Prato/Produto: ${editingItem.titulo}` : 'Cadastrar Novo Prato / Comida Típica'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Nome da Comida / Produto *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.titulo || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, titulo: e.target.value })}
                    placeholder="Ex: Sanduíche de Mortadela, Pastel de Bacalhau, Pitaia..."
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Categoria</label>
                  <select
                    value={editingItem.categoria || 'Lanches'}
                    onChange={(e) => setEditingItem({ ...editingItem, categoria: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
                  >
                    <option value="Lanches">Lanches</option>
                    <option value="Frutas">Frutas</option>
                    <option value="Temperos">Temperos</option>
                    <option value="Queijos">Queijos</option>
                    <option value="Doces">Doces</option>
                    <option value="Carnes">Carnes</option>
                    <option value="Bebidas">Bebidas</option>
                    <option value="Produtos regionais">Produtos regionais</option>
                  </select>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-amber-400">Foto Específica desta Comida / Prato</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editingItem.imagem || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, imagem: e.target.value })}
                      placeholder="URL ou foto do prato..."
                      className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowMediaPicker('PRODUCT_IMG')}
                      className="flex items-center gap-1.5 rounded-xl bg-slate-800 px-3 py-2 text-xs font-bold text-white hover:bg-slate-700"
                    >
                      <ImageIcon className="h-4 w-4" /> Escolher Foto
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Esta foto será exibida no cartão do prato/comida, diferenciada da foto da fachada do prédio.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Origem / Box Tradicional</label>
                  <input
                    type="text"
                    value={editingItem.origem || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, origem: e.target.value })}
                    placeholder="Ex: Bar do Mané, Hocca Bar, Banca de Frutas..."
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
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
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Descrição Curta da Comida</label>
                  <textarea
                    value={editingItem.descricao || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, descricao: e.target.value })}
                    rows={2}
                    placeholder="Ingredientes, peso, sabor e tradição do prato..."
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                    <Info className="h-3.5 w-3.5" /> Curiosidade sobre a Comida
                  </label>
                  <input
                    type="text"
                    value={editingItem.curiosidade || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, curiosidade: e.target.value })}
                    placeholder="Ex: Criado em 1933 quando um cliente pediu recheio mais caprichado..."
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-amber-200 focus:outline-none focus:border-amber-400"
                  />
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
                  className="rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
                >
                  Salvar Comida / Produto
                </button>
              </div>
            </form>
          )}

          {/* Grid of Food Products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProdutos.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-3 flex flex-col justify-between hover:border-amber-500/40 transition shadow-xl"
              >
                <div className="space-y-3">
                  <div className="h-44 w-full overflow-hidden rounded-xl bg-slate-950 relative">
                    <img src={item.imagem} alt={item.titulo} className="h-full w-full object-cover" />
                    <span className="absolute top-2 left-2 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] font-bold text-amber-400">
                      {item.categoria}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-base font-bold text-white">{item.titulo}</h3>
                    <p className="text-xs text-slate-300 line-clamp-2 mt-1">{item.descricao}</p>
                    {item.curiosidade && (
                      <p className="text-[11px] font-mono text-amber-300/80 mt-1 line-clamp-2">
                        💡 {item.curiosidade}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <span className="text-[10px] text-slate-400 font-mono">{item.origem || 'Mercadão'}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingItem(item)}
                      title="Editar foto e dados desta comida"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-950 text-blue-400 hover:bg-blue-500/20 transition"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(item.id)}
                      title="Excluir"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-950 text-rose-400 hover:bg-rose-500/20 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteConfirmId)}
        title="Mover Produto para a Lixeira?"
        message="O produto poderá ser restaurado posteriormente na lixeira do sistema."
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
          onClose={() => setShowMediaPicker(null)}
          onSelectImage={(url) => {
            if (showMediaPicker === 'HEADER_IMG') {
              setHeaderInfo({ ...headerInfo, imagemPrincipal: url });
            } else if (showMediaPicker === 'PRODUCT_IMG' && editingItem) {
              setEditingItem({ ...editingItem, imagem: url });
            }
          }}
        />
      )}
    </div>
  );
};
