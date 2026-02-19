"use client";

import { useEffect, useRef, useState } from "react";

export default function Homefridge() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  // 설명 표시 상태
  const [showDesc, setShowDesc] = useState(true);
  const [hideDesc, setHideDesc] = useState(false);

  useEffect(() => {
    const t1 = window.setTimeout(() => setHideDesc(true), 5000);
    const t2 = window.setTimeout(() => setShowDesc(false), 5600);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

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

  const heroBottom = showDesc ? 180 : 210;
  const logoScale = showDesc ? 1 : 0.92;

  return (
    <section
      style={{
        position: "relative",
        height: "78vh",
        minHeight: 520,
        overflow: "hidden",
      }}
    >
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
          bottom: heroBottom,
          zIndex: 2,
          maxWidth: 760,
          transition: "bottom 600ms ease",
        }}
      >
        <img
          src="/icons/fridge-title.png"
          alt="hero title"
          style={{
            width: 440,
            maxWidth: "70vw",
            userSelect: "none",
            transform: `scale(${logoScale})`,
            transformOrigin: "left bottom",
            transition: "transform 600ms ease",
            marginBottom: showDesc ? 18 : 12,
          }}
        />

        {showDesc && (
          <div
            style={{
              marginBottom: 20,
              maxWidth: 640,
              opacity: hideDesc ? 0 : 1,
              transform: hideDesc
                ? "translateY(-6px)"
                : "translateY(0)",
              transition:
                "opacity 600ms ease, transform 600ms ease",
            }}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                marginBottom: 10,
                letterSpacing: "-0.3px",
                textShadow:
                  "0 2px 10px rgba(0,0,0,0.45)",
              }}
            >
              2월 15일 새로운 에피소드 공개
            </div>

            <div
              style={{
                fontSize: 16,
                lineHeight: 1.45,
                color: "rgba(255,255,255,0.92)",
                textShadow:
                  "0 2px 10px rgba(0,0,0,0.45)",
                whiteSpace: "pre-line",
              }}
            >
           {`인기 연예인의 집 냉장고엔 뭐가 들었을까? 한국 최고의 셰프들이 연예인의
             냉장고에서 직접 꺼낸 재료를 사용해 즉흥 요리 맞대결을 펼친다.`}
            </div>
          </div>
        )}

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
            src={
              isMuted
                ? "/icons/volume-off.png"
                : "/icons/volume-on.png"
            }
            alt="volume"
            style={{ width: 22, height: 22 }}
          />
        </button>

        <div
          style={{
            height: 36,
            minWidth: 100,
            padding: "0 10px",
            display: "flex",
            alignItems: "center",
            borderLeft:
              "3px solid rgba(255,255,255,0.85)",
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

