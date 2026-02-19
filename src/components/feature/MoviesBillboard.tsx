import { getDisplayName } from "next/dist/shared/lib/utils";

export default function MoviesBillboard() {
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
        src={"./movies-billboard.jpg"}
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
          src="./movies-billboard-title.png"
          alt="hero title"
          style={{
            width: "100%",
            marginBottom: 26,
            userSelect: "none",
          }}
        />

        {/* 설명 */}
        <p style={{ fontSize: "17.2px", fontWeight: 400, marginBottom: 26 }}>
          새로 태어난 아기와 함께 행복한 나날을 보내던 그루. 복수심에 불타는 옛
          라이벌의 등장으로 그루 가족과 미니언들의 삶이 흔들리기 시작한다!
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
        {/* 연령(all) */}
        <div
          style={{
            height: 32,
            minWidth: 100,
            padding: "0 10px",
            display: "flex",
            alignItems: "center",
            borderLeft: "3px solid rgba(255,255,255,0.85)",
          }}
        >
          <svg
            viewBox="0 0 100 100"
            width="32"
            height="32"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            role="img"
          >
            <g fill="none">
              <path
                d="m88.729 100h-77.455c-6.223 0-11.274-5.046-11.274-11.272v-77.454c0-6.226 5.051-11.274 11.274-11.274h77.456c6.226 0 11.27 5.048 11.27 11.274v77.454c0 6.226-5.044 11.272-11.271 11.272"
                fill="#269251"
              ></path>
              <path
                d="m68.776 24.428 11.274.001-.004 40.523h13.27v10.148l-24.54-.005zm-51.928.001 12.335.002 10.677 50.536.004.131h-11.275l-1.196-7.559-8.751.004-1.194 7.552-11.278.003v-.135zm36.277-.001v40.524h13.262v10.146h-24.54v-50.67zm-30.11 16.312-2.785 17.247h5.57z"
                fill="#fffffe"
              ></path>
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
