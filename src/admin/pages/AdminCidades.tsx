import React, { useState, useEffect } from 'react';
import {
  getCidades,
  getRegioes,
  saveEntity,
  moveToTrash,
  KEYS,
  subscribeStorage
} from '../../services/storageService';
import { Cidade, Regiao } from '../../types/database';
import { Building2, Plus, Edit2, Trash2, Copy, Search, Image, MapPin } from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';
import { MediaPickerModal } from '../../components/MediaPickerModal';

export const AdminCidades: React.FC = () => {
  const [cidades, setCidades] = useState<Cidade[]>(getCidades());
  const [regioes, setRegioes] = useState<Regiao[]>(getRegioes());
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedRegiaoId, setSelectedRegiaoId] = useState<string>('ALL');

  const [editingItem, setEditingItem] = useState<Partial<Cidade> | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  useEffect(() => {
    return subscribeStorage(() => {
      setCidades(getCidades());
      setRegioes(getRegioes());
    });
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.titulo) return;

    const customRegiaoNome = (editingItem.regiaoNome || '').trim();
    let reg = regioes.find(
      (r) => r.id === editingItem.regiaoId || r.nome.toLowerCase() === customRegiaoNome.toLowerCase()
    );

    if (!reg && customRegiaoNome) {
      const newReg: Regiao = {
        id: 'reg_' + Date.now(),
        nome: customRegiaoNome,
        descricao: `Região ${customRegiaoNome} do Estado de São Paulo`,
        corHex: '#f59e0b'
      };
      saveEntity(KEYS.REGIOES, newReg, 'Região');
      reg = newReg;
    } else if (!reg) {
      reg = regioes[0] || { id: 'reg_1', nome: customRegiaoNome || 'Capital & RMC', descricao: '', corHex: '#f59e0b' };
    }

    const newCidade: Cidade = {
      id: editingItem.id || 'cid_' + Date.now(),
      titulo: editingItem.titulo,
      descricao: editingItem.descricao || '',
      regiaoId: reg.id,
      regiaoNome: customRegiaoNome || reg.nome,
      imagemPrincipal: editingItem.imagemPrincipal || '/images/sp_hero_banner_1790701710531.jpg',
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
    const matchesQuery =
      c.titulo.toLowerCase().includes(filterQuery.toLowerCase()) ||
      c.descricao.toLowerCase().includes(filterQuery.toLowerCase()) ||
      c.regiaoNome.toLowerCase().includes(filterQuery.toLowerCase());
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
            Cadastre, edite e configure informações completas das cidades e regiões do Estado de SP.
          </p>
        </div>

        <button
          onClick={() => {
            const firstReg = regioes[0];
            setEditingItem({
              titulo: '',
              descricao: '',
              regiaoId: firstReg?.id || 'reg_1',
              regiaoNome: firstReg?.nome || 'Capital & RMC',
              imagemPrincipal: '/images/sp_hero_banner_1790701710531.jpg',
              status: 'PUBLICADO',
              populacao: '',
              distanciaCapital: '100 km',
              posicaoMapa: { x: 50, y: 50 },
              curiosidades: ['']
            });
          }}
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
            placeholder="Pesquisar cidade por nome, região ou descrição..."
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
          <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
            <Edit2 className="h-5 w-5 text-amber-400" />
            {editingItem.id ? 'Editar Cidade e Região' : 'Cadastrar Nova Cidade'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Nome da Cidade</label>
              <input
                type="text"
                required
                value={editingItem.titulo || ''}
                onChange={(e) => setEditingItem({ ...editingItem, titulo: e.target.value })}
                placeholder="Ex: Santos, Campinas, Campos do Jordão..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Região Selector and Custom Field */}
            <div className="space-y-1 sm:col-span-1">
              <label className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> Região Paulista
              </label>
              <div className="space-y-2">
                <select
                  value={editingItem.regiaoId || ''}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    if (selectedId === 'CUSTOM') {
                      setEditingItem({ ...editingItem, regiaoId: '', regiaoNome: '' });
                    } else {
                      const found = regioes.find((r) => r.id === selectedId);
                      if (found) {
                        setEditingItem({
                          ...editingItem,
                          regiaoId: found.id,
                          regiaoNome: found.nome
                        });
                      }
                    }
                  }}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="">-- Selecionar Região Existente --</option>
                  {regioes.map((r) => (
                    <option key={r.id} value={r.id}>{r.nome}</option>
                  ))}
                  <option value="CUSTOM">+ Digitar Nova Região Customizada</option>
                </select>

                <input
                  type="text"
                  required
                  placeholder="Ou digite/edite o nome da região..."
                  value={editingItem.regiaoNome || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    const matchingReg = regioes.find((r) => r.nome.toLowerCase() === val.trim().toLowerCase());
                    setEditingItem({
                      ...editingItem,
                      regiaoNome: val,
                      regiaoId: matchingReg ? matchingReg.id : ''
                    });
                  }}
                  className="w-full rounded-xl border border-amber-500/40 bg-slate-950 px-3 py-2 text-xs text-amber-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 font-medium"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Você pode selecionar uma região existente no menu ou digitar um novo nome livremente para cadastrar uma nova região.
              </p>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-300">Descrição Curta</label>
              <textarea
                value={editingItem.descricao || ''}
                onChange={(e) => setEditingItem({ ...editingItem, descricao: e.target.value })}
                rows={2}
                placeholder="Resumo sobre a cidade para os cartões de exibição..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Imagem Principal</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editingItem.imagemPrincipal || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, imagemPrincipal: e.target.value })}
                  className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
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
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-300">História da Cidade</label>
              <textarea
                value={editingItem.historia || ''}
                onChange={(e) => setEditingItem({ ...editingItem, historia: e.target.value })}
                rows={3}
                placeholder="A história da cidade, fundação e fatos importantes..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
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
              className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
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
            className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4 flex flex-col justify-between hover:border-slate-700 transition"
          >
            <div className="space-y-3">
              <div className="h-40 w-full overflow-hidden rounded-xl bg-slate-950 relative">
                <img src={city.imagemPrincipal} alt={city.titulo} className="h-full w-full object-cover" />
                <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] font-bold text-amber-400 flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {city.regiaoNome}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {city.distanciaCapital || 'Estado de SP'}
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
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-amber-400 transition"
              >
                <Copy className="h-3.5 w-3.5" /> Duplicar
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingItem(city)}
                  title="Editar Cidade e Região"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-950 text-blue-400 hover:bg-blue-500/20 transition"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(city.id)}
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
