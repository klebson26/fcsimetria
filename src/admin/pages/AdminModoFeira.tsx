import React, { useState, useEffect } from 'react';
import { getModoFeira, saveModoFeira, subscribeStorage } from '../../services/storageService';
import { ConfigModoFeira, SlideCustomizadoModoFeira } from '../../types/database';
import {
  Play,
  Check,
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Clock,
  Sparkles,
  Layers,
  Sliders,
  Eye,
  X
} from 'lucide-react';
import { MediaPickerModal } from '../../components/MediaPickerModal';

interface AdminModoFeiraProps {
  onOpenFairMode: () => void;
}

export const AdminModoFeira: React.FC<AdminModoFeiraProps> = ({ onOpenFairMode }) => {
  const [modoFeira, setModoFeira] = useState<ConfigModoFeira>(getModoFeira());
  const [editingSlide, setEditingSlide] = useState<Partial<SlideCustomizadoModoFeira> | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    return subscribeStorage(() => {
      setModoFeira(getModoFeira());
    });
  }, []);

  const handleSaveConfig = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    saveModoFeira(modoFeira);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSaveSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide?.titulo) return;

    const currentCustomSlides = modoFeira.slidesCustomizados || [];
    const newSlide: SlideCustomizadoModoFeira = {
      id: editingSlide.id || 'slide_' + Date.now(),
      categoria: editingSlide.categoria || 'SLIDE DA FEIRA',
      titulo: editingSlide.titulo,
      subtitulo: editingSlide.subtitulo || '',
      descricao: editingSlide.descricao || '',
      imagem: editingSlide.imagem || '/images/sp_hero_banner_1790701710531.jpg',
      badge: editingSlide.badge || 'DESTAQUE',
      ativo: editingSlide.ativo !== undefined ? editingSlide.ativo : true,
      ordem: editingSlide.ordem || currentCustomSlides.length + 1
    };

    let updatedList: SlideCustomizadoModoFeira[];
    if (editingSlide.id) {
      updatedList = currentCustomSlides.map((s) => (s.id === editingSlide.id ? newSlide : s));
    } else {
      updatedList = [...currentCustomSlides, newSlide];
    }

    const updatedConfig = { ...modoFeira, slidesCustomizados: updatedList };
    setModoFeira(updatedConfig);
    saveModoFeira(updatedConfig);
    setEditingSlide(null);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDeleteSlide = (id: string) => {
    const updatedList = (modoFeira.slidesCustomizados || []).filter((s) => s.id !== id);
    const updatedConfig = { ...modoFeira, slidesCustomizados: updatedList };
    setModoFeira(updatedConfig);
    saveModoFeira(updatedConfig);
  };

  const handleToggleSection = (sectionKey: string) => {
    const currentSections = modoFeira.secoesExibidas || [];
    let updated: string[];
    if (currentSections.includes(sectionKey)) {
      updated = currentSections.filter((s) => s !== sectionKey);
    } else {
      updated = [...currentSections, sectionKey];
    }
    const newConfig = { ...modoFeira, secoesExibidas: updated };
    setModoFeira(newConfig);
    saveModoFeira(newConfig);
  };

  const customSlides = modoFeira.slidesCustomizados || [];

  return (
    <div className="p-4 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <Play className="h-6 w-6 text-amber-400" /> Modo Feira — Apresentação em Totens e Telas
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Personalize textos, fotos e slides customizados da apresentação em carrossel para os estandes da feira.
          </p>
        </div>

        <button
          onClick={onOpenFairMode}
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition shadow-lg shadow-amber-500/20"
        >
          <Eye className="h-4 w-4" /> Testar Modo Feira Agora
        </button>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 p-3 text-xs text-emerald-300 font-bold">
          <Check className="h-4 w-4" /> Configurações do Modo Feira salvas com sucesso!
        </div>
      )}

      {/* Global Config Card */}
      <form onSubmit={handleSaveConfig} className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
        <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Sliders className="h-5 w-5 text-amber-400" /> Configurações de Reprodução
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-amber-400" /> Tempo por Slide (Segundos)
            </label>
            <input
              type="number"
              min={3}
              max={60}
              value={modoFeira.tempoTransicaoSegundos || 8}
              onChange={(e) =>
                setModoFeira({ ...modoFeira, tempoTransicaoSegundos: parseInt(e.target.value) || 8 })
              }
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Autoplay Automático</label>
            <select
              value={modoFeira.autoplay ? 'SIM' : 'NAO'}
              onChange={(e) => setModoFeira({ ...modoFeira, autoplay: e.target.value === 'SIM' })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-amber-400"
            >
              <option value="SIM">SIM (Girar slides automaticamente)</option>
              <option value="NAO">NÃO (Apenas navegação manual)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Velocidade Transição</label>
            <select
              value={modoFeira.velocidadeAnimacoes || 'Normal'}
              onChange={(e) => setModoFeira({ ...modoFeira, velocidadeAnimacoes: e.target.value as any })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value="Lenta">Lenta</option>
              <option value="Normal">Normal</option>
              <option value="Rápida">Rápida</option>
            </select>
          </div>
        </div>

        {/* Categories checklist */}
        <div className="pt-2">
          <label className="text-xs font-semibold text-slate-300 block mb-2">
            Seções do Banco de Dados a Incluir na Apresentação:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { id: 'cidades', label: 'Cidades' },
              { id: 'paulista', label: 'Av. Paulista' },
              { id: 'mercadao', label: 'Mercadão' },
              { id: 'liberdade', label: 'Liberdade' },
              { id: 'culinaria', label: 'Culinária' },
              { id: 'curiosidades', label: 'Curiosidades' }
            ].map((sec) => {
              const isChecked = (modoFeira.secoesExibidas || []).includes(sec.id);
              return (
                <button
                  type="button"
                  key={sec.id}
                  onClick={() => handleToggleSection(sec.id)}
                  className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-semibold transition ${
                    isChecked
                      ? 'border-amber-500 bg-amber-500/15 text-amber-300 font-bold'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Check className={`h-3.5 w-3.5 ${isChecked ? 'text-amber-400' : 'opacity-0'}`} />
                  {sec.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            type="submit"
            className="rounded-xl bg-amber-500 px-6 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
          >
            Salvar Preferências Globais
          </button>
        </div>
      </form>

      {/* Custom Slides Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-400" /> Slides Customizados da Apresentação ({customSlides.length})
            </h3>
            <p className="text-xs text-slate-400">
              Crie slides com fotos, avisos, introduções e textos institucionais para rodar na feira.
            </p>
          </div>

          <button
            onClick={() =>
              setEditingSlide({
                titulo: '',
                subtitulo: '',
                descricao: '',
                categoria: 'FEIRA CULTURAL 2026',
                badge: 'ESTANDE',
                imagem: '/images/sp_hero_banner_1790701710531.jpg',
                ativo: true
              })
            }
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition shrink-0"
          >
            <Plus className="h-4 w-4" /> Criar Novo Slide Customizado
          </button>
        </div>

        {/* Slide Editor Form */}
        {editingSlide && (
          <form onSubmit={handleSaveSlide} className="rounded-2xl border border-amber-500/50 bg-slate-900 p-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-serif text-base font-bold text-white flex items-center gap-2">
                <Edit2 className="h-4 w-4 text-amber-400" />
                {editingSlide.id ? 'Editar Slide Customizado' : 'Novo Slide Customizado para o Modo Feira'}
              </h4>
              <button
                type="button"
                onClick={() => setEditingSlide(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Título do Slide *</label>
                <input
                  type="text"
                  required
                  value={editingSlide.titulo || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, titulo: e.target.value })}
                  placeholder="Ex: Bem-vindos à Feira Cultural Simetria"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Subtítulo / Local</label>
                <input
                  type="text"
                  value={editingSlide.subtitulo || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, subtitulo: e.target.value })}
                  placeholder="Ex: Colégio Simetria · Auditório Principal"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-slate-300">Texto / Descrição do Slide</label>
                <textarea
                  value={editingSlide.descricao || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, descricao: e.target.value })}
                  rows={3}
                  placeholder="Escreva a mensagem ou informações que aparecerão no slide da tela..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Foto / Imagem do Slide</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingSlide.imagem || ''}
                    onChange={(e) => setEditingSlide({ ...editingSlide, imagem: e.target.value })}
                    className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowMediaPicker(true)}
                    className="flex items-center gap-1.5 rounded-xl bg-slate-800 px-3 py-2 text-xs font-bold text-white hover:bg-slate-700"
                  >
                    <ImageIcon className="h-4 w-4" /> Mídia
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Categoria (Topo do Slide)</label>
                <input
                  type="text"
                  value={editingSlide.categoria || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, categoria: e.target.value })}
                  placeholder="Ex: FEIRA CULTURAL 2026, ESTANDE 01..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Etiqueta / Badge (Rodapé)</label>
                <input
                  type="text"
                  value={editingSlide.badge || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, badge: e.target.value })}
                  placeholder="Ex: PROJETO DE GEOGRAFIA"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Status</label>
                <select
                  value={editingSlide.ativo ? 'SIM' : 'NAO'}
                  onChange={(e) => setEditingSlide({ ...editingSlide, ativo: e.target.value === 'SIM' })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="SIM">ATIVO (Exibir na Apresentação)</option>
                  <option value="NAO">INATIVO (Ocultar)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingSlide(null)}
                className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
              >
                Salvar Slide
              </button>
            </div>
          </form>
        )}

        {/* Custom Slides Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {customSlides.map((slide) => (
            <div
              key={slide.id}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-3 flex flex-col justify-between hover:border-amber-500/30 transition"
            >
              <div className="space-y-2">
                <div className="h-36 w-full overflow-hidden rounded-xl bg-slate-950 relative">
                  <img src={slide.imagem} alt={slide.titulo} className="h-full w-full object-cover" />
                  <span className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-amber-400 border border-slate-800">
                    {slide.categoria}
                  </span>
                </div>

                <div>
                  <h4 className="font-serif text-sm font-bold text-white">{slide.titulo}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{slide.descricao}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                <span className="text-[10px] font-mono text-amber-400">{slide.badge}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingSlide(slide)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-800 bg-slate-950 text-blue-400 hover:bg-blue-500/20"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteSlide(slide.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-800 bg-slate-950 text-rose-400 hover:bg-rose-500/20"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {customSlides.length === 0 && !editingSlide && (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-800 p-8 text-center text-slate-500 space-y-2">
              <Sparkles className="h-8 w-8 text-amber-500/40 mx-auto" />
              <p className="text-xs font-medium">Nenhum slide customizado criado ainda.</p>
              <p className="text-[11px]">
                Clique no botão acima para adicionar slides com avisos, fotos e informações exclusivas da feira.
              </p>
            </div>
          )}
        </div>
      </div>

      {showMediaPicker && (
        <MediaPickerModal
          onClose={() => setShowMediaPicker(false)}
          onSelectImage={(url) => {
            if (editingSlide) {
              setEditingSlide({ ...editingSlide, imagem: url });
            }
          }}
        />
      )}
    </div>
  );
};
