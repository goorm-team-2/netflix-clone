"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { useRouter } from "next/navigation"; // Next.js 라우터 추가

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태 추가
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter(); // 라우터 인스턴스 생성

  // 스크롤 감지 로직
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 검색창 열릴 때 포커스
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // 엔터키 입력 시 검색 페이지로 이동
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      // ?q=검색어 형태로 이동
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      // 필요하다면 검색 후 창을 닫음
      // setIsSearchOpen(false); 
    }
  };

  return (
    <header className={isScrolled ? "scrolled" : ""}>
      <nav>
        <div className="nav-left">
          <img className="netflix-icon" src="/netflix_logo.svg" alt="logo" />
        </div>
        
        <div className="nav-center">
          <ul>
            <li><a href="/">홈</a></li>
            <li><a href="/series">시리즈</a></li>
            <li><a href="/movies">영화</a></li>
            <li><a href="/games">게임</a></li>
            <li><a href="/trending">NEW! 요즘 대세 콘텐츠</a></li>
            <li><a href="/my-list">내가 찜한 리스트</a></li>
            <li><a href="/by-language">언어별로 찾아보기</a></li>
          </ul>
        </div>

        <div className="nav-right">
          <div className={`search-container ${isSearchOpen ? "active" : ""}`}>
            <button
              className="search-btn"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <img className="search-icon" src="/search.svg" alt="search" />
            </button>
            <input
              ref={searchInputRef}
              type="text"
              className="search-input"
              placeholder="제목, 사람, 장르"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // 입력값 업데이트
              onKeyDown={handleKeyDown} // 엔터키 감지
              onBlur={() => {
                // 입력값이 없을 때만 닫히도록 설정 (검색 중 닫힘 방지)
                if (searchQuery === "") setIsSearchOpen(false);
              }}
            />
          </div>
          <a href="#" className="kids-links">키즈</a>
          <img className="notification-icon" src="/notification.svg" alt="notif" />

          <div className="profile-menu">
            <button className="profile-btn">
              <img src="/avatar.png" alt="avatar" />
              <span className="arrow">▼</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}