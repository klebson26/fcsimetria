import React, { useState, useEffect } from 'react';
import { getAdmins, saveAdmin, deleteAdmin, subscribeStorage, getAuthSession } from '../../services/storageService';
import { AdminUser, UserRole } from '../../types/database';
import { Users, Plus, Edit2, Trash2, ShieldCheck, UserCheck } from 'lucide-react';

export const AdminUsuarios: React.FC = () => {
  const [admins, setAdmins] = useState<AdminUser[]>(getAdmins());
  const [editingUser, setEditingUser] = useState<Partial<AdminUser> | null>(null);
  const currentSession = getAuthSession();

  useEffect(() => {
    return subscribeStorage(() => {
      setAdmins(getAdmins());
    });
  }, []);

  const isSuperAdmin = currentSession?.role === 'SUPER_ADMIN';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser?.email || !editingUser?.nome) return;

    const newUser: AdminUser = {
      id: editingUser.id || 'adm_' + Date.now(),
      nome: editingUser.nome,
      email: editingUser.email,
      role: editingUser.role || 'EDITOR',
      ativo: editingUser.ativo !== undefined ? editingUser.ativo : true,
      dataCriacao: editingUser.dataCriacao || new Date().toISOString()
    };

    saveAdmin(newUser);
    setEditingUser(null);
  };

  return (
    <div className="p-4 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-amber-400" /> Usuários Administradores & Níveis de Acesso
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gerencie as contas de acesso (Super Admin com controle total ou Editor de conteúdos).
          </p>
        </div>

        {isSuperAdmin && (
          <button
            onClick={() =>
              setEditingUser({
                nome: '',
                email: '',
                role: 'EDITOR',
                ativo: true
              })
            }
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
          >
            <Plus className="h-4 w-4" /> Novo Administrador
          </button>
        )}
      </div>

      {!isSuperAdmin && (
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-300">
          Você está conectado como <strong>EDITOR</strong>. Apenas Super Admins podem alterar permissões e excluir administradores.
        </div>
      )}

      {editingUser && (
        <form onSubmit={handleSave} className="rounded-2xl border border-amber-500/40 bg-slate-900 p-6 space-y-4 shadow-2xl">
          <h3 className="font-serif text-lg font-bold text-white">
            {editingUser.id ? 'Editar Administrador' : 'Cadastrar Administrador'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Nome Completo</label>
              <input
                type="text"
                required
                value={editingUser.nome || ''}
                onChange={(e) => setEditingUser({ ...editingUser, nome: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">E-mail Institucional</label>
              <input
                type="email"
                required
                value={editingUser.email || ''}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Nível de Permissão</label>
              <select
                value={editingUser.role || 'EDITOR'}
                onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white font-bold"
              >
                <option value="SUPER_ADMIN">SUPER ADMIN (Acesso e exclusões totais)</option>
                <option value="EDITOR">EDITOR (Edição de conteúdos apenas)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setEditingUser(null)}
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

      <div className="space-y-3">
        {admins.map((adm) => (
          <div key={adm.id} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 font-bold">
                {adm.role === 'SUPER_ADMIN' ? <ShieldCheck className="h-5 w-5" /> : <UserCheck className="h-5 w-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{adm.nome}</h4>
                  <span className="rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.2 text-[10px] font-bold">
                    {adm.role}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{adm.email}</p>
              </div>
            </div>

            {isSuperAdmin && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingUser(adm)}
                  className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                {adm.id !== currentSession?.id && (
                  <button
                    onClick={() => deleteAdmin(adm.id)}
                    className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
