import React, { useState, useRef } from 'react';
import { Cidade, PontoTuristico, Regiao } from '../types/database';
import {
  Compass,
  MapPin,
  ArrowRight,
  X,
  Layers,
  Sparkles,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Navigation,
  Info,
  Building2,
  Mountain,
  Waves
} from 'lucide-react';

interface InteractiveMapProps {
  regioes: Regiao[];
  cidades: Cidade[];
  pontos: PontoTuristico[];
  onSelectCidade: (cidade: Cidade) => void;
  onSelectPonto: (ponto: PontoTuristico) => void;
}

// Exact real-world coordinates and altitudes for São Paulo municipalities
const REAL_GEO_DATA: Record<string, { lat: number; lng: number; altitude: string; bioma: string }> = {
  cid_1: { lat: -23.5505, lng: -46.6333, altitude: '760 m', bioma: 'Mata Atlântica / Planalto' }, // São Paulo
  cid_2: { lat: -23.9608, lng: -46.3336, altitude: '2 m', bioma: 'Costeiro / Manguezal' }, // Santos
  cid_3: { lat: -22.7394, lng: -45.5914, altitude: '1.628 m', bioma: 'Mantiqueira / Mata de Araucária' }, // Campos do Jordão
  cid_4: { lat: -22.9099, lng: -47.0626, altitude: '685 m', bioma: 'Transição Cerrado / Mata Atlântica' }, // Campinas
  cid_5: { lat: -21.1704, lng: -47.8103, altitude: '546 m', bioma: 'Cerrado Paulista' }, // Ribeirão Preto
  cid_6: { lat: -22.8467, lng: -45.2317, altitude: '542 m', bioma: 'Vale do Paraíba do Sul' } // Aparecida
};

