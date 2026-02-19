"use client";

import "./SeriesModal.css";

interface SeriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SeriesModal({
  isOpen,
  onClose,
}: SeriesModalProps) {
  if (!isOpen) return null;

  return (
<div
  className="series-overlay"
  onClick={onClose}
>

  <div
    className="series-modal"
    onClick={(e) => e.stopPropagation()}
  >
        {/* 닫기 */}
        <button
          className="close-btn"
          onClick={onClose}
        >
          ✕
        </button>

        {/* 상단 배너 */}
        <div className="series-banner">

          <div className="banner-img" />

          <div className="banner-info">

            <h1>갯마을 차차차</h1>

            <div className="banner-btns">
              <button className="play-btn">▶ 재생</button>
              <button className="icon-btn">＋</button>
              <button className="icon-btn">👍</button>
            </div>

          </div>

        </div>

        {/* 설명 영역 */}
        <div className="series-desc">

          <div className="left">

            <p className="meta">
              2021 · 에피소드 16개 · HD · AD
            </p>

            <p className="age">15+</p>

            <h3>시즌 1: 1화 "1화"</h3>

            <p className="summary">
              화경에 병원을 때려치운 뒤 갈 곳을 잃었다.
              변화를 기대하며 어린 시절 추억이 담긴
              바닷마을 공진으로 향한 치과의사 혜진.
              그곳에서 혜진은 독특한 마을 청년을 만난다.
            </p>

          </div>

          <div className="right">

            <p>
              <span>출연:</span> 신민아, 김선호, 이상이, 더보기
            </p>

            <p>
              <span>장르:</span> 코미디 시리즈, 로맨틱 코미디,
              한국 드라마
            </p>

            <p>
              <span>시리즈 특징:</span> 힐링, 기분 좋아지는,
              거부할 수 없는 이끌림
            </p>

          </div>

        </div>

        {/* 회차 제목 */}
        <div className="episode-header">
          <h2>회차</h2>
          <span>리미티드 시리즈</span>
        </div>

        {/* 에피소드 리스트 */}
        <div className="episode-list">

          {episodeData.map((ep) => (
            <div key={ep.no} className="episode-item">

              <div className="episode-thumb" />

              <div className="episode-text">

                <h4>{ep.no}화</h4>

                <p>{ep.desc}</p>

              </div>

              <span className="episode-time">
                {ep.time}
              </span>

            </div>
          ))}

        </div>

        {/* 마지막 화살표 */}
<div className="episode-more">

  <div className="more-line" />

  <button className="more-btn">
    <span className="arrow-icon">⌄</span>
  </button>

</div>

{/* 함께 시청된 콘텐츠 */}
<div className="watch-together">

  <h2>함께 시청된 콘텐츠</h2>

  <div className="watch-grid">

    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="watch-card">

        <div className="watch-img" />

        <div className="watch-meta">

          <div className="badge">
            <span className="age">15+</span>
            <span>HD</span>
            <span>2020</span>
          </div>

          <button className="add-btn">＋</button>

        </div>

        <p className="watch-desc">
          드라마 설명이 들어가는 영역입니다.
        </p>

      </div>
    ))}

  </div>

</div>


{/* 예고편 및 다른 영상 */}
<div className="trailer-section">

  <h2>예고편 및 다른 영상</h2>

  <div className="trailer-item">

    <div className="trailer-thumb" />

    <p>예고편: 갯마을 차차차</p>

  </div>
</div>


{/* 상세 정보 */}
<div className="detail-info">

  <h2>갯마을 차차차 상세 정보</h2>

  <p>
    크리에이터: 유제원, 신하은
  </p>

  <p>
    출연: 신민아, 김선호, 이상이, 공민정, 김영옥
  </p>

  <p>
    장르: 코미디 시리즈, 로맨틱 코미디, 한국 드라마
  </p>

  <p>
    시리즈 특징: 힐링, 기분 좋아지는, 거부할 수 없는 이끌림
  </p>

  <p>
    관람등급: 15세 이상 관람가
  </p>

<p className="release">
    tvN · 2021-08-28
    </p>
        </div>
      </div>
    </div>
  );
}

/* 에피소드 데이터 */
const episodeData = [
  {
    no: 1,
    time: "1시간 14분",
    desc:
      "화경에 병원을 때려치운 뒤 갈 곳을 잃었다. " +
      "변화를 기대하며 바닷마을 공진으로 향한 혜진."
  },
  {
    no: 2,
    time: "1시간 15분",
    desc:
      "환자 맞을 준비를 해볼까? 새로운 출발을 앞둔 혜진."
  },
  {
    no: 3,
    time: "1시간 17분",
    desc:
      "두식과 함께 서울로 향하는 혜진."
  },
  {
    no: 4,
    time: "1시간 12분",
    desc:
      "뜻밖의 사건으로 치과가 발칵 뒤집힌다."
  },
  {
    no: 5,
    time: "1시간 9분",
    desc:
      "소문이 퍼지며 마을 분위기가 달라진다."
  },
  {
    no: 6,
    time: "1시간 18분",
    desc:
      "과거의 상처와 다시 마주하는 혜진."
  },
  {
    no: 7,
    time: "1시간 19분",
    desc:
      "공진에서 프로그램 촬영을 준비한다."
  },
  {
    no: 8,
    time: "1시간 18분",
    desc:
      "의문의 사건이 마을을 뒤흔든다."
  },
  {
    no: 9,
    time: "1시간 19분",
    desc:
      "부모님의 방문으로 분위기가 바뀐다."
  },
  {
    no: 10,
    time: "1시간 20분",
    desc:
      "혜진의 집에 누군가 침입한다."
  },
];
