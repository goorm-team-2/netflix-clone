"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Item = {
  id: number;
  title: string;
  image: string;
};

export default function Top10Row({
  title,
  items,
  variant,
}: {
  title: string;
  items: Item[];
  variant: "series" | "movie";
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [hovered, setHovered] = useState(false);

  const SIDE_PADDING = 60;
  const GAP = 75;
  const ITEMS_PER_VIEW = 6.6;

  const VISIBLE = 6;
  const STEP_ITEMS = 4;

  const posterW = 106;
  const posterH = 152;

  const numberSize = 210;
  const numberSize10 = 160;
  const stroke = 3;
  const numberOpacity = 0.28;

  const numberLeftRest = -16;
  const numberBottomRest = -35;

  const numberLeft1 = 16;
  const numberBottom1 = -35;

  const numberLeft10 = -30;
  const numberBottom10 = -10;

  const posterLeft = 74;
  const posterBottom = 0;

  const cellH = 170;
  const [cellW, setCellW] = useState(180);

  const TOP10_SERIES_IMAGES = useMemo(
    () => [
      "/top10_mshong.jpg",
      "/top10_kimwonhun.jpg",
      "/top10_solohell.jpg",
      "/top10_todaybehuman.jpg",
      "/top10_cheonhajebbang.jpg",
      "/top10_translatethislove.jpg",
      "/top10_anikundae.jpg",
      "/top10_brizerten.jpg",
      "/top10_imsolo.jpg",
      "/top10_deathgame.jpg",
    ],
    []
  );

  const TOP10_MOVIE_IMAGES = useMemo(
    () => [
      "/top10_todaydeletelove.jpg",
      "/top10_noway.jpg",
      "/top10_waitforyou.jpg",
      "/top10_thelip.jpg",
      "/top10_face.jpg",
      "/top10_96min.jpg",
      "/top10_bestkid.jpg",
      "/top10_superbad.jpg",
      "/top10_choukaguyahime.jpg",
      "/top10_pandora.jpg",
    ],
    []
  );

  const TOP10_IMAGES = variant === "series" ? TOP10_SERIES_IMAGES : TOP10_MOVIE_IMAGES;

  const isPlaceholder = (src: string) => {
    if (!src) return true;
    return (
      src.includes("placeholder") ||
      src.includes("/images/placeholder") ||
      src.includes("placehold")
    );
  };

  const baseItems = useMemo(() => {
    const top10 = items.slice(0, 10);

    return top10.map((it, idx) => {
      const fallback = TOP10_IMAGES[idx % TOP10_IMAGES.length];
      return {
        ...it,
        image: isPlaceholder(it.image) ? fallback : it.image,
      };
    });
  }, [items, TOP10_IMAGES]);

  const total = baseItems.length;

  const stride = cellW + GAP;

  // 페이지 인디케이터
  const [pageCount, setPageCount] = useState(1);
  const [pageIndex, setPageIndex] = useState(0);

  const lockRef = useRef(false);
  const lockTimer = useRef<number | null>(null);

  const lockAuto = (ms = 520) => {
    lockRef.current = true;
    if (lockTimer.current) window.clearTimeout(lockTimer.current);
    lockTimer.current = window.setTimeout(() => {
      lockRef.current = false;
    }, ms);
  };

  const getVisibleAndStep = () => ({ visible: VISIBLE, stepItems: STEP_ITEMS });

  const calcPages = () => {
    const { visible, stepItems } = getVisibleAndStep();
    if (total <= visible) return 1;
    return Math.max(1, 1 + Math.ceil((total - visible) / stepItems));
  };

  const CLONE = STEP_ITEMS; 
  const prefix = useMemo(() => baseItems.slice(-CLONE), [baseItems]);
  const suffix = useMemo(() => baseItems.slice(0, CLONE), [baseItems]);

  const renderItems = useMemo(() => {
    if (total === 0) return [];
    return [...prefix, ...baseItems, ...suffix];
  }, [prefix, baseItems, suffix, total]);

  const START_OFFSET = CLONE * stride; 
  const CYCLE_WIDTH = total * stride; 

  const scrollToPage = (nextPage: number, behavior: ScrollBehavior) => {
    const el = scrollerRef.current;
    if (!el) return;

    const { stepItems } = getVisibleAndStep();
    const target = START_OFFSET + nextPage * stepItems * stride;
    el.scrollTo({ left: target, behavior });
  };

  const updateLayout = () => {
    const el = scrollerRef.current;
    if (!el) return;

    const usable = el.clientWidth - SIDE_PADDING * 2;
    const w = Math.floor((usable - GAP * (ITEMS_PER_VIEW - 1)) / ITEMS_PER_VIEW);
    const clamped = Math.max(160, Math.min(260, w));
    setCellW(clamped);

    const pages = calcPages();
    setPageCount(pages);
    setPageIndex((p) => Math.max(0, Math.min(pages - 1, p)));
  };

  useEffect(() => {
    updateLayout();

    const el = scrollerRef.current;
    if (!el) return;

    requestAnimationFrame(() => {
      el.scrollTo({ left: START_OFFSET, behavior: "auto" });
    });

    const onScroll = () => {
      if (lockRef.current) return;

      if (el.scrollLeft >= START_OFFSET + CYCLE_WIDTH) {
        el.scrollTo({ left: el.scrollLeft - CYCLE_WIDTH, behavior: "auto" });
        return;
      }
      if (el.scrollLeft <= START_OFFSET - 1) {
        el.scrollTo({ left: el.scrollLeft + CYCLE_WIDTH, behavior: "auto" });
        return;
      }

      const { stepItems } = getVisibleAndStep();
      const pageWidth = stepItems * stride;
      if (pageWidth <= 1) return;

      const raw = Math.round((el.scrollLeft - START_OFFSET) / pageWidth);
      const pages = calcPages();
      const clamped = Math.max(0, Math.min(pages - 1, raw));
      setPageIndex(clamped);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateLayout);

    // 트랙패드 가로 스와이프 차단
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) e.preventDefault();
    };
    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateLayout);
      el.removeEventListener("wheel", onWheel);
      if (lockTimer.current) window.clearTimeout(lockTimer.current);
    };

  }, [stride, total]);

  const go = (dir: "left" | "right") => {
    const pages = calcPages();
    setPageCount(pages);
    if (pages <= 1) return;

    const next =
      dir === "right"
        ? (pageIndex + 1) % pages
        : (pageIndex - 1 + pages) % pages;

    lockAuto();
    setPageIndex(next);
    scrollToPage(next, "smooth");
  };

  return (
    <section style={{ paddingTop: 40 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: `0 ${SIDE_PADDING}px`,
          marginBottom: 10,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 400,
            color: "rgba(255,255,255,0.92)",
            letterSpacing: "-0.2px",
          }}
        >
          {title}
        </h2>

        <div
          style={{
            display: "flex",
            gap: 2,
            opacity: 0.9,
            transform: "translateY(20px)",
          }}
        >
          {Array.from({ length: pageCount }).map((_, i) => (
            <span
              key={i}
              style={{
                width: 12,
                height: 2,
                borderRadius: 2,
                background:
                  i === pageIndex
                    ? "rgba(255,255,255,0.85)"
                    : "rgba(255,255,255,0.22)",
              }}
            />
          ))}
        </div>
      </div>

      <div
        style={{ position: "relative" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
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

        {hovered && pageCount > 1 && (
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

        <div
          ref={scrollerRef}
          className="rowScroll"
          style={{
            padding: `0 ${SIDE_PADDING}px`,
            gap: GAP,
            overflowY: "hidden",
            overscrollBehaviorX: "contain",
          }}
        >
          {renderItems.map((it, i) => {
            if (total === 0) return null;

            const realIdx = (i - CLONE + total) % total;

            const is1 = realIdx === 0;
            const is10 = realIdx === 9;
            const fontSize = is10 ? numberSize10 : numberSize;

            const nLeft = is1 ? numberLeft1 : is10 ? numberLeft10 : numberLeftRest;
            const nBottom = is1 ? numberBottom1 : is10 ? numberBottom10 : numberBottomRest;

            return (
              <div
                key={`${it.id}-${i}`}
                style={{
                  position: "relative",
                  flex: "0 0 auto",
                  width: cellW,
                  height: cellH,
                }}
                title={it.title}
              >
                <div
                  style={{
                    position: "absolute",
                    left: nLeft,
                    bottom: nBottom,
                    fontSize,
                    lineHeight: 0.9,
                    fontWeight: 900,
                    color: "transparent",
                    WebkitTextStroke: `${stroke}px rgba(255,255,255,${numberOpacity})`,
                    zIndex: 0,
                    userSelect: "none",
                    pointerEvents: "none",
                    letterSpacing: "-0.06em",
                  }}
                >
                  {realIdx + 1}
                </div>

                <div
                  style={{
                    position: "absolute",
                    left: posterLeft,
                    bottom: posterBottom,
                    width: posterW,
                    height: posterH,
                    borderRadius: 8,
                    background: "#2b2b2b",
                    overflow: "hidden",
                    zIndex: 1,
                    boxShadow: "0 10px 22px rgba(0,0,0,0.45)",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundImage: `url(${it.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
