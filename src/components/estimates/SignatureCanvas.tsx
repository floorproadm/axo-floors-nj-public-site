import { useCallback, useEffect, useImperativeHandle, useRef, useState, forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { Eraser, Undo2 } from 'lucide-react';

export interface SignatureCanvasHandle {
  toSVG: () => string | null;
  clear: () => void;
  isEmpty: () => boolean;
}

interface Point {
  x: number;
  y: number;
}

type Stroke = Point[];

interface Props {
  onChange?: (isEmpty: boolean) => void;
  height?: number;
  penColor?: string;
  className?: string;
}

export const SignatureCanvas = forwardRef<SignatureCanvasHandle, Props>(function SignatureCanvas(
  { onChange, height = 180, penColor = '#0f172a', className },
  ref,
) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const currentRef = useRef<Stroke | null>(null);
  const [, force] = useState(0);
  const [size, setSize] = useState({ w: 0, h: height });

  const emitChange = useCallback(() => {
    onChange?.(strokesRef.current.length === 0);
  }, [onChange]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = penColor;
    ctx.lineWidth = 2;

    const drawStroke = (s: Stroke) => {
      if (s.length === 0) return;
      ctx.beginPath();
      ctx.moveTo(s[0].x, s[0].y);
      if (s.length === 1) {
        ctx.arc(s[0].x, s[0].y, 1, 0, Math.PI * 2);
        ctx.fill();
        return;
      }
      for (let i = 1; i < s.length - 1; i++) {
        const mx = (s[i].x + s[i + 1].x) / 2;
        const my = (s[i].y + s[i + 1].y) / 2;
        ctx.quadraticCurveTo(s[i].x, s[i].y, mx, my);
      }
      const last = s[s.length - 1];
      ctx.lineTo(last.x, last.y);
      ctx.stroke();
    };

    strokesRef.current.forEach(drawStroke);
    if (currentRef.current) drawStroke(currentRef.current);
  }, [penColor]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(() => {
      const w = wrap.clientWidth;
      setSize({ w, h: height });
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || size.w === 0) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(size.w * dpr);
    canvas.height = Math.round(size.h * dpr);
    canvas.style.width = `${size.w}px`;
    canvas.style.height = `${size.h}px`;
    draw();
  }, [size, draw]);

  const pointFromEvent = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    (e.currentTarget as any).setPointerCapture?.(e.pointerId);
    currentRef.current = [pointFromEvent(e)];
    draw();
  };
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!currentRef.current) return;
    currentRef.current.push(pointFromEvent(e));
    draw();
  };
  const handlePointerUp = () => {
    if (!currentRef.current) return;
    if (currentRef.current.length > 0) {
      strokesRef.current = [...strokesRef.current, currentRef.current];
    }
    currentRef.current = null;
    force((n) => n + 1);
    emitChange();
  };

  const clear = useCallback(() => {
    strokesRef.current = [];
    currentRef.current = null;
    draw();
    force((n) => n + 1);
    emitChange();
  }, [draw, emitChange]);

  const undo = useCallback(() => {
    strokesRef.current = strokesRef.current.slice(0, -1);
    draw();
    force((n) => n + 1);
    emitChange();
  }, [draw, emitChange]);

  const isEmpty = useCallback(() => strokesRef.current.length === 0, []);

  const toSVG = useCallback((): string | null => {
    if (strokesRef.current.length === 0) return null;
    const w = size.w || 600;
    const h = size.h;
    const pathFor = (s: Stroke) => {
      if (s.length === 0) return '';
      if (s.length === 1) return `M ${s[0].x.toFixed(2)} ${s[0].y.toFixed(2)} l 0.1 0`;
      let d = `M ${s[0].x.toFixed(2)} ${s[0].y.toFixed(2)}`;
      for (let i = 1; i < s.length - 1; i++) {
        const mx = (s[i].x + s[i + 1].x) / 2;
        const my = (s[i].y + s[i + 1].y) / 2;
        d += ` Q ${s[i].x.toFixed(2)} ${s[i].y.toFixed(2)} ${mx.toFixed(2)} ${my.toFixed(2)}`;
      }
      const last = s[s.length - 1];
      d += ` L ${last.x.toFixed(2)} ${last.y.toFixed(2)}`;
      return d;
    };
    const paths = strokesRef.current.map((s) => `<path d="${pathFor(s)}" />`).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" fill="none" stroke="${penColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
  }, [size, penColor]);

  useImperativeHandle(ref, () => ({ toSVG, clear, isEmpty }), [toSVG, clear, isEmpty]);

  const empty = strokesRef.current.length === 0 && !currentRef.current;

  return (
    <div className={className}>
      <div
        ref={wrapRef}
        className="relative rounded-md border border-input bg-background"
        style={{ height }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 rounded-md cursor-crosshair"
          style={{ touchAction: 'none' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
        {empty && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-muted-foreground/70 select-none">
            Sign here
          </div>
        )}
        <div className="pointer-events-none absolute bottom-1.5 left-3 right-3 border-b border-dashed border-muted-foreground/30" />
      </div>
      <div className="mt-2 flex items-center justify-end gap-2">
        <Button type="button" size="sm" variant="ghost" onClick={undo} disabled={empty}>
          <Undo2 className="w-3.5 h-3.5 mr-1.5" /> Undo
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={clear} disabled={empty}>
          <Eraser className="w-3.5 h-3.5 mr-1.5" /> Clear
        </Button>
      </div>
    </div>
  );
});
