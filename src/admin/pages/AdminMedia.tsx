import React, { useState, useEffect } from 'react';
import { getMedia, saveMediaItem, deleteMediaItem, subscribeStorage } from '../../services/storageService';
import { MediaItem } from '../../types/database';
import { Image, Upload, Search, Trash2, Plus, Link, Copy, Check, X } from 'lucide-react';

export const AdminMedia: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaItem[]>(getMedia());
  const [filterQuery, setFilterQuery] = useState('');
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('Geral');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    return subscribeStorage(() => {
      setMediaList(getMedia());
    });
  }, []);

  const compressImage = (file: File): Promise<{ url: string; sizeKb: number }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const rawUrl = evt.target?.result as string;
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height = Math.round((height * MAX_SIZE) / width);
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width = Math.round((width * MAX_SIZE) / height);
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.82);
            const sizeKb = Math.round((compressed.length * 3) / 4 / 1024);
            resolve({ url: compressed, sizeKb });
            return;
          }
          resolve({ url: rawUrl, sizeKb: Math.round(file.size / 1024) });
        };
        img.onerror = () => resolve({ url: rawUrl, sizeKb: Math.round(file.size / 1024) });
        img.src = rawUrl;
      };
      reader.onerror = () => resolve({ url: '', sizeKb: 0 });
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const { url, sizeKb } = await compressImage(file);
      if (!url) return;

      const newMedia: MediaItem = {
        id: 'med_' + Date.now(),
        nome: file.name.replace(/\.[^/.]+$/, ''),
        url: url,
        tamanhoKb: sizeKb,
        formato: 'JPG',
        categoria: 'Upload Local',
        textoAlternativo: file.name,
        dataUpload: new Date().toISOString()
      };
      saveMediaItem(newMedia);
    }
  };

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    const newMedia: MediaItem = {
      id: 'med_' + Date.now(),
      nome: nameInput.trim() || 'Imagem Externa URL',
      url: urlInput.trim(),
      tamanhoKb: 0,
      formato: (urlInput.split('.').pop()?.substring(0, 4).toUpperCase() as any) || 'URL',
      categoria: categoryInput || 'Link URL',
      textoAlternativo: nameInput.trim() || 'Imagem externa',
      dataUpload: new Date().toISOString()
    };

    saveMediaItem(newMedia);
    setUrlInput('');
    setNameInput('');
    setShowUrlModal(false);
  };

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = mediaList.filter(
    (m) =>
      m.nome.toLowerCase().includes(filterQuery.toLowerCase()) ||
      m.categoria.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <Image className="h-6 w-6 text-amber-400" /> Biblioteca de Mídia & Fotos
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gerencie todas as fotos do site. Faça upload local ou adicione imagens diretamente por link URL da internet.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Add by URL button */}
          <button
            onClick={() => setShowUrlModal(true)}
            className="flex items-center gap-2 rounded-xl border border-blue-500/40 bg-blue-600/20 px-4 py-2.5 text-xs font-bold text-blue-300 hover:bg-blue-600/30 transition shadow-lg"
          >
            <Link className="h-4 w-4" />
            <span>Adicionar por Link URL</span>
          </button>

          {/* Upload file button */}
          <label className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 cursor-pointer transition shadow-lg shadow-amber-500/20">
            <Upload className="h-4 w-4" />
            <span>Upload do Arquivo</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <input
          type="text"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder="Pesquisar foto por nome ou categoria..."
          className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
        />
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map((item) => {
          const isCopied = copiedId === item.id;
          const isUrl = item.url.startsWith('http://') || item.url.startsWith('https://');

          return (
            <div
              key={item.id}
              className="group relative rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden space-y-2 p-2 hover:border-slate-700 transition"
            >
              <div className="aspect-square w-full rounded-xl overflow-hidden bg-slate-950 relative border border-slate-800">
                <img
                  src={item.url}
                  alt={item.nome}
                  className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                  onError={(e) => {
                    (e.target as HTMLElement).style.opacity = '0.3';
                  }}
                />
                {isUrl && (
                  <span className="absolute bottom-2 left-2 rounded bg-blue-900/90 border border-blue-500/40 px-1.5 py-0.5 text-[9px] font-mono text-blue-200">
                    URL Web
                  </span>
                )}
              </div>

              <div className="px-1 text-[11px] space-y-0.5">
                <p className="font-bold text-white truncate" title={item.nome}>{item.nome}</p>
                <p className="text-slate-500 truncate">{item.categoria}</p>
              </div>

              {/* Action buttons on hover */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => handleCopyLink(item.url, item.id)}
                  title="Copiar Link da Imagem"
                  className="flex items-center gap-1 text-[10px] font-bold text-amber-400 hover:text-amber-300 p-1"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copiar Link</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => deleteMediaItem(item.id)}
                  title="Excluir imagem"
                  className="text-slate-500 hover:text-rose-400 p-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Adicionar Imagem por URL */}
      {showUrlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl border border-blue-500/40 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <Link className="h-5 w-5 text-blue-400" /> Adicionar Foto por URL
              </h3>
              <button
                onClick={() => setShowUrlModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUrl} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Link da Imagem (URL)</label>
                <input
                  type="url"
                  required
                  placeholder="https://exemplo.com/foto.jpg"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Nome / Título da Foto</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Fachada do MASP à noite"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Categoria</label>
                <select
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="Geral">Geral</option>
                  <option value="Cidades">Cidades</option>
                  <option value="Pontos Turísticos">Pontos Turísticos</option>
                  <option value="Paulista">Avenida Paulista</option>
                  <option value="Mercadão">Mercadão</option>
                  <option value="Liberdade">Liberdade</option>
                  <option value="Culinária">Culinária</option>
                  <option value="Artesanato">Artesanato</option>
                  <option value="História">História</option>
                </select>
              </div>

              {/* Live Preview */}
              {urlInput && (
                <div className="space-y-1 pt-1">
                  <label className="text-[11px] font-semibold text-slate-400">Pré-visualização:</label>
                  <div className="h-36 w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center">
                    <img
                      src={urlInput}
                      alt="Preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUrlModal(false)}
                  className="rounded-xl border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-500"
                >
                  Salvar Imagem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
