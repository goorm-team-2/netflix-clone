"use client";

import { useEffect, useState } from "react";
import Vedio from "@/components/video/video";
import type { Movie, MovieResponse } from "@/components/video/movie";
import SeriesBillboard from "@/components/feature/SeriesBillboard";

type Category = {
  key: string;
  title: string;
  query: string;
  top10?: boolean;
};

const CATEGORIES: Category[] = [
  {
    key: "global-drama",
    title: "해외 드라마",
    query: "with_genres=18&sort_by=popularity.desc&page=1",
  },
  {
    key: "us-drama",
    title: "미국 드라마",
    query:
      "with_origin_country=US&with_genres=18&sort_by=popularity.desc&page=1",
  },
  {
    key: "china-series",
    title: "중국 시리즈",
    query: "with_origin_country=CN&sort_by=popularity.desc&page=1",
  },
  {
    key: "animation",
    title: "애니 시리즈",
    query: "with_genres=16&sort_by=popularity.desc&page=1",
  },
  {
    key: "jp-anime",
    title: "일본 애니",
    query:
      "with_original_language=ja&with_genres=16&sort_by=popularity.desc&page=1",
  },
  {
    key: "uk-series",
    title: "유럽 시리즈 (영국)",
    query: "with_origin_country=GB&sort_by=popularity.desc&page=1",
  },
  {
    key: "fr-series",
    title: "유럽 시리즈 (프랑스)",
    query: "with_origin_country=FR&sort_by=popularity.desc&page=1",
  },
  {
    key: "de-series",
    title: "유럽 시리즈 (독일)",
    query: "with_origin_country=DE&sort_by=popularity.desc&page=1",
  },
  {
    key: "crime",
    title: "범죄 시리즈",
    query: "with_genres=80&sort_by=popularity.desc&page=1",
  },
  {
    key: "mystery",
    title: "미스터리 시리즈",
    query: "with_genres=9648&sort_by=popularity.desc&page=1",
  },
];

function buildDiscoverUrl(query: string) {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!apiKey)
    throw new Error("NEXT_PUBLIC_TMDB_API_KEY가 없습니다. (.env.local 확인)");
  return `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=ko-KR&include_adult=false&${query}`;
}

function getItemsPerRowByWidth(w: number) {
  if (w >= 1400) return 6;
  if (w >= 1000) return 5;
  if (w >= 700) return 4;
  return 3;
}

export default function SeriesPage() {
  const [rows, setRows] = useState<Record<string, Movie[]>>({});
  const [error, setError] = useState<string | null>(null);

  // 카테고리별 “현재 시작 인덱스”(페이지 대신 offset)
  const [offsets, setOffsets] = useState<Record<string, number>>({});

  // 반응형: 한 줄에 몇 개 보여줄지
  const [itemsPerRow, setItemsPerRow] = useState(5);

  useEffect(() => {
    const update = () =>
      setItemsPerRow(getItemsPerRowByWidth(window.innerWidth));
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
            if (!res.ok)
              throw new Error(`${cat.title} 요청 실패 (${res.status})`);

            const data: MovieResponse = await res.json();
            const list = (data.results ?? []).filter(Boolean);
            return [cat.key, cat.top10 ? list.slice(0, 10) : list] as const;
          })
        );

        const next: Record<string, Movie[]> = {};
        for (const [k, v] of resultPairs) next[k] = v;

        setRows(next);
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "영화 데이터를 불러오지 못했습니다."
        );
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
      {error ? (
        <p style={{ color: "red", padding: "0 60px" }}>{error}</p>
      ) : null}

      <SeriesBillboard />

      {CATEGORIES.map((cat) => {
        const items = rows[cat.key] ?? [];
        const offset = offsets[cat.key] ?? 0;

        // 버튼 disable 조건
        const canPrev = offset > 0;
        const canNext = offset + itemsPerRow < items.length;

        return (
          <section key={cat.key} className="row">
            <div className="row-title">{cat.title}</div>

            <div className="row-viewport">
              <button
                className="arrow left"
                onClick={() => handlePrev(cat.key)}
                disabled={!canPrev}
                aria-label="이전"
              >
                ‹
              </button>
              <div
                className="row-track"
                style={{
                  transform: `translateX(calc(-${
                    (offset / itemsPerRow) * 100
                  }% - ${8 * (offset / itemsPerRow)}px))`,
                }}
              >
                {items.map((movie) => (
                  <div
                    key={movie.id}
                    className="row-item"
                    style={{
                      // 한 화면에 itemsPerRow개 보이도록 폭을 계산
                      flexBasis: `calc((100% - ${
                        (itemsPerRow - 1) * 8
                      }px) / ${itemsPerRow})`,
                    }}
                  >
                    <Vedio movie={movie} />
                  </div>
                ))}
              </div>
              <button
                className="arrow right"
                onClick={() => handleNext(cat.key, items.length)}
                disabled={!canNext}
                aria-label="다음"
              >
                ›
              </button>
            </div>
          </section>
        );
      })}
    </main>
  );
}
