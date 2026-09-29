import React, { useState, useEffect } from 'react';
import { getLogs, subscribeStorage } from '../../services/storageService';
import { LogAlteracao } from '../../types/database';
import { FileText, Clock, User, Shield } from 'lucide-react';

export const AdminHistorico: React.FC = () => {
  const [logs, setLogs] = useState<LogAlteracao[]>(getLogs());

  useEffect(() => {
    return subscribeStorage(() => {
      setLogs(getLogs());
    });
  }, []);

  return (
    <div className="p-4 sm:p-8 space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
          <FileText className="h-6 w-6 text-amber-400" /> Histórico de Alterações (Audit Logs)
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Registro completo de todas as ações realizadas pelos administradores e editores no painel.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-2xl">
        <div className="divide-y divide-slate-800">
          {logs.map((log) => (
            <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-950/50 transition">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{log.acao}</h4>
                  <p className="text-xs text-slate-300 font-semibold">{log.conteudoAfetado}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Realizado por: <strong className="text-slate-400">{log.usuarioNome}</strong> ({log.usuarioEmail})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-right shrink-0">
                <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                  {log.tipoEntidade}
                </span>
                <span className="text-xs font-mono text-slate-500">
                  {new Date(log.dataHora).toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
