import React, { useState, useEffect } from 'react';
import {
  getCidades,
  getRegioes,
  saveEntity,
  moveToTrash,
  KEYS,
  subscribeStorage
} from '../../services/storageService';
import { Cidade, ContentStatus } from '../../types/database';
import { Building2, Plus, Edit2, Trash2, Copy, Search, Eye, Image } from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';
import { MediaPickerModal } from '../../components/MediaPickerModal';

export const AdminCidades: React.FC = () => {
  const [cidades, setCidades] = useState<Cidade[]>(getCidades());
  const [regioes] = useState(getRegioes());
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedRegiaoId, setSelectedRegiaoId] = useState<string>('ALL');

  const [editingItem, setEditingItem] = useState<Partial<Cidade> | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  useEffect(() => {
    return subscribeStorage(() => {
      setCidades(getCidades());
    });
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.titulo) return;

    const reg = regioes.find((r) => r.id === editingItem.regiaoId) || regioes[0];

    const newCidade: Cidade = {
      id: editingItem.id || 'cid_' + Date.now(),
      titulo: editingItem.titulo,
      descricao: editingItem.descricao || '',
      regiaoId: reg.id,
      regiaoNome: reg.nome,
      imagemPrincipal: editingItem.imagemPrincipal || '/src/assets/images/sp_hero_banner_1790701710531.jpg',
      galeria: editingItem.galeria || [],
      historia: editingItem.historia || '',
      cultura: editingItem.cultura || '',
      gastronomia: editingItem.gastronomia || '',
      turismo: editingItem.turismo || '',
      curiosidades: editingItem.curiosidades || [],
      populacao: editingItem.populacao || '',
      distanciaCapital: editingItem.distanciaCapital || '0 km',
      posicaoMapa: editingItem.posicaoMapa || { x: 50, y: 50 },
      status: editingItem.status || 'PUBLICADO',
      ordem: editingItem.ordem || cidades.length + 1,
      dataCriacao: editingItem.dataCriacao || new Date().toISOString(),
      dataAtualizacao: new Date().toISOString()
    };

    saveEntity(KEYS.CIDADES, newCidade, 'Cidade');
    setEditingItem(null);
  };

  const handleDuplicate = (cidade: Cidade) => {
    const duplicated: Cidade = {
      ...cidade,
      id: 'cid_' + Date.now(),
      titulo: `${cidade.titulo} (Cópia)`,
      status: 'RASCUNHO',
      dataCriacao: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString()
    };
    saveEntity(KEYS.CIDADES, duplicated, 'Cidade');
  };

  const filtered = cidades.filter((c) => {
    const matchesQuery = c.titulo.toLowerCase().includes(filterQuery.toLowerCase()) || c.descricao.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesRegiao = selectedRegiaoId === 'ALL' || c.regiaoId === selectedRegiaoId;
    return matchesQuery && matchesRegiao;
  });

  return (
    <div className="p-4 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <Building2 className="h-6 w-6 text-amber-400" /> Gerenciamento de Cidades Paulistas
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Cadastre, edite e configure informações completas das cidades do Estado de SP.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingItem({
              titulo: '',
              descricao: '',
              regiaoId: regioes[0]?.id || 'reg_1',
              imagemPrincipal: '/src/assets/images/sp_hero_banner_1790701710531.jpg',
              status: 'PUBLICADO',
              populacao: '',
              distanciaCapital: '100 km',
              posicaoMapa: { x: 50, y: 50 },
              curiosidades: ['']
            })
          }
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
        >
          <Plus className="h-4 w-4" /> Cadastrar Nova Cidade
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Pesquisar cidade por nome ou descrição..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
          />
        </div>

        <select
          value={selectedRegiaoId}
          onChange={(e) => setSelectedRegiaoId(e.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
        >
          <option value="ALL">Todas as Regiões</option>
          {regioes.map((r) => (
            <option key={r.id} value={r.id}>{r.nome}</option>
          ))}
        </select>
      </div>

      {/* Editor Modal Form */}
      {editingItem && (
        <form onSubmit={handleSave} className="rounded-2xl border border-amber-500/40 bg-slate-900 p-6 space-y-4 shadow-2xl">
          <h3 className="font-serif text-lg font-bold text-white">
            {editingItem.id ? 'Editar Cidade' : 'Cadastrar Nova Cidade'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Nome da Cidade</label>
              <input
                type="text"
                required
                value={editingItem.titulo || ''}
                onChange={(e) => setEditingItem({ ...editingItem, titulo: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Região Paulista</label>
              <select
                value={editingItem.regiaoId || regioes[0]?.id}
                onChange={(e) => setEditingItem({ ...editingItem, regiaoId: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
              >
                {regioes.map((r) => (
                  <option key={r.id} value={r.id}>{r.nome}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-300">Descrição Curta</label>
              <textarea
                value={editingItem.descricao || ''}
                onChange={(e) => setEditingItem({ ...editingItem, descricao: e.target.value })}
                rows={2}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
              />
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
                  className="flex items-center gap-1.5 rounded-xl bg-slate-800 px-3 py-2 text-xs font-bold text-white hover:bg-slate-700"
                >
                  <Image className="h-4 w-4" /> Mídia
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">População Estimada</label>
              <input
                type="text"
                value={editingItem.populacao || ''}
                onChange={(e) => setEditingItem({ ...editingItem, populacao: e.target.value })}
                placeholder="Ex: 500.000 hab"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-300">História da Cidade</label>
              <textarea
                value={editingItem.historia || ''}
                onChange={(e) => setEditingItem({ ...editingItem, historia: e.target.value })}
                rows={3}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Status de Publicação</label>
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
              className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs font-semibold text-slate-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400"
            >
              Salvar Cidade
            </button>
          </div>
        </form>
      )}

      {/* Cities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((city) => (
          <div
            key={city.id}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-40 w-full overflow-hidden rounded-xl bg-slate-950">
                <img src={city.imagemPrincipal} alt={city.titulo} className="h-full w-full object-cover" />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                    {city.regiaoNome}
                  </span>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                      city.status === 'PUBLICADO'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {city.status}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-white mt-1">{city.titulo}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">{city.descricao}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                onClick={() => handleDuplicate(city)}
                title="Duplicar"
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-amber-400"
              >
                <Copy className="h-3.5 w-3.5" /> Duplicar
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingItem(city)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-950 text-blue-400 hover:bg-blue-500/20"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(city.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-950 text-rose-400 hover:bg-rose-500/20"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={Boolean(deleteConfirmId)}
        title="Mover Cidade para a Lixeira?"
        message="A cidade poderá ser restaurada posteriormente na lixeira do sistema."
        onConfirm={() => {
          if (deleteConfirmId) {
            moveToTrash(KEYS.CIDADES, deleteConfirmId, 'Cidade');
            setDeleteConfirmId(null);
          }
        }}
        onCancel={() => setDeleteConfirmId(null)}
      />

      {showMediaPicker && (
        <MediaPickerModal
          onClose={() => setShowMediaPicker(false)}
          onSelectImage={(url) => {
            if (editingItem) {
              setEditingItem({ ...editingItem, imagemPrincipal: url });
            }
          }}
        />
      )}
    </div>
  );
};
