"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Vedio from "@/components/video/video";

type Item = {
  id: number;
  title: string;
  image: string;
  match?: number;
  age?: string;
  year?: string;
  quality?: string;
  genresText?: string;
};

export default function Row({
  title,
  items,
  itemWidth = 240,
  itemHeight = 135,
  indicatorCount = 6,
  loop = true,
  showProgress = false,
}: {
  title: string;
  items: Item[];
  itemWidth?: number;
  itemHeight?: number;
  indicatorCount?: number;
  loop?: boolean;
  showProgress?: boolean;
}) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [hoverKey, setHoverKey] = useState<string | null>(null);

  // indicatorCount = 0 이면 인디케이터 숨김 허용
  const safeCount = Math.max(0, indicatorCount);

  const [active, setActive] = useState(0);
  const [transitionOn, setTransitionOn] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [maskOn, setMaskOn] = useState(true);

  const SIDE_PADDING = 60;
  const GAP = 10;

  const trackItems = useMemo(() => {
    return loop ? [...items, ...items, ...items] : items;
  }, [items, loop]);

  const loopItemsLen = items.length;
  const oneLoopWidth = loopItemsLen > 0 ? loopItemsLen * (itemWidth + GAP) - GAP : 0;
  const segmentWidth = oneLoopWidth > 0 ? oneLoopWidth + GAP : 0;
  const baseOffset = loop ? segmentWidth : 0;

  const [viewWidth, setViewWidth] = useState(0);

  const maxMove = useMemo(() => {
    const usable = Math.max(0, viewWidth - SIDE_PADDING * 2);
    return Math.max(0, oneLoopWidth - usable);
  }, [oneLoopWidth, viewWidth, SIDE_PADDING]);

  const moveForIndex = (idx: number) => {
    if (safeCount <= 1 || maxMove <= 0) return 0;
    const step = maxMove / (safeCount - 1);
    return Math.round(step * idx);
  };

  const [x, setX] = useState(() => -(baseOffset + 0));
  const [ready, setReady] = useState(false);

  const pendingSnapRef = useRef<null | number>(null);

  const applyIndex = (next: number, opts?: { wrapRight?: boolean; wrapLeft?: boolean }) => {
    const wrapRight = opts?.wrapRight ?? false;
    const wrapLeft = opts?.wrapLeft ?? false;
    const targetInLoop = moveForIndex(next);

    if (!loop) {
      setTransitionOn(true);
      setActive(next);
      setX(-targetInLoop);
      return;
    }

    if (!wrapRight && !wrapLeft) {
      setTransitionOn(true);
      setActive(next);
      setX(-(baseOffset + targetInLoop));
      return;
    }

    if (wrapRight) {
      const toClone = 2 * segmentWidth + moveForIndex(0);
      const snapTo = baseOffset + moveForIndex(0);
      pendingSnapRef.current = -snapTo;

      setTransitionOn(true);
      setActive(0);
      setX(-toClone);
      return;
    }

    if (wrapLeft) {
      const lastIdx = safeCount - 1;
      const toClone = 0 * segmentWidth + moveForIndex(lastIdx);
      const snapTo = baseOffset + moveForIndex(lastIdx);
      pendingSnapRef.current = -snapTo;

      setTransitionOn(true);
      setActive(lastIdx);
      setX(-toClone);
    }
  };

  const go = (dir: "left" | "right") => {
    if (safeCount <= 1) return;

    setMaskOn(false);

    if (dir === "right") {
      const isWrap = active === safeCount - 1;
      const next = isWrap ? 0 : active + 1;
      applyIndex(next, { wrapRight: isWrap });
      return;
    }

    const isWrap = active === 0;
    const next = isWrap ? safeCount - 1 : active - 1;
    applyIndex(next, { wrapLeft: isWrap });
  };

  const onTransitionEnd = () => {
    if (!loop) return;
    if (pendingSnapRef.current == null) return;

    const snapX = pendingSnapRef.current;
    pendingSnapRef.current = null;

    setTransitionOn(false);
    setX(snapX);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => setTransitionOn(true));
    });
  };

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const measure = () => setViewWidth(el.clientWidth);
    measure();

    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useLayoutEffect(() => {
    if (!viewportRef.current) return;
    if (viewWidth <= 0) return;

    if (segmentWidth <= 0 && loop) {
      setReady(true);
      return;
    }

    setTransitionOn(false);
    const startX = loop ? -(baseOffset + moveForIndex(active)) : -moveForIndex(active);
    setX(startX);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setReady(true);
        setTransitionOn(true);
      });
    });
  }, [viewWidth, segmentWidth, maxMove, loop]);

  // 트랙패드 가로 스와이프 차단
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) e.preventDefault();
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <section style={{ paddingTop: 40, position: "relative", zIndex: hoverKey ? 50 : 1 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: `0 ${SIDE_PADDING}px`,
          marginBottom: 10,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 400 }}>{title}</h2>

        {safeCount > 0 && (
          <div style={{ display: "flex", gap: 2, opacity: 0.9 }}>
            {Array.from({ length: safeCount }).map((_, i) => (
              <span
                key={i}
                style={{
                  width: 12,
                  height: 2,
                  borderRadius: 2,
                  background:
                    i === active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.25)",
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div
        ref={viewportRef}
        style={{ position: "relative", overflow: "visible" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {loop && maskOn && (
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: SIDE_PADDING,
              zIndex: 6,
              pointerEvents: "none",
              background: "#141414",
            }}
          />
        )}

        {hovered && safeCount > 1 && (
          <>
            <button
              type="button"
              onClick={() => go("left")}
              aria-label="left"
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: 56,
                zIndex: 7,
                border: 0,
                background: "rgba(0,0,0,0.35)",
                color: "white",
                cursor: "pointer",
              }}
            >
              <span style={{ fontSize: 44 }}>‹</span>
            </button>

            <button
              type="button"
              onClick={() => go("right")}
              aria-label="right"
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: 56,
                zIndex: 7,
                border: 0,
                background: "rgba(0,0,0,0.35)",
                color: "white",
                cursor: "pointer",
              }}
            >
              <span style={{ fontSize: 44 }}>›</span>
            </button>
          </>
        )}

        {ready && (
          <div style={{ padding: `0 ${SIDE_PADDING}px`, position: "relative", zIndex: 1 }}>
            <div
              onTransitionEnd={onTransitionEnd}
              style={{
                display: "flex",
                gap: GAP,
                willChange: "transform",
                transform: `translate3d(${x}px, 0, 0)`,
                transition: transitionOn
                  ? "transform 520ms cubic-bezier(0.2, 0.8, 0.2, 1)"
                  : "none",
              }}
            >
              {trackItems.map((it, idx) => {
                const key = `${it.id}-${idx}`;
                const isHot = hoverKey === key;
                const progress = Math.round(Math.abs(Math.sin(it.id * 999)) * 84 + 8);

                return (
                  <div
                    key={key}
                    onMouseEnter={() => setHoverKey(key)}
                    onMouseLeave={() => setHoverKey(null)}
                    style={{
                      flex: "0 0 auto",
                      width: itemWidth,
                      position: "relative",
                      zIndex: isHot ? 9999 : 1,
                      transform: "translateZ(0)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      overflow: "visible",
                    }}
                    title={it.title}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: itemHeight,
                        background: "#2b2b2b",
                        overflow: "visible", 
                        borderRadius: 6, 
                        position: "relative",
                      }}
                    >
                      <Vedio movie={it as any} />
                    </div>

                    {showProgress && (
                      <div className="watchingProgressBar" aria-hidden="true">
                        <span className="watchingProgressFill" style={{ width: `${progress}%` }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
