import React, { useState, useEffect } from 'react';
import { getLiberdadeContent, saveLiberdade, subscribeStorage } from '../../services/storageService';
import { LiberdadeContent } from '../../types/database';
import { Compass, Image, Save, Plus, Trash2, CheckCircle2, Sparkles, MapPin } from 'lucide-react';
import { MediaPickerModal } from '../../components/MediaPickerModal';

export const AdminLiberdade: React.FC = () => {
  const [liberdade, setLiberdade] = useState<LiberdadeContent>(getLiberdadeContent());
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<'principal' | 'galeria'>('principal');
  const [newCuriosity, setNewCuriosity] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    return subscribeStorage(() => {
      setLiberdade(getLiberdadeContent());
    });
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveLiberdade(liberdade);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddCuriosity = () => {
    if (!newCuriosity.trim()) return;
    setLiberdade({
      ...liberdade,
      curiosidades: [...(liberdade.curiosidades || []), newCuriosity.trim()]
    });
    setNewCuriosity('');
  };

  const handleRemoveCuriosity = (index: number) => {
    setLiberdade({
      ...liberdade,
      curiosidades: (liberdade.curiosidades || []).filter((_, i) => i !== index)
    });
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <Compass className="h-6 w-6 text-purple-400" /> Especial Bairro da Liberdade
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure informações, história, festivais, atrações e fotos do Bairro da Liberdade.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-xs font-bold text-emerald-400">
            <CheckCircle2 className="h-4 w-4" /> Alterações Salvas!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Main Information Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <h3 className="font-serif text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sparkles className="h-4 w-4 text-purple-400" /> Informações Principais
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300">Título da Seção</label>
              <input
                type="text"
                required
                value={liberdade.titulo}
                onChange={(e) => setLiberdade({ ...liberdade, titulo: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300">Descrição Geral</label>
              <textarea
                rows={3}
                required
                value={liberdade.descricao}
                onChange={(e) => setLiberdade({ ...liberdade, descricao: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* Main Image with URL option */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300">Imagem Principal (URL ou Galeria)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={liberdade.imagemPrincipal}
                  onChange={(e) => setLiberdade({ ...liberdade, imagemPrincipal: e.target.value })}
                  placeholder="https://... ou caminho de imagem"
                  className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPickerTarget('principal');
                    setShowMediaPicker(true);
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-slate-800 px-3 py-2 text-xs font-bold text-white hover:bg-slate-700"
                >
                  <Image className="h-4 w-4" /> Mídia
                </button>
              </div>

              {liberdade.imagemPrincipal && (
                <div className="mt-2 h-36 w-full max-w-sm rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                  <img
                    src={liberdade.imagemPrincipal}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Culture, Festivals & Commerce */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <h3 className="font-serif text-base font-bold text-white border-b border-slate-800 pb-3">
            História, Cultura e Festivais
          </h3>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">História da Imigração</label>
              <textarea
                rows={3}
                value={liberdade.historia || ''}
                onChange={(e) => setLiberdade({ ...liberdade, historia: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Manifestações Culturais e Tradições</label>
              <textarea
                rows={2}
                value={liberdade.cultura || ''}
                onChange={(e) => setLiberdade({ ...liberdade, cultura: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Festivais Tradicionais (Tanabata Matsuri, Hana Matsuri, etc.)</label>
              <input
                type="text"
                value={liberdade.festivais || ''}
                onChange={(e) => setLiberdade({ ...liberdade, festivais: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Gastronomia Típica Oriental</label>
              <input
                type="text"
                value={liberdade.gastronomia || ''}
                onChange={(e) => setLiberdade({ ...liberdade, gastronomia: e.target.value })}
                placeholder="Ex: Lamen, Guioza, Pastel de Feira, Doces de Feijão Azuki"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Arquitetura & Símbolos (Torii, Suzuran, etc.)</label>
              <input
                type="text"
                value={liberdade.arquitetura || ''}
                onChange={(e) => setLiberdade({ ...liberdade, arquitetura: e.target.value })}
                placeholder="Ex: Portal Torii vermelho na Rua Galvão Bueno e luminárias Suzuran"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Curiosidades */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <h3 className="font-serif text-base font-bold text-white border-b border-slate-800 pb-3">
            Curiosidades do Bairro
          </h3>

          <div className="space-y-2">
            {(liberdade.curiosidades || []).map((cur, idx) => (
              <div key={idx} className="flex items-center gap-2 rounded-xl bg-slate-950 p-2.5 border border-slate-800">
                <span className="text-xs text-slate-300 flex-1">{cur}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveCuriosity(idx)}
                  className="text-rose-400 hover:text-rose-300 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <input
              type="text"
              value={newCuriosity}
              onChange={(e) => setNewCuriosity(e.target.value)}
              placeholder="Digite uma curiosidade sobre a Liberdade..."
              className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddCuriosity}
              className="flex items-center gap-1 rounded-xl bg-purple-600 px-3 py-2 text-xs font-bold text-white hover:bg-purple-500"
            >
              <Plus className="h-4 w-4" /> Adicionar
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-xs font-bold text-white hover:bg-purple-500 transition shadow-lg shadow-purple-600/20"
          >
            <Save className="h-4 w-4" /> Salvar Conteúdo da Liberdade
          </button>
        </div>
      </form>

      {/* Media Picker Modal */}
      {showMediaPicker && (
        <MediaPickerModal
          onClose={() => setShowMediaPicker(false)}
          onSelectImage={(url) => {
            if (pickerTarget === 'principal') {
              setLiberdade({ ...liberdade, imagemPrincipal: url });
            }
            setShowMediaPicker(false);
          }}
        />
      )}
    </div>
  );
};
