import React, { useState } from 'react';
import { getQuiz, getIdentidade } from '../services/storageService';
import { PerguntaQuiz } from '../types/database';
import { Award, CheckCircle, XCircle, RotateCcw, HelpCircle, Sparkles, Printer } from 'lucide-react';
import { FadeIn } from '../components/FadeIn';
import confetti from 'canvas-confetti';

export const QuizView: React.FC = () => {
  const quizList = getQuiz().filter((q) => q.status === 'PUBLICADO');
  const identidade = getIdentidade();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [answers, setAnswers] = useState<{ [index: number]: 'A' | 'B' | 'C' | 'D' }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [studentName, setStudentName] = useState('');
  const [showCertificate, setShowCertificate] = useState(false);

  if (quizList.length === 0) {
    return (
      <div className="py-16 text-center text-slate-400">
        Nenhuma pergunta do quiz cadastrada no momento.
      </div>
    );
  }

  const currentQuestion = quizList[currentIndex];
  const isLastQuestion = currentIndex === quizList.length - 1;

  const handleSelectOption = (opt: 'A' | 'B' | 'C' | 'D') => {
    if (isSubmitted) return;
    setSelectedOption(opt);
  };

  const handleConfirmAnswer = () => {
    if (!selectedOption) return;

    const newAnswers = { ...answers, [currentIndex]: selectedOption };
    setAnswers(newAnswers);

    if (selectedOption === currentQuestion.respostaCorreta) {
      setScore((prev) => prev + 1);
    }

    if (isLastQuestion) {
      setIsSubmitted(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      setSelectedOption(null);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswers({});
    setIsSubmitted(false);
    setScore(0);
    setShowCertificate(false);
  };

  return (
    <FadeIn direction="up" durationMs={600} className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header Badge */}
      <div className="mb-8 text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/30 px-4 py-1 text-xs font-bold uppercase tracking-widest text-amber-400">
          <Award className="h-4 w-4" />
          DESAFIO CULTURAL
        </div>
        <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">
          Quiz da Feira Cultural — Estado de SP
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Responda às perguntas sobre história, geografia, culinária e atrativos paulistas para garantir seu certificado de participação oficial!
        </p>
      </div>

      {!isSubmitted ? (
        <div
          key={currentIndex}
          className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl animate-fade-in"
        >
          {/* Progress Header */}
          <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
            <span className="text-xs font-mono font-bold text-amber-400">
              PERGUNTA {currentIndex + 1} DE {quizList.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">
                Dificuldade:
              </span>
              <span className="rounded-md bg-blue-500/20 border border-blue-500/30 px-2 py-0.5 text-[11px] font-bold text-blue-300">
                {currentQuestion.dificuldade}
              </span>
            </div>
          </div>

          {/* Question Text */}
          <div className="mb-8 space-y-4">
            <h3 className="font-serif text-xl font-bold text-white sm:text-2xl leading-snug">
              {currentQuestion.pergunta}
            </h3>

            {currentQuestion.imagem && (
              <div className="h-48 w-full overflow-hidden rounded-2xl border border-slate-800 animate-fade-in">
                <img
                  src={currentQuestion.imagem}
                  alt={currentQuestion.pergunta}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Options Grid */}
          <div className="space-y-3 mb-8">
            {[
              { key: 'A', text: currentQuestion.alternativaA },
              { key: 'B', text: currentQuestion.alternativaB },
              { key: 'C', text: currentQuestion.alternativaC },
              { key: 'D', text: currentQuestion.alternativaD }
            ].map((opt) => {
              const isSelected = selectedOption === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => handleSelectOption(opt.key as any)}
                  className={`w-full flex items-center justify-between rounded-2xl border p-4 text-left transition-all duration-200 ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/10 text-white shadow-lg shadow-amber-500/10 scale-[1.01]'
                      : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-bold text-xs transition ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {opt.key}
                    </span>
                    <span className="text-sm font-medium">{opt.text}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-6">
            <span className="text-xs text-slate-500">
              Pontuação atual: {score} acerto(s)
            </span>
            <button
              disabled={!selectedOption}
              onClick={handleConfirmAnswer}
              className="rounded-xl bg-amber-500 px-6 py-3 text-xs font-bold text-slate-950 hover:bg-amber-400 disabled:opacity-40 transition shadow-lg shadow-amber-500/20 active:scale-95"
            >
              {isLastQuestion ? 'Finalizar Quiz' : 'Próxima Pergunta →'}
            </button>
          </div>
        </div>
      ) : (
        /* Result Screen */
        <div className="rounded-3xl border border-amber-500/40 bg-slate-900/90 p-8 text-center shadow-2xl space-y-6 animate-fade-in-up">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-fade-in-scale">
            <Award className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-3xl font-bold text-white">
              Quiz Concluído com Sucesso!
            </h3>
            <p className="text-lg text-amber-300 font-bold">
              Você acertou {score} de {quizList.length} perguntas (
              {Math.round((score / quizList.length) * 100)}%)
            </p>
          </div>

          {/* Certificate Input */}
          {!showCertificate ? (
            <div className="max-w-md mx-auto space-y-4 pt-4 border-t border-slate-800 animate-fade-in">
              <p className="text-xs text-slate-300">
                Digite seu nome completo para gerar seu Certificado de Participação da Feira Cultural:
              </p>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Seu nome completo..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none transition"
              />
              <button
                disabled={!studentName.trim()}
                onClick={() => setShowCertificate(true)}
                className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 text-xs font-bold text-slate-950 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 transition shadow-lg active:scale-95"
              >
                Gerar Certificado Oficial
              </button>
            </div>
          ) : (
            /* Printable Certificate Frame */
            <div className="p-8 rounded-2xl border-4 border-amber-500/60 bg-slate-950 text-slate-100 shadow-2xl relative my-6 text-center space-y-4 animate-fade-in-scale">
              <div className="flex items-center justify-between border-b border-amber-500/30 pb-4">
                <span className="text-xs font-serif font-bold text-amber-400">
                  {identidade.nomeColegio}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  ED. 2026 · CERTIFICADO
                </span>
              </div>

              <div className="py-6 space-y-3">
                <div className="h-16 w-16 mx-auto overflow-hidden rounded-full border-2 border-amber-500/60 shadow-xl shadow-amber-500/20 p-0.5 bg-slate-900">
                  <img
                    src={identidade.logoUrl || '/logo-simetria.jpg'}
                    alt={identidade.nomeColegio}
                    className="h-full w-full object-contain rounded-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/logo-simetria.jpg';
                    }}
                  />
                </div>
                <h4 className="font-serif text-2xl font-bold text-amber-300 uppercase tracking-wider">
                  CERTIFICADO DE CONHECIMENTO CULTURAL
                </h4>
                <p className="text-xs text-slate-400">Certificamos que</p>
                <p className="font-serif text-3xl font-bold text-white underline decoration-amber-500 decoration-2">
                  {studentName}
                </p>
                <p className="text-xs text-slate-300 max-w-lg mx-auto pt-2">
                  Concluiu com êxito a avaliação interativa da {identidade.nomeFeira} sobre a História, Cultura, Gastronomia e Patrimônio do Estado de São Paulo com aproveitamento de {Math.round((score / quizList.length) * 100)}%.
                </p>
              </div>

              <div className="border-t border-amber-500/30 pt-4 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Data: {new Date().toLocaleDateString('pt-BR')}</span>
                <span>Código Validador: SIM-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            {showCertificate && (
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition active:scale-95"
              >
                <Printer className="h-4 w-4" /> Imprimir Certificado
              </button>
            )}
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700 transition active:scale-95"
            >
              <RotateCcw className="h-4 w-4" /> Tentar Novamente
            </button>
          </div>
        </div>
      )}
    </FadeIn>
  );
};
