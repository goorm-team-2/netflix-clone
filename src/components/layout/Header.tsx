"use client";

import { useState, useRef, useEffect } from 'react'; // 열림 / 닫힘

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false); //스크롤 상태 추가
    // 검색바 포커스 열림, 닫힘과 포커스 잃을 시, 닫힘
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    
    // 스크롤 감지 로직
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
    };
    return (
        <header className={isScrolled ? 'scrolled' : ''}>
            <nav>
                <div className="nav-left">
                    <img className="netflix-icon" src="/netflix_logo.svg"/>
                </div>
                <div className="nav-center">
                    <ul>
                        <li><a href="#">홈</a></li>
                        <li><a href="#">시리즈</a></li>
                        <li><a href="#">영화</a></li>
                        <li><a href="#">게임</a></li>
                        <li><a href="#">NEW! 요즘 대세 콘텐츠</a></li>
                        <li><a href="#">내가 찜한 리스트</a></li>
                        <li><a href="#">언어별로 찾아보기</a></li>
                    </ul>
                </div>
                <div className="nav-right">
                    <div className={`search-container ${isSearchOpen ? 'active' : ''}`}>
                        <button className="search-btn" onClick={(toggleSearch) => setIsSearchOpen(!isSearchOpen)}>
                            <img className="search-icon" src="/search.svg" alt="search"/>
                        </button>
                        <input 
                            ref={searchInputRef}
                            type="text" 
                            className="search-input" 
                            placeholder="제목, 사람, 장르" 
                            autoFocus
                            onBlur={() => setIsSearchOpen(false)} // 포커스 잃으면 닫기
                        />
                        
                    </div>
                    <a href="#" className="kids-links">키즈</a>
                    <img className="notification-icon" src="/notification.svg"/>

                    <div className="profile-menu">
                        <button className="profile-btn">
                            <img src="/avatar.png"/>
                            <span className="arrow">▼</span>
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
}
