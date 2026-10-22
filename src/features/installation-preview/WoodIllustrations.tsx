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