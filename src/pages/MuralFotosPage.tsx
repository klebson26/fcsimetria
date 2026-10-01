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
import { playClickSound } from '../services/audioService';
import { FotoMural } from '../types/database';
import {
  Camera,
  Heart,
  ArrowLeft,
  Share2,
  Check,
  QrCode,
  Sparkles,
  Image as ImageIcon,
  X,
  MapPin,
  Clock,
  Trash2,
  Download,
  Maximize2,
  Send,
  RefreshCw,
  RotateCcw,
  Timer,
  AlertCircle,
  HelpCircle,
  Smartphone,
  ChevronDown
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
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<FotoMural | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('TODAS');
  const [searchQuery, setSearchQuery] = useState('');
  const session = getAuthSession();

  // Camera States
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [cameraError, setCameraError] = useState<'BLOCKED' | 'NOT_FOUND' | 'GENERIC' | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [flashAnimation, setFlashAnimation] = useState(false);
  const [showHelpInstructions, setShowHelpInstructions] = useState(false);

  // Form States
  const [formNome, setFormNome] = useState('');
  const [formRelacao, setFormRelacao] = useState('Visitante');
  const [formLocal, setFormLocal] = useState('Área Geral');
  const [formMensagem, setFormMensagem] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return subscribeStorage(() => {
      setFotos(getMuralFotos());
      setIdentidade(getIdentidade());
    });
  }, []);

  // Stop camera stream when component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async (mode: 'user' | 'environment') => {
    stopCamera();
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('NO_GET_USER_MEDIA');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 960 }
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((e) => console.log('Video play deferred:', e));
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Tentando fallback simplificado de câmera:', err);
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
        streamRef.current = fallbackStream;
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          videoRef.current.play().catch((e) => console.log('Fallback video play:', e));
        }
        setIsCameraActive(true);
      } catch (fallbackErr: any) {
        console.error('Falha de inicialização da câmera:', fallbackErr);
        const errName = fallbackErr.name || err.name;
        if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError') {
          setCameraError('BLOCKED');
        } else if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError') {
          setCameraError('NOT_FOUND');
        } else {
          setCameraError('GENERIC');
        }
        setIsCameraActive(false);
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const handleOpenLiveCamera = () => {
    playClickSound();
    setPreviewImage(null);
    setIsCameraModalOpen(true);
    startCamera(facingMode);
  };

  const handleOpenNativeCamera = () => {
    playClickSound();
    nativeCameraInputRef.current?.click();
  };

  const handleSwitchCamera = () => {
    playClickSound();
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Capture from live video stream
  const handleCapturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    playClickSound();

    setFlashAnimation(true);
    setTimeout(() => setFlashAnimation(false), 200);

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Add official school banner watermark
    const bannerHeight = Math.max(48, Math.round(canvas.height * 0.08));
    ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
    ctx.fillRect(0, canvas.height - bannerHeight, canvas.width, bannerHeight);

    ctx.fillStyle = '#f59e0b';
    ctx.font = `bold ${Math.max(14, Math.round(bannerHeight * 0.38))}px sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    const textLeft = Math.round(canvas.width * 0.04);
    ctx.fillText(
      `${identidade.nomeColegio.toUpperCase()} • ${identidade.nomeFeira.toUpperCase()} ${identidade.anoFeira || '2026'}`,
      textLeft,
      canvas.height - bannerHeight / 2
    );

    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    setPreviewImage(dataUrl);
    stopCamera();
  };

  // Capture directly via device native camera input
  const handleNativeCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
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
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, width, height);

        // Watermark band
        const bannerHeight = Math.max(48, Math.round(canvas.height * 0.08));
        ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
        ctx.fillRect(0, canvas.height - bannerHeight, canvas.width, bannerHeight);

        ctx.fillStyle = '#f59e0b';
        ctx.font = `bold ${Math.max(14, Math.round(bannerHeight * 0.38))}px sans-serif`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        const textLeft = Math.round(canvas.width * 0.04);
        ctx.fillText(
          `${identidade.nomeColegio.toUpperCase()} • ${identidade.nomeFeira.toUpperCase()} ${identidade.anoFeira || '2026'}`,
          textLeft,
          canvas.height - bannerHeight / 2
        );

        const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
        setPreviewImage(dataUrl);
        setIsCameraModalOpen(true);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleStartTimerCapture = () => {
    if (countdown !== null) return;
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          setTimeout(() => {
            handleCapturePhoto();
            setCountdown(null);
          }, 300);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleRetakePhoto = () => {
    playClickSound();
    setPreviewImage(null);
    startCamera(facingMode);
  };

  const handleCloseModal = () => {
    stopCamera();
    setPreviewImage(null);
    setCountdown(null);
    setIsCameraModalOpen(false);
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
      setIsCameraModalOpen(false);
      setFeedbackSuccess(true);
      setTimeout(() => setFeedbackSuccess(false), 4500);
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

  const handleCopyLink = () => {
    const url = window.location.origin + window.location.pathname + '#mural';
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const totalCurtidas = fotos.reduce((acc, f) => acc + (f.curtidas || 0), 0);

  // Filters
  const filteredFotos = fotos.filter((f) => {
    if (activeFilter === 'PAULISTA' && f.localFeira !== 'Estande Av. Paulista') return false;
    if (activeFilter === 'MERCADAO' && f.localFeira !== 'Mercadão Municipal') return false;
    if (activeFilter === 'LIBERDADE' && f.localFeira !== 'Bairro da Liberdade') return false;
    if (activeFilter === 'DESTAQUES' && !f.destaque) return false;

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
      return (
        date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) +
        ' · ' +
        date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
      );
    } catch {
      return 'Agora';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 pb-20">
      {/* Hidden input to directly trigger device native camera on any phone */}
      <input
        ref={nativeCameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleNativeCameraCapture}
        className="hidden"
      />

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
              onClick={handleOpenLiveCamera}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-3.5 py-1.5 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition"
            >
              <Camera className="h-4 w-4 fill-slate-950" />
              <span>Abrir Câmera</span>
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
                Tire sua foto diretamente com a câmera do celular nos estandes da feira, registre seu momento em família ou com sua turma e faça parte do mural oficial do {identidade.nomeColegio}!
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
                  <span>Câmera e Mural ao Vivo</span>
                </div>
              </div>
            </div>

            {/* Direct Camera Shutter Trigger Buttons */}
            <div className="shrink-0 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleOpenLiveCamera}
                className="flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-4 text-sm font-bold text-slate-950 shadow-xl shadow-amber-500/25 hover:from-amber-400 hover:to-amber-500 transition active:scale-98"
              >
                <Camera className="h-5 w-5 fill-slate-950" />
                <span>Abrir Câmera na Tela</span>
              </button>

              <button
                onClick={handleOpenNativeCamera}
                title="Tirar foto diretamente com o aplicativo de câmera nativo do celular"
                className="flex items-center justify-center gap-2 rounded-2xl border border-amber-500/40 bg-slate-900/90 px-5 py-4 text-xs font-bold text-amber-300 hover:bg-amber-500/15 transition active:scale-98 shadow-md"
              >
                <Smartphone className="h-4 w-4 text-amber-400" />
                <span>Câmera do Celular</span>
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
                <h4 className="font-bold text-sm">Foto publicada com sucesso no Mural!</h4>
                <p className="text-xs text-emerald-400/90">Sua foto já está disponível ao vivo para todos os visitantes da feira.</p>
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
              Seja o primeiro a abrir a câmera e tirar uma foto para o mural!
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleOpenLiveCamera}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
              >
                <Camera className="h-4 w-4" />
                <span>Abrir Câmera</span>
              </button>
              <button
                onClick={handleOpenNativeCamera}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white"
              >
                <Smartphone className="h-4 w-4 text-amber-400" />
                <span>Câmera do Celular</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFotos.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedPhoto(item)}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/90 shadow-xl hover:border-amber-500/50 hover:shadow-amber-500/10 transition cursor-pointer"
              >
                <div className="relative aspect-4/3 sm:aspect-square w-full overflow-hidden bg-slate-950">
                  <img
                    src={item.fotoUrl}
                    alt={item.autorNome}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />

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

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3 pointer-events-none">
                    <span className="text-[11px] font-semibold text-white flex items-center gap-1">
                      <Maximize2 className="h-3.5 w-3.5" /> Ampliar foto
                    </span>
                  </div>
                </div>

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

      {/* ================= REAL CAMERA VIEWFINDER & CAPTURE MODAL ================= */}
      {isCameraModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden my-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4 bg-slate-900/90">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  <Camera className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-white leading-tight">
                    {previewImage ? 'Confirmar e Publicar Foto' : 'Câmera da Feira Cultural'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {previewImage ? 'Revise sua foto e adicione seu nome' : 'Tire sua foto ao vivo para o mural oficial'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Camera Viewfinder OR Captured Preview */}
            <div className="p-4 sm:p-6 space-y-4">
              {!previewImage ? (
                /* LIVE CAMERA VIEWFINDER */
                <div className="space-y-4">
                  <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-black border-2 border-slate-800 shadow-inner flex items-center justify-center">
                    {/* Live Video Element */}
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className={`h-full w-full object-cover transition-transform ${
                        facingMode === 'user' ? 'scale-x-[-1]' : ''
                      }`}
                    />

                    {/* Camera Flash Animation */}
                    {flashAnimation && (
                      <div className="absolute inset-0 bg-white z-40 animate-fade-out" />
                    )}

                    {/* Countdown Overlay (3, 2, 1) */}
                    {countdown !== null && (
                      <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-xs">
                        <span className="font-mono text-7xl sm:text-8xl font-black text-amber-400 animate-ping">
                          {countdown}
                        </span>
                      </div>
                    )}

                    {/* Live School Frame Watermark */}
                    <div className="absolute bottom-2 left-2 right-2 z-20 rounded-xl bg-slate-950/80 backdrop-blur-md px-3 py-1.5 text-center text-[10px] font-bold text-amber-300 border border-amber-500/30">
                      {identidade.nomeColegio} • {identidade.nomeFeira} {identidade.anoFeira || '2026'}
                    </div>

                    {/* SMART CAMERA ERROR & PERMISSION FALLBACK OVERLAY */}
                    {cameraError && (
                      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-5 text-center bg-slate-950/98 space-y-3 overflow-y-auto">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 shrink-0">
                          <Camera className="h-6 w-6" />
                        </div>

                        <div className="space-y-1">
                          <h4 className="font-bold text-sm text-white">
                            {cameraError === 'BLOCKED'
                              ? 'Acesso à câmera bloqueado no navegador'
                              : 'Não foi possível carregar a câmera na tela'}
                          </h4>
                          <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
                            {cameraError === 'BLOCKED'
                              ? 'O navegador ou aplicativo bloqueou a transmissão direta da câmera. Use o botão abaixo para disparar com a câmera do seu aparelho sem bloqueio:'
                              : 'Toque abaixo para abrir a câmera nativa do seu celular ou tablet:'}
                          </p>
                        </div>

                        {/* Guaranteed Direct Native Camera Capture Button */}
                        <div className="w-full max-w-xs space-y-2 pt-1">
                          <button
                            type="button"
                            onClick={() => nativeCameraInputRef.current?.click()}
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-3 text-xs font-bold text-slate-950 shadow-xl shadow-amber-500/25 hover:from-amber-400 hover:to-amber-500 transition active:scale-98"
                          >
                            <Camera className="h-4 w-4 fill-slate-950" />
                            <span>Tirar Foto Direto no Aparelho</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => startCamera(facingMode)}
                            className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-600 transition"
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                            <span>Tentar Novamente na Tela</span>
                          </button>
                        </div>

                        {/* Step-by-step instructions toggle */}
                        <div className="w-full max-w-xs pt-1">
                          <button
                            type="button"
                            onClick={() => setShowHelpInstructions(!showHelpInstructions)}
                            className="text-[11px] text-amber-400 hover:text-amber-300 underline font-medium flex items-center justify-center gap-1 mx-auto"
                          >
                            <HelpCircle className="h-3.5 w-3.5" />
                            <span>Como permitir a câmera no navegador?</span>
                            <ChevronDown
                              className={`h-3 w-3 transition-transform ${
                                showHelpInstructions ? 'rotate-180' : ''
                              }`}
                            />
                          </button>

                          {showHelpInstructions && (
                            <div className="mt-2 rounded-xl border border-slate-800 bg-slate-900 p-3 text-left text-[11px] text-slate-300 space-y-2 shadow-lg animate-fade-in">
                              <div>
                                <span className="font-bold text-amber-400 block">🤖 No Chrome (Android ou PC):</span>
                                <p className="text-slate-400 text-[10px] mt-0.5">
                                  Toque no ícone de configurações/cadeado 🔒 ao lado da barra de endereço &gt; Permissões &gt; Câmera &gt; selecione <strong>Permitir</strong> e recarregue.
                                </p>
                              </div>
                              <div>
                                <span className="font-bold text-amber-400 block">🍏 No Safari (iPhone ou iPad):</span>
                                <p className="text-slate-400 text-[10px] mt-0.5">
                                  Toque em <strong>aA</strong> na barra de endereço &gt; Ajustes do Site &gt; Câmera &gt; selecione <strong>Permitir</strong>.
                                </p>
                              </div>
                              <div>
                                <span className="font-bold text-amber-400 block">💬 Se abriu pelo WhatsApp ou Instagram:</span>
                                <p className="text-slate-400 text-[10px] mt-0.5">
                                  Toque no menu (3 pontinhos no canto superior) e selecione <em>"Abrir no Chrome"</em> ou <em>"Abrir no Safari"</em>.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Quick Camera Flip Button (Top Right of Viewfinder) */}
                    {isCameraActive && !cameraError && (
                      <button
                        onClick={handleSwitchCamera}
                        title="Inverter Câmera (Frontal / Traseira)"
                        className="absolute top-3 right-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/80 text-white border border-slate-700 hover:bg-slate-800 transition active:scale-95 shadow-lg"
                      >
                        <RefreshCw className="h-4 w-4 text-amber-400" />
                      </button>
                    )}
                  </div>

                  {/* Shutter Action Controls (Under Viewfinder) */}
                  {!cameraError && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-6 py-2">
                        {/* Timer 3s Trigger */}
                        <button
                          type="button"
                          disabled={!isCameraActive || countdown !== null}
                          onClick={handleStartTimerCapture}
                          title="Timer de 3 segundos para se preparar"
                          className="flex flex-col items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-amber-400 transition disabled:opacity-40"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 border border-slate-700">
                            <Timer className="h-4 w-4" />
                          </div>
                          <span>Timer 3s</span>
                        </button>

                        {/* BIG ROUND CAMERA SHUTTER BUTTON */}
                        <button
                          type="button"
                          disabled={!isCameraActive || countdown !== null}
                          onClick={handleCapturePhoto}
                          title="Tirar Foto Agora"
                          className="group relative flex h-18 w-18 sm:h-20 sm:w-20 items-center justify-center rounded-full border-4 border-white/80 bg-slate-950 shadow-2xl transition hover:border-amber-400 active:scale-90 disabled:opacity-40"
                        >
                          <div className="h-14 w-14 sm:h-15 sm:w-15 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 group-hover:from-amber-400 group-hover:to-amber-300 shadow-lg" />
                        </button>

                        {/* Flip Camera Button */}
                        <button
                          type="button"
                          disabled={!isCameraActive}
                          onClick={handleSwitchCamera}
                          title="Alternar Câmera"
                          className="flex flex-col items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-amber-400 transition disabled:opacity-40"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 border border-slate-700">
                            <RefreshCw className="h-4 w-4" />
                          </div>
                          <span>Inverter</span>
                        </button>
                      </div>

                      {/* Small helper link for direct native camera trigger */}
                      <p className="text-center text-[11px] text-slate-400">
                        Prefere usar a câmera do seu celular?{' '}
                        <button
                          type="button"
                          onClick={() => nativeCameraInputRef.current?.click()}
                          className="text-amber-400 font-bold underline hover:text-amber-300"
                        >
                          Toque aqui
                        </button>
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* CAPTURED PHOTO REVIEW & PUBLISH FORM */
                <form onSubmit={handleSubmitPhoto} className="space-y-4 animate-fade-in">
                  {/* Photo Preview Card */}
                  <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-black border-2 border-amber-500/50 shadow-lg">
                    <img src={previewImage} alt="Foto Capturada" className="h-full w-full object-cover" />

                    {/* Retake Button Over Photo */}
                    <button
                      type="button"
                      onClick={handleRetakePhoto}
                      className="absolute top-3 right-3 flex items-center gap-1.5 rounded-xl bg-slate-950/85 px-3 py-1.5 text-xs font-bold text-amber-400 border border-amber-500/40 hover:bg-slate-900 transition shadow-lg"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Tirar Outra Foto</span>
                    </button>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Seu Nome / Grupo <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        autoFocus
                        value={formNome}
                        onChange={(e) => setFormNome(e.target.value)}
                        placeholder="Ex: Família Souza, 3º Ano B..."
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

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Onde você tirou a foto?
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
                      <option value="Praça Gastronômica">Praça Gastronômica / Lanches</option>
                      <option value="Palco de Apresentações">Palco das Apresentações</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Mensagem / Legenda da Foto
                    </label>
                    <textarea
                      rows={2}
                      value={formMensagem}
                      onChange={(e) => setFormMensagem(e.target.value)}
                      placeholder="Deixe um recado legal sobre o que você achou da feira cultural..."
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  {/* Publish & Cancel Buttons */}
                  <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={handleRetakePhoto}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Tirar Outra</span>
                    </button>

                    <button
                      type="submit"
                      disabled={!formNome.trim() || isSubmitting}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/25 hover:from-amber-400 hover:to-amber-500 transition disabled:opacity-50"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>{isSubmitting ? 'Publicando...' : 'Publicar no Mural'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
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
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-slate-950/80 text-white border border-slate-800 hover:bg-slate-800 transition"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative max-h-[65vh] w-full overflow-hidden bg-slate-950 flex items-center justify-center">
              <img
                src={selectedPhoto.fotoUrl}
                alt={selectedPhoto.autorNome}
                className="max-h-[65vh] w-auto max-w-full object-contain"
              />
            </div>

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
