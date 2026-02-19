"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Top10HoverPortal from "./Top10HoverPortal";

type Item = {
  id: number;
  title: string;
  image: string;

  match?: number;
  age?: string;
  year?: string;
  quality?: string;
  genresText?: string;

  backdrop_path?: string | null;
  poster_path?: string | null;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  adult?: boolean;
  genre_ids?: number[];
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
  const [portalOpen, setPortalOpen] = useState(false);
  const [portalAnchorEl, setPortalAnchorEl] = useState<HTMLElement | null>(null);
  const [portalItem, setPortalItem] = useState<Item | null>(null);

  // 닫힘 딜레이 
  const closeTimerRef = useRef<number | null>(null);
  const cancelClose = () => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  };
  const scheduleClose = (ms = 220) => {
    cancelClose();
    closeTimerRef.current = window.setTimeout(() => {
      setPortalOpen(false);
      setPortalAnchorEl(null);
      setPortalItem(null);
    }, ms);
  };

  useEffect(() => {
    return () => cancelClose();
  }, []);

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

  const TOP10_IMAGES =
    variant === "series" ? TOP10_SERIES_IMAGES : TOP10_MOVIE_IMAGES;

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
      return { ...it, image: isPlaceholder(it.image) ? fallback : it.image };
    });
  }, [items, TOP10_IMAGES]);

  const total = baseItems.length;

  const [cellW, setCellW] = useState(180);

  const stride = cellW + GAP;

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
             display: "flex",          
             flexWrap: "nowrap",       
             position: "relative",     
             overflowX: "auto",        
          }}
        >
          {renderItems.map((it, i) => {
            if (total === 0) return null;

            const realIdx = (i - CLONE + total) % total;

            const is1 = realIdx === 0;
            const is10 = realIdx === 9;
            const fontSize = is10 ? numberSize10 : numberSize;

           const BASE_LEFT = -28;
           const BASE_BOTTOM = -12;

           const nLeft =
             realIdx === 0 ? BASE_LEFT + 30 :
             realIdx === 9 ? BASE_LEFT - 10 :
             BASE_LEFT;

           const nBottom =
            realIdx === 0 ? BASE_BOTTOM :
            realIdx === 9 ? BASE_BOTTOM + 20 :
            BASE_BOTTOM;


            return (
              <div
                key={`${it.id}-${i}`}
                style={{
                  position: "relative",
                  flex: "0 0 auto",
                  width: cellW,
                  height: 170,
                  overflow: "visible",
                }}
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
                  onMouseEnter={(e) => {
                    cancelClose();
                    setPortalAnchorEl(e.currentTarget as HTMLElement);
                    setPortalItem(it);
                    setPortalOpen(true);
                  }}
                  onMouseLeave={() => {
                    scheduleClose(240);
                  }}
                  style={{
                    position: "absolute",
                    left: 74,
                    bottom: 0,
                    width: posterW,
                    height: posterH,
                    borderRadius: 8,
                    background: "#2b2b2b",
                    overflow: "hidden",
                    zIndex: 1,
                    boxShadow: "0 10px 22px rgba(0,0,0,0.45)",
                    cursor: "pointer",
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

        <Top10HoverPortal
          open={portalOpen}
          anchorEl={portalAnchorEl}
          item={portalItem}
          onClose={() => {
            setPortalOpen(false);
            setPortalAnchorEl(null);
            setPortalItem(null);
          }}
          onHoverCardEnter={() => cancelClose()}
          onHoverCardLeave={() => scheduleClose(180)}
        />
      </div>
    </section>
  );
}
