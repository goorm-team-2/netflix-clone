import Link from "next/link";
import { useState } from "react";

import SeriesModal from "../feature/modals/SeriesModal";
import GameModal from "../feature/modals/GameModal";
import MovieModal from "../feature/modals/MovieModal";

export default function Header() {
  const [openSeries, setOpenSeries] = useState(false);
  const [openGame, setOpenGame] = useState(false);
  const [openMovie, setOpenMovie] = useState(false);

  // 테스트용 ID
  const TEST_TV_ID = 1399;     // 왕좌의 게임
  const TEST_GAME_ID = 3498;  // 예: GTA5 (RAWG 기준)
  const TEST_MOVIE_ID = 496243;

  return (
    <>
      <header>
        <nav>
          {/* 왼쪽 */}
          <div className="nav-left">
            <img className="netflix-icon" src="/netflix_logo.svg" />
          </div>

          {/* 가운데 메뉴 */}
          <div className="nav-center">
            <ul>
              <li>
                <Link href="/">홈</Link>
              </li>

              {/* 시리즈 */}
              <li>
                <button
                  className="nav-btn"
                  onClick={() => setOpenSeries(true)}
                >
                  시리즈
                </button>
              </li>

              {/* 영화 (나중에 MovieModal 연결 가능) */}
              <li>
                <button
                  className="nav-btn"
                  onClick={() => setOpenMovie(true)}
                >
                  영화
                </button>
              </li>

              {/* ✅ 게임 */}
              <li>
                <button
                  className="nav-btn"
                  onClick={() => setOpenGame(true)}
                >
                  게임
                </button>
              </li>

              <li>
                <Link href="/trending">NEW! 요즘 대세 콘텐츠</Link>
              </li>

              <li>
                <a href="#">내가 찜한 리스트</a>
              </li>

              <li>
                <a href="#">언어별로 찾아보기</a>
              </li>
            </ul>
          </div>

          {/* 오른쪽 */}
          <div className="nav-right">
            <button className="search-btn">
              <img className="search-icon" src="/search.svg" />
            </button>

            <a href="#" className="kids-links">
              키즈
            </a>

            <img
              className="notification-icon"
              src="/notification.svg"
            />

            <div className="profile-menu">
              <button className="profile-btn">
                <img src="/avatar.png" />
                <span className="arrow">▼</span>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* ===============================
          시리즈 모달
      =============================== */}
      <SeriesModal
        isOpen={openSeries}
        tvId={TEST_TV_ID}
        onClose={() => setOpenSeries(false)}
      />

      <MovieModal
        isOpen={openMovie}
        movieId={TEST_MOVIE_ID}
        onClose={() => setOpenMovie(false)}
        />
      {/* ===============================
          게임 모달
      =============================== */}
      <GameModal
        isOpen={openGame}
        gameId={TEST_GAME_ID}
        onClose={() => setOpenGame(false)}
      />
    </>
  );
}
