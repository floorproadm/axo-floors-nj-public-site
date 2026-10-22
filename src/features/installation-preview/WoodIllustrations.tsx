import { useId } from "react";

export type FloorLayout = "Straight Lay" | "Herringbone" | "Chevron" | "Diagonal Lay";

/** Geometric plank diagrams, never represented as completed AXO projects. */
export function FloorPattern({ layout }: { layout: FloorLayout }) {
  const id = useId().replace(/:/g, "");
  const planks: React.ReactNode[] = [];
  const tone = (i: number) => `wood-plank wood-tone-${((i % 4) + 4) % 4}`;
  if (layout === "Straight Lay") {
    for (let row = -1; row < 12; row++) {
      for (let col = -1; col < 5; col++) {
        planks.push(<rect key={`${row}-${col}`} x={col * 120 + (row % 3) * 40} y={row * 28} width="120" height="28" className={tone(row + col)} />);
      }
    }
  } else if (layout === "Diagonal Lay") {
    // Parallel boards laid at 45 degrees; same plank grammar as straight lay, rotated.
    for (let row = -4; row < 16; row++) {
      for (let col = -3; col < 9; col++) {
        planks.push(<rect key={`${row}-${col}`} x={col * 120 + (row % 3) * 40} y={row * 28} width="120" height="28" className={tone(row + col)} />);
      }
    }
  } else if (layout === "Herringbone") {
    // Two perpendicular, square-ended planks; translations tile without miters.
    for (let i = -7; i < 8; i++) {
      for (let j = -12; j < 13; j++) {
        const x = i * 80 - j * 20;
        const y = i * 80 + j * 20;
        planks.push(<g key={`${i}-${j}`} transform={`translate(${x} ${y})`}><rect width="80" height="20" className={tone(i + j)} /><rect x="60" y="20" width="20" height="80" className={tone(i - j + 1)} /></g>);
      }
    }
  } else {
    // Mitered ends meet at a continuous center seam, unlike herringbone.
    for (let col = -1; col < 4; col++) {
      for (let row = -8; row < 14; row++) {
        const x = col * 160;
        const y = row * 28;
        planks.push(<g key={`${col}-${row}`}><polygon points={`${x},${y} ${x + 80},${y + 80} ${x + 80},${y + 108} ${x},${y + 28}`} className={tone(col + row)} /><polygon points={`${x + 80},${y + 80} ${x + 160},${y} ${x + 160},${y + 28} ${x + 80},${y + 108}`} className={tone(col - row + 1)} /></g>);
      }
    }
  }
  return <svg viewBox="0 0 400 300" role="img" preserveAspectRatio="xMidYMid slice" aria-label={`Illustration of ${layout.toLowerCase()} layout`} className="h-full w-full">
    <defs><pattern id={`grain-${id}`} width="100" height="24" patternUnits="userSpaceOnUse"><path d="M0 4 Q25 0 50 5 T100 4 M0 12 Q35 17 65 11 T100 12 M0 21 Q30 16 55 21 T100 20" className="wood-grain" fill="none" /></pattern></defs>
    <g transform={layout === "Herringbone" ? "translate(200 -140) rotate(45)" : layout === "Diagonal Lay" ? "rotate(45 200 150)" : undefined}>{planks}</g>
    <rect width="400" height="300" fill={`url(#grain-${id})`} opacity="0.32" />
  </svg>;
}

export function WoodConstruction({ engineered }: { engineered?: boolean }) {
  const id = useId().replace(/:/g, "");
  return <svg viewBox="0 0 420 250" role="img" aria-label={engineered ? "Illustration of engineered hardwood with a real wood surface over layered core" : "Illustration of solid hardwood made from one continuous piece of wood"} className="h-full w-full">
    <defs><pattern id={`surface-${id}`} width="160" height="30" patternUnits="userSpaceOnUse"><path d="M0 6 Q45 0 90 8 T160 6 M0 18 Q65 25 110 16 T160 18" className="wood-grain" fill="none" /></pattern></defs>
    <polygon points="45,120 135,55 375,105 285,175" className="wood-tone-1 wood-plank" />
    <polygon points="45,120 285,175 285,215 45,160" className="wood-tone-2 wood-plank" />
    <polygon points="285,175 375,105 375,145 285,215" className="wood-tone-3 wood-plank" />
    <polygon points="45,120 135,55 375,105 285,175" fill={`url(#surface-${id})`} opacity="0.5" />
    {engineered ? Array.from({ length: 6 }, (_, i) => <g key={i}><path d={`M45 ${130 + i * 5} L285 ${185 + i * 5} L375 ${115 + i * 5}`} className="wood-layer" fill="none" /></g>) : <><path d="M50 145 Q135 151 280 195 M295 193 L365 139" className="wood-grain" fill="none" /><path d="M65 138 Q175 158 270 181" className="wood-grain" fill="none" /></>}
  </svg>;
}

