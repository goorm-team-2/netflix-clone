"use client"; // 클라이언트 컴포넌트로 설정

import { useState, useEffect, useRef } from "react"; // React 임포트
import css from "@/app/by-language/page.module.css";
import { Movie, MovieResponse } from "@/components/video/movie";
import Video from "@/components/video/video";

export default function MyListPage() {
    // 선택된 값을 관리할 상태 변수들
    const [movies, setMovies] = useState<Movie[]>([]); // 영화 목록 저장


    useEffect(() => {
        // API_KEY가 없을 경우 실행하지 않도록 방어
        const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        if (!API_KEY) {
            console.error("API 키가 설정되지 않았습니다.");
            return;
        }
    }); 

    return (
        <main className={css.main}>
            <nav className={css.nav}>
                {/* 상단 부분 */}
                <div className={`header`}>
                    <h3 className={css.h3}>내가 찜한 리스트</h3>
                    
                </div>

                {/* 영화 부분 */}
                <div className={`common-videos`}>
                    {movies && movies.length > 0 && 
                    movies.map((movie) => (
                        <Video 
                            key={movie.id} 
                            movie={movie} 
                            onClick={() => console.log(movie.title)} 
                        />
                    ))}
                </div>
            </nav>
        </main>
    );
}