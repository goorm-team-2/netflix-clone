"use client";


import { useState } from "react";
import SeriesModal from "../feature/modals/SeriesModal";
import MovieModal from "../feature/modals/MovieModal";
import GameModal from "../feature/modals/GameModal";

export default function Header() {

  const [isSeriesOpen, setIsSeriesOpen] = useState(false);
  const [isMovieOpen, setIsMovieOpen] = useState(false);
  const [isGameOpen, setIsGameOpen] = useState(false);

  return (
    <>
      <header>
        <nav>

          {/* 왼쪽 */}
          <div className="nav-left">
            <img
              className="netflix-icon"
              src="/netflix_logo.svg"
              alt="Netflix"
            />
          </div>

          {/* 가운데 */}
          <div className="nav-center">
            <ul>

              <li><a href="#">홈</a></li>

              {/* 시리즈 버튼 */}
              <li>
                <button
                  className="nav-btn"
                  onClick={() => setIsSeriesOpen(true)}
                >
                  시리즈
                </button>
              </li>

              <li>
                <button
                  className="nav-btn"
                  onClick={() => setIsMovieOpen(true)}
                >
                  영화
                </button>
              </li>

              <li>
                <button
                  className="nav-btn"
                  onClick={() => setIsGameOpen(true)}
                >
                  게임
                </button>
              </li>
              <li><a href="#">NEW! 요즘 대세 콘텐츠</a></li>
              <li><a href="#">내가 찜한 리스트</a></li>
              <li><a href="#">언어별로 찾아보기</a></li>

            </ul>
          </div>

          {/* 오른쪽 */}
          <div className="nav-right">

            <button className="search-btn">
              <img
                className="search-icon"
                src="/search.svg"
                alt="Search"
              />
            </button>

            <a href="#" className="kids-links">
              키즈
            </a>

            <img
              className="notification-icon"
              src="/notification.svg"
              alt="Notice"
            />

            <div className="profile-menu">
              <button className="profile-btn">
                <img src="/avatar.png" alt="Profile" />
                <span className="arrow">▼</span>
              </button>
            </div>

          </div>

        </nav>
      </header>


      {/*  시리즈 모달 연결 */}
      <SeriesModal
        isOpen={isSeriesOpen}
        onClose={() => setIsSeriesOpen(false)}
      />
      {/*  영화 모달 연결 */}
      <MovieModal
        isOpen={isMovieOpen}
        onClose={() => setIsMovieOpen(false)}
      />
      {/*  게임 모달 연결 */}
      <GameModal
        isOpen={isGameOpen}
        onClose={() => setIsGameOpen(false)}
      />
    </>
  );
}
