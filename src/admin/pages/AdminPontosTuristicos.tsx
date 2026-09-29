import React, { useState, useEffect } from 'react';
import {
  getPontosTuristicos,
  getCidades,
  saveEntity,
  moveToTrash,
  KEYS,
  subscribeStorage
} from '../../services/storageService';
import { PontoTuristico } from '../../types/database';
import { Camera, Plus, Edit2, Trash2, Copy, Search, Image } from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';
import { MediaPickerModal } from '../../components/MediaPickerModal';

export const AdminPontosTuristicos: React.FC = () => {
  const [pontos, setPontos] = useState<PontoTuristico[]>(getPontosTuristicos());
  const [cidades] = useState(getCidades());
  const [filterQuery, setFilterQuery] = useState('');

  const [editingItem, setEditingItem] = useState<Partial<PontoTuristico> | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  useEffect(() => {
    return subscribeStorage(() => {
      setPontos(getPontosTuristicos());
    });
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.titulo) return;

    const city = cidades.find((c) => c.id === editingItem.cidadeId) || cidades[0];

    const newPonto: PontoTuristico = {
      id: editingItem.id || 'pt_' + Date.now(),
      titulo: editingItem.titulo,
      descricao: editingItem.descricao || '',
      cidadeId: city?.id || 'cid_1',
      cidadeNome: city?.titulo || 'São Paulo',
      regiaoNome: city?.regiaoNome || 'Capital',
      categoria: editingItem.categoria || 'Turismo',
      imagemPrincipal: editingItem.imagemPrincipal || '/images/sp_hero_banner_1790701710531.jpg',
      galeria: editingItem.galeria || [],
      historia: editingItem.historia || '',
      curiosidade: editingItem.curiosidade || '',
      endereco: editingItem.endereco || '',
      siteExterno: editingItem.siteExterno || '',
      status: editingItem.status || 'PUBLICADO',
      ordem: editingItem.ordem || pontos.length + 1,
      dataCriacao: editingItem.dataCriacao || new Date().toISOString(),
      dataAtualizacao: new Date().toISOString()
    };

    saveEntity(KEYS.PONTOS, newPonto, 'Ponto Turístico');
    setEditingItem(null);
  };

  const filtered = pontos.filter(
    (p) =>
      p.titulo.toLowerCase().includes(filterQuery.toLowerCase()) ||
      p.cidadeNome.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <Camera className="h-6 w-6 text-amber-400" /> Pontos Turísticos de São Paulo
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Cadastre atrativos, museus, parques e monumentos das cidades paulistas.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingItem({
              titulo: '',
              descricao: '',
              cidadeId: cidades[0]?.id || 'cid_1',
              categoria: 'Turismo',
              imagemPrincipal: '/images/sp_hero_banner_1790701710531.jpg',
              status: 'PUBLICADO'
            })
          }
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
        >
          <Plus className="h-4 w-4" /> Novo Ponto Turístico
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <input
          type="text"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder="Pesquisar ponto turística por nome ou cidade..."
          className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
        />
      </div>

      {editingItem && (
        <form onSubmit={handleSave} className="rounded-2xl border border-amber-500/40 bg-slate-900 p-6 space-y-4 shadow-2xl">
          <h3 className="font-serif text-lg font-bold text-white">
            {editingItem.id ? 'Editar Ponto Turístico' : 'Cadastrar Ponto Turístico'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Nome do Ponto</label>
              <input
                type="text"
                required
                value={editingItem.titulo || ''}
                onChange={(e) => setEditingItem({ ...editingItem, titulo: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Cidade</label>
              <select
                value={editingItem.cidadeId || cidades[0]?.id}
                onChange={(e) => setEditingItem({ ...editingItem, cidadeId: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
              >
                {cidades.map((c) => (
                  <option key={c.id} value={c.id}>{c.titulo}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Categoria</label>
              <select
                value={editingItem.categoria || 'Turismo'}
                onChange={(e) => setEditingItem({ ...editingItem, categoria: e.target.value as any })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="História">História</option>
                <option value="Cultura">Cultura</option>
                <option value="Natureza">Natureza</option>
                <option value="Turismo">Turismo</option>
                <option value="Arquitetura">Arquitetura</option>
                <option value="Lazer">Lazer</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Imagem Principal</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editingItem.imagemPrincipal || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, imagemPrincipal: e.target.value })}
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
              Salvar Ponto
            </button>
          </div>
        </form>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((ponto) => (
          <div
            key={ponto.id}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="h-36 w-full overflow-hidden rounded-xl bg-slate-950">
                <img src={ponto.imagemPrincipal} alt={ponto.titulo} className="h-full w-full object-cover" />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-blue-400">{ponto.cidadeNome}</span>
                <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300">{ponto.categoria}</span>
              </div>

              <h3 className="font-serif text-base font-bold text-white">{ponto.titulo}</h3>
              <p className="text-xs text-slate-400 line-clamp-2">{ponto.descricao}</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setEditingItem(ponto)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-950 text-blue-400 hover:bg-blue-500/20"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setDeleteConfirmId(ponto.id)}
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
        title="Mover Ponto Turístico para a Lixeira?"
        message="Você poderá restaurar o ponto turístico posteriormente."
        onConfirm={() => {
          if (deleteConfirmId) {
            moveToTrash(KEYS.PONTOS, deleteConfirmId, 'Ponto Turístico');
            setDeleteConfirmId(null);
          }
        }}
        onCancel={() => setDeleteConfirmId(null)}
      />

      {showMediaPicker && (
        <MediaPickerModal
          onClose={() => setShowMediaPicker(false)}
          onSelectImage={(url) => {
            if (editingItem) setEditingItem({ ...editingItem, imagemPrincipal: url });
          }}
        />
      )}
    </div>
  );
};
