"use client";

import "./GameModal.css";

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GameModal({
  isOpen,
  onClose,
}: GameModalProps) {

  if (!isOpen) return null;

  return (
    <div
      className="game-overlay"
      onClick={onClose}
    >
      <div
        className="game-modal"
        onClick={(e) => e.stopPropagation()}
      >

        {/* 닫기 */}
        <button
          className="game-close"
          onClick={onClose}
        >
          ✕
        </button>


        {/* 배너 */}
        <div className="game-banner">

          <div className="game-banner-img" />

        </div>


        {/* 메인 정보 */}
        <div className="game-main">

          <div className="game-left">

            <div className="game-icon" />

            <div>

              <p className="netflix-label">NETFLIX</p>

              <h1>넷플릭스 퍼즐 모음</h1>

              <p className="game-meta">
                모바일 게임 · 퍼즐 · 13+
              </p>

            </div>

          </div>


          <div className="game-actions">

            <button className="game-icon-btn">＋</button>
            <button className="game-icon-btn">👍</button>

          </div>

        </div>


        {/* 설명 */}
        <div className="game-desc">

          <p>
            매일 뇌를 단련시키는 퍼즐 플레이 습관을 길러 보세요.
            날마다 새로운 퍼즐과 논리, 시각 퍼즐을 풀고,
            좋아하는 넷플릭스 세계에 기반한
            컬렉션을 둘러보세요.
          </p>

          <div className="game-info-right">

            <p>모드: 싱글 플레이어</p>
            <p>오프라인 플레이: 일부 기능 가능</p>

          </div>

        </div>


        {/* QR 다운로드 */}
        <div className="game-download">

          <div className="qr-box" />

          <div className="download-text">

            <h3>
              QR 코드를 스캔해 모바일에서 다운로드하세요
            </h3>

            <p>
              기존 멤버십에 포함되어 있습니다.
              광고도, 추가 요금도, 인앱 구매도 없습니다.
            </p>

            <div className="store-btns">

              <div className="store-btn">App Store</div>
              <div className="store-btn">Google Play</div>

            </div>

          </div>

        </div>


        {/* 상세 정보 */}
        <div className="game-detail">

          <h2>넷플릭스 퍼즐 모음 상세 정보</h2>

          <p><span>카테고리:</span> 단어 게임, 퍼즐 게임</p>
          <p><span>모드:</span> 싱글 플레이어</p>
          <p><span>플레이어:</span> 1</p>
          <p><span>이용 가능 플랫폼:</span> 모바일</p>
          <p><span>오프라인 플레이:</span> 일부 기능 가능</p>

          <p>
            <span>호환성:</span>
            iOS 17.0 이상, Android OS8 이상
          </p>

          <p><span>컨트롤러 지원:</span> O</p>

          <p>
            <span>언어:</span>
            한국어, 독일어, 스페인어, 영어, 이탈리아어,
            일본어, 중국어, 터키어, 포르투갈어
          </p>

          <p><span>개발자:</span> Next Games</p>
          <p><span>출시 연도:</span> 2025</p>

          <p className="game-rating">

            <span>관람등급:</span>

            <span className="game-age">13+</span>

            간헐적 폭력, 욕설, 공포 요소 포함

          </p>

        </div>

      </div>
    </div>
  );
}