/** Layered cross-section diagram of a luxury vinyl plank, never a project photograph. */
export function VinylPlank() {
  const id = useId().replace(/:/g, "");
  const front = (f1: number, f2: number, cls: string) => <polygon points={`45,${120 + 40 * f1} 285,${175 + 40 * f1} 285,${175 + 40 * f2} 45,${120 + 40 * f2}`} className={cls} />;
  const side = (f1: number, f2: number, cls: string) => <polygon points={`285,${175 + 40 * f1} 375,${105 + 40 * f1} 375,${105 + 40 * f2} 285,${175 + 40 * f2}`} className={cls} />;
  return <svg viewBox="0 0 420 250" role="img" aria-label="Illustration of luxury vinyl plank construction: clear wear layer, printed design layer, rigid core and backing" className="h-full w-full">
    <defs><pattern id={`print-${id}`} width="160" height="30" patternUnits="userSpaceOnUse"><path d="M0 6 Q45 0 90 8 T160 6 M0 18 Q65 25 110 16 T160 18" className="wood-grain" fill="none" /></pattern></defs>
    <polygon points="45,120 135,55 375,105 285,175" className="wood-tone-1 wood-plank" />
    <polygon points="45,120 135,55 375,105 285,175" fill={`url(#print-${id})`} opacity="0.5" />
    {front(0, 0.16, "vinyl-wear wood-plank")}
    {front(0.16, 0.32, "wood-tone-1 wood-plank")}
    {front(0.32, 0.8, "vinyl-core wood-plank")}
    {front(0.8, 1, "vinyl-backing wood-plank")}
    {side(0, 0.16, "vinyl-wear wood-plank")}
    {side(0.16, 0.32, "wood-tone-2 wood-plank")}
    {side(0.32, 0.8, "vinyl-core wood-plank")}
    {side(0.8, 1, "vinyl-backing wood-plank")}
  </svg>;
}

const TOP_FACE = "45,120 135,55 375,105 285,175";

/** Bilinear map over the shared top face: s runs A(45,120)->D(285,175), t runs A->B(135,55). */
function isoXY(s: number, t: number): [number, number] {
  const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
  return [lerp(lerp(45, 285, s), lerp(135, 375, s), t), lerp(lerp(120, 175, s), lerp(55, 105, s), t)];
}
const iso = (s: number, t: number) => isoXY(s, t).map(n => Math.round(n * 10) / 10).join(",");
const frontBand = (h: number, f1: number, f2: number, cls: string) => <polygon points={`45,${120 + h * f1} 285,${175 + h * f1} 285,${175 + h * f2} 45,${120 + h * f2}`} className={cls} />;
const sideBand = (h: number, f1: number, f2: number, cls: string) => <polygon points={`285,${175 + h * f1} 375,${105 + h * f1} 375,${105 + h * f2} 285,${175 + h * f2}`} className={cls} />;
const frontSeam = (key: string, s: number, h: number) => { const [x, y] = isoXY(s, 0); return <line key={key} x1={x} y1={y} x2={x} y2={y + h} className="tile-seam" />; };
const sideSeam = (key: string, t: number, h: number) => { const [x, y] = isoXY(1, t); return <line key={key} x1={x} y1={y} x2={x} y2={y + h} className="tile-seam" />; };
const topSeam = (key: string, s1: number, t1: number, s2: number, t2: number) => { const [x1, y1] = isoXY(s1, t1); const [x2, y2] = isoXY(s2, t2); return <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} className="tile-seam" />; };

/** Modular carpet tiles laid edge to edge over a backing; a schematic, never a project photograph. */
export function CarpetTile() {
  const id = useId().replace(/:/g, "");
  const h = 26;
  const cells: React.ReactNode[] = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 2; j++) {
      cells.push(<polygon key={`${i}-${j}`} points={`${iso(i / 3, j / 2)} ${iso((i + 1) / 3, j / 2)} ${iso((i + 1) / 3, (j + 1) / 2)} ${iso(i / 3, (j + 1) / 2)}`} className={`carpet-cell ${(i + j) % 2 ? "carpet-b" : "carpet-a"}`} />);
    }
  }
  return <svg viewBox="0 0 420 250" role="img" aria-label="Illustration of carpet tile: modular square tiles laid edge to edge over a backing layer" className="h-full w-full">
    <defs><pattern id={`tuft-${id}`} width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(18)"><path d="M0 2h4M5 7h4" className="carpet-tuft" fill="none" /></pattern></defs>
    {frontBand(h, 0, 0.72, "carpet-front")}
    {frontBand(h, 0.72, 1, "carpet-back")}
    {sideBand(h, 0, 0.72, "carpet-side")}
    {sideBand(h, 0.72, 1, "carpet-back")}
    {cells}
    <polygon points={TOP_FACE} fill={`url(#tuft-${id})`} opacity="0.4" />
    {[1, 2].map(i => frontSeam(`cf${i}`, i / 3, h))}
    {sideSeam("cs0", 0.5, h)}
  </svg>;
}

