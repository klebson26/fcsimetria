import React, { useState, useEffect } from 'react';
import { getMenu, saveEntity, reorderEntities, KEYS, subscribeStorage } from '../../services/storageService';
import { MenuItem } from '../../types/database';
import { Menu as MenuIcon, Plus, Edit2, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';

export const AdminMenu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(getMenu());
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);

  useEffect(() => {
    return subscribeStorage(() => {
      setMenuItems(getMenu());
    });
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.label) return;

    const newItem: MenuItem = {
      id: editingItem.id || 'm_' + Date.now(),
      label: editingItem.label,
      path: editingItem.path || '/#',
      icone: editingItem.icone || 'Home',
      ordem: editingItem.ordem || menuItems.length + 1,
      status: editingItem.status || 'PUBLICADO'
    };

    saveEntity(KEYS.MENU, newItem, 'Item do Menu');
    setEditingItem(null);
  };

  const handleMove = (index: number, direction: 'UP' | 'DOWN') => {
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= menuItems.length) return;

    const list = [...menuItems];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    reorderEntities(KEYS.MENU, list);
  };

  return (
    <div className="p-4 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <MenuIcon className="h-6 w-6 text-amber-400" /> Menu do Site
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Altere os links de navegação, nomes e ordem do menu do cabeçalho sem mexer no código.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingItem({
              label: '',
              path: '/#',
              status: 'PUBLICADO'
            })
          }
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
        >
          <Plus className="h-4 w-4" /> Novo Item de Menu
        </button>
      </div>

      {editingItem && (
        <form onSubmit={handleSave} className="rounded-2xl border border-amber-500/40 bg-slate-900 p-6 space-y-4 shadow-2xl">
          <h3 className="font-serif text-lg font-bold text-white">
            {editingItem.id ? 'Editar Item do Menu' : 'Cadastrar Item do Menu'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Rótulo / Nome</label>
              <input
                type="text"
                required
                value={editingItem.label || ''}
                onChange={(e) => setEditingItem({ ...editingItem, label: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Caminho / Âncora (ex: /#cidades)</label>
              <input
                type="text"
                required
                value={editingItem.path || ''}
                onChange={(e) => setEditingItem({ ...editingItem, path: e.target.value })}
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
              Salvar Item
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {menuItems.map((item, index) => (
          <div key={item.id} className="flex items-center justify-between rounded-xl bg-slate-900 p-3 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <button
                  disabled={index === 0}
                  onClick={() => handleMove(index, 'UP')}
                  className="text-slate-500 hover:text-amber-400 disabled:opacity-20"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  disabled={index === menuItems.length - 1}
                  onClick={() => handleMove(index, 'DOWN')}
                  className="text-slate-500 hover:text-amber-400 disabled:opacity-20"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </div>

              <span className="font-mono text-xs font-bold text-slate-500">#{index + 1}</span>

              <div>
                <h4 className="text-xs font-bold text-white">{item.label}</h4>
                <p className="text-[10px] text-slate-400">{item.path}</p>
              </div>
            </div>

            <button
              onClick={() => setEditingItem(item)}
              className="p-1.5 text-blue-400 hover:bg-blue-500/20 rounded-lg"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
