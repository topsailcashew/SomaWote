import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { BarChart, BookOpen, Calculator, Info } from 'lucide-react';

interface WeeklyEngagement {
  week: string;
  literacy: number;
  numeracy: number;
}

const data: WeeklyEngagement[] = [
  { week: 'Week 1', literacy: 28, numeracy: 22 },
  { week: 'Week 2', literacy: 42, numeracy: 35 },
  { week: 'Week 3', literacy: 56, numeracy: 48 },
  { week: 'Week 4', literacy: 72, numeracy: 64 },
  { week: 'Week 5', literacy: 88, numeracy: 81 },
];

export default function EngagementChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: 320 });
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    content: string;
    category: 'literacy' | 'numeracy';
  }>({
    visible: false,
    x: 0,
    y: 0,
    content: '',
    category: 'literacy',
  });

  // Track the container resize to make the SVG perfectly responsive
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width } = entries[0].contentRect;
      // Clamp width and keep standard height
      setDimensions({
        width: Math.max(280, width),
        height: 320,
      });
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Render the D3 grouped bar chart
  useEffect(() => {
    if (!svgRef.current || !dimensions.width) return;

    // Clear previous elements
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 40, right: 20, bottom: 50, left: 50 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    const chartGroup = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // X scale for the weeks
    const x0 = d3.scaleBand()
      .domain(data.map(d => d.week))
      .rangeRound([0, width])
      .paddingInner(0.2);

    // X scale for the keys (literacy vs numeracy)
    const keys = ['literacy', 'numeracy'] as const;
    const x1 = d3.scaleBand()
      .domain(keys)
      .rangeRound([0, x0.bandwidth()])
      .padding(0.05);

    // Y scale for engagement count (tasks / logs)
    const yMax = d3.max(data, d => Math.max(d.literacy, d.numeracy)) || 100;
    const y = d3.scaleLinear()
      .domain([0, Math.ceil(yMax / 10) * 10]) // round up to nearest 10
      .rangeRound([height, 0]);

    // Color definitions
    const colors = {
      literacy: '#4A90E2', // vibrant blue
      numeracy: '#FF6B6B', // vibrant coral
    };

    // Draw Y grid lines
    chartGroup.append('g')
      .attr('class', 'grid-lines')
      .attr('stroke', '#E2E8F0')
      .attr('stroke-opacity', 0.8)
      .selectAll('line')
      .data(y.ticks(5))
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', d => y(d))
      .attr('y2', d => y(d));

    // Draw X Axis
    chartGroup.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x0))
      .call(g => g.select('.domain').attr('stroke', '#2D3436').attr('stroke-width', 2.5))
      .call(g => g.selectAll('.tick line').attr('stroke', '#2D3436').attr('stroke-width', 2))
      .call(g => g.selectAll('.tick text')
        .attr('fill', '#2D3436')
        .attr('font-size', '11px')
        .attr('font-weight', 'bold')
        .attr('dy', '10px')
      );

    // Draw Y Axis
    chartGroup.append('g')
      .call(d3.axisLeft(y).ticks(6))
      .call(g => g.select('.domain').attr('stroke', '#2D3436').attr('stroke-width', 2.5))
      .call(g => g.selectAll('.tick line').attr('stroke', '#2D3436').attr('stroke-width', 2))
      .call(g => g.selectAll('.tick text')
        .attr('fill', '#2D3436')
        .attr('font-size', '11px')
        .attr('font-weight', 'bold')
      );

    // Grid labels axis title - optional, but keep it clean
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 15)
      .attr('x', 0 - (dimensions.height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .attr('fill', '#2D3436')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .text('Tasks Engaged / Completed');

    // Draw Bar groups with neo-brutalist border styling
    const weekGroups = chartGroup.selectAll('.week-group')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'week-group')
      .attr('transform', d => `translate(${x0(d.week)}, 0)`);

    // Draw grouped bars
    keys.forEach(key => {
      weekGroups.append('rect')
        .attr('x', x1(key) || 0)
        .attr('width', x1.bandwidth())
        .attr('y', height) // start at bottom for transition animating
        .attr('height', 0)
        .attr('fill', colors[key])
        .attr('stroke', '#2D3436')
        .attr('stroke-width', 2.5)
        .attr('rx', 4) // rounded corners
        .on('mousemove', function (event, d) {
          const mX = event.clientX;
          const mY = event.clientY;
          const val = d[key];
          
          d3.select(this)
            .transition()
            .duration(100)
            .attr('fill', d3.rgb(colors[key]).darker(0.3).toString());

          setTooltip({
            visible: true,
            x: mX - containerRef.current!.getBoundingClientRect().left + 15,
            y: mY - containerRef.current!.getBoundingClientRect().top - 45,
            content: `${key === 'literacy' ? 'Literacy' : 'Numeracy'} engagement: ${val} tasks`,
            category: key,
          });
        })
        .on('mouseleave', function () {
          d3.select(this)
            .transition()
            .duration(100)
            .attr('fill', colors[key]);

          setTooltip(prev => ({ ...prev, visible: false }));
        })
        .transition()
        .duration(1000)
        .delay((d, i) => i * 120)
        .attr('y', d => y(d[key]))
        .attr('height', d => height - y(d[key]));
    });

  }, [dimensions, svgRef]);

  return (
    <div 
      className="p-6 bg-white border-4 border-[#2D3436] rounded-[32px] shadow-[8px_8px_0px_#2D3436] relative overflow-hidden text-left" 
      ref={containerRef}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-100 pb-4 mb-4">
        <div>
          <h4 className="font-black text-sm text-[#2D3436] uppercase tracking-wide flex items-center gap-2">
            <BarChart size={18} className="text-[#4A90E2] stroke-[2.5px]" />
            Weekly Interactive Student Engagement Log
          </h4>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Tracking cross-classroom participation metrics. Hover onto specific bars to audit activity indexes.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 font-black text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#E1F5FE] border-2 border-[#2D3436] rounded-xl shadow-[1.5px_1.5px_0px_#2D3436]">
            <BookOpen size={14} className="text-[#4A90E2]" />
            <span className="w-3 h-3 rounded-xs border-2 border-[#2D3436] bg-[#4A90E2]"></span>
            <span>Literacy Tasks</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#FFE5E5] border-2 border-[#2D3436] rounded-xl shadow-[1.5px_1.5px_0px_#2D3436]">
            <Calculator size={14} className="text-[#FF6B6B]" />
            <span className="w-3 h-3 rounded-xs border-2 border-[#2D3436] bg-[#FF6B6B]"></span>
            <span>Numeracy Tasks</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas stage with dynamic responsive width */}
      <div className="relative" style={{ height: `${dimensions.height}px` }}>
        <svg 
          ref={svgRef} 
          width={dimensions.width} 
          height={dimensions.height}
          className="overflow-visible"
        />

        {/* Dynamic customized absolute HTML tooltip */}
        {tooltip.visible && (
          <div 
            className={`absolute pointer-events-none z-30 px-3.5 py-2 font-black text-xs border-2 border-[#2D3436] rounded-xl shadow-[3px_3px_0px_#2D3436] transition-all flex items-center gap-2 ${
              tooltip.category === 'literacy' ? 'bg-[#E1F5FE] text-[#1B4E8C]' : 'bg-[#FFE5E5] text-[#FF6B6B]'
            }`}
            style={{ 
              left: `${tooltip.x}px`, 
              top: `${tooltip.y}px` 
            }}
          >
            <Info size={14} className="stroke-[2.5px]" />
            <span>{tooltip.content}</span>
          </div>
        )}
      </div>
    </div>
  );
}
