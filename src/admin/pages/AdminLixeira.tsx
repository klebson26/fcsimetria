import React, { useState, useEffect } from 'react';
import {
  getAllTrashItems,
  restoreFromTrash,
  permanentDelete,
  subscribeStorage
} from '../../services/storageService';
import { Trash2, RotateCcw, AlertTriangle } from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';

export const AdminLixeira: React.FC = () => {
  const [trashItems, setTrashItems] = useState(getAllTrashItems());
  const [purgeConfirmId, setPurgeConfirmId] = useState<{ id: string; key: string; tipo: string } | null>(null);

  useEffect(() => {
    return subscribeStorage(() => {
      setTrashItems(getAllTrashItems());
    });
  }, []);

  const handleRestore = (item: { id: string; key: string; tipo: string }) => {
    restoreFromTrash(item.key, item.id, item.tipo);
  };

  return (
    <div className="p-4 sm:p-8 space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
          <Trash2 className="h-6 w-6 text-rose-400" /> Lixeira do Sistema
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Conteúdos excluídos recentemente são armazenados aqui. Restaure-os ou exclua definitivamente.
        </p>
      </div>

      {trashItems.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center text-slate-500 text-sm">
          A lixeira está completamente vazia no momento.
        </div>
      ) : (
        <div className="space-y-3">
          {trashItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 text-[10px] font-bold uppercase">
                    {item.tipo}
                  </span>
                  <h4 className="text-sm font-bold text-white">{item.titulo}</h4>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Excluído em: {new Date(item.dataAtualizacao).toLocaleString('pt-BR')}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRestore(item)}
                  className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Restaurar
                </button>
                <button
                  onClick={() => setPurgeConfirmId(item)}
                  className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Excluir Definitivo
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(purgeConfirmId)}
        title="EXCLUIR PERMANENTEMENTE?"
        message="Esta ação é IRREVERSÍVEL. O conteúdo será apagado definitivamente do banco de dados."
        confirmText="Excluir Definitivamente"
        isDanger={true}
        onConfirm={() => {
          if (purgeConfirmId) {
            permanentDelete(purgeConfirmId.key, purgeConfirmId.id, purgeConfirmId.tipo);
            setPurgeConfirmId(null);
          }
        }}
        onCancel={() => setPurgeConfirmId(null)}
      />
    </div>
  );
};
