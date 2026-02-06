"use client"; // 클라이언트 컴포넌트로 설정

import { useState, useEffect, useRef } from "react"; // React 임포트
import css from "@/app/by-language/page.module.css";
import { Movie, MovieResponse } from "@/components/video/movie";
import Video from "@/components/video/video";

export default function ByLanguagePage() {
    // 선택된 값을 관리할 상태 변수들
    const [language, setLanguage] = useState("en"); // 기본값 영어
    const [sort, setSort] = useState("popularity.desc"); // 기본 정렬 기준
    const [subtitle, setSubtitle] = useState("original"); // 기본 자막 언어
    const [movies, setMovies] = useState<Movie[]>([]); // 영화 목록 저장

    // 무한 스크롤을 위한 상태 변수
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const sentinelRef = useRef<HTMLDivElement>(null);

    // 언어나 정렬 기준이 바뀌면 페이지와 목록을 초기화
    useEffect(() => {
        setPage(1);
        setMovies([]);
    }, [language, sort]); // 이 두 값이 바뀔 때마다 자동으로 실행

    useEffect(() => {
        // API_KEY가 없을 경우 실행하지 않도록 방어
        const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        if (!API_KEY) {
            console.error("API 키가 설정되지 않았습니다.");
            return;
        }

        const fetchMovies = async () => {
            if (isLoading) return; // 로딩 중이면 중복 요청 방지
            setIsLoading(true);

            try {
                // page 파라미터가 동적으로 변경되도록 URL 구성
                const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=ko-KR&with_original_language=${language}&sort_by=${sort}&page=${page}`;
                
                const res = await fetch(url);
                
                if (!res.ok) throw new Error("네트워크 응답에 문제가 있습니다.");

                const data: MovieResponse = await res.json();
                
                setMovies((prev) => {
                    const newMovies = data.results || [];
                    // 1페이지면 그냥 덮어쓰고, 아니면 뒤에 이어 붙이기
                    if (page === 1) return newMovies;
                    // 중복 제거 후 합치기
                    return [...prev, ...newMovies].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
                });
            } catch (error) {
                console.error("영화 데이터를 가져오는 중 에러 발생:", error);
                // 1페이지에서 에러나면 목록 비우기 (기존 데이터 보호 위해 조건 추가 가능)
                if (page === 1) setMovies([]); 
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovies();
    }, [page, language, sort, subtitle]); // page가 바뀌거나 설정이 바뀌면 실행

    // 무한 스크롤 감지 (바닥에 닿으면 page + 1)
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoading) {
                    // 0.5초(500ms) 딜레이 추가
                    setTimeout(() => {
                        setPage((prev) => prev + 1);
                    }, 500);
                }
            },
            { threshold: 0.1 }
        );

        if (sentinelRef.current) {
            observer.observe(sentinelRef.current);
        }

        return () => observer.disconnect();
    }, [isLoading]);

    return (
        <main className={css.main}>
            <nav className={css.nav}>
                {/* 상단 select 부분 */}
                <div className={`header`}>
                    <h3 className={css.h3}>언어별로 찾아보기</h3>
                    <div className={css.selects}>
                        <p className={css.p}>선호하는 설정을 선택하세요</p>
                        <select className={css.select} onChange={(e) => setSubtitle(e.target.value)} value={subtitle}>
                            <option value="original">원어</option>
                            <option value="dubbing">더빙</option>
                            <option value="subtitle">자막</option>
                        </select>
                        <select className={css.select} onChange={(e) => setLanguage(e.target.value)} value={language}>
                            <option value="id">인도네시아어</option>
                            <option value="ms">말레이어</option>
                            <option value="tr">터키어</option>
                            <option value="en">영어</option>
                            <option value="ja">일본어</option>
                            <option value="es">스페인어</option>
                            <option value="fr">프랑스어</option>
                            <option value="hi">힌디어</option>
                            <option value="ko">한국어</option>
                            <option value="de">독일어</option>
                            <option value="zh">북경어</option>
                            <option value="it">이탈리아어</option>
                            <option value="pt">포르투갈어</option>
                            <option value="cn">광둥어</option>
                            <option value="nl">네덜란드어</option>
                            <option value="tl">필리핀어</option>
                            <option value="pl">폴란드어</option>
                            <option value="sv">스웨덴어</option>
                            <option value="ar">아랍어</option>
                            <option value="ta">타밀어</option>
                            <option value="da">덴마크어</option>
                            <option value="th">태국어</option>
                            <option value="te">텔루구어</option>
                            <option value="nl-BE">플랑드르어</option>
                            <option value="no">노르웨이어</option>
                            <option value="vi">베트남어</option>
                        </select>
                        <p className={css.p}>정렬기준</p>
                        <select className={css.select} onChange={(e) => setSort(e.target.value)} value={sort}>
                            <option value="popularity.desc">추천 콘텐츠</option>
                            <option value="primary_release_date.desc">출시일순</option>
                            <option value="title.asc">오름차순(ㄱ~Z)</option>
                            <option value="title.desc">내림차순(Z~ㄱ)</option>
                        </select>
                    </div>
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
                
                {/* 무한 스크롤 감지용 투명 박스 */}
                <div ref={sentinelRef} style={{ width: '100%', height: '20px', backgroundColor: 'transparent' }} />
            </nav>
        </main>
    );
}