/** Thick resilient tile with a speckled wear surface; a schematic, never a project photograph. */
export function RubberFlooring() {
  const id = useId().replace(/:/g, "");
  const h = 34;
  return <svg viewBox="0 0 420 250" role="img" aria-label="Illustration of rubber flooring: a thick resilient tile with a speckled surface over a solid base" className="h-full w-full">
    <defs><pattern id={`speck-${id}`} width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="3" cy="4" r="1.4" className="rubber-speck" /><circle cx="11" cy="9" r="1" className="rubber-speck" /><circle cx="7" cy="13" r="0.7" className="rubber-speck" /><circle cx="14" cy="2" r="0.9" className="rubber-speck" /></pattern></defs>
    {frontBand(h, 0, 0.55, "rubber-front")}
    {frontBand(h, 0.55, 1, "rubber-base")}
    {sideBand(h, 0, 0.55, "rubber-side")}
    {sideBand(h, 0.55, 1, "rubber-base")}
    <polygon points={TOP_FACE} className="rubber-top" />
    <polygon points={TOP_FACE} fill={`url(#speck-${id})`} opacity="0.5" />
    {topSeam("rt-s", 0.5, 0, 0.5, 1)}
    {topSeam("rt-t", 0, 0.5, 1, 0.5)}
    {frontSeam("rf0", 0.5, h)}
    {sideSeam("rs0", 0.5, h)}
  </svg>;
}

export function FloorRemoval() {
  return <svg viewBox="0 0 140 100" aria-hidden="true" className="h-full w-full">
    <rect x="6" y="70" width="128" height="18" rx="2" fill="#d8cfc4" />
    <path d="M18 70v18M34 70v18M50 70v18M66 70v18M82 70v18M98 70v18M114 70v18" stroke="#b5aaa0" strokeWidth="0.9" />
    <rect x="8" y="52" width="32" height="16" rx="1.5" fill="#c7a583" stroke="#a8865f" strokeWidth="1" />
    <rect x="42" y="52" width="32" height="16" rx="1.5" fill="#b89b7a" stroke="#a8865f" strokeWidth="1" />
    <path d="M8 60h32M42 60h32" stroke="#a8865f" strokeWidth="0.8" opacity=".5" />
    <rect x="80" y="70" width="42" height="4" fill="#b5aaa0" opacity=".55" />
    <polygon points="80,56 120,42 120,56 80,70" fill="#c7a583" stroke="#a8865f" strokeWidth="1" />
    <path d="M80 63L120 49" stroke="#a8865f" strokeWidth="0.8" opacity=".5" />
    <path d="M116 34q10-6 16 3" fill="none" stroke="#b5aaa0" strokeWidth="1.6" strokeDasharray="3 3" />
  </svg>;
}

export function SubfloorPrep() {
  return <svg viewBox="0 0 140 100" aria-hidden="true" className="h-full w-full">
    <g fill="#17293f"><rect x="12" y="80" width="13" height="16" rx="1" /><rect x="47" y="80" width="13" height="16" rx="1" /><rect x="82" y="80" width="13" height="16" rx="1" /><rect x="117" y="80" width="13" height="16" rx="1" /></g>
    <rect x="6" y="64" width="128" height="16" rx="1.5" fill="#c7a583" stroke="#a8865f" strokeWidth="1" />
    <path d="M6 70h128M6 75h128" stroke="#a8865f" strokeWidth="0.7" opacity=".45" />
    <path d="M52 64v16M98 64v16" stroke="#a8865f" strokeWidth="1" opacity=".7" />
    <path d="M6 57H134v7q-16 3-32 0t-32 0t-32 0t-32 0z" fill="#e6dcd0" stroke="#b89b7a" strokeWidth="1" />
    <g><rect x="62" y="50" width="60" height="7" rx="3" fill="#c9a227" /><rect x="86" y="36" width="9" height="15" rx="4" fill="#17293f" /><rect x="72" y="30" width="37" height="9" rx="4.5" fill="#17293f" /></g>
  </svg>;
}