"use client";

import { useState } from "react";
import "./MovieModal.css";

interface MovieModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MovieModal({
  isOpen,
  onClose,
}: MovieModalProps) {

  const [showMore, setShowMore] = useState(false);

  if (!isOpen) return null;

  // 더미 콘텐츠 15개
  const contents = Array.from({ length: 15 });

  // 표시할 개수
  const visibleContents = showMore
    ? contents
    : contents.slice(0, 6);

  return (
    <div
      className="movie-overlay"
      onClick={onClose}
    >
      <div
        className="movie-modal"
        onClick={(e) => e.stopPropagation()}
      >

        {/* 닫기 */}
        <button
          className="movie-close"
          onClick={onClose}
        >
          ✕
        </button>


        {/* 상단 배너 */}
        <div className="movie-banner">

          <div className="movie-banner-img" />

          <div className="movie-banner-info">

            <h1>어느날 그녀에게 생긴일</h1>

            <div className="movie-btns">
              <button className="play-btn">▶ 재생</button>
              <button className="icon-btn">＋</button>
              <button className="icon-btn">👍</button>
            </div>

          </div>

        </div>


        {/* 설명 */}
        <div className="movie-desc">

          <div className="left">

            <p className="meta">
              2002 · 1시간 43분 · HD
            </p>

            <p className="age">15+</p>

            <p className="summary">
              잘나가는 리포터가 길거리 예지자를 인터뷰하던 중
              며칠 내에 죽게 될 운명이라는 이야기를 듣게 된다.
            </p>

          </div>

          <div className="right">

            <p>
              <span>출연:</span> 안젤리나 졸리, 에드워드 번즈
            </p>

            <p>
              <span>장르:</span> 로맨틱 코미디 영화
            </p>

            <p>
              <span>영화 특징:</span> 로맨틱
            </p>

          </div>

        </div>


        {/* 함께 시청 */}
        <div className="movie-watch">

          <h2>함께 시청된 콘텐츠</h2>

          <div className="movie-grid">

            {visibleContents.map((_, i) => (
              <div key={i} className="movie-card">

                <div className="movie-thumb" />

                <div className="movie-card-meta">

                  <div className="badge">
                    <span className="age">15+</span>
                    <span>HD</span>
                    <span>2020</span>
                  </div>

                  <button className="add-btn">＋</button>

                </div>

                <p className="movie-card-desc">
                  영화 설명이 들어가는 영역입니다.
                </p>

              </div>
            ))}

          </div>

        </div>


        {/* 더보기 버튼 */}
        <div className="movie-more">

          <div className="more-line" />

          <button
            className={`more-btn ${showMore ? "open" : ""}`}
            onClick={() => setShowMore(!showMore)}
          >
            ⌄
          </button>
        </div>


        {/* 영화 상세 정보 */}
        <div className="movie-detail-info">
            <h2>어느날 그녀에게 생긴 일 상세 정보</h2>
<p>
    <span>감독:</span> 스티븐 헤릭
  </p>

  <p>
    <span>출연:</span> 안젤리나 졸리, 에드워드 번즈,
    토니 살호브, 스톡카드 채닝,
    리사 톰슨, 크리스천 케인,
    제임스 가먼, 멜리사 에릭,
    맥스 베이커
  </p>

  <p>
    <span>각본:</span> 존 스콧 셰퍼드, 데이나 스티븐스
  </p>

  <p>
    <span>장르:</span> 미국 작품, 로맨틱 코미디 영화,
    코미디 영화, 로맨틱한 영화
  </p>

  <p>
    <span>영화 특징:</span> 로맨틱
  </p>

  <p className="rating">

    <span>관람등급:</span>

    <span className="age-box">15</span>

    15세이상관람가

  </p>

</div>


      </div>
    </div>
  );
}
