"use client";

import { useEffect, useMemo, useState } from "react";
import "./MovieModal.css";

interface MovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  movieId: number; // TMDB movie id
}

const IMG_BASE = "https://image.tmdb.org/t/p";

type TmdbMovie = {
  id: number;
  title: string;
  overview: string;
  release_date?: string;
  runtime?: number | null;
  backdrop_path?: string | null;
  poster_path?: string | null;

  videos?: {
    results: Array<{
      key: string;
      site: string;
      type: string;
      name: string;
    }>;
  };

  credits?: {
    cast: Array<{ name: string }>;
    crew: Array<{ job: string; name: string }>;
  };

  genres?: Array<{ id: number; name: string }>;

  recommendations?: {
    results: Array<{
      id: number;
      title: string;
      poster_path?: string | null;
      backdrop_path?: string | null;
      release_date?: string;
      overview?: string;
    }>;
  };
};

type WatchCard = {
  id: number;
  title: string;
  yearText: string;
  runtimeText: string;
  ratingText: "15" | "19" | "ALL";
  imgUrl: string;
  desc: string;
  showPlayIcon?: boolean;
  showNewBadge?: boolean;
};

function toKoreanRuntime(min?: number | null) {
  if (!min || min <= 0) return "";
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h <= 0) return `${m}분`;
  if (m === 0) return `${h}시간`;
  return `${h}시간 ${m}분`;
}

function pickTrailerKey(movie: TmdbMovie | null) {
  const vids = movie?.videos?.results ?? [];
  const yt = vids.filter((v) => v.site === "YouTube");
  const trailer = yt.find((v) => v.type === "Trailer") ?? yt[0];
  return trailer?.key ?? "";
}

