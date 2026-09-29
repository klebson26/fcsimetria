import React, { useState, useEffect } from 'react';
import { getCidades, saveEntity, KEYS, subscribeStorage, getRegioes } from '../../services/storageService';
import { Cidade } from '../../types/database';
import { Map, MapPin, Edit2, Save } from 'lucide-react';

export const AdminMapa: React.FC = () => {
  const [cidades, setCidades] = useState<Cidade[]>(getCidades());
  const [regioes] = useState(getRegioes());
  const [selectedCity, setSelectedCity] = useState<Cidade | null>(null);

  useEffect(() => {
    return subscribeStorage(() => {
      setCidades(getCidades());
    });
  }, []);

  const handleUpdatePosition = (city: Cidade, posX: number, posY: number) => {
    const updated = {
      ...city,
      posicaoMapa: { x: posX, y: posY }
    };
    saveEntity(KEYS.CIDADES, updated, 'Cidade');
  };

  return (
    <div className="p-4 sm:p-8 space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
          <Map className="h-6 w-6 text-amber-400" /> Configuração do Mapa de São Paulo
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Ajuste as posições (X%, Y%) dos marcadores das cidades no mapa interativo.
        </p>
      </div>

      <div className="space-y-3">
        {cidades.map((city) => (
          <div key={city.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-amber-400" />
                <h4 className="text-sm font-bold text-white">{city.titulo}</h4>
              </div>
              <p className="text-xs text-slate-400">{city.regiaoNome}</p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span>Posição X:</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={city.posicaoMapa?.x ?? 50}
                  onChange={(e) => handleUpdatePosition(city, parseInt(e.target.value) || 0, city.posicaoMapa?.y ?? 50)}
                  className="w-16 rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 text-white text-center font-bold"
                />
                <span>%</span>
              </div>

              <div className="flex items-center gap-2">
                <span>Posição Y:</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={city.posicaoMapa?.y ?? 50}
                  onChange={(e) => handleUpdatePosition(city, city.posicaoMapa?.x ?? 50, parseInt(e.target.value) || 0)}
                  className="w-16 rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 text-white text-center font-bold"
                />
                <span>%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
