import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { SecaoAcessoMetrica } from '../../../services/analyticsService';

interface D3TimelineChartSectionsProps {
  data: SecaoAcessoMetrica[];
}

export const D3TimelineChartSections: React.FC<D3TimelineChartSectionsProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Extract common hour labels
  const hours = data[0]?.historicoHoras.map((h) => h.hora) || [];

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || data.length === 0 || hours.length === 0)
      return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const containerWidth = containerRef.current.clientWidth || 600;
    const width = Math.max(340, containerWidth);
    const height = 280;

    const margin = { top: 25, right: 30, bottom: 40, left: 45 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X Scale
    const x = d3.scalePoint().domain(hours).range([0, innerWidth]).padding(0.2);

    // Y Scale
    const maxVal =
      d3.max(data.flatMap((d) => d.historicoHoras.map((h) => h.acessos))) || 200;
    const y = d3
      .scaleLinear()
      .domain([0, maxVal * 1.15])
      .nice()
      .range([innerHeight, 0]);

    // Grid lines
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
      .attr('stroke-opacity', 0.35)
      .attr('stroke-dasharray', '3 3');

    g.select('.grid .domain').remove();

    // Defs for gradients
    const defs = svg.append('defs');
    data.forEach((d) => {
      const grad = defs
        .append('linearGradient')
        .attr('id', `area-grad-${d.id}`)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');

      grad
        .append('stop')
        .attr('offset', '0%')
        .attr('stop-color', d.corHex)
        .attr('stop-opacity', 0.3);

      grad
        .append('stop')
        .attr('offset', '100%')
        .attr('stop-color', d.corHex)
        .attr('stop-opacity', 0.0);
    });

    // D3 Line & Area Generators
    const lineGen = d3
      .line<{ hora: string; acessos: number }>()
      .x((d) => x(d.hora) || 0)
      .y((d) => y(d.acessos))
      .curve(d3.curveMonotoneX);

    const areaGen = d3
      .area<{ hora: string; acessos: number }>()
      .x((d) => x(d.hora) || 0)
      .y0(innerHeight)
      .y1((d) => y(d.acessos))
      .curve(d3.curveMonotoneX);

    // Draw areas and lines for each section
    data.forEach((secao) => {
      // Area fill
      g.append('path')
        .datum(secao.historicoHoras)
        .attr('fill', `url(#area-grad-${secao.id})`)
        .attr('d', areaGen);

      // Line stroke
      const path = g
        .append('path')
        .datum(secao.historicoHoras)
        .attr('fill', 'none')
        .attr('stroke', secao.corHex)
        .attr('stroke-width', 3)
        .attr('d', lineGen);

      // Animation
      const totalLength = (path.node() as SVGPathElement)?.getTotalLength() || 1000;
      path
        .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(1000)
        .ease(d3.easeCubicOut)
        .attr('stroke-dashoffset', 0);
    });

    // X Axis
    const xAxis = g
      .append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x));

    xAxis.select('.domain').attr('stroke', '#475569');
    xAxis
      .selectAll('text')
      .attr('fill', '#94a3b8')
      .attr('font-size', '11px')
      .attr('font-family', 'monospace');

    // Y Axis
    const yAxis = g.append('g').call(
      d3
        .axisLeft(y)
        .ticks(4)
        .tickFormat((v) => Number(v).toString())
    );
    yAxis.select('.domain').remove();
    yAxis
      .selectAll('text')
      .attr('fill', '#64748b')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace');

    // Interactive vertical crosshair guide
    const focusLine = g
      .append('line')
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', '#f59e0b')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4 4')
      .style('opacity', 0);

    // Overlay to capture mouse move across the whole chart
    g.append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .attr('cursor', 'crosshair')
      .on('mousemove', function (event) {
        const [mX] = d3.pointer(event);
        const eachBand = innerWidth / (hours.length - 1);
        const index = Math.round(mX / eachBand);
        const clampedIndex = Math.max(0, Math.min(hours.length - 1, index));

        const targetX = x(hours[clampedIndex]) || 0;
        focusLine.attr('x1', targetX).attr('x2', targetX).style('opacity', 1);

        setHoverIndex(clampedIndex);
      })
      .on('mouseleave', function () {
        focusLine.style('opacity', 0);
        setHoverIndex(null);
      });
  }, [data, hours]);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden select-none space-y-3">
      <svg ref={svgRef} className="w-full overflow-visible" />

      {/* Hourly tooltip strip */}
      {hoverIndex !== null && hours[hoverIndex] && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-900/90 p-2.5 text-xs">
          <div className="font-mono font-bold text-amber-400">
            Horário: {hours[hoverIndex]}
          </div>

          <div className="flex items-center gap-4">
            {data.map((secao) => {
              const acessos = secao.historicoHoras[hoverIndex]?.acessos || 0;
              return (
                <div key={secao.id} className="flex items-center gap-1.5 font-mono text-xs">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: secao.corHex }}
                  />
                  <span className="text-slate-300 font-semibold">{secao.nome}:</span>
                  <strong className="text-white font-bold">{acessos}</strong>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