export default function MovieModal({ isOpen, onClose, movieId }: MovieModalProps) {
  const [data, setData] = useState<TmdbMovie | null>(null);
  const [loading, setLoading] = useState(false);
  const [playHero, setPlayHero] = useState(false);
  const [muted, setMuted] = useState(true);
  const [visibleCount, setVisibleCount] = useState(9);

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;
    setData(null);
    setLoading(true);
    setPlayHero(false);
    setMuted(true);
    setVisibleCount(9);

    (async () => {
      try {
        const res = await fetch(`/api/tmdb/movie/${movieId}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load movie");
        const json = (await res.json()) as TmdbMovie;
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [isOpen, movieId]);

  const title = data?.title ?? "";
  const overview = data?.overview ?? "";
  const year = data?.release_date ? data.release_date.slice(0, 4) : "";
  const runtimeText = toKoreanRuntime(data?.runtime ?? null);
  const trailerKey = useMemo(() => pickTrailerKey(data), [data]);

  const heroBgUrl = useMemo(() => {
    if (data?.backdrop_path) return `${IMG_BASE}/original${data.backdrop_path}`;
    if (data?.poster_path) return `${IMG_BASE}/w780${data.poster_path}`;
    return "";
  }, [data?.backdrop_path, data?.poster_path]);

  const director = useMemo(() => {
    const crew = data?.credits?.crew ?? [];
    return crew.find((c) => c.job === "Director")?.name ?? "-";
  }, [data?.credits?.crew]);

  const screenplay = useMemo(() => {
    const crew = data?.credits?.crew ?? [];
    const found = crew.filter((c) => c.job === "Screenplay" || c.job === "Writer");
    return found.length > 0 ? found.map((c) => c.name).join(", ") : director;
  }, [data?.credits?.crew, director]);

  const castAll = useMemo(() => {
    const cast = data?.credits?.cast ?? [];
    return cast.slice(0, 5).map((c) => c.name).join(", ");
  }, [data?.credits?.cast]);

  const castTop = useMemo(() => {
    const cast = data?.credits?.cast ?? [];
    return cast.slice(0, 4).map((c) => c.name).join(", ");
  }, [data?.credits?.cast]);

  const genresText = useMemo(() => {
    const genres = data?.genres ?? [];
    return genres.map((g) => g.name).join(", ");
  }, [data?.genres]);

  const featureText = useMemo(() => {
    const genres = data?.genres ?? [];
    return genres.slice(0, 2).map((g) => g.name).join(", ");
  }, [data?.genres]);

  const watchCards: WatchCard[] = useMemo(() => {
    const rec = data?.recommendations?.results ?? [];

    if (rec.length > 0) {
      return rec.slice(0, 15).map((r, idx) => {
        const img = r.backdrop_path || r.poster_path || "";
        const imgUrl = img ? `${IMG_BASE}/w780${img}` : "";
        const ratingText: WatchCard["ratingText"] = idx % 3 === 0 ? "19" : "15";
        const runtimes = ["1시간 45분", "1시간 52분", "1시간 48분", "2시간 18분", "1시간 55분", "1시간 39분", "1시간 55분", "1시간 53분", "1시간 42분"];
        const runtimeText = runtimes[idx % runtimes.length];
        const yearText = (r.release_date ? r.release_date.slice(0, 4) : year) || "2025";

        return {
          id: r.id,
          title: r.title,
          yearText,
          runtimeText,
          ratingText,
          imgUrl,
          desc: r.overview || "여기에는 영화 설명이 들어가요. (원하는 문구로 교체 가능)",
          showPlayIcon: idx === 4 || idx === 5,
          showNewBadge: idx === 3,
        };
      });
    }

    return Array.from({ length: 15 }).map((_, i) => ({
      id: 900000 + i,
      title: `목업 영화 ${i + 1}`,
      yearText: "2025",
      runtimeText: ["1시간 45분","1시간 52분","1시간 48분","2시간 18분","1시간 55분","1시간 39분"][i % 6],
      ratingText: i % 3 === 0 ? "19" : "15",
      imgUrl: "",
      desc: "여기에는 영화 설명이 들어가요. (원하는 문구로 교체 가능)",
      showPlayIcon: i === 4 || i === 5,
      showNewBadge: i === 3,
    }));
  }, [data?.recommendations?.results, year]);

  const visibleCards = watchCards.slice(0, visibleCount);
  const canLoadMore = visibleCount < watchCards.length;

  if (!isOpen) return null;

  return (
    <div className="movie-overlay" onClick={onClose}>
      <div className="movie-modal" onClick={(e) => e.stopPropagation()}>

        {/* 닫기 버튼 */}
        <button className="movie-close" onClick={onClose} aria-label="close">
          ✕
        </button>

        {/* ========================
            히어로 배너
        ========================= */}
        <div className="movie-hero">
          {!playHero && (
            <div
              className="movie-hero-img"
              style={{ backgroundImage: heroBgUrl ? `url(${heroBgUrl})` : undefined }}
            />
          )}

          {playHero && trailerKey && (
            <div className="movie-hero-video">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=${muted ? 1 : 0}&controls=0&rel=0`}
                title="Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <button className="movie-hero-video-close" onClick={() => setPlayHero(false)}>
                닫기
              </button>
            </div>
          )}

          {/* 그라데이션 오버레이 */}
          <div className="movie-hero-dim" />

          {/* 타이틀/버튼 */}
          <div className="movie-hero-info">
            <h1 className="movie-title">{title || (loading ? "로딩중..." : "")}</h1>

            <div className="movie-actions">
              <button
                className="movie-play"
                onClick={() => { if (trailerKey) setPlayHero(true); }}
              >
                ▶ 재생
              </button>
              <button className="movie-icon-btn" title="내가 찜한 콘텐츠에 추가">
                ＋
              </button>
              <button className="movie-icon-btn" title="좋아요">
                {/* 좋아요 아이콘 이미지로 교체 가능 */}
                {/* <img src="여기에_좋아요_아이콘_경로" alt="좋아요" className="movie-icon-img" /> */}
                👍
              </button>
            </div>
          </div>

          {/* 우측 음소거 버튼 */}
          {playHero ? (
            <button
              className="movie-hero-mute"
              onClick={() => setMuted((v) => !v)}
              title={muted ? "소리 켜기" : "음소거"}
            >
              {muted ? "🔇" : "🔊"}
            </button>
          ) : (
            <button className="movie-hero-mute" title="음소거">
              {/* 음소거 아이콘 이미지로 교체 가능 */}
              {/* <img src="여기에_음소거_아이콘_경로" alt="음소거" className="movie-icon-img" /> */}
              🔇
            </button>
          )}
        </div>

        {/* ========================
            메타/설명 영역
        ========================= */}
        <div className="movie-desc">
          <div className="movie-left">
            <div className="movie-meta-row">
              <span className="movie-meta">{year || "-"}</span>
              {runtimeText ? <span className="movie-meta">{runtimeText}</span> : null}
              <span className="movie-chip">HD</span>

              {/*
                ── 아이콘 이미지 (경로 교체하면 바로 표시됩니다) ──
                자막 아이콘
                <img className="movie-icon-img" src="여기에_자막_아이콘_경로" alt="자막" />
                대사 아이콘
                <img className="movie-icon-img" src="여기에_대사_아이콘_경로" alt="대사" />
                음성해설 아이콘
                <img className="movie-icon-img" src="여기에_음성해설_아이콘_경로" alt="음성해설" />
              */}
              {/* 등급 아이콘 – 이미지로 교체 가능 */}
              {/* <img className="movie-icon-img" src="여기에_15등급_아이콘_경로" alt="15" /> */}
              <span className="movie-rating-box">15</span>
            </div>

            {/* TOP 10 뱃지 */}
            <div className="movie-rank-row">
              {/*
                TOP10 이미지 뱃지로 교체 가능:
                <img className="movie-rank-badge-img" src="여기에_TOP10_뱃지_이미지_경로" alt="TOP 10" />
              */}
              <span className="movie-rank-badge">
                TOP<br />10
              </span>
              <span className="movie-rank-text">오늘 영화 순위 7위</span>
            </div>

            <p className="movie-overview">{overview || "설명이 없습니다."}</p>
          </div>

          <div className="movie-right">
            <p>
              <span className="label">출연: </span>
              <span className="value">{castTop || "-"}, </span>
              <a className="more-link">더 보기</a>
            </p>
            <p>
              <span className="label">장르: </span>
              <span className="value">{genresText || "-"}</span>
            </p>
            <p>
              <span className="label">영화 특징: </span>
              <span className="value">{featureText || "-"}</span>
            </p>
          </div>
        </div>

        {/* ========================
            함께 시청된 콘텐츠
        ========================= */}
        <div className="movie-section">
          <h2 className="movie-section-title">함께 시청된 콘텐츠</h2>

          <div className="movie-grid">
            {visibleCards.map((card) => {
              const hasImg = !!card.imgUrl;
              return (
                <div key={card.id} className="movie-card">
                  <div className="movie-card-thumb">
                    {hasImg ? (
                      <div
                        className="movie-card-thumb-bg"
                        style={{ backgroundImage: `url(${card.imgUrl})` }}
                      />
                    ) : (
                      <div className="movie-card-thumb-bg placeholder" />
                    )}

                    {/* 재생 아이콘 오버레이 */}
                    {card.showPlayIcon && (
                      <div className="movie-card-play-icon">
                        <div className="movie-card-play-circle">▶</div>
                      </div>
                    )}

                    {/* 최신등록 / TOP10 뱃지 */}
                    {card.showNewBadge && (
                      <div className="movie-card-label">
                        <span className="movie-label-badge">최신 등록</span>
                      </div>
                    )}

                    <div className="movie-card-runtime">{card.runtimeText}</div>
                  </div>

                  <div className="movie-card-body">
                    <div className="movie-card-badges">
                      {/*
                        ── 등급 이미지 교체 영역 ──
                        15등급:
                        <img className="movie-card-rating-img" src="여기에_15등급_이미지_경로" alt="15" />
                        19등급:
                        <img className="movie-card-rating-img" src="여기에_19등급_이미지_경로" alt="19" />
                      */}
                      <span className={`movie-badge ${card.ratingText === "19" ? "r19" : "r15"}`}>
                        {card.ratingText}
                      </span>

                      <span className="movie-badge gray">HD</span>
                      <span className="movie-badge gray">{card.yearText}</span>

                      <button className="movie-plus">＋</button>
                    </div>

                    <p className="movie-card-desc">{card.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 더보기 화살표 */}
          {canLoadMore && (
            <div className="movie-more">
              <div className="movie-more-line" />
              <button
                className="movie-more-btn"
                onClick={() => setVisibleCount((v) => Math.min(v + 6, watchCards.length))}
                aria-label="더 보기"
              >
                <span className="movie-more-arrow">⌄</span>
              </button>
            </div>
          )}
        </div>

        {/* ========================
            상세 정보 섹션 (이미지 3 하단)
        ========================= */}
        <div className="movie-detail-section">
          <h2 className="movie-detail-title">{title ? `${title} 상세 정보` : "상세 정보"}</h2>

          <div className="movie-detail-row">
            <span className="movie-detail-label">감독: </span>
            <span className="movie-detail-value">{director}</span>
          </div>

          <div className="movie-detail-row">
            <span className="movie-detail-label">출연: </span>
            <span className="movie-detail-value">{castAll || "-"}</span>
          </div>

          <div className="movie-detail-row">
            <span className="movie-detail-label">각본: </span>
            <span className="movie-detail-value">{screenplay}</span>
          </div>

          <div className="movie-detail-row">
            <span className="movie-detail-label">장르: </span>
            <span className="movie-detail-value">{genresText || "-"}</span>
          </div>

          <div className="movie-detail-row">
            <span className="movie-detail-label">영화 특징: </span>
            <span className="movie-detail-value">{featureText || "-"}</span>
          </div>

          {/* 관람등급 행 – 이미지 경로 교체 가능 */}
          <div className="movie-detail-rating-row">
            <span className="movie-detail-label">관람등급: </span>
            <div className="movie-detail-rating-content">
              <div className="movie-detail-rating-main">
                {/*
                  15등급 이미지 교체:
                  <img className="movie-detail-rating-img" src="여기에_15등급_큰_이미지_경로" alt="15세이상관람가" />
                */}
                <span className="movie-badge r15" style={{ width: 42, height: 36, fontSize: 16 }}>15</span>
                <span className="movie-detail-rating-text">15세이상관람가</span>
              </div>

              {/* 관람등급 아이콘 그룹 (폭력성, 대사, 모방위험 등) */}
              <div className="movie-detail-icons">
                {/*
                  ── 각 아이콘 이미지 교체 ──
                  폭력성 아이콘:
                  <div className="movie-detail-icon-item">
                    <img className="movie-detail-icon-img" src="여기에_폭력성_아이콘_경로" alt="폭력성" />
                    <span className="movie-detail-icon-label">폭력성</span>
                  </div>
                  대사 아이콘:
                  <div className="movie-detail-icon-item">
                    <img className="movie-detail-icon-img" src="여기에_대사_아이콘_경로" alt="대사" />
                    <span className="movie-detail-icon-label">대사</span>
                  </div>
                  모방위험 아이콘:
                  <div className="movie-detail-icon-item">
                    <img className="movie-detail-icon-img" src="여기에_모방위험_아이콘_경로" alt="모방위험" />
                    <span className="movie-detail-icon-label">모방위험</span>
                  </div>
                */}
                {/* 임시 텍스트 뱃지 (이미지 경로 넣으면 위 주석 해제하세요) */}
                <div className="movie-detail-icon-item">
                  <div style={{ width: 44, height: 44, background: "rgba(255,255,255,0.1)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>👊</div>
                  <span className="movie-detail-icon-label">폭력성</span>
                </div>
                <div className="movie-detail-icon-item">
                  <div style={{ width: 44, height: 44, background: "rgba(255,255,255,0.1)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>💬</div>
                  <span className="movie-detail-icon-label">대사</span>
                </div>
                <div className="movie-detail-icon-item">
                  <div style={{ width: 44, height: 44, background: "rgba(255,255,255,0.1)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>⚠️</div>
                  <span className="movie-detail-icon-label">모방위험</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 바닥 여백 */}
        <div style={{ height: 16 }} />
      </div>
    </div>
  );
}