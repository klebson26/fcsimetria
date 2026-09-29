import React, { useState, useEffect } from 'react';
import { getQuiz, saveEntity, KEYS, subscribeStorage } from '../../services/storageService';
import { PerguntaQuiz } from '../../types/database';
import { Award, Plus, Edit2, Trash2, Search } from 'lucide-react';

export const AdminQuiz: React.FC = () => {
  const [quizList, setQuizList] = useState<PerguntaQuiz[]>(getQuiz());
  const [filterQuery, setFilterQuery] = useState('');
  const [editingItem, setEditingItem] = useState<Partial<PerguntaQuiz> | null>(null);

  useEffect(() => {
    return subscribeStorage(() => {
      setQuizList(getQuiz());
    });
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.pergunta) return;

    const newQ: PerguntaQuiz = {
      id: editingItem.id || 'qz_' + Date.now(),
      pergunta: editingItem.pergunta,
      alternativaA: editingItem.alternativaA || '',
      alternativaB: editingItem.alternativaB || '',
      alternativaC: editingItem.alternativaC || '',
      alternativaD: editingItem.alternativaD || '',
      respostaCorreta: editingItem.respostaCorreta || 'A',
      explicacao: editingItem.explicacao || '',
      categoria: editingItem.categoria || 'História',
      dificuldade: editingItem.dificuldade || 'Médio',
      status: editingItem.status || 'PUBLICADO',
      ordem: editingItem.ordem || quizList.length + 1
    };

    saveEntity(KEYS.QUIZ, newQ as any, 'Pergunta do Quiz');
    setEditingItem(null);
  };

  const filtered = quizList.filter((q) => q.pergunta.toLowerCase().includes(filterQuery.toLowerCase()));

  return (
    <div className="p-4 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <Award className="h-6 w-6 text-amber-400" /> Quiz da Feira Cultural
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Cadastre perguntas, alternativas A/B/C/D, resposta correta e explicação pedagógica.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingItem({
              pergunta: '',
              alternativaA: '',
              alternativaB: '',
              alternativaC: '',
              alternativaD: '',
              respostaCorreta: 'A',
              explicacao: '',
              categoria: 'História',
              dificuldade: 'Médio',
              status: 'PUBLICADO'
            })
          }
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
        >
          <Plus className="h-4 w-4" /> Nova Pergunta
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <input
          type="text"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder="Pesquisar pergunta..."
          className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
        />
      </div>

      {editingItem && (
        <form onSubmit={handleSave} className="rounded-2xl border border-amber-500/40 bg-slate-900 p-6 space-y-4 shadow-2xl">
          <h3 className="font-serif text-lg font-bold text-white">
            {editingItem.id ? 'Editar Pergunta' : 'Nova Pergunta'}
          </h3>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Enunciado da Pergunta</label>
              <textarea
                required
                value={editingItem.pergunta || ''}
                onChange={(e) => setEditingItem({ ...editingItem, pergunta: e.target.value })}
                rows={2}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300">Alternativa A</label>
                <input
                  type="text"
                  required
                  value={editingItem.alternativaA || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, alternativaA: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300">Alternativa B</label>
                <input
                  type="text"
                  required
                  value={editingItem.alternativaB || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, alternativaB: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300">Alternativa C</label>
                <input
                  type="text"
                  required
                  value={editingItem.alternativaC || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, alternativaC: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300">Alternativa D</label>
                <input
                  type="text"
                  required
                  value={editingItem.alternativaD || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, alternativaD: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300">Resposta Correta</label>
                <select
                  value={editingItem.respostaCorreta || 'A'}
                  onChange={(e) => setEditingItem({ ...editingItem, respostaCorreta: e.target.value as any })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white font-bold"
                >
                  <option value="A">Alternativa A</option>
                  <option value="B">Alternativa B</option>
                  <option value="C">Alternativa C</option>
                  <option value="D">Alternativa D</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Categoria</label>
                <select
                  value={editingItem.categoria || 'História'}
                  onChange={(e) => setEditingItem({ ...editingItem, categoria: e.target.value as any })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                >
                  <option value="História">História</option>
                  <option value="Cultura">Cultura</option>
                  <option value="Gastronomia">Gastronomia</option>
                  <option value="Turismo">Turismo</option>
                  <option value="Cidades">Cidades</option>
                  <option value="Natureza">Natureza</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Dificuldade</label>
                <select
                  value={editingItem.dificuldade || 'Médio'}
                  onChange={(e) => setEditingItem({ ...editingItem, dificuldade: e.target.value as any })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                >
                  <option value="Fácil">Fácil</option>
                  <option value="Médio">Médio</option>
                  <option value="Difícil">Difícil</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Explicação Didática</label>
              <textarea
                value={editingItem.explicacao || ''}
                onChange={(e) => setEditingItem({ ...editingItem, explicacao: e.target.value })}
                rows={2}
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
              Salvar Pergunta
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {filtered.map((q, idx) => (
          <div key={q.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400">#0{idx + 1} · {q.categoria} ({q.dificuldade})</span>
              <span className="font-bold text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                Correta: {q.respostaCorreta}
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">{q.pergunta}</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 pt-1">
              <span className={q.respostaCorreta === 'A' ? 'font-bold text-emerald-400' : ''}>A: {q.alternativaA}</span>
              <span className={q.respostaCorreta === 'B' ? 'font-bold text-emerald-400' : ''}>B: {q.alternativaB}</span>
              <span className={q.respostaCorreta === 'C' ? 'font-bold text-emerald-400' : ''}>C: {q.alternativaC}</span>
              <span className={q.respostaCorreta === 'D' ? 'font-bold text-emerald-400' : ''}>D: {q.alternativaD}</span>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setEditingItem(q)}
                className="p-1.5 text-blue-400 hover:bg-blue-500/20 rounded-lg text-xs font-bold flex items-center gap-1"
              >
                <Edit2 className="h-3.5 w-3.5" /> Editar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
