import { getDisplayName } from "next/dist/shared/lib/utils";

export default function SeriesBillboard() {
  return (
    <section
      style={{
        position: "relative",
        height: "100vh",
        minHeight: 520,
        overflow: "hidden",
      }}
    >
      <img
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "brightness(0.82)",
        }}
        src={"./series-billboard.jpg"}
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
          bottom: 220,
          display: "flex",
          flexDirection: "column",
          zIndex: 2,
          justifyContent: "flex-end",
          width: 520,
        }}
      >
        {/* 제목 */}
        <img
          src="./series-billboard-title.png"
          alt="hero title"
          style={{
            width: "100%",
            marginBottom: 26,
            userSelect: "none",
          }}
        />

        {/* 설명 */}
        <p style={{ fontSize: "17.2px", fontWeight: 400, marginBottom: 26 }}>
          전통 인형 장인이 되고 싶은 고등학생. 진지하기만 한 그가 인기 많고
          화려한 같은 반 친구를 통해 코스프레의 세계에 발을 들인다.
        </p>

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
          bottom: 220,
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        {/* 연령(19+) */}
        <div
          style={{
            height: 32,
            minWidth: 100,
            padding: "0 10px",
            display: "flex",
            alignItems: "center",
            borderLeft: "3px solid rgba(255,255,255,0.85)",
            background: "rgba(0,0,0,0.45)",
          }}
        >
          19+
        </div>
      </div>
    </section>
  );
}
