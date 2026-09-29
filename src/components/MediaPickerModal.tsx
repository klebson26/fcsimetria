import React, { useState } from 'react';
import { getMedia, saveMediaItem } from '../services/storageService';
import { MediaItem } from '../types/database';
import { Image, Upload, Check, X, Search, Plus } from 'lucide-react';

interface MediaPickerModalProps {
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  onClose,
  onSelectImage
}) => {
  const [mediaList, setMediaList] = useState<MediaItem[]>(getMedia());
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState('');
  const [customUrlInput, setCustomUrlInput] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const url = evt.target?.result as string;
        const newMedia: MediaItem = {
          id: 'med_' + Date.now(),
          nome: file.name.replace(/\.[^/.]+$/, ''),
          url: url,
          tamanhoKb: Math.round(file.size / 1024),
          formato: file.name.split('.').pop()?.toUpperCase() as any || 'JPG',
          categoria: 'Geral',
          textoAlternativo: file.name,
          dataUpload: new Date().toISOString()
        };
        saveMediaItem(newMedia);
        setMediaList(getMedia());
        setSelectedUrl(url);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmCustomUrl = () => {
    if (customUrlInput.trim()) {
      onSelectImage(customUrlInput.trim());
      onClose();
    }
  };

  const filtered = mediaList.filter(
    (m) =>
      m.nome.toLowerCase().includes(filterQuery.toLowerCase()) ||
      m.categoria.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-2">
            <Image className="h-5 w-5 text-amber-400" />
            <h3 className="font-serif text-lg font-bold text-white">
              Biblioteca de Mídia & Imagens
            </h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 border-b border-slate-800 px-6 py-3 bg-slate-950/50">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filtrar por nome ou categoria..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <label className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 cursor-pointer transition">
            <Upload className="h-4 w-4" />
            <span>Fazer Upload</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Custom URL Input option */}
        <div className="px-6 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={customUrlInput}
            onChange={(e) => setCustomUrlInput(e.target.value)}
            placeholder="Ou cole o link direto da imagem (URL https://...)"
            className="flex-1 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={handleConfirmCustomUrl}
            className="rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-700 transition"
          >
            Usar URL
          </button>
        </div>

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filtered.map((item) => {
            const isSelected = selectedUrl === item.url;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedUrl(item.url)}
                className={`relative group rounded-2xl border-2 overflow-hidden cursor-pointer transition ${
                  isSelected
                    ? 'border-amber-500 shadow-lg shadow-amber-500/20'
                    : 'border-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="aspect-square w-full bg-slate-950">
                  <img
                    src={item.url}
                    alt={item.nome}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                {isSelected && (
                  <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-slate-950">
                    <Check className="h-4 w-4 font-bold" />
                  </div>
                )}
                <div className="p-2 bg-slate-950/90 text-[11px]">
                  <p className="font-bold text-white truncate">{item.nome}</p>
                  <p className="text-slate-500">{item.categoria}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-800 px-6 py-4 bg-slate-950">
          <span className="text-xs text-slate-400">
            {selectedUrl ? '1 imagem selecionada' : 'Selecione uma imagem acima'}
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              disabled={!selectedUrl}
              onClick={() => {
                if (selectedUrl) {
                  onSelectImage(selectedUrl);
                  onClose();
                }
              }}
              className="rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 disabled:opacity-50 transition"
            >
              Confirmar Seleção
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
