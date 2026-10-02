import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { SecaoAcessoMetrica } from '../../../services/analyticsService';

interface D3DonutChartSectionsProps {
  data: SecaoAcessoMetrica[];
}

export const D3DonutChartSections: React.FC<D3DonutChartSectionsProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredSection, setHoveredSection] = useState<SecaoAcessoMetrica | null>(null);

  const totalAcessos = data.reduce((acc, d) => acc + d.totalAcessos, 0);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 280;
    const height = 280;
    const radius = Math.min(width, height) / 2;
    const innerRadius = radius * 0.62;

    const g = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', '100%')
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // D3 Pie Generator
    const pie = d3
      .pie<SecaoAcessoMetrica>()
      .value((d) => d.totalAcessos)
      .sort(null)
      .padAngle(0.04);

    // D3 Arc Generator
    const arc = d3
      .arc<d3.PieArcDatum<SecaoAcessoMetrica>>()
      .innerRadius(innerRadius)
      .outerRadius(radius - 12)
      .cornerRadius(6);

    const arcHover = d3
      .arc<d3.PieArcDatum<SecaoAcessoMetrica>>()
      .innerRadius(innerRadius - 4)
      .outerRadius(radius)
      .cornerRadius(8);

    const arcs = g
      .selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs
      .append('path')
      .attr('fill', (d) => d.data.corHex)
      .attr('stroke', '#020617')
      .attr('stroke-width', 3)
      .attr('cursor', 'pointer')
      .style('transition', 'all 0.2s ease')
      .on('mouseenter', function (_, d) {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('d', arcHover as any)
          .attr('filter', 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.3))');

        setHoveredSection(d.data);
      })
      .on('mouseleave', function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', arc as any)
          .attr('filter', 'none');

        setHoveredSection(null);
      })
      .transition()
      .duration(750)
      .attrTween('d', function (d) {
        const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function (t) {
          return arc(i(t)) || '';
        };
      });
  }, [data]);

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center relative select-none">
      <div className="relative w-64 h-64 flex items-center justify-center">
        <svg ref={svgRef} className="w-full h-full overflow-visible" />

        {/* Center Dynamic Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-4">
          {hoveredSection ? (
            <div className="space-y-0.5 animate-fade-in">
              <span className="text-xl">{hoveredSection.icone}</span>
              <span className="text-[11px] font-bold text-slate-300 block truncate max-w-[120px]">
                {hoveredSection.nome}
              </span>
              <span className="font-mono text-base font-black text-amber-400">
                {Math.round((hoveredSection.totalAcessos / totalAcessos) * 100)}%
              </span>
              <span className="text-[9px] text-slate-400 font-mono block">
                {hoveredSection.totalAcessos.toLocaleString('pt-BR')} acessos
              </span>
            </div>
          ) : (
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Total Seções
              </span>
              <span className="font-mono text-xl font-black text-white">
                {totalAcessos.toLocaleString('pt-BR')}
              </span>
              <span className="text-[10px] text-amber-400 font-medium block">
                Visitas acumuladas
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        {data.map((item) => {
          const pct = Math.round((item.totalAcessos / totalAcessos) * 100);
          return (
            <div
              key={item.id}
              onMouseEnter={() => setHoveredSection(item)}
              onMouseLeave={() => setHoveredSection(null)}
              className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer hover:text-white transition"
            >
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.corHex }}
              />
              <span className="font-semibold">{item.icone} {item.nome}:</span>
              <span className="font-mono font-bold text-amber-400">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
