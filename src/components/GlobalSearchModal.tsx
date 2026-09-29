import React, { useState } from 'react';
import {
  getCidades,
  getPontosTuristicos,
  getMercadaoProdutos,
  getCulinaria,
  getArtesanato,
  getCuriosidades,
  getHistoria
} from '../services/storageService';
import { Search, X, ArrowRight, MapPin, Utensils, Palette, HelpCircle, History, Building2 } from 'lucide-react';

interface GlobalSearchModalProps {
  onClose: () => void;
  onSelectResult: (item: any, category: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  onClose,
  onSelectResult
}) => {
  const [query, setQuery] = useState('');

  const cidades = getCidades();
  const pontos = getPontosTuristicos();
  const mercadao = getMercadaoProdutos();
  const culinaria = getCulinaria();
  const artesanato = getArtesanato();
  const curiosidades = getCuriosidades();
  const historia = getHistoria();

  const term = query.trim().toLowerCase();

  const resultsCidades = term ? cidades.filter((c) => c.titulo.toLowerCase().includes(term) || c.descricao.toLowerCase().includes(term) || c.regiaoNome.toLowerCase().includes(term)) : [];
  const resultsPontos = term ? pontos.filter((p) => p.titulo.toLowerCase().includes(term) || p.descricao.toLowerCase().includes(term) || p.cidadeNome.toLowerCase().includes(term)) : [];
  const resultsMercadao = term ? mercadao.filter((m) => m.titulo.toLowerCase().includes(term) || m.descricao.toLowerCase().includes(term) || m.categoria.toLowerCase().includes(term)) : [];
  const resultsCulinaria = term ? culinaria.filter((c) => c.titulo.toLowerCase().includes(term) || c.descricao.toLowerCase().includes(term) || c.categoria.toLowerCase().includes(term)) : [];
  const resultsArtesanato = term ? artesanato.filter((a) => a.titulo.toLowerCase().includes(term) || a.descricao.toLowerCase().includes(term) || a.material.toLowerCase().includes(term)) : [];
  const resultsCuriosidades = term ? curiosidades.filter((c) => c.pergunta.toLowerCase().includes(term) || c.resposta.toLowerCase().includes(term)) : [];
  const resultsHistoria = term ? historia.filter((h) => h.titulo.toLowerCase().includes(term) || h.descricao.toLowerCase().includes(term)) : [];

  const totalResults =
    resultsCidades.length +
    resultsPontos.length +
    resultsMercadao.length +
    resultsCulinaria.length +
    resultsArtesanato.length +
    resultsCuriosidades.length +
    resultsHistoria.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/80 p-4 pt-16 sm:pt-24 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-scale">
        {/* Input Bar */}
        <div className="flex items-center border-b border-slate-800 px-6 py-4">
          <Search className="h-6 w-6 text-amber-400 shrink-0 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar cidades, pratos, curiosidades, história de SP..."
            autoFocus
            className="w-full bg-transparent text-lg font-medium text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="ml-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-6 space-y-6">
          {!term && (
            <div className="py-12 text-center text-slate-500 text-sm">
              Digite uma palavra-chave acima para encontrar qualquer conteúdo do site.
            </div>
          )}

          {term && totalResults === 0 && (
            <div className="py-12 text-center text-slate-400 text-sm">
              Nenhum conteúdo encontrado para "<span className="text-white font-semibold">{query}</span>".
            </div>
          )}

          {/* Cidades */}
          {resultsCidades.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400">
                <Building2 className="h-4 w-4" /> Cidades ({resultsCidades.length})
              </div>
              <div className="grid grid-cols-1 gap-2">
                {resultsCidades.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectResult(item, 'cidade');
                      onClose();
                    }}
                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3 hover:border-amber-500/40 cursor-pointer transition"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.titulo}</h4>
                      <p className="text-xs text-slate-400">{item.regiaoNome}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pontos Turísticos */}
          {resultsPontos.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-400">
                <MapPin className="h-4 w-4" /> Pontos Turísticos ({resultsPontos.length})
              </div>
              <div className="grid grid-cols-1 gap-2">
                {resultsPontos.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectResult(item, 'ponto');
                      onClose();
                    }}
                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3 hover:border-blue-500/40 cursor-pointer transition"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.titulo}</h4>
                      <p className="text-xs text-slate-400">{item.cidadeNome} · {item.categoria}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Culinária */}
          {resultsCulinaria.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-400">
                <Utensils className="h-4 w-4" /> Gastronomia ({resultsCulinaria.length})
              </div>
              <div className="grid grid-cols-1 gap-2">
                {resultsCulinaria.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectResult(item, 'culinaria');
                      onClose();
                    }}
                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3 hover:border-orange-500/40 cursor-pointer transition"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.titulo}</h4>
                      <p className="text-xs text-slate-400">{item.categoria} · {item.cidadeOuRegiao}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Curiosidades */}
          {resultsCuriosidades.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-purple-400">
                <HelpCircle className="h-4 w-4" /> Curiosidades ({resultsCuriosidades.length})
              </div>
              <div className="grid grid-cols-1 gap-2">
                {resultsCuriosidades.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectResult(item, 'curiosidade');
                      onClose();
                    }}
                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3 hover:border-purple-500/40 cursor-pointer transition"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.pergunta}</h4>
                      <p className="text-xs text-slate-400 line-clamp-1">{item.resposta}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-500" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
