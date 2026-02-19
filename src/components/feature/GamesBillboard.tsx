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
        height: "75vh",
        maxHeight: "610px",
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
        src="./games-billboard-dummy-video.mp4"
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
          bottom: 50,
          zIndex: 2,
          maxWidth: 760,
        }}
      >
        {/* 제목 */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            style={{
              width: "96px",
              height: "96px",
              borderRadius: "16px",
              marginRight: "16px",
            }}
            src={"./game_reddeadredemption.png"}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <img
              style={{ width: "75px", height: "20px" }}
              src={"./logo.webp"}
            />
            <p
              style={{
                height: "30px",
                fontSize: "24px",
                fontWeight: 500,
                marginTop: "8px",
              }}
            >
              레드 데드 리뎀션
            </p>
          </div>
        </div>

        {/* 설명 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <p style={{ marginTop: "8px" }}>모바일 게임 · 액션</p>
          <p
            style={{
              fontSize: "18px",
              fontWeight: 500,
              marginTop: "8px",
              marginBottom: "12px",
            }}
          >
            멤버십에 포함되어 있습니다
          </p>
          <p style={{ fontSize: "18px", fontWeight: 400 }}>
            자신의 과거를 묻으려는 전직 무법자가 되어 미국 서부를 여행해
            보십시오. 이 호평받은 어드벤처 게임이 처음으로 모바일에 출시됩니다.
          </p>
        </div>

        {/* 버튼 */}
        <div style={{ display: "flex", gap: 14, marginTop: "24px" }}>
          <button
            type="button"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              height: 40,
              padding: "6px 16px",
              borderRadius: 6,
              border: 0,
              background: "white",
              color: "#111",
              cursor: "pointer",
              fontSize: 16,
              fontWeight: 500,
            }}
          >
            <svg
              viewBox="0 0 16 16"
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              role="img"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M4 1.5h8c.28 0 .5.22.5.5v12a.5.5 0 0 1-.5.5H4a.5.5 0 0 1-.5-.5V2c0-.28.22-.5.5-.5M2 2c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm7 10a1 1 0 1 0-2 0 1 1 0 0 0 2 0"
                clipRule="evenodd"
              ></path>
            </svg>
            모바일 게임 받기
          </button>

          {/* 상세 정보 */}
          <button
            type="button"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              height: 40,
              padding: "6px 16px",
              borderRadius: 6,
              border: 0,
              background: "rgba(109,109,110,0.7)",
              color: "white",
              cursor: "pointer",
              fontSize: 16,
              fontWeight: 500,
            }}
          >
            <img
              src="/icons/icon-info.png"
              alt="info"
              style={{ width: 16, height: 16 }}
            />
            상세 정보
          </button>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 0,
          bottom: 50,
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

        {/* 연령(18+) */}
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
          18+
        </div>
      </div>
    </section>
  );
}
