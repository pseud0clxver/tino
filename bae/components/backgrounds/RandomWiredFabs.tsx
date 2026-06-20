"use client";

import { useEffect, useRef } from "react";
import rough from "roughjs";

const LOVE_PATHS = [
  // Heart
  {
    path: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
    color: "#f472b6", // pink-400
  },
  // Star/Sparkle
  {
    path: "M12 3v18 M3 12h18 M6 6l12 12 M6 18L18 6",
    color: "#fde047", // yellow-300
  },
  // Flower
  {
    path: "M12 15c-3.5 0-6-2.5-6-6s2.5-6 6-6 6 2.5 6 6-2.5 6-6 6z M12 21v-6",
    color: "#f87171", // red-400
  },
  // X / Cross (like kisses)
  {
    path: "M6 6l12 12 M6 18L18 6",
    color: "#a78bfa", // purple-400
  }
];

function RoughIcon({ pathData, color }: { pathData: string; color: string }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      // Clear previous
      while (svgRef.current.firstChild) {
        svgRef.current.removeChild(svgRef.current.firstChild);
      }
      
      const rc = rough.svg(svgRef.current);
      // We ONLY use stroke to prevent the hf.fillPolygon error
      const node = rc.path(pathData, {
        stroke: color,
        strokeWidth: 1.5,
        roughness: 0.5,
        bowing: 1,
        fill: color,
        fillStyle: 'hachure',
        hachureAngle: 60,
        hachureGap: 4
      });
      svgRef.current.appendChild(node);
    }
  }, [pathData, color]);

  return <svg ref={svgRef} viewBox="0 0 24 24" className="w-16 h-16 drop-shadow-md" />;
}

const GRID_COLS = 8;
const GRID_ROWS = 14;

const STATIC_ELEMENTS = Array.from({ length: GRID_COLS * GRID_ROWS }).map((_, i) => {
  const r = Math.floor(i / GRID_COLS);
  const c = i % GRID_COLS;
  
  // Offset odd rows slightly to create a diamond/staggered grid pattern
  const rowOffset = r % 2 === 1 ? (100 / GRID_COLS / 2) : 0;
  
  const top = `${((r + 0.5) / GRID_ROWS) * 100}%`;
  const left = `calc(${((c + 0.5) / GRID_COLS) * 100}% + ${rowOffset}vw)`;
  
  // Deterministic pseudo-random values
  const rotate = `${(i * 37) % 360}deg`;
  const delay = `${(i * 0.17) % 4}s`;
  const pathIndex = (i * 19) % LOVE_PATHS.length;
  const scale = `${0.6 + ((i * 23) % 5) / 10}`; // 0.6 to 1.0

  return {
    id: i,
    top,
    left,
    rotate,
    delay,
    pathIndex,
    scale,
  };
});

export default function RandomWiredFabs() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-5] overflow-hidden">
      {STATIC_ELEMENTS.map((el) => {
        const item = LOVE_PATHS[el.pathIndex];
        return (
          <div
            key={el.id}
            className="absolute opacity-40 transition-transform duration-1000"
            style={{
              top: el.top,
              left: el.left,
              transform: `translate(-50%, -50%) rotate(${el.rotate}) scale(${el.scale})`,
              animation: `hydro-pulse 4s ease-in-out infinite alternate`,
              animationDelay: el.delay,
            }}
          >
            <RoughIcon pathData={item.path} color={item.color} />
          </div>
        );
      })}
    </div>
  );
}
