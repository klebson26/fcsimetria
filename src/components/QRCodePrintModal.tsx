import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { getIdentidade } from '../services/storageService';
import { QrCode, Printer, X, Sparkles, Smartphone, Landmark, ShoppingBag, Compass, Award, ExternalLink } from 'lucide-react';

interface QRCodePrintModalProps {
  onClose: () => void;
  initialTopic?: 'geral' | 'paulista' | 'mercadao' | 'liberdade' | 'quiz';
}

export const QRCodePrintModal: React.FC<QRCodePrintModalProps> = ({
  onClose,
  initialTopic = 'geral'
}) => {
  const [selectedTopic, setSelectedTopic] = useState<'geral' | 'paulista' | 'mercadao' | 'liberdade' | 'quiz'>(initialTopic);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [customTableNumber, setCustomTableNumber] = useState<string>('01');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const identidade = getIdentidade();

  const baseUrl = window.location.origin + window.location.pathname;

  const topicsMap = {
    geral: {
      title: 'Site Geral da Feira Cultural',
      subtitle: 'Explore todo o Estado de São Paulo',
      url: baseUrl + '#',
      icon: Sparkles,
      color: 'from-amber-500 to-amber-600',
      badge: 'EXPLORAR TUDO'
    },
    paulista: {
      title: 'Especial Avenida Paulista',
      subtitle: 'História, MASP, arquitetura e atrativos da Paulista',
      url: baseUrl + '#paulista',
      icon: Landmark,
      color: 'from-rose-500 to-rose-600',
      badge: 'AV. PAULISTA'
    },
    mercadao: {
      title: 'Mercadão de São Paulo',
      subtitle: 'Iguarias, vitrais históricos e sanduíche de mortadela',
      url: baseUrl + '#mercadao',
      icon: ShoppingBag,
      color: 'from-amber-500 to-amber-600',
      badge: 'MERCADÃO MUNICIPAL'
    },
    liberdade: {
      title: 'Bairro da Liberdade',
      subtitle: 'Tradição oriental, gastronomia e cultura asiática',
      url: baseUrl + '#liberdade',
      icon: Compass,
      color: 'from-purple-500 to-purple-600',
      badge: 'BAIRRO DA LIBERDADE'
    },
    quiz: {
      title: 'Quiz Cultural da Feira',
      subtitle: 'Responda as perguntas na mesa e ganhe seu certificado!',
      url: baseUrl + '#quiz',
      icon: Award,
      color: 'from-blue-500 to-indigo-600',
      badge: 'DESAFIO QUIZ'
    }
  };

  const currentTopicData = topicsMap[selectedTopic];

  useEffect(() => {
    // Generate QR Code data URL
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
  }, [selectedTopic, currentTopicData.url]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:static print:block animate-fade-in">
      {/* Non-printable modal wrapper card */}
      <div className="relative w-full max-w-2xl rounded-3xl border border-amber-500/40 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6 print:border-none print:shadow-none print:bg-white print:p-0 print:w-full animate-fade-in-scale">
        {/* Modal Controls Header (Hidden on Print) */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                Display de Mesa com QR Code
              </h3>
              <p className="text-xs text-slate-400">
                Imprima este cartão para colocar nas mesas dos visitantes durante a feira cultural.
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

        {/* Topic Selector Tabs (Hidden on Print) */}
        <div className="space-y-3 print:hidden">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Selecione o Tópico Principal do QR Code:
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {(Object.keys(topicsMap) as Array<'geral' | 'paulista' | 'mercadao' | 'liberdade' | 'quiz'>).map((key) => {
              const item = topicsMap[key];
              const Icon = item.icon;
              const isSelected = selectedTopic === key;

              return (
                <button
                  key={key}
                  onClick={() => setSelectedTopic(key)}
                  className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border text-center transition ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/10 text-amber-300 font-bold shadow-md shadow-amber-500/10'
                      : 'border-slate-800 bg-slate-950/80 text-slate-400 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-[11px] truncate w-full">{item.badge}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <span className="text-xs text-slate-400 font-medium">Número da Mesa (opcional):</span>
            <input
              type="text"
              value={customTableNumber}
              onChange={(e) => setCustomTableNumber(e.target.value)}
              placeholder="Ex: 01"
              className="w-20 rounded-xl border border-slate-800 bg-slate-950 px-3 py-1 text-xs text-center font-bold text-amber-400 focus:outline-none"
            />
          </div>
        </div>

        {/* PRINTABLE DISPLAY STAND CARD (Visible both on screen and on print) */}
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

          {/* Headline & Banner */}
          <div className="space-y-1 py-1">
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/20 px-3 py-0.5 rounded-full border border-amber-500/30 print:bg-amber-100 print:text-amber-800">
              {currentTopicData.badge}
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white print:text-slate-950 leading-tight">
              {currentTopicData.title}
            </h2>
            <p className="text-xs text-slate-300 print:text-slate-600">
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
        <div className="flex items-center justify-between border-t border-slate-800 pt-4 print:hidden">
          <a
            href={currentTopicData.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-amber-400 hover:underline"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Abrir Link Direto
          </a>

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
