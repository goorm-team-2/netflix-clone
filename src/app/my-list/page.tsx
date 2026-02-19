"use client"; // 클라이언트 컴포넌트로 설정

import { useState, useEffect, useRef } from "react"; // React 임포트
import css from "@/app/my-list/page.module.css";
import { Movie, MovieResponse } from "@/components/video/movie";
import Video from "@/components/video/video";

export default function MyListPage() {
    // 선택된 값을 관리할 상태 변수들
    const [movies, setMovies] = useState<Movie[]>([]); 
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

    useEffect(() => {
        const fetchMyList = async () => {
            const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
            if (!API_KEY) return;

            // LocalStorage에서 'myList_'로 시작하고 값이 true인 ID 찾기
            const likedMovieIds: string[] = [];
            
            // localStorage의 모든 키를 확인
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                // 키가 'myList_'로 시작하는지 확인
                if (key && key.startsWith("myList_")) {
                    const value = localStorage.getItem(key);
                    // 값이 true인지 확인
                    if (value && JSON.parse(value) === true) {
                        // 'myList_12345'에서 '12345'만 추출
                        const id = key.split("_")[1];
                        likedMovieIds.push(id);
                    }
                }
            }

            // 찜한 영화가 없으면 종료
            if (likedMovieIds.length === 0) {
                setMovies([]);
                setIsLoading(false);
                return;
            }

            // 추출한 ID들로 API 호출하여 영화 상세 정보 가져오기
            try {
                // 여러 API 요청을 동시에 처리
                const requests = likedMovieIds.map(async (id) => {
                    const res = await fetch(
                        `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=ko-KR&append_to_response=videos`
                    );
                    const data = await res.json();
                    
                    
                    return data;
                });

                const results = await Promise.all(requests);
                setMovies(results);
            } catch (error) {
                console.error("찜한 목록 불러오기 실패:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyList();
    }, []);

    return (
        <main className={css.main}>
            <nav className={css.nav}>
                {/* 상단 부분 */}
                <div className={`common-header ${css['header']}`}>
                    <h3 className={css.h3}>내가 찜한 리스트</h3>
                    
                </div>

                {/* 영화 부분 */}
                <div className={`common-videos ${css['videos']}`}>
                    {movies.length > 0 ? (
                        movies.map((movie) => (
                            <Video 
                                key={movie.id} 
                                movie={movie} 
                                // Video 컴포넌트 내부에서 videoUrl을 처리하도록 데이터를 넘김
                            />
                        ))
                    ) : movies.length === 0 ? (
                        // 찜한 콘텐츠가 없을 때 메시지 표시
                        <p className={css.noMovies}>아직 찜하신 콘텐츠가 없습니다.</p>
                        
                    ) : null}
                </div>
            </nav>
        </main>
    );
}