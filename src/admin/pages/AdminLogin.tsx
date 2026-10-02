import React, { useState } from 'react';
import { getAdmins, setAuthSession, getIdentidade } from '../../services/storageService';
import { Lock, Mail, Key, AlertCircle, ArrowLeft } from 'lucide-react';

interface AdminLoginProps {
  onSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState(false);

  const identidade = getIdentidade();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const admins = getAdmins();
    const user = admins.find((a) => a.email.toLowerCase() === email.trim().toLowerCase());

    if (!user) {
      setErrorMsg('Credenciais incorretas ou usuário não cadastrado.');
      return;
    }

    if (!user.ativo) {
      setErrorMsg('Esta conta administrativa está desativada no momento.');
      return;
    }

    if (!password.trim()) {
      setErrorMsg('Por favor, digite sua senha.');
      return;
    }

    setAuthSession({
      ...user,
      ultimoAcesso: new Date().toISOString()
    });
    onSuccess();
  };

  const handleRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoverySuccess(true);
  };

  const handleBackToPublic = () => {
    window.location.hash = '';
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      {/* Background Graphic Accents */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Logo Banner */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-slate-900 border-2 border-amber-500/50 p-1 shadow-2xl shadow-amber-500/20 overflow-hidden">
            <img
              src={identidade.logoUrl || '/logo-simetria.jpg'}
              alt={identidade.nomeColegio}
              className="h-full w-full object-contain rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/logo-simetria.jpg';
              }}
            />
          </div>
          <h1 className="font-serif text-2xl font-bold text-white uppercase tracking-wider">
            Painel Administrativo
          </h1>
          <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest">
            {identidade.nomeColegio} · Feira Cultural {identidade.anoFeira || '2026'}
          </p>
        </div>

        {/* Login Form Box */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl space-y-6">
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">E-mail Institucional</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu-email@simetria.edu.br"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Senha de Acesso</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500 flex items-center gap-1">
                <Lock className="h-3 w-3 text-slate-400" />
                <span>Acesso Seguro Restrito</span>
              </span>
              <button
                type="button"
                onClick={() => setShowRecoveryModal(true)}
                className="text-amber-400 hover:underline font-semibold"
              >
                Esqueceu a senha?
              </button>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 text-xs font-bold text-slate-950 hover:from-amber-400 hover:to-amber-500 transition shadow-lg shadow-amber-500/20 uppercase tracking-wider"
            >
              Entrar no Painel
            </button>
          </form>

          {/* Return to public fair website button */}
          <div className="pt-2 text-center border-t border-slate-800/80">
            <button
              type="button"
              onClick={handleBackToPublic}
              className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-amber-400" />
              <span>Voltar ao Portal Público da Feira</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recovery Modal */}
      {showRecoveryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <h3 className="font-serif text-lg font-bold text-white">Recuperação de Senha</h3>
            {!recoverySuccess ? (
              <form onSubmit={handleRecovery} className="space-y-3">
                <p className="text-xs text-slate-400">
                  Informe o seu e-mail cadastrado para receber as instruções de redefinição de senha:
                </p>
                <input
                  type="email"
                  required
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  placeholder="seu-email@simetria.edu.br"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRecoveryModal(false)}
                    className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400"
                  >
                    Enviar Instruções
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-emerald-400 font-semibold">
                  Instruções de redefinição enviadas com sucesso para {recoveryEmail}!
                </p>
                <button
                  onClick={() => {
                    setShowRecoveryModal(false);
                    setRecoverySuccess(false);
                  }}
                  className="w-full rounded-xl bg-amber-500 py-2 text-xs font-bold text-slate-950"
                >
                  Voltar ao Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
