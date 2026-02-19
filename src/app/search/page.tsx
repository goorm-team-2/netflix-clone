"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation"; 
import Link from "next/link"; //
import css from "@/app/search/page.module.css"; 
import { Movie } from "@/components/video/movie"; 
import Video from "@/components/video/video";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q"); 

  // --- 상태 관리 ---
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // 무한 스크롤
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const sentinelRef = useRef<HTMLDivElement>(null); 

  // 검색어 변경 시 초기화
  useEffect(() => {
    setMovies([]);
    setPage(1);
    setTotalPages(0);
  }, [query]);

  // 데이터 fetch
  useEffect(() => {
    if (!query) return;

    const fetchSearchResults = async () => {
      if (isLoading) return;
      setIsLoading(true);

      try {
        const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=ko-KR&query=${encodeURIComponent(query)}&include_adult=false&page=${page}`
        );
        const data = await res.json();

        setMovies((prev) => {
          const newMovies = data.results || [];
          if (page === 1) return newMovies;
          return [...prev, ...newMovies].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
        });
        
        setTotalPages(data.total_pages || 0);

      } catch (error) {
        console.error("검색 에러:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, page]); 

  // 무한 스크롤 Observer
  useEffect(() => {
    if (isLoading) return; 

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && page < totalPages) {
          setTimeout(() => {
             setPage((prev) => prev + 1);
          }, 500);
        }
      },
      { threshold: 0.5 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [isLoading, page, totalPages]);


  return (
    <main className={css.main}>
        <nav className={css.nav}>
            
            {/* 헤더 영역 */}
            <div className={css.searchheader}>                 
                 {/* --- 연관 검색어 섹션 --- */}
                 {/* 검색 결과가 있을 때만 보여줍니다 */}
                 {movies.length > 0 && (
                    <div className={css.relatedContainer}>
                        <span className={css.relatedLabel}>
                            더 다양한 검색어가 필요하시다면:
                        </span>
                        
                        <div className={css.keywordList}>
                            {/* 상위 10개 영화 제목만 추출해서 보여줌 */}
                            {movies.slice(0, 10).map((movie, index, arr) => (
                                <span key={movie.id}>
                                    <Link 
                                        href={`/search?q=${encodeURIComponent(movie.title)}`}
                                        className={css.keywordLink}
                                    >
                                        {movie.title}
                                    </Link>
                                    {/* 마지막 아이템이 아니면 구분선 표시 */}
                                    {index < arr.length - 1 && (
                                        <span className={css.separator}>|</span>
                                    )}
                                </span>
                            ))}
                        </div>
                    </div>
                 )}
            </div>

            {/* 비디오 영역 */}
            <div className={`common-videos ${css.videos}`}> 
    {/* 결과가 있을 때 */}
    {movies.length > 0 ? (
        <>
            {movies.map((movie) => (
                <Video key={movie.id} movie={movie} />
            ))}
            {/* 무한 스크롤 감지용 투명 박스 (데이터가 있을 때만 렌더링) */}
            <div 
                ref={sentinelRef} 
                style={{ width: '100%', height: '20px', backgroundColor: 'transparent' }} 
            />
            {/* 추가 로딩 중 표시 */}
            {isLoading && page > 1 && (
                    <p style={{ width: "100%", textAlign: "center", color: "#666", padding: "20px 0" }}>로딩 중...</p>
            )}
        </>
    ) : (
        /* 결과가 없고 로딩도 끝났을 때 */
        !isLoading && (
            <div className={css.noResult}>
                <p>입력하신 검색어와 일치하는 결과가 없습니다.</p>
            </div>
        )
    )}
    {/* 첫 페이지 로딩 중일 때 (화면 중앙) */}
    {isLoading && page === 1 && (
            <div className={css.noResult}>
            <p>검색 중...</p>
        </div>
    )}
</div>
        </nav>
    </main>
  );
}