import React, { useState, useEffect, useRef } from 'react';
import {
  getMuralFotos,
  addFotoMural,
  likeFotoMural,
  deleteFotoMural,
  getIdentidade,
  subscribeStorage,
  getAuthSession
} from '../services/storageService';
import { FotoMural } from '../types/database';
import {
  Camera,
  Heart,
  Upload,
  ArrowLeft,
  Share2,
  Check,
  QrCode,
  Sparkles,
  Users,
  Image as ImageIcon,
  X,
  MapPin,
  Clock,
  Filter,
  Trash2,
  Download,
  Maximize2,
  Smile,
  Send
} from 'lucide-react';

interface MuralFotosPageProps {
  onBackToHome: () => void;
  onOpenQRCodeModal: (topic?: string) => void;
}

export const MuralFotosPage: React.FC<MuralFotosPageProps> = ({
  onBackToHome,
  onOpenQRCodeModal
}) => {
  const [fotos, setFotos] = useState<FotoMural[]>(getMuralFotos());
  const [identidade, setIdentidade] = useState(getIdentidade());
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<FotoMural | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('TODAS');
  const [searchQuery, setSearchQuery] = useState('');
  const session = getAuthSession();

  // Form states for new photo upload
  const [formNome, setFormNome] = useState('');
  const [formRelacao, setFormRelacao] = useState('Visitante');
  const [formLocal, setFormLocal] = useState('Área Geral');
  const [formMensagem, setFormMensagem] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return subscribeStorage(() => {
      setFotos(getMuralFotos());
      setIdentidade(getIdentidade());
    });
  }, []);

  const handleCopyLink = () => {
    const url = window.location.origin + window.location.pathname + '#mural';
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Read and compress file as base64 data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize image to max 1280px to keep localStorage light and fast
        const canvas = document.createElement('canvas');
        const maxDimension = 1280;
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          setPreviewImage(compressed);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNome.trim() || !previewImage) return;

    setIsSubmitting(true);
    try {
      addFotoMural({
        autorNome: formNome.trim(),
        turmaOuRelacao: formRelacao,
        localFeira: formLocal,
        mensagem: formMensagem.trim() || 'Registrando nossa presença na Feira Cultural Simetria!',
        fotoUrl: previewImage,
        destaque: false
      });

      // Reset form
      setFormNome('');
      setFormMensagem('');
      setPreviewImage(null);
      setIsUploadOpen(false);
      setFeedbackSuccess(true);
      setTimeout(() => setFeedbackSuccess(false), 4000);
    } catch (err) {
      console.error('Erro ao enviar foto:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    likeFotoMural(id);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Deseja realmente remover esta foto do mural?')) {
      deleteFotoMural(id);
      if (selectedPhoto?.id === id) {
        setSelectedPhoto(null);
      }
    }
  };

  const totalCurtidas = fotos.reduce((acc, f) => acc + (f.curtidas || 0), 0);

  // Filters
  const filteredFotos = fotos.filter((f) => {
    // Local filter
    if (activeFilter === 'PAULISTA' && f.localFeira !== 'Estande Av. Paulista') return false;
    if (activeFilter === 'MERCADAO' && f.localFeira !== 'Mercadão Municipal') return false;
    if (activeFilter === 'LIBERDADE' && f.localFeira !== 'Bairro da Liberdade') return false;
    if (activeFilter === 'DESTAQUES' && !f.destaque) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = f.autorNome.toLowerCase().includes(q);
      const matchMsg = f.mensagem.toLowerCase().includes(q);
      const matchLocal = f.localFeira?.toLowerCase().includes(q);
      const matchRelacao = f.turmaOuRelacao?.toLowerCase().includes(q);
      if (!matchName && !matchMsg && !matchLocal && !matchRelacao) return false;
    }

    return true;
  });

  const formatData = (iso: string) => {
    try {
      const date = new Date(iso);
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) + ' · ' + date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    } catch {
      return 'Agora';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 pb-20">
      {/* Top Banner Navigation Bar */}
      <div className="sticky top-16 sm:top-[70px] z-30 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:border-amber-500/40 hover:text-white transition shadow-sm"
          >
            <ArrowLeft className="h-4 w-4 text-amber-400" />
            <span>Voltar ao Portal</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsUploadOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-3.5 py-1.5 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition"
            >
              <Camera className="h-4 w-4 fill-slate-950" />
              <span>Publicar Minha Foto</span>
            </button>

            <button
              onClick={handleCopyLink}
              title="Copiar link do Mural"
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5 text-blue-400" />}
              <span className="hidden sm:inline">{copied ? 'Link Copiado!' : 'Compartilhar'}</span>
            </button>

            <button
              onClick={() => onOpenQRCodeModal('mural')}
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition shadow-sm"
            >
              <QrCode className="h-3.5 w-3.5 text-amber-400" />
              <span>QR Code Mural</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-800/80 bg-radial from-amber-500/10 via-slate-950 to-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-400">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Mural Vivo da Feira Cultural {identidade.anoFeira || '2026'}</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl font-black tracking-tight text-white text-balance">
                Mural de Fotos dos Visitantes
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                Tire uma selfie ou foto nos estandes, registre seu momento em família ou com sua turma e faça parte da galeria oficial do {identidade.nomeColegio}!
              </p>

              {/* Stats badges */}
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono">
                <div className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-1.5 text-slate-300">
                  <ImageIcon className="h-4 w-4 text-amber-400" />
                  <span><strong>{fotos.length}</strong> fotos publicadas</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-1.5 text-slate-300">
                  <Heart className="h-4 w-4 text-rose-400 fill-rose-400/30" />
                  <span><strong>{totalCurtidas}</strong> curtidas recebidas</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-emerald-400">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>Mural ao vivo</span>
                </div>
              </div>
            </div>

            {/* Big Action CTA */}
            <div className="shrink-0 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setIsUploadOpen(true)}
                className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-xl shadow-amber-500/25 hover:from-amber-400 hover:to-amber-500 transition active:scale-98"
              >
                <Camera className="h-5 w-5 fill-slate-950" />
                <span>Tirar ou Enviar Minha Foto</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Success Notification Alert */}
      {feedbackSuccess && (
        <div className="mx-auto max-w-7xl px-4 mt-6">
          <div className="flex items-center justify-between rounded-2xl border border-emerald-500/40 bg-emerald-500/15 p-4 text-emerald-300 shadow-xl animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 font-bold">
                <Check className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Foto publicada no Mural com sucesso!</h4>
                <p className="text-xs text-emerald-400/90">Sua lembrança já está visível para todos os visitantes da feira cultural.</p>
              </div>
            </div>
            <button
              onClick={() => setFeedbackSuccess(false)}
              className="text-emerald-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 space-y-6">
        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'TODAS', label: 'Todas as Fotos' },
              { id: 'DESTAQUES', label: '⭐ Destaques' },
              { id: 'PAULISTA', label: 'Av. Paulista' },
              { id: 'MERCADAO', label: 'Mercadão' },
              { id: 'LIBERDADE', label: 'Liberdade' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
                  activeFilter === f.id
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-64 shrink-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome ou mensagem..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 py-1.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Photo Gallery Grid */}
        {filteredFotos.length === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-12 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Camera className="h-8 w-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-white">Nenhuma foto encontrada</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Seja o primeiro a publicar uma foto ou ajuste os filtros acima!
            </p>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
            >
              <Camera className="h-4 w-4" />
              <span>Publicar Foto Agora</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFotos.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedPhoto(item)}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/90 shadow-xl hover:border-amber-500/50 hover:shadow-amber-500/10 transition cursor-pointer"
              >
                {/* Photo container */}
                <div className="relative aspect-4/3 sm:aspect-square w-full overflow-hidden bg-slate-950">
                  <img
                    src={item.fotoUrl}
                    alt={item.autorNome}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />

                  {/* Top badges on photo */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    {item.localFeira && (
                      <span className="rounded-full bg-slate-950/80 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                        📍 {item.localFeira}
                      </span>
                    )}

                    {item.destaque && (
                      <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-slate-950 shadow-md">
                        ⭐ Destaque
                      </span>
                    )}
                  </div>

                  {/* Hover overlay hint */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3 pointer-events-none">
                    <span className="text-[11px] font-semibold text-white flex items-center gap-1">
                      <Maximize2 className="h-3.5 w-3.5" /> Ampliar foto
                    </span>
                  </div>
                </div>

                {/* Card Info & Caption */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-serif text-sm font-bold text-white truncate group-hover:text-amber-400 transition">
                        {item.autorNome}
                      </h4>
                      <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full shrink-0">
                        {item.turmaOuRelacao}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                      "{item.mensagem}"
                    </p>
                  </div>

                  {/* Card Footer: Timestamp & Like button */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {formatData(item.dataCriacao)}
                    </span>

                    <div className="flex items-center gap-2">
                      {session && (
                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          title="Remover foto (Admin)"
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}

                      <button
                        onClick={(e) => handleLike(item.id, e)}
                        title="Curtir foto"
                        className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition active:scale-95"
                      >
                        <Heart className="h-3.5 w-3.5 fill-rose-500" />
                        <span>{item.curtidas || 0}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ================= UPLOAD / CAMERA MODAL ================= */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  <Camera className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">Publicar no Mural da Feira</h3>
                  <p className="text-xs text-slate-400">Compartilhe sua lembrança com todos os visitantes</p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitPhoto} className="space-y-4">
              {/* Photo Upload / Capture preview */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">
                  Foto da Feira <span className="text-amber-400">*</span>
                </label>

                {previewImage ? (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-amber-500/50 aspect-4/3 bg-slate-950">
                    <img src={previewImage} alt="Prévia" className="h-full w-full object-cover" />
                    
                    {/* Simulated cultural fair official badge watermark */}
                    <div className="absolute bottom-2 left-2 right-2 rounded-xl bg-slate-950/80 backdrop-blur-md px-3 py-1.5 text-center text-[10px] font-bold text-amber-300 border border-amber-500/30">
                      {identidade.nomeColegio} • {identidade.nomeFeira} {identidade.anoFeira || '2026'}
                    </div>

                    <button
                      type="button"
                      onClick={() => setPreviewImage(null)}
                      className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/80 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950/50 p-8 text-center cursor-pointer hover:border-amber-500/50 hover:bg-amber-500/5 transition space-y-3"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      <Camera className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Toque aqui para abrir a câmera ou galeria</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Formatos suportados: JPG, PNG, WEBP</p>
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Name & Relationship inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Seu Nome / Grupo <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formNome}
                    onChange={(e) => setFormNome(e.target.value)}
                    placeholder="Ex: Família Souza, Turma 3º B..."
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Quem é você?
                  </label>
                  <select
                    value={formRelacao}
                    onChange={(e) => setFormRelacao(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Visitante">Visitante</option>
                    <option value="Família">Família de Aluno</option>
                    <option value="Estudante">Estudante</option>
                    <option value="Professor">Professor / Funcionário</option>
                    <option value="Ex-Aluno">Ex-Aluno</option>
                  </select>
                </div>
              </div>

              {/* Fair Booth location */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Onde a foto foi tirada?
                </label>
                <select
                  value={formLocal}
                  onChange={(e) => setFormLocal(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="Área Geral">Área Geral da Feira</option>
                  <option value="Estande Av. Paulista">Estande da Avenida Paulista</option>
                  <option value="Mercadão Municipal">Estande do Mercadão Municipal</option>
                  <option value="Bairro da Liberdade">Estande do Bairro da Liberdade</option>
                  <option value="Praça de Alimentação">Praça Gastronômica</option>
                  <option value="Palco Cultural">Palco das Apresentações</option>
                </select>
              </div>

              {/* Message / Caption */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Mensagem / Recado da Feira
                </label>
                <textarea
                  rows={3}
                  value={formMensagem}
                  onChange={(e) => setFormMensagem(e.target.value)}
                  placeholder="Deixe um recado sobre o que você mais gostou na feira cultural..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!formNome.trim() || !previewImage || isSubmitting}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{isSubmitting ? 'Publicando...' : 'Publicar no Mural'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= FULLSCREEN LIGHTBOX MODAL ================= */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-xl p-4 overflow-y-auto animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-slate-950/80 text-white border border-slate-800 hover:bg-slate-800 transition"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Photo */}
            <div className="relative max-h-[65vh] w-full overflow-hidden bg-slate-950 flex items-center justify-center">
              <img
                src={selectedPhoto.fotoUrl}
                alt={selectedPhoto.autorNome}
                className="max-h-[65vh] w-auto max-w-full object-contain"
              />
            </div>

            {/* Photo info */}
            <div className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-xl font-bold text-white">
                      {selectedPhoto.autorNome}
                    </h3>
                    <span className="rounded-full bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                      {selectedPhoto.turmaOuRelacao}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                    {selectedPhoto.localFeira && (
                      <span className="text-amber-400 font-semibold">📍 {selectedPhoto.localFeira}</span>
                    )}
                    <span>•</span>
                    <span>{formatData(selectedPhoto.dataCriacao)}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleLike(selectedPhoto.id, e)}
                    className="flex items-center gap-1.5 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-xs font-bold text-rose-300 hover:bg-rose-500/20 transition active:scale-95"
                  >
                    <Heart className="h-4 w-4 fill-rose-500" />
                    <span>Curtir ({selectedPhoto.curtidas || 0})</span>
                  </button>

                  <a
                    href={selectedPhoto.fotoUrl}
                    download={`simetria_feira_${selectedPhoto.id}.jpg`}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white"
                  >
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Baixar</span>
                  </a>
                </div>
              </div>

              <p className="text-sm text-slate-200 leading-relaxed italic">
                "{selectedPhoto.mensagem}"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
