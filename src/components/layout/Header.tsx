import Link from "next/link"; // Next.js 라우팅용 Link 추가했습니다

export default function Header() {
  return (
    <header>
      <nav>
        <div className="nav-left">
          <img className="netflix-icon" src="/netflix_logo.svg" />
        </div>

        <div className="nav-center">
          <ul>
            <li>
              <Link href="/">홈</Link>
            </li>
            <li>
              <a href="#">시리즈</a>
            </li>
            <li>
              <a href="#">영화</a>
            </li>
            <li>
              <a href="#">게임</a>
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

        <div className="nav-right">
          <button className="search-btn">
            <img className="search-icon" src="/search.svg" />
          </button>
          <a href="#" className="kids-links">
            키즈
          </a>
          <img className="notification-icon" src="/notification.svg" />

          <div className="profile-menu">
            <button className="profile-btn">
              <img src="/avatar.png" />
              <span className="header-arrow">▼</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
