import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface TaxHealthGaugeProps {
  score: number;
}

const TaxHealthGauge: React.FC<TaxHealthGaugeProps> = ({ score }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const width = 200;
    const height = 120; // Half circle height
    const radius = Math.min(width, height * 2) / 2;

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height})`);

    // Scale
    const scale = d3.scaleLinear().domain([0, 100]).range([-Math.PI / 2, Math.PI / 2]);

    // Background Arc
    const arcBg = d3.arc<any>()
      .innerRadius(60)
      .outerRadius(80)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2);

    g.append("path")
      .attr("d", arcBg)
      .attr("fill", "#e2e8f0");

    // Foreground Arc
    const arcFg = d3.arc<any>()
      .innerRadius(60)
      .outerRadius(80)
      .startAngle(-Math.PI / 2)
      .endAngle(scale(score));
      // .cornerRadius(10);

    const color = score > 80 ? "#22c55e" : score > 50 ? "#eab308" : "#ef4444";

    g.append("path")
      .attr("d", arcFg)
      .attr("fill", color)
      .transition()
      .duration(1000)
      .attrTween("d", function(d) {
        const i = d3.interpolate(scale(0), scale(score));
        return function(t) {
            const angle = i(t);
            const currentArc = d3.arc<any>()
                .innerRadius(60)
                .outerRadius(80)
                .startAngle(-Math.PI / 2)
                .endAngle(angle);
            return currentArc(d) || "";
        };
      });

    // Text
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("y", -10)
      .attr("class", "text-3xl font-bold fill-slate-800")
      .text(score);

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("y", 15)
      .attr("class", "text-xs font-medium fill-slate-500 uppercase tracking-wide")
      .text("Tax Health Score");

  }, [score]);

  return <svg ref={svgRef} width={200} height={120} className="mx-auto" />;
};

export default TaxHealthGauge;
