"use client";

import { useEffect, useMemo, useState } from "react";
import Vedio from "@/components/video/video";
import type { Movie, MovieResponse } from "@/components/video/movie";

type Category = {
  key: string;
  title: string;
  query: string;
  top10?: boolean;
};

const CATEGORIES: Category[] = [
  { key: "kr-top10", title: "오늘 대한민국의 TOP 10 영화", query: "region=KR&sort_by=popularity.desc&page=1", top10: true },
  { key: "high-rating", title: "평점 높은 영화", query: "sort_by=vote_average.desc&vote_count.gte=3000&page=1" },
  { key: "hollywood", title: "할리우드 영화", query: "region=US&sort_by=popularity.desc&page=1" },
  { key: "family", title: "가족 영화", query: "with_genres=10751&sort_by=popularity.desc&page=1" },
  { key: "romcom", title: "로맨틱 코미디 영화", query: "with_genres=10749,35&sort_by=popularity.desc&page=1" },
  { key: "comedy", title: "코미디 영화", query: "with_genres=35&sort_by=popularity.desc&page=1" },
  { key: "thriller", title: "스릴러 영화", query: "with_genres=53&sort_by=popularity.desc&page=1" },
  { key: "blockbuster", title: "블록버스터 영화", query: "sort_by=revenue.desc&page=1" },
  { key: "awards-like", title: "어워드 수상작 느낌", query: "sort_by=vote_average.desc&vote_count.gte=8000&page=1" },
  { key: "korean", title: "한국 영화", query: "with_original_language=ko&sort_by=popularity.desc&page=1" },
  { key: "runtime-90", title: "90분짜리 영화", query: "with_runtime.gte=80&with_runtime.lte=90&sort_by=popularity.desc&page=1" },
  { key: "action", title: "액션 영화", query: "with_genres=28&sort_by=popularity.desc&page=1" },
  { key: "horror", title: "공포 영화", query: "with_genres=27&sort_by=popularity.desc&page=1" },
  { key: "sf", title: "SF 영화", query: "with_genres=878&sort_by=popularity.desc&page=1" },
  { key: "animation", title: "애니메이션 영화", query: "with_genres=16&sort_by=popularity.desc&page=1" },
  { key: "crime", title: "범죄 영화", query: "with_genres=80&sort_by=popularity.desc&page=1" },
];

function buildDiscoverUrl(query: string) {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!apiKey) throw new Error("NEXT_PUBLIC_TMDB_API_KEY가 없습니다. (.env.local 확인)");
  return `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=ko-KR&include_adult=false&${query}`;
}

function getItemsPerRowByWidth(w: number) {
  if (w >= 1400) return 6;
  if (w >= 1000) return 5;
  if (w >= 700) return 4;
  return 3;
}

export default function MoviesPage() {
  const [rows, setRows] = useState<Record<string, Movie[]>>({});
  const [error, setError] = useState<string | null>(null);

  // 카테고리별 “현재 시작 인덱스”(페이지 대신 offset)
  const [offsets, setOffsets] = useState<Record<string, number>>({});

  // 반응형: 한 줄에 몇 개 보여줄지
  const [itemsPerRow, setItemsPerRow] = useState(5);

  useEffect(() => {
    const update = () => setItemsPerRow(getItemsPerRowByWidth(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setError(null);

        const resultPairs = await Promise.all(
          CATEGORIES.map(async (cat) => {
            const url = buildDiscoverUrl(cat.query);
            const res = await fetch(url);
            if (!res.ok) throw new Error(`${cat.title} 요청 실패 (${res.status})`);

            const data: MovieResponse = await res.json();
            const list = (data.results ?? []).filter(Boolean);
            return [cat.key, cat.top10 ? list.slice(0, 10) : list] as const;
          })
        );

        const next: Record<string, Movie[]> = {};
        for (const [k, v] of resultPairs) next[k] = v;

        setRows(next);
      } catch (e) {
        setError(e instanceof Error ? e.message : "영화 데이터를 불러오지 못했습니다.");
      }
    };

    fetchAll();
  }, []);

  const handlePrev = (key: string) => {
    setOffsets((prev) => {
      const cur = prev[key] ?? 0;
      const next = Math.max(cur - itemsPerRow, 0);
      return { ...prev, [key]: next };
    });
  };

  const handleNext = (key: string, total: number) => {
    setOffsets((prev) => {
      const cur = prev[key] ?? 0;
      const maxStart = Math.max(total - itemsPerRow, 0);
      const next = Math.min(cur + itemsPerRow, maxStart);
      return { ...prev, [key]: next };
    });
  };

  return (
    <main>
      {error ? <p style={{ color: "red", padding: "0 60px" }}>{error}</p> : null}

      {CATEGORIES.map((cat) => {
        const items = rows[cat.key] ?? [];
        const offset = offsets[cat.key] ?? 0;

        // 버튼 disable 조건
        const canPrev = offset > 0;
        const canNext = offset + itemsPerRow < items.length;

        return (
          <section key={cat.key} className="row">
            <div className="row-title">{cat.title}</div>

            <button
              className="arrow left"
              onClick={() => handlePrev(cat.key)}
              disabled={!canPrev}
              aria-label="이전"
            >
              ‹
            </button>

            <div className="row-viewport">
              <div
                className="row-track"
                style={{
                  // 한 화면 너비(100%)를 itemsPerRow 단위로 “페이지”처럼 이동시키면,
                  // 카드 폭이 %로 계산되도록 CSS에서 잡아줄 거라 딱 맞게 움직임
                  transform: `translateX(-${(offset / itemsPerRow) * 100}%)`,
                }}
              >
                {items.map((movie) => (
                  <div
                    key={movie.id}
                    className="row-item"
                    style={{
                      // 한 화면에 itemsPerRow개 보이도록 폭을 계산
                      flexBasis: `calc((100% - ${(itemsPerRow - 1) * 8}px) / ${itemsPerRow})`,
                    }}
                  >
                    <Vedio movie={movie} />
                  </div>
                ))}
              </div>
            </div>

            <button
              className="arrow right"
              onClick={() => handleNext(cat.key, items.length)}
              disabled={!canNext}
              aria-label="다음"
            >
              ›
            </button>
          </section>
        );
      })}
    </main>
  );
}
