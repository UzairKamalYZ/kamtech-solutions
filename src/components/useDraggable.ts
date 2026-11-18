import { useCallback, useEffect, useRef, useState } from "react";

export type Pos = { x: number; y: number };
export const MARGIN = 16;
const DRAG_THRESHOLD = 5;

export const clamp = (p: Pos, w: number, h: number): Pos => ({
  x: Math.min(Math.max(MARGIN, p.x), Math.max(MARGIN, window.innerWidth - w - MARGIN)),
  y: Math.min(Math.max(MARGIN, p.y), Math.max(MARGIN, window.innerHeight - h - MARGIN)),
});

const read = (key: string): Pos | null => {
  try {
    const v = JSON.parse(localStorage.getItem(key) ?? "null");
    return v && typeof v.x === "number" ? v : null;
  } catch {
    return null;
  }
};

type Opts = {
  storageKey: string;
  width: number;
  height: number;
  /** Snap to the nearest left/right edge on release. */
  snapToEdge?: boolean;
  defaultPos: () => Pos;
  disabled?: boolean;
};

export function useDraggable({
  storageKey,
  width,
  height,
  snapToEdge,
  defaultPos,
  disabled,
}: Opts) {
  const [pos, setPos] = useState<Pos | null>(null);
  const [dragging, setDragging] = useState(false);
  const [animating, setAnimating] = useState(false);
  const start = useRef<{ px: number; py: number; x: number; y: number; moved: boolean } | null>(
    null,
  );
  const justDragged = useRef(false);
  const dims = useRef({ width, height });
  dims.current = { width, height };

  const snap = useCallback(
    (p: Pos) => {
      const c = clamp(p, dims.current.width, dims.current.height);
      if (!snapToEdge) return c;
      const left = c.x + dims.current.width / 2 < window.innerWidth / 2;
      return { x: left ? MARGIN : window.innerWidth - dims.current.width - MARGIN, y: c.y };
    },
    [snapToEdge],
  );

  const commit = useCallback(
    (p: Pos) => {
      setPos(p);
      localStorage.setItem(storageKey, JSON.stringify(p));
    },
    [storageKey],
  );

  // Restore on mount (client only).
  useEffect(() => {
    setPos(snap(read(storageKey) ?? defaultPos()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // Keep in viewport on resize.
  useEffect(() => {
    const onResize = () => setPos((p) => (p ? snap(p) : p));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [snap]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (disabled || !pos || e.button !== 0) return;
    start.current = { px: e.clientX, py: e.clientY, x: pos.x, y: pos.y, moved: false };
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const s = start.current;
    if (!s) return;
    const dx = e.clientX - s.px;
    const dy = e.clientY - s.py;
    if (!s.moved && Math.hypot(dx, dy) <= DRAG_THRESHOLD) return;
    if (!s.moved) {
      s.moved = true;
      setDragging(true);
      setAnimating(false);
    }
    setPos(clamp({ x: s.x + dx, y: s.y + dy }, dims.current.width, dims.current.height));
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const s = start.current;
    start.current = null;
    if (!s?.moved) return;
    justDragged.current = true;
    setTimeout(() => (justDragged.current = false), 0);
    setDragging(false);
    setAnimating(true);
    commit(snap({ x: s.x + e.clientX - s.px, y: s.y + e.clientY - s.py }));
    setTimeout(() => setAnimating(false), 260);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled || !pos) return;
    const d = { ArrowLeft: [-20, 0], ArrowRight: [20, 0], ArrowUp: [0, -20], ArrowDown: [0, 20] }[
      e.key
    ];
    if (!d) return;
    e.preventDefault();
    commit(clamp({ x: pos.x + d[0], y: pos.y + d[1] }, width, height));
  };

  const reset = useCallback(() => {
    localStorage.removeItem(storageKey);
    setAnimating(true);
    setPos(snap(defaultPos()));
    setTimeout(() => setAnimating(false), 260);
  }, [storageKey, snap, defaultPos]);

  return {
    pos,
    setPos: commit,
    /** Place without persisting. */
    place: (p: Pos) => setPos(clamp(p, dims.current.width, dims.current.height)),
    hasSaved: () => read(storageKey) !== null,
    dragging,
    animating,
    /** True right after a drag ended — use to swallow the click. */
    wasDragged: () => justDragged.current,
    reset,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp },
    onKeyDown,
  };
}
