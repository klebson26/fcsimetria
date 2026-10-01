import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { getIdentidade, getCidades } from '../services/storageService';
import { Cidade } from '../types/database';
import {
  QrCode,
  Printer,
  X,
  Sparkles,
  Smartphone,
  Landmark,
  ShoppingBag,
  Compass,
  Award,
  ExternalLink,
  Download,
  Building2,
  Utensils,
  Palette,
  Music,
  Clock,
  HelpCircle,
  MapPin,
  Check,
  Camera
} from 'lucide-react';

interface QRCodePrintModalProps {
  onClose: () => void;
  initialTopic?: string;
}

export const QRCodePrintModal: React.FC<QRCodePrintModalProps> = ({
  onClose,
  initialTopic = 'geral'
}) => {
  const [selectedTopic, setSelectedTopic] = useState<string>(initialTopic);
  const [selectedCidadeId, setSelectedCidadeId] = useState<string>('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [customTableNumber, setCustomTableNumber] = useState<string>('01');
  const [copied, setCopied] = useState(false);

  const identidade = getIdentidade();
  const cidades = getCidades().filter((c) => c.status === 'PUBLICADO');

  const baseUrl = window.location.origin + window.location.pathname;

  // Dictionary of main topics
  const topicsMap: Record<
    string,
    {
      title: string;
      subtitle: string;
      url: string;
      icon: any;
      badge: string;
    }
  > = {
    geral: {
      title: 'Portal Geral da Feira Cultural',
      subtitle: 'Explore o mapa, cidades, gastronomia e história de São Paulo',
      url: baseUrl + '#',
      icon: Sparkles,
      badge: 'EXPLORAR TUDO'
    },
    mural: {
      title: 'Mural de Fotos dos Visitantes',
      subtitle: 'Tire sua foto e participe ao vivo do mural de memórias da feira',
      url: baseUrl + '#mural',
      icon: Camera,
      badge: 'MURAL AO VIVO'
    },
    cidades: {
      title: 'Cidades Paulistas',
      subtitle: 'Municípios do litoral, interior e região metropolitana de SP',
      url: baseUrl + '#cidades',
      icon: Building2,
      badge: 'CIDADES DE SP'
    },
    paulista: {
      title: 'Avenida Paulista (Página Exclusiva)',
      subtitle: 'História, linha do tempo, MASP, arquitetura e atrativos',
      url: baseUrl + '#paulista',
      icon: Landmark,
      badge: 'PÁGINA DEDICADA'
    },
    mercadao: {
      title: 'Mercadão Municipal de SP (Página Exclusiva)',
      subtitle: 'Iguarias, 72 vitrais históricos e os produtos mais famosos',
      url: baseUrl + '#mercadao',
      icon: ShoppingBag,
      badge: 'PÁGINA DEDICADA'
    },
    liberdade: {
      title: 'Bairro da Liberdade (Página Exclusiva)',
      subtitle: 'Tradição oriental, feirinha, gastronomia e cultura asiática',
      url: baseUrl + '#liberdade',
      icon: Compass,
      badge: 'PÁGINA DEDICADA'
    },
    culinaria: {
      title: 'Gastronomia & Pratos Típicos',
      subtitle: 'Sabores marcantes da culinária paulistana e caipira',
      url: baseUrl + '#culinaria',
      icon: Utensils,
      badge: 'GASTRONOMIA'
    },
    artesanato: {
      title: 'Artesanato & Arte Popular',
      subtitle: 'Tradição artesanal, feiras de arte e mestres paulistas',
      url: baseUrl + '#artesanato',
      icon: Palette,
      badge: 'ARTESANATO'
    },
    cultura: {
      title: 'Cultura & Folclore de SP',
      subtitle: 'Festas tradicionais, danças, música caipira e manifestações',
      url: baseUrl + '#cultura',
      icon: Music,
      badge: 'CULTURA & FOLCLORE'
    },
    historia: {
      title: 'História & Linha do Tempo',
      subtitle: 'Da fundação de São Paulo aos dias atuais',
      url: baseUrl + '#historia',
      icon: Clock,
      badge: 'HISTÓRIA DE SP'
    },
    quiz: {
      title: 'Quiz Cultural da Feira',
      subtitle: 'Responda as perguntas na mesa e teste seus conhecimentos!',
      url: baseUrl + '#quiz',
      icon: Award,
      badge: 'DESAFIO QUIZ'
    },
    duvidas: {
      title: 'Mural de Dúvidas & Perguntas',
      subtitle: 'Envie sua mensagem ou pergunta durante a feira cultural',
      url: baseUrl + '#duvidas',
      icon: HelpCircle,
      badge: 'PERGUNTAS'
    }
  };

  // Check if topic is a specific city
  let currentTopicData = topicsMap[selectedTopic];

  if (!currentTopicData && selectedCidadeId) {
    const city = cidades.find((c) => c.id === selectedCidadeId);
    if (city) {
      currentTopicData = {
        title: `Cidade: ${city.titulo}`,
        subtitle: `${city.regiaoNome} · População: ${city.populacao || 'N/A'}`,
        url: `${baseUrl}#cidades`,
        icon: MapPin,
        badge: `FICHA: ${city.titulo.toUpperCase()}`
      };
    }
  }

  // Fallback to Geral if topic not found
  if (!currentTopicData) {
    currentTopicData = topicsMap.geral;
  }

  useEffect(() => {
    QRCode.toDataURL(currentTopicData.url, {
      width: 400,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
      .then((url) => {
        setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('Error generating QR code:', err);
      });
  }, [currentTopicData.url]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadImage = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `qrcode_feiracultural_${selectedTopic}_simetria.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentTopicData.url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:static print:block animate-fade-in">
      {/* Modal Wrapper */}
      <div className="relative w-full max-w-3xl rounded-3xl border border-amber-500/40 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6 print:border-none print:shadow-none print:bg-white print:p-0 print:w-full animate-fade-in-scale">
        {/* Modal Controls Header (Hidden on Print) */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                Gerador de QR Code por Tópico & Totem de Mesa
              </h3>
              <p className="text-xs text-slate-400">
                Selecione qualquer tópico ou cidade específica para gerar o QR Code direcionado.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Topic & City Selection Tabs (Hidden on Print) */}
        <div className="space-y-4 print:hidden">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
              1. Escolha o Tópico da Feira para o QR Code:
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
              {Object.keys(topicsMap).map((key) => {
                const item = topicsMap[key];
                const Icon = item.icon;
                const isSelected = selectedTopic === key && !selectedCidadeId;

                return (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedTopic(key);
                      setSelectedCidadeId('');
                    }}
                    className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border text-center transition ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/15 text-amber-300 font-bold shadow-md shadow-amber-500/10'
                        : 'border-slate-800 bg-slate-950/80 text-slate-400 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-[10px] truncate w-full font-medium">{item.badge}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* City Specific Selector */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1 border-t border-slate-800/80">
            <div className="flex-1 space-y-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-amber-400" /> Ou Direcionar para Ficha de uma Cidade Específica:
              </label>
              <select
                value={selectedCidadeId}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedCidadeId(val);
                  if (val) {
                    const city = cidades.find((c) => c.id === val);
                    if (city) {
                      setSelectedTopic(`cidade_${city.id}`);
                    }
                  } else {
                    setSelectedTopic('geral');
                  }
                }}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
              >
                <option value="">-- Selecionar Cidade Específica --</option>
                {cidades.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.titulo} ({c.regiaoNome})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 block">Número/Nome da Mesa:</label>
              <input
                type="text"
                value={customTableNumber}
                onChange={(e) => setCustomTableNumber(e.target.value)}
                placeholder="Ex: 01"
                className="w-full sm:w-28 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-center font-bold text-amber-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* PRINTABLE DISPLAY STAND CARD */}
        <div className="printable-stand-card mx-auto max-w-md rounded-2xl border-4 border-amber-500 bg-slate-950 p-6 sm:p-8 text-center shadow-2xl relative space-y-4 print:border-4 print:border-slate-900 print:bg-white print:text-slate-950 print:shadow-none print:m-0 print:max-w-none">
          {/* Top School Header */}
          <div className="flex items-center justify-between border-b border-amber-500/30 pb-3 print:border-slate-300">
            <div className="flex items-center gap-2.5 text-left">
              <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-900 border border-amber-500/50 p-0.5 shrink-0 print:border-slate-400">
                <img
                  src={identidade.logoUrl || '/logo-simetria.jpg'}
                  alt={identidade.nomeColegio}
                  className="h-full w-full object-contain rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/logo-simetria.jpg';
                  }}
                />
              </div>
              <div>
                <span className="font-serif text-sm font-bold text-white print:text-slate-950 block">
                  {identidade.nomeColegio}
                </span>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block print:text-amber-700">
                  {identidade.nomeFeira}
                </span>
              </div>
            </div>

            {customTableNumber && (
              <span className="font-mono text-xs font-bold text-amber-400 border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 rounded-md print:bg-slate-100 print:text-slate-900 print:border-slate-300">
                MESA {customTableNumber}
              </span>
            )}
          </div>

          {/* Headline & Badge */}
          <div className="space-y-1.5 py-1">
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/20 px-3 py-0.5 rounded-full border border-amber-500/30 print:bg-amber-100 print:text-amber-800">
              {currentTopicData.badge}
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white print:text-slate-950 leading-tight">
              {currentTopicData.title}
            </h2>
            <p className="text-xs text-slate-300 print:text-slate-600 leading-relaxed">
              {currentTopicData.subtitle}
            </p>
          </div>

          {/* QR Code Container */}
          <div className="p-4 bg-white rounded-2xl border-2 border-amber-500/50 inline-block shadow-xl my-2 print:border-slate-400">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="QR Code" className="h-44 w-44 mx-auto" />
            ) : (
              <div className="h-44 w-44 bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                Gerando QR Code...
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-400 print:text-slate-900">
              <Smartphone className="h-4 w-4 text-amber-400 print:text-amber-700" />
              <span>Aponte a câmera do celular para acessar no seu aparelho</span>
            </div>
            <p className="text-[11px] text-slate-400 print:text-slate-500 font-mono break-all">
              {currentTopicData.url}
            </p>
          </div>

          {/* Footer watermark */}
          <div className="border-t border-amber-500/20 pt-3 text-[10px] text-slate-500 print:text-slate-400 flex items-center justify-between font-mono">
            <span>Colégio Simetria · 2026</span>
            <span>São Paulo: Cultura & História</span>
          </div>
        </div>

        {/* Modal Action Footer (Hidden on Print) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800 pt-4 print:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <ExternalLink className="h-3.5 w-3.5" />}
              <span>{copied ? 'Link Copiado!' : 'Copiar Link'}</span>
            </button>

            <button
              onClick={handleDownloadImage}
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition"
            >
              <Download className="h-3.5 w-3.5 text-blue-400" /> Baixar Imagem PNG
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              Fechar
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition shadow-lg shadow-amber-500/20"
            >
              <Printer className="h-4 w-4" /> Imprimir Totem de Mesa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
