"use client";

import { useRef, useState } from "react";

export default function Homefridge() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = async () => {
    const v = videoRef.current;
    if (!v) return;

    const next = !isMuted;
    v.muted = next;
    setIsMuted(next);

    try {
      if (!next) await v.play();
    } catch {}
  };

  return (
    <section
      style={{
        position: "relative",
        height: "78vh",
        minHeight: 520,
        overflow: "hidden",
      }}
    >
      {/* 비디오 */}
      <video
        ref={videoRef}
        autoPlay
        muted={isMuted}
        loop
        playsInline
        preload="auto"
        src="/videos/fridge.mov"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "brightness(0.82)",
        }}
      />

      {/* 하단 그라데이션 */}
      <div
        style={{
          position: "absolute",
          inset: "auto 0 0 0",
          height: 280,
          background:
            "linear-gradient(to top, rgba(20,20,20,1), rgba(20,20,20,0))",
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 60,
          bottom: 180,
          zIndex: 2,
          maxWidth: 760,
        }}
      >
        {/* 제목 */}
        <img
          src="/icons/fridge-title.png"
          alt="hero title"
          style={{
            width: 440,
            maxWidth: "70vw",
            marginBottom: 26,
            userSelect: "none",
          }}
        />

        {/* 재생 버튼 */}
        <div style={{ display: "flex", gap: 14 }}>
          <button
            type="button"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              height: 52,
              padding: "0 26px",
              borderRadius: 6,
              border: 0,
              background: "white",
              color: "#111",
              cursor: "pointer",
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            <img
              src="/icons/icon-play.png"
              alt="play"
              style={{ width: 22, height: 22 }}
            />
            재생
          </button>

          {/* 상세 정보 */}
          <button
            type="button"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              height: 52,
              padding: "0 26px",
              borderRadius: 6,
              border: 0,
              background: "rgba(109,109,110,0.7)",
              color: "white",
              cursor: "pointer",
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            <img
              src="/icons/icon-info.png"
              alt="info"
              style={{ width: 22, height: 22 }}
            />
            상세 정보
          </button>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 0,
          bottom: 180,
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        {/* 음소거 */}
        <button
          type="button"
          onClick={toggleMute}
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.9)",
            background: "rgba(0,0,0,0.4)",
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
          }}
        >
          <img
            src={isMuted ? "/icons/volume-off.png" : "/icons/volume-on.png"}
            alt="volume"
            style={{ width: 22, height: 22 }}
          />
        </button>

        {/* 연령(15세) */}
        <div
          style={{
            height: 36,
            minWidth: 100,
            padding: "0 10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            borderLeft: "3px solid rgba(255,255,255,0.85)",
            background: "rgba(0,0,0,0.45)",
          }}
        >
          <img
            src="/icons/rating-15.png"
            alt="15"
            style={{ height: 22 }}
          />
        </div>
      </div>
    </section>
  );
}
