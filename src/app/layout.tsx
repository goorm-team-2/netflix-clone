"use client";

import { useEffect, useState } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 스크롤 상태를 저장할 변수
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll); // 스크롤 감시
    return () => window.removeEventListener("scroll", handleScroll); // 종료 시 감시 해제
  }, []);

  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        
        <header className={isScrolled ? "scrolled" : ""}>
          <nav>
            <div className="nav-left">
                <img className="netflix-icon" src="/netflix_logo.svg" alt="logo" />
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
                <button className="search-btn">
                    <img className="search-icon" src="/search.svg" alt="search" />
                </button>
                <a href="#" className="kids-links">키즈</a>
                <img className="notification-icon" src="/notification.svg" alt="noti" />

                <div className="profile-menu">
                    <button className="profile-btn">
                        <img src="/window.svg" alt="profile" />
                        <span className="arrow">▼</span>
                    </button>
                </div>
            </div>
          </nav>
        </header>

        <main>{children}</main>

        <footer>
          <div className="footer-container">
              <div className="social-links">
                  <a href="#"><img src="/icons/facebook.svg" alt="facebook"/></a>
                  <a href="#"><img src="/icons/instagram.svg" alt="instagram"/></a>
                  <a href="#"><img src="/icons/twitter.svg" alt="twitter"/></a>
                  <a href="#"><img src="/icons/youtube.svg" alt="youtube"/></a>
              </div>

              <ul className="footer-links">
                  <li><a href="#">화면 해설</a></li>
                  <li><a href="#">고객 센터</a></li>
                  <li><a href="#">기프트카드</a></li>
                  <li><a href="#">미디어 센터</a></li>
                  <li><a href="#">투자 정보(IR)</a></li>
                  <li><a href="#">입사 정보</a></li>
                  <li><a href="#">이용 약관</a></li>
                  <li><a href="#">개인정보</a></li>
                  <li><a href="#">법적 고지</a></li>
                  <li><a href="#">쿠키 설정</a></li>
                  <li><a href="#">회사 정보</a></li>
                  <li><a href="#">문의하기</a></li>
              </ul>

              <div className="footer-info">
                  <p>넷플릭스서비스코리아 유한회사 통신판매업신고번호: 제2018-서울종로-0426호</p>
                  <p>전화번호: 00-308-321-0161 (수신자 부담)</p>
                  <p>대표: 레지널드 숀 톰프슨</p>
                  <p>이메일 주소: korea@netflix.com</p>
                  <p>주소: 대한민국 서울특별시 종로구 우정국로 26, 센트로폴리스 A동 20층 우편번호 03161</p>
                  <p>사업자등록번호: 165-87-00119</p>
                  <p>클라우드 호스팅: Amazon Web Services Inc.</p>
                  <p>공정거래위원회 웹사이트</p>
              </div>
          </div>
        </footer>
      </body>
    </html>
  );
}