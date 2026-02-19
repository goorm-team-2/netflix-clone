"use client";

import { createPortal } from "react-dom";
import { useEffect, useLayoutEffect, useState } from "react";
import Top10HoverCard from "./Top10HoverCard";

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

export default function Top10HoverPortal({
  open,
  anchorEl,
  item,
  onClose,
  onHoverCardEnter,
  onHoverCardLeave,
}: {
  open: boolean;
  anchorEl: HTMLElement | null;
  item: Item | null;
  onClose: () => void;
  onHoverCardEnter?: () => void;
  onHoverCardLeave?: () => void;
}) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  const updateRect = () => {
    if (!anchorEl) return;
    setRect(anchorEl.getBoundingClientRect());
  };

  useLayoutEffect(() => {
    if (!open) return;
    updateRect();
  }, [open, anchorEl]);

  // 스크롤 같은 이동이 발생하면 즉시 닫기
  useEffect(() => {
    if (!open) return;

    const closeNow = () => onClose();


    window.addEventListener("scroll", closeNow, true);
    window.addEventListener("wheel", closeNow, { passive: true });
    window.addEventListener("touchmove", closeNow, { passive: true });

    window.addEventListener("keydown", (e) => {
      const keys = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "];
      if (keys.includes(e.key)) closeNow();
    });

    return () => {
      window.removeEventListener("scroll", closeNow, true);
      window.removeEventListener("wheel", closeNow as any);
      window.removeEventListener("touchmove", closeNow as any);
    };
  }, [open, onClose]);

  if (!open || !rect || !item) return null;

  const top = Math.max(8, rect.top - 40);
  const left = Math.max(8, rect.left - 60);

  return createPortal(
    <div
      onMouseEnter={onHoverCardEnter}
      onMouseLeave={onHoverCardLeave}
      style={{
        position: "fixed",
        top,
        left,
        zIndex: 99999,
        pointerEvents: "auto",
      }}
    >
      <Top10HoverCard item={item} hideTitleOverlay />
    </div>,
    document.body
  );
}
