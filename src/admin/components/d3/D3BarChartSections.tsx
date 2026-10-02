import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { SecaoAcessoMetrica } from '../../../services/analyticsService';

interface D3BarChartSectionsProps {
  data: SecaoAcessoMetrica[];
  selectedMetric?: 'totalAcessos' | 'visitantesUnicos' | 'interacoes';
}

export const D3BarChartSections: React.FC<D3BarChartSectionsProps> = ({
  data,
  selectedMetric = 'totalAcessos'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltipData, setTooltipData] = useState<{
    x: number;
    y: number;
    visible: boolean;
    item?: SecaoAcessoMetrica;
    value?: number;
    pct?: number;
  }>({ x: 0, y: 0, visible: false });

  const metricLabel = {
    totalAcessos: 'Total de Visitas',
    visitantesUnicos: 'Visitantes Únicos',
    interacoes: 'Interações e Engajamento'
  }[selectedMetric];

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const containerWidth = containerRef.current.clientWidth || 500;
    const width = Math.max(320, containerWidth);
    const height = 320;

    const margin = { top: 35, right: 30, bottom: 50, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const totalValue = d3.sum(data, (d) => d[selectedMetric]) || 1;

    // Define defs and gradients
    const defs = svg.append('defs');
    data.forEach((d) => {
      const grad = defs
        .append('linearGradient')
        .attr('id', `grad-bar-${d.id}`)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');

      grad
        .append('stop')
        .attr('offset', '0%')
        .attr('stop-color', d.corSecundaria || d.corHex)
        .attr('stop-opacity', 1);

      grad
        .append('stop')
        .attr('offset', '100%')
        .attr('stop-color', d.corHex)
        .attr('stop-opacity', 0.85);
    });

    const g = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X Scale
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.nome))
      .range([0, innerWidth])
      .padding(0.35);

    // Y Scale
    const maxVal = d3.max(data, (d) => d[selectedMetric]) || 100;
    const y = d3
      .scaleLinear()
      .domain([0, maxVal * 1.15])
      .nice()
      .range([innerHeight, 0]);

    // Background horizontal grid lines
    g.append('g')
      .attr('class', 'grid')
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickSize(-innerWidth)
          .tickFormat(() => '')
      )
      .selectAll('line')
      .attr('stroke', '#334155')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-dasharray', '3 3');

    g.select('.grid .domain').remove();

    // Bars
    const bars = g
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'bar-group');

    bars
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => x(d.nome) || 0)
      .attr('y', innerHeight)
      .attr('width', x.bandwidth())
      .attr('height', 0)
      .attr('rx', 8)
      .attr('ry', 8)
      .attr('fill', (d) => `url(#grad-bar-${d.id})`)
      .attr('cursor', 'pointer')
      .attr('filter', 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))')
      .on('mouseenter', function (event, d) {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('opacity', 1)
          .attr('filter', 'drop-shadow(0 0 16px rgba(245, 158, 11, 0.4))');

        const [mX, mY] = d3.pointer(event, containerRef.current);
        const pct = Math.round((d[selectedMetric] / totalValue) * 100);
        setTooltipData({
          x: mX,
          y: mY - 10,
          visible: true,
          item: d,
          value: d[selectedMetric],
          pct
        });
      })
      .on('mousemove', function (event) {
        const [mX, mY] = d3.pointer(event, containerRef.current);
        setTooltipData((prev) => ({
          ...prev,
          x: mX,
          y: mY - 10
        }));
      })
      .on('mouseleave', function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 0.95)
          .attr('filter', 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))');

        setTooltipData((prev) => ({ ...prev, visible: false }));
      })
      .transition()
      .duration(800)
      .delay((_, i) => i * 120)
      .ease(d3.easeCubicOut)
      .attr('y', (d) => y(d[selectedMetric]))
      .attr('height', (d) => innerHeight - y(d[selectedMetric]));

    // Top values text
    bars
      .append('text')
      .attr('x', (d) => (x(d.nome) || 0) + x.bandwidth() / 2)
      .attr('y', (d) => y(d[selectedMetric]) - 8)
      .attr('text-anchor', 'middle')
      .attr('fill', '#f1f5f9')
      .attr('font-size', '12px')
      .attr('font-weight', '700')
      .attr('opacity', 0)
      .text((d) => d[selectedMetric].toLocaleString('pt-BR'))
      .transition()
      .duration(800)
      .delay((_, i) => i * 120 + 200)
      .attr('opacity', 1);

    // X Axis
    const xAxis = g
      .append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x));

    xAxis.select('.domain').attr('stroke', '#475569');
    xAxis
      .selectAll('text')
      .attr('fill', '#cbd5e1')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('dy', '1.2em');

    // Y Axis
    const yAxis = g.append('g').call(
      d3
        .axisLeft(y)
        .ticks(5)
        .tickFormat((v) => Number(v).toLocaleString('pt-BR'))
    );

    yAxis.select('.domain').remove();
    yAxis
      .selectAll('text')
      .attr('fill', '#94a3b8')
      .attr('font-size', '11px')
      .attr('font-family', 'monospace');
  }, [data, selectedMetric]);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden select-none">
      <svg ref={svgRef} className="w-full overflow-visible" />

      {/* Floating D3 Tooltip */}
      {tooltipData.visible && tooltipData.item && (
        <div
          className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-full rounded-2xl border border-slate-700 bg-slate-900/95 p-3.5 shadow-2xl backdrop-blur-md text-xs space-y-1.5 transition-transform"
          style={{
            left: `${tooltipData.x}px`,
            top: `${tooltipData.y}px`
          }}
        >
          <div className="flex items-center gap-2 border-b border-slate-800 pb-1.5">
            <span className="text-base">{tooltipData.item.icone}</span>
            <span className="font-bold text-white text-sm">
              {tooltipData.item.nome}
            </span>
          </div>

          <div className="space-y-1 font-mono text-[11px]">
            <div className="flex justify-between gap-4 text-slate-300">
              <span>{metricLabel}:</span>
              <strong className="text-amber-400 font-bold">
                {tooltipData.value?.toLocaleString('pt-BR')}
              </strong>
            </div>

            <div className="flex justify-between gap-4 text-slate-400">
              <span>Participação:</span>
              <span className="text-emerald-400 font-bold">
                {tooltipData.pct}% do total
              </span>
            </div>

            <div className="flex justify-between gap-4 text-slate-400">
              <span>Tempo médio:</span>
              <span className="text-blue-400 font-semibold">
                {tooltipData.item.tempoMedioMinutos} min
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
