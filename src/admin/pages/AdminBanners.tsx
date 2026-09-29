import React, { useState, useEffect } from 'react';
import { getBanners, saveEntity, KEYS, subscribeStorage } from '../../services/storageService';
import { Banner } from '../../types/database';
import { Sliders, Plus, Edit2, Trash2 } from 'lucide-react';

export const AdminBanners: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>(getBanners());
  const [editingItem, setEditingItem] = useState<Partial<Banner> | null>(null);

  useEffect(() => {
    return subscribeStorage(() => {
      setBanners(getBanners());
    });
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.titulo) return;

    const newBanner: Banner = {
      id: editingItem.id || 'b_' + Date.now(),
      titulo: editingItem.titulo,
      subtitulo: editingItem.subtitulo || '',
      imagem: editingItem.imagem || '/src/assets/images/sp_hero_banner_1790701710531.jpg',
      botaoTexto: editingItem.botaoTexto || 'EXPLORAR',
      botaoLink: editingItem.botaoLink || '#mapa',
      status: editingItem.status || 'PUBLICADO',
      ordem: editingItem.ordem || banners.length + 1
    };

    saveEntity(KEYS.BANNERS, newBanner, 'Banner');
    setEditingItem(null);
  };

  return (
    <div className="p-4 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <Sliders className="h-6 w-6 text-amber-400" /> Banners Promocionais
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gerencie os banners e chamadas de ação da feira cultural.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingItem({
              titulo: '',
              subtitulo: '',
              imagem: '/src/assets/images/sp_hero_banner_1790701710531.jpg',
              botaoTexto: 'EXPLORAR',
              botaoLink: '#mapa',
              status: 'PUBLICADO'
            })
          }
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
        >
          <Plus className="h-4 w-4" /> Novo Banner
        </button>
      </div>

      {editingItem && (
        <form onSubmit={handleSave} className="rounded-2xl border border-amber-500/40 bg-slate-900 p-6 space-y-4 shadow-2xl">
          <h3 className="font-serif text-lg font-bold text-white">
            {editingItem.id ? 'Editar Banner' : 'Cadastrar Banner'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Título do Banner</label>
              <input
                type="text"
                required
                value={editingItem.titulo || ''}
                onChange={(e) => setEditingItem({ ...editingItem, titulo: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Subtítulo</label>
              <input
                type="text"
                value={editingItem.subtitulo || ''}
                onChange={(e) => setEditingItem({ ...editingItem, subtitulo: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
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
              Salvar Banner
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {banners.map((b) => (
          <div key={b.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-4 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-white">{b.titulo}</h4>
              <p className="text-xs text-slate-400">{b.subtitulo}</p>
            </div>
            <button
              onClick={() => setEditingItem(b)}
              className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