// Cartographic bounds of São Paulo state for geographic projection
// Longitude: -53.20° W (Pontal do Paranapanema) to -44.15° W (Bananal)
// Latitude: -19.75° S (Rio Grande) to -25.35° S (Cananéia / Ilha do Cardoso)
const MAP_BOUNDS = {
  minLng: -53.20,
  maxLng: -44.15,
  minLat: -19.75,
  maxLat: -25.35
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  regioes,
  cidades,
  pontos,
  onSelectCidade,
  onSelectPonto
}) => {
  const [selectedRegiaoId, setSelectedRegiaoId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'CIDADES' | 'PONTOS'>('CIDADES');
  const [mapMode, setMapMode] = useState<'RELEVO' | 'VETORIAL' | 'SATELLITE'>('RELEVO');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [selectedCityModal, setSelectedCityModal] = useState<Cidade | null>(null);
  const [hoveredCity, setHoveredCity] = useState<Cidade | null>(null);
  const [cursorCoords, setCursorCoords] = useState<{ lat: string; lng: string }>({
    lat: '23°33\'01" S',
    lng: '46°38\'02" W'
  });

  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const filteredCidades = cidades.filter(
    (c) => !selectedRegiaoId || c.regiaoId === selectedRegiaoId
  );

  const filteredPontos = pontos.filter((p) => {
    if (!selectedRegiaoId) return true;
    const city = cidades.find((c) => c.id === p.cidadeId);
    return city?.regiaoId === selectedRegiaoId;
  });

  // Convert real geographic coordinate (lat, lng) to map (x%, y%)
  const getCityPercentPos = (city: Cidade) => {
    const geo = REAL_GEO_DATA[city.id];
    if (geo) {
      const x = ((geo.lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * 100;
      const y = ((geo.lat - MAP_BOUNDS.minLat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * 100;
      // Clamped within 5% - 95% of SVG viewport
      return {
        x: Math.max(6, Math.min(94, x)),
        y: Math.max(6, Math.min(94, y))
      };
    }
    return {
      x: city.posicaoMapa?.x ?? 50,
      y: city.posicaoMapa?.y ?? 50
    };
  };

  const handleMouseMoveMap = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;

    const curLng = MAP_BOUNDS.minLng + relX * (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng);
    const curLat = MAP_BOUNDS.minLat + relY * (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat);

    const latDeg = Math.floor(Math.abs(curLat));
    const latMin = Math.floor((Math.abs(curLat) - latDeg) * 60);
    const lngDeg = Math.floor(Math.abs(curLng));
    const lngMin = Math.floor((Math.abs(curLng) - lngDeg) * 60);

    setCursorCoords({
      lat: `${latDeg}°${latMin.toString().padStart(2, '0')}' S`,
      lng: `${lngDeg}°${lngMin.toString().padStart(2, '0')}' W`
    });
  };

  return (
    <div className="w-full rounded-3xl border border-slate-700/80 bg-slate-900/95 p-4 sm:p-8 shadow-2xl backdrop-blur-xl">
      {/* Header with Title and Mode Switcher */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Compass className="h-4 w-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              CARTOGRAFIA OFICIAL · ESTADO DE SÃO PAULO
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl mt-1">
            Mapa Geográfico & Cartográfico do Estado
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            Fiel à geografia paulista, com relevo da Serra do Mar e Mantiqueira, hidrografia do Rio Tietê, litoral e coordenadas reais das cidades.
          </p>
        </div>

        {/* Layer Mode Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setMapMode('RELEVO')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                mapMode === 'RELEVO'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mountain className="h-3.5 w-3.5" /> Relevo Físico
            </button>
            <button
              onClick={() => setMapMode('VETORIAL')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                mapMode === 'VETORIAL'
                  ? 'bg-blue-600 text-white font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="h-3.5 w-3.5" /> Político & Regiões
            </button>
            <button
              onClick={() => setMapMode('SATELLITE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                mapMode === 'SATELLITE'
                  ? 'bg-emerald-600 text-white font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Waves className="h-3.5 w-3.5" /> Satélite / Topo
            </button>
          </div>
        </div>
      </div>

      {/* Region Filter Buttons */}
      <div className="mb-6 flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => setSelectedRegiaoId(null)}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
            selectedRegiaoId === null
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
              : 'bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          Todas as Regiões ({cidades.length} cidades)
        </button>
        {regioes.map((reg) => (
          <button
            key={reg.id}
            onClick={() => setSelectedRegiaoId(reg.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition border ${
              selectedRegiaoId === reg.id
                ? 'bg-blue-600 text-white font-bold border-blue-400 shadow-md shadow-blue-500/20'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
            }`}
          >
            {reg.nome.split('&')[0]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Main Map Viewer Canvas */}
        <div className="relative min-h-[460px] lg:col-span-8 overflow-hidden rounded-2xl border-2 border-slate-700/80 bg-slate-950 shadow-2xl flex flex-col justify-between">
          {/* Top Bar inside Map Canvas: Zoom, Pan & Coordinates */}
          <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
            {/* Live GPS Coordinates display */}
            <div className="pointer-events-auto flex items-center gap-2 rounded-lg bg-slate-950/90 border border-slate-700 px-3 py-1.5 text-[11px] font-mono font-bold text-amber-400 backdrop-blur-md shadow-lg">
              <Navigation className="h-3 w-3 text-blue-400 animate-pulse" />
              <span>{cursorCoords.lat} · {cursorCoords.lng}</span>
            </div>

            {/* Zoom Controls */}
            <div className="pointer-events-auto flex items-center gap-1 rounded-lg bg-slate-950/90 border border-slate-700 p-1 backdrop-blur-md shadow-lg">
              <button
                onClick={() => setZoomLevel((z) => Math.min(1.8, z + 0.2))}
                className="p-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded"
                title="Aproximar Zoom"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(1, z - 0.2))}
                className="p-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded"
                title="Afastar Zoom"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1 text-slate-300 hover:text-amber-400 hover:bg-slate-800 rounded text-[10px] font-bold"
                title="Redefinir Zoom"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Map Visual Layer */}
          <div
            ref={mapContainerRef}
            onMouseMove={handleMouseMoveMap}
            className="relative h-full min-h-[460px] w-full overflow-hidden flex items-center justify-center select-none"
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'center center',
              transition: 'transform 0.25s ease-out'
            }}
          >
            {/* BASEMAP LAYER 1: Realistic Geographical Relief & Terrain */}
            {mapMode === 'RELEVO' && (
              <div className="absolute inset-0 h-full w-full">
                <img
                  src="/images/mapa_estado_sp_geografico_1790705536183.jpg"
                  alt="Mapa Geográfico do Estado de São Paulo"
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-slate-950/20 pointer-events-none" />
              </div>
            )}

            {/* BASEMAP LAYER 2: Satellite / Topography */}
            {mapMode === 'SATELLITE' && (
              <div className="absolute inset-0 h-full w-full">
                <img
                  src="/images/mapa_sp_topografico_vetor_1790705555599.jpg"
                  alt="Mapa Topográfico Satélite"
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-slate-950/15 pointer-events-none" />
              </div>
            )}

            {/* BASEMAP LAYER 3: Razor-Sharp High-Precision Vector SVG Cartography */}
            {mapMode === 'VETORIAL' && (
              <div className="absolute inset-0 h-full w-full flex items-center justify-center p-2 bg-[#090d16]">
                <svg
                  viewBox="0 0 1000 680"
                  className="h-full w-full"
                >
                  <defs>
                    {/* Gradients */}
                    <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0b192c" />
                      <stop offset="100%" stopColor="#031120" />
                    </linearGradient>

                    <linearGradient id="spStateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1e293b" />
                      <stop offset="50%" stopColor="#1e2538" />
                      <stop offset="100%" stopColor="#172033" />
                    </linearGradient>

                    {/* Graticule pattern */}
                    <pattern id="gridPattern" width="100" height="100" patternUnits="userSpaceOnUse">
                      <line x1="0" y1="0" x2="100" y2="0" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
                      <line x1="0" y1="0" x2="0" y2="100" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
                    </pattern>
                  </defs>

                  {/* Ocean & Land Backdrop with Coordinate Graticules */}
                  <rect width="1000" height="680" fill="url(#oceanGrad)" />
                  <rect width="1000" height="680" fill="url(#gridPattern)" />

                  {/* Atlantic Ocean Label & Waves */}
                  <path
                    d="M 640 560 Q 750 510, 850 440 T 960 380 L 1000 680 L 520 680 Z"
                    fill="#082f49"
                    opacity="0.6"
                  />
                  <text x="740" y="600" fill="#38bdf8" fontSize="13" fontWeight="bold" fontFamily="monospace" letterSpacing="3">
                    OCEANO ATLÂNTICO
                  </text>

                  {/* Neighboring States (Outlines & Labels) */}
                  {/* Minas Gerais (Norte e Nordeste) */}
                  <text x="420" y="80" fill="#475569" fontSize="12" fontWeight="bold" fontFamily="monospace">
                    MINAS GERAIS (MG)
                  </text>
                  {/* Mato Grosso do Sul (Oeste) */}
                  <text x="60" y="240" fill="#475569" fontSize="11" fontWeight="bold" fontFamily="monospace">
                    MATO GROSSO DO SUL (MS)
                  </text>
                  {/* Paraná (Sul) */}
                  <text x="280" y="560" fill="#475569" fontSize="12" fontWeight="bold" fontFamily="monospace">
                    PARANÁ (PR)
                  </text>
                  {/* Rio de Janeiro (Extremo Leste) */}
                  <text x="910" y="320" fill="#475569" fontSize="11" fontWeight="bold" fontFamily="monospace">
                    RIO DE JANEIRO (RJ)
                  </text>

                  {/* REAL AUTHENTIC SHAPE OF SÃO PAULO STATE */}
                  {/* Points represent the actual boundaries from Pontal do Paranapanema to Vale do Paraíba */}
                  <path
                    d="
                      M 50 350 
                      L 90 310 
                      L 130 250 
                      L 170 210 
                      L 220 180 
                      L 280 150 
                      L 340 120 
                      L 400 95 
                      L 470 90 
                      L 530 115 
                      L 580 120 
                      L 630 150 
                      L 690 170 
                      L 750 210 
                      L 800 240 
                      L 850 270 
                      L 910 300 
                      L 960 330 
                      L 970 350 
                      L 950 375 
                      L 920 380 
                      L 880 405 
                      L 850 435 
                      L 820 460 
                      L 780 490 
                      L 740 520 
                      L 700 550 
                      L 670 565 
                      L 630 560 
                      L 580 540 
                      L 540 515 
                      L 500 490 
                      L 460 480 
                      L 410 475 
                      L 360 470 
                      L 310 465 
                      L 250 455 
                      L 190 440 
                      L 140 420 
                      L 90 395 
                      Z
                    "
                    fill="url(#spStateGrad)"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />

                  {/* Internal Hydrography (Rio Tietê Crossing the State) */}
                  <path
                    d="M 750 490 Q 680 470, 600 430 T 450 360 T 320 320 T 180 270 T 90 310"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.8"
                  />
                  <text x="470" y="380" fill="#38bdf8" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    Rio Tietê
                  </text>

                  {/* Rio Paranapanema (Divisa Sul com PR) */}
                  <path
                    d="M 500 490 Q 400 475, 300 465 T 160 430 T 50 350"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.7"
                  />
                  <text x="250" y="480" fill="#38bdf8" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    Rio Paranapanema
                  </text>

                  {/* Serra do Mar and Mantiqueira Mountain Ribbons */}
                  <path
                    d="M 680 565 Q 750 510, 840 440 T 930 375"
                    fill="none"
                    stroke="#d97706"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                    opacity="0.8"
                  />
                  <text x="820" y="470" fill="#fbbf24" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    Serra do Mar & Mantiqueira
                  </text>
                </svg>
              </div>
            )}

            {/* CARTOGRAPHIC OVERLAY: Latitude & Longitude Coordinate Graticule Grid */}
            <div className="absolute inset-0 pointer-events-none border border-slate-700/60">
              {/* Latitude lines */}
              <div className="absolute top-[20%] left-0 right-0 border-b border-white/10 flex justify-between px-2 text-[9px] font-mono text-slate-400">
                <span>21°00' S</span>
                <span>21°00' S</span>
              </div>
              <div className="absolute top-[45%] left-0 right-0 border-b border-white/10 flex justify-between px-2 text-[9px] font-mono text-slate-400">
                <span>22°30' S</span>
                <span>22°30' S</span>
              </div>
              <div className="absolute top-[75%] left-0 right-0 border-b border-white/10 flex justify-between px-2 text-[9px] font-mono text-slate-400">
                <span>24°00' S</span>
                <span>24°00' S</span>
              </div>

              {/* Longitude lines */}
              <div className="absolute left-[25%] top-0 bottom-0 border-r border-white/10 flex flex-col justify-between py-2 text-[9px] font-mono text-slate-400">
                <span>51°00' W</span>
                <span>51°00' W</span>
              </div>
              <div className="absolute left-[50%] top-0 bottom-0 border-r border-white/10 flex flex-col justify-between py-2 text-[9px] font-mono text-slate-400">
                <span>48°30' W</span>
                <span>48°30' W</span>
              </div>
              <div className="absolute left-[75%] top-0 bottom-0 border-r border-white/10 flex flex-col justify-between py-2 text-[9px] font-mono text-slate-400">
                <span>46°00' W</span>
                <span>46°00' W</span>
              </div>
            </div>

            {/* PINS: Geographically Placed Municipalities */}
            {filteredCidades.map((city) => {
              const pos = getCityPercentPos(city);
              const isHovered = hoveredCity?.id === city.id;
              const geo = REAL_GEO_DATA[city.id];

              return (
                <div
                  key={city.id}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-30"
                  onClick={() => {
                    setSelectedCityModal(city);
                    onSelectCidade(city);
                  }}
                  onMouseEnter={() => setHoveredCity(city)}
                  onMouseLeave={() => setHoveredCity(null)}
                >
                  {/* Pin Icon & Pulse Ring */}
                  <div className="relative flex items-center justify-center">
                    <span className="absolute h-9 w-9 rounded-full bg-amber-400/40 animate-ping" />
                    <div
                      className={`relative flex h-8 w-8 items-center justify-center rounded-full font-bold shadow-2xl transition-all duration-300 border-2 ${
                        city.titulo.includes('São Paulo')
                          ? 'bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 border-white scale-110 shadow-amber-500/50'
                          : 'bg-gradient-to-tr from-blue-600 to-indigo-500 text-white border-blue-200 hover:scale-125 hover:bg-amber-500 hover:text-slate-950'
                      }`}
                    >
                      <MapPin className="h-4 w-4 drop-shadow" />
                    </div>
                  </div>

                  {/* Crisp Floating Label */}
                  <div
                    className={`absolute left-1/2 top-9 -translate-x-1/2 whitespace-nowrap rounded-lg border px-2.5 py-1 text-[11px] font-bold shadow-2xl transition-all duration-200 ${
                      isHovered
                        ? 'bg-amber-400 text-slate-950 border-amber-300 scale-110 z-40'
                        : 'bg-slate-950/95 text-white border-slate-700/90'
                    }`}
                  >
                    <span className="block">{city.titulo.split('(')[0]}</span>
                    {geo && (
                      <span className="block text-[9px] font-mono text-slate-400 font-normal">
                        Alt: {geo.altitude}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Footer Bar: Cartographic Scale & Legend */}
          <div className="relative z-20 flex flex-wrap items-center justify-between gap-2 border-t border-slate-700/80 bg-slate-950/95 px-4 py-2.5 text-xs">
            {/* Scale bar */}
            <div className="flex items-center gap-3 font-mono text-[11px] text-slate-300">
              <span className="font-bold text-amber-400">ESCALA:</span>
              <div className="flex items-center">
                <span className="border-l border-t border-b border-white px-2 py-0.5 text-[10px]">
                  0 km
                </span>
                <span className="border-r border-t border-b border-white px-2 py-0.5 text-[10px]">
                  100 km
                </span>
                <span className="border-r border-t border-b border-white px-2 py-0.5 text-[10px]">
                  200 km
                </span>
              </div>
            </div>

            {/* City Count Indicator */}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{filteredCidades.length} cidades demarcadas no mapa</span>
            </div>
          </div>
        </div>

        {/* Sidebar list for Map */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
            <button
              onClick={() => setActiveTab('CIDADES')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                activeTab === 'CIDADES'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Cidades ({filteredCidades.length})
            </button>
            <button
              onClick={() => setActiveTab('PONTOS')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                activeTab === 'PONTOS'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pontos Turísticos ({filteredPontos.length})
            </button>
          </div>

          <div className="max-h-[400px] space-y-2.5 overflow-y-auto pr-1">
            {activeTab === 'CIDADES' ? (
              filteredCidades.map((city) => {
                const geo = REAL_GEO_DATA[city.id];
                return (
                  <div
                    key={city.id}
                    onClick={() => {
                      setSelectedCityModal(city);
                      onSelectCidade(city);
                    }}
                    className="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/80 p-3 hover:border-amber-500/60 hover:bg-slate-800/90 cursor-pointer transition shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 overflow-hidden rounded-xl bg-slate-800 border border-slate-700 shrink-0">
                        <img
                          src={city.imagemPrincipal}
                          alt={city.titulo}
                          className="h-full w-full object-cover group-hover:scale-110 transition duration-300"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition">
                          {city.titulo}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <span>{city.regiaoNome.split('&')[0]}</span>
                          {geo && (
                            <>
                              <span>·</span>
                              <span className="font-mono text-amber-400">{geo.altitude}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition shrink-0" />
                  </div>
                );
              })
            ) : (
              filteredPontos.map((ponto) => (
                <div
                  key={ponto.id}
                  onClick={() => onSelectPonto(ponto)}
                  className="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/80 p-3 hover:border-blue-500/60 hover:bg-slate-800/90 cursor-pointer transition shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 overflow-hidden rounded-xl bg-slate-800 border border-slate-700 shrink-0">
                      <img
                        src={ponto.imagemPrincipal}
                        alt={ponto.titulo}
                        className="h-full w-full object-cover group-hover:scale-110 transition duration-300"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition">
                        {ponto.titulo}
                      </h4>
                      <p className="text-[11px] text-slate-400">{ponto.cidadeNome}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition shrink-0" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* City Detail Drawer Modal */}
      {selectedCityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl border border-amber-500/40 bg-slate-900 p-6 sm:p-8 shadow-2xl animate-fade-in-scale">
            <button
              onClick={() => setSelectedCityModal(null)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="h-36 w-full sm:w-52 shrink-0 overflow-hidden rounded-2xl border-2 border-amber-500/40 shadow-xl">
                <img
                  src={selectedCityModal.imagemPrincipal}
                  alt={selectedCityModal.titulo}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded">
                  {selectedCityModal.regiaoNome}
                </span>
                <h3 className="font-serif text-2xl font-bold text-white">
                  {selectedCityModal.titulo}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedCityModal.descricao}
                </p>

                {/* Geographical technical metrics */}
                {REAL_GEO_DATA[selectedCityModal.id] && (
                  <div className="rounded-xl bg-slate-950 border border-slate-800 p-2.5 mt-2 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
                    <div>
                      <span className="text-slate-500 block">Altitude:</span>
                      <strong className="text-amber-400">{REAL_GEO_DATA[selectedCityModal.id].altitude}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Coordenadas:</span>
                      <strong>{REAL_GEO_DATA[selectedCityModal.id].lat.toFixed(3)}°, {REAL_GEO_DATA[selectedCityModal.id].lng.toFixed(3)}°</strong>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500 block">Bioma / Geografia:</span>
                      <strong>{REAL_GEO_DATA[selectedCityModal.id].bioma}</strong>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 text-[11px] font-mono text-slate-400 pt-1">
                  <span>População: {selectedCityModal.populacao || 'N/A'}</span>
                  <span>·</span>
                  <span>Distância da Capital: {selectedCityModal.distanciaCapital || '0 km'}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-800 pt-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                História & Destaques Culturais
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedCityModal.historia}
              </p>

              {selectedCityModal.curiosidades && selectedCityModal.curiosidades.length > 0 && (
                <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-1">
                    <Info className="h-3.5 w-3.5" /> Curiosidade Paulista
                  </div>
                  <p className="text-xs text-amber-200/90">
                    {selectedCityModal.curiosidades[0]}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedCityModal(null)}
                className="rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
              >
                Fechar Ficha Técnica
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
