"use client";

import { useEffect, useMemo, useState } from "react";
import "./SeriesModal.css";

interface SeriesModalProps {
  isOpen: boolean;
  tvId: number;
  onClose: () => void;
}

const IMG_BASE = "https://image.tmdb.org/t/p";

type TmdbTv = {
  id: number;
  name: string;
  overview: string;
  first_air_date?: string;
  number_of_episodes?: number;
  number_of_seasons?: number;
  backdrop_path?: string | null;
  created_by?: Array<{ id: number; name: string }>;
  genres?: Array<{ id: number; name: string }>;
  videos?: {
    results: Array<{ key: string; site: string; type: string; name: string }>;
  };
  credits?: {
    cast: Array<{ name: string }>;
    crew: Array<{ job: string; name: string }>;
  };
  recommendations?: {
    results: Array<{
      id: number;
      name: string;
      poster_path?: string | null;
      backdrop_path?: string | null;
    }>;
  };
};

type SeasonEpisode = {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  runtime?: number | null;
  still_path?: string | null;
};

type SeasonResponse = {
  id: number;
  name: string;
  episodes: SeasonEpisode[];
};

function toKoreanRuntime(min?: number | null) {
  if (!min || min <= 0) return "";
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h <= 0) return `${m}분`;
  if (m === 0) return `${h}시간`;
  return `${h}시간 ${m}분`;
}

const INITIAL_EPISODE_COUNT = 4;

export default function SeriesModal({ isOpen, tvId, onClose }: SeriesModalProps) {
  const [data, setData] = useState<TmdbTv | null>(null);
  const [season1, setSeason1] = useState<SeasonResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isBannerPlaying, setIsBannerPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  // 에피소드 펼치기 상태
  const [showAllEpisodes, setShowAllEpisodes] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    setData(null);
    setSeason1(null);
    setIsBannerPlaying(false);
    setMuted(true);
    setShowAllEpisodes(false);

    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/tmdb/tv/${tvId}`);
        if (!res.ok) throw new Error("Failed to load TMDB tv data");
        const tvJson = (await res.json()) as TmdbTv;
        if (cancelled) return;
        setData(tvJson);

        try {
          const sRes = await fetch(`/api/tmdb/tv/${tvId}/season/1`);
          if (sRes.ok) {
            const sJson = (await sRes.json()) as SeasonResponse;
            if (!cancelled) setSeason1(sJson);
          }
        } catch { /* ignore */ }
      } catch {
        if (!cancelled) setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [isOpen, tvId]);

  const title = data?.name ?? (loading ? "로딩중..." : "");
  const year = data?.first_air_date ? data.first_air_date.slice(0, 4) : "";
  const episodesCount = data?.number_of_episodes ?? 0;

  const bannerBg = useMemo(() => {
    if (!data?.backdrop_path) return "";
    return `${IMG_BASE}/original${data.backdrop_path}`;
  }, [data?.backdrop_path]);

  const castTop = useMemo(() => {
    const cast = data?.credits?.cast ?? [];
    return cast.slice(0, 4).map((c) => c.name).join(", ");
  }, [data?.credits?.cast]);

  const castAll = useMemo(() => {
    const cast = data?.credits?.cast ?? [];
    return cast.slice(0, 6).map((c) => c.name).join(", ");
  }, [data?.credits?.cast]);

  const genresText = useMemo(() => {
    const genres = data?.genres ?? [];
    return genres.map((g) => g.name).join(", ");
  }, [data?.genres]);

  const seriesTraits = useMemo(() => {
    const genres = data?.genres ?? [];
    return genres.slice(0, 3).map((g) => g.name).join(", ");
  }, [data?.genres]);

  const creatorLike = useMemo(() => {
    const createdBy = data?.created_by ?? [];
    if (createdBy.length > 0) return createdBy.map((c) => c.name).join(", ");
    const crew = data?.credits?.crew ?? [];
    const pick =
      crew.find((c) => c.job === "Creator") ||
      crew.find((c) => c.job === "Executive Producer") ||
      crew.find((c) => c.job === "Director");
    return pick?.name ?? "";
  }, [data?.created_by, data?.credits?.crew]);

  const trailerKey = useMemo(() => {
    const vids = data?.videos?.results ?? [];
    const yt = vids.filter((v) => v.site === "YouTube" && v.key);
    const pick =
      yt.find((v) => v.type === "Trailer") ||
      yt.find((v) => v.type === "Teaser") ||
      yt.find((v) => v.type === "Clip") ||
      yt[0];
    return pick?.key ?? "";
  }, [data?.videos?.results]);

  const allTrailers = useMemo(() => {
    const vids = data?.videos?.results ?? [];
    return vids
      .filter((v) => v.site === "YouTube" && v.key)
      .filter((v) => v.type === "Trailer" || v.type === "Teaser" || v.type === "Clip")
      .slice(0, 3);
  }, [data?.videos?.results]);

  const bannerTrailerSrc = useMemo(() => {
    if (!trailerKey) return "";
    return `https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&mute=${muted ? 1 : 0}&playsinline=1&rel=0&modestbranding=1`;
  }, [trailerKey, muted]);

  useEffect(() => {
    if (!isOpen || !trailerKey) return;
    setIsBannerPlaying(true);
  }, [isOpen, trailerKey]);

  // 에피소드 목록 전체
  const allEpisodeData = useMemo(() => {
    if (season1?.episodes?.length) {
      return season1.episodes.map((ep) => ({
        no: ep.episode_number,
        name: ep.name,
        time: toKoreanRuntime(ep.runtime),
        desc: ep.overview?.trim() || "설명이 없습니다.",
        still: ep.still_path ? `${IMG_BASE}/w500${ep.still_path}` : "",
      }));
    }
    const fallbackCount = Math.min(10, episodesCount || 10);
    return Array.from({ length: fallbackCount }).map((_, i) => ({
      no: i + 1,
      name: `${i + 1}화`,
      time: "",
      desc: "설명이 없습니다.",
      still: "",
    }));
  }, [season1, episodesCount]);

  // 표시할 에피소드 (접힌 상태 vs 전체)
  const visibleEpisodes = showAllEpisodes
    ? allEpisodeData
    : allEpisodeData.slice(0, INITIAL_EPISODE_COUNT);

  const canExpandEpisodes = !showAllEpisodes && allEpisodeData.length > INITIAL_EPISODE_COUNT;

  if (!isOpen) return null;

  const handleClose = () => {
    setIsBannerPlaying(false);
    onClose();
  };

  return (
    <div className="series-overlay" onClick={handleClose}>
      <div className="series-modal" onClick={(e) => e.stopPropagation()}>

        {/* 닫기 버튼 */}
        <button className="close-btn" onClick={handleClose} type="button">
          ✕
        </button>

        {/* ========================
            상단 배너
        ========================= */}
        <div className="series-banner">
          <div
            className="banner-img"
            style={{ backgroundImage: bannerBg ? `url(${bannerBg})` : undefined }}
          />

          {isBannerPlaying && bannerTrailerSrc ? (
            <div className="banner-video" onClick={(e) => e.stopPropagation()}>
              <iframe
                src={bannerTrailerSrc}
                title="Banner Trailer"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
              <button
                className="banner-video-close"
                onClick={() => setIsBannerPlaying(false)}
                type="button"
              >
                닫기
              </button>
            </div>
          ) : null}

          <div className="banner-info">
            <h1>{title}</h1>
            <div className="banner-btns">
              <button
                className="play-btn"
                type="button"
                onClick={() => { if (trailerKey) setIsBannerPlaying(true); }}
              >
                ▶ 재생
              </button>
              <button className="icon-btn" type="button" title="내가 찜한 콘텐츠에 추가">
                ＋
              </button>
              <button className="icon-btn" type="button" title="좋아요">
                {/*
                  좋아요 아이콘 이미지로 교체 가능:
                  <img className="icon-img" src="여기에_좋아요_아이콘_경로" alt="좋아요" />
                */}
                👍
              </button>
            </div>
          </div>

          {/* 음소거 버튼 - MovieModal과 통일 */}
          <button
            className="banner-mute-btn"
            type="button"
            onClick={() => {
              if (isBannerPlaying) {
                setMuted((v) => !v);
                // iframe을 새로 마운트해서 mute 상태 반영
                setIsBannerPlaying(false);
                setTimeout(() => setIsBannerPlaying(true), 10);
              }
            }}
            title={muted ? "소리 켜기" : "음소거"}
          >
            {/*
              음소거 아이콘 이미지로 교체 가능:
              <img className="icon-img" src="여기에_음소거_아이콘_경로" alt="음소거" />
            */}
            {muted ? "🔇" : "🔊"}
          </button>
        </div>

        {/* 로딩 */}
        {loading && (
          <div style={{ padding: "12px 34px" }}>
            <p className="meta">TMDB에서 불러오는 중이에요...</p>
          </div>
        )}

        {/* ========================
            메타/설명 영역
        ========================= */}
        <div className="series-desc">
          <div className="left">
            <p className="meta">
              {year || "-"}
              {episodesCount ? ` · 에피소드 ${episodesCount}개` : ""}
              {data?.number_of_seasons ? ` · 시즌 ${data.number_of_seasons}개` : ""}
            </p>

            {/*
              등급 이미지로 교체 가능:
              <img className="icon-img" src="여기에_15등급_아이콘_경로" alt="15" />
            */}
            <div className="age-badge">15</div>

            {season1 && (
              <p className="episode-label">
                시즌 1: 1화 &quot;{season1.episodes[0]?.name ?? "1화"}&quot;
              </p>
            )}

            <p className="summary">{data?.overview ?? ""}</p>
          </div>

          <div className="right">
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
              <span className="label">시리즈 특징: </span>
              <span className="value">{seriesTraits || "-"}</span>
            </p>
          </div>
        </div>

        {/* ========================
            회차 목록
        ========================= */}
        <div className="episode-header">
          <h2>회차</h2>
          <span>리미티드 시리즈</span>
        </div>

        <div className="episode-list">
          {visibleEpisodes.map((ep) => (
            <div key={ep.no} className="episode-item">
              <span className="episode-num">{ep.no}</span>

              <div
                className="episode-thumb"
                style={{ backgroundImage: ep.still ? `url(${ep.still})` : undefined }}
              >
                <div className="episode-play-icon">
                  <div className="episode-play-circle">▶</div>
                </div>
              </div>

              <div className="episode-text">
                <h4>{ep.name || `${ep.no}화`}</h4>
                <p>{ep.desc}</p>
              </div>

              <span className="episode-time">{ep.time}</span>
            </div>
          ))}
        </div>

        {/* 더보기 화살표 – 클릭 시 전체 회차 표시 */}
        {canExpandEpisodes ? (
          <div className="episode-more">
            <div className="more-line" />
            <button
              className="more-btn"
              type="button"
              onClick={() => setShowAllEpisodes(true)}
              aria-label="전체 회차 보기"
            >
              <span className="arrow-icon">⌄</span>
            </button>
          </div>
        ) : showAllEpisodes && allEpisodeData.length > INITIAL_EPISODE_COUNT ? (
          /* 전체 펼쳐진 상태 – 위로 접기 버튼 */
          <div className="episode-more">
            <div className="more-line" />
            <button
              className="more-btn"
              type="button"
              onClick={() => setShowAllEpisodes(false)}
              aria-label="회차 접기"
            >
              <span className="arrow-icon up">⌄</span>
            </button>
          </div>
        ) : null}

        {/* ========================
            함께 시청된 콘텐츠
        ========================= */}
        <div className="watch-together">
          <h2>함께 시청된 콘텐츠</h2>

          <div className="watch-grid">
            {(data?.recommendations?.results ?? []).slice(0, 6).map((item, idx) => {
              const img = item.backdrop_path || item.poster_path;
              const url = img ? `${IMG_BASE}/w500${img}` : "";
              const rating = idx % 3 === 0 ? "19" : "15";
              return (
                <div key={item.id} className="watch-card">
                  <div
                    className="watch-img"
                    style={{ backgroundImage: url ? `url(${url})` : undefined }}
                  />
                  <div className="watch-card-body">
                    <div className="watch-meta">
                      {/*
                        등급 이미지로 교체 가능:
                        <img className="card-rating-img" src="여기에_15등급_이미지_경로" alt="15" />
                        <img className="card-rating-img" src="여기에_19등급_이미지_경로" alt="19" />
                      */}
                      <span className={`badge-item ${rating === "19" ? "r19" : "r15"}`}>
                        {rating}
                      </span>
                      <span className="badge-item gray">HD</span>
                      <span className="badge-item gray">{year || "-"}</span>
                      <button className="add-btn" type="button">＋</button>
                    </div>
                    <p className="watch-desc">{item.name}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================
            예고편 및 다른 영상
        ========================= */}
        <div className="trailer-section">
          <h2>예고편 및 다른 영상</h2>

          <div className="trailer-grid">
            {allTrailers.length > 0 ? (
              allTrailers.map((v) => (
                <div
                  key={v.key}
                  className="trailer-item"
                  onClick={() => window.open(`https://www.youtube.com/watch?v=${v.key}`, "_blank")}
                >
                  <div
                    className="trailer-thumb"
                    style={{
                      backgroundImage: `url(https://img.youtube.com/vi/${v.key}/mqdefault.jpg)`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="trailer-play">▶</div>
                  </div>
                  <p>{v.name}</p>
                </div>
              ))
            ) : (
              <div className="trailer-item">
                <div className="trailer-thumb">
                  <div className="trailer-play">▶</div>
                </div>
                <p>예고편이 없습니다.</p>
              </div>
            )}
          </div>
        </div>

        {/* ========================
            상세 정보 - MovieModal과 통일
        ========================= */}
        <div className="detail-info">
          <h2>{title ? `${title} 상세 정보` : "상세 정보"}</h2>

          <div className="detail-row">
            <span className="detail-label">크리에이터: </span>
            <span className="detail-value">{creatorLike || "-"}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">출연: </span>
            <span className="detail-value">{castAll || "-"}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">장르: </span>
            <span className="detail-value">{genresText || "-"}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">시리즈 특징: </span>
            <span className="detail-value">{seriesTraits || "-"}</span>
          </div>

          {/* 관람등급 행 */}
          <div className="detail-rating-row">
            <span className="detail-label">관람등급: </span>
            <div className="detail-rating-content">
              <div className="detail-rating-main">
                {/*
                  15등급 이미지로 교체 가능:
                  <img className="detail-rating-img" src="여기에_15등급_큰_이미지_경로" alt="15세이상관람가" />
                */}
                <span className="badge-item r15" style={{ width: 42, height: 36, fontSize: 16 }}>15</span>
                <span className="detail-rating-text">15세이상관람가</span>
              </div>

              {/* 아이콘 그룹 */}
              <div className="detail-icons">
                {/*
                  각 아이콘 이미지로 교체 가능:
                  <div className="detail-icon-item">
                    <img className="detail-icon-img" src="여기에_폭력성_아이콘_경로" alt="폭력성" />
                    <span className="detail-icon-label">폭력성</span>
                  </div>
                  <div className="detail-icon-item">
                    <img className="detail-icon-img" src="여기에_대사_아이콘_경로" alt="대사" />
                    <span className="detail-icon-label">대사</span>
                  </div>
                  <div className="detail-icon-item">
                    <img className="detail-icon-img" src="여기에_모방위험_아이콘_경로" alt="모방위험" />
                    <span className="detail-icon-label">모방위험</span>
                  </div>
                */}
                <div className="detail-icon-item">
                  <div style={{ width: 44, height: 44, background: "rgba(255,255,255,0.1)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>👊</div>
                  <span className="detail-icon-label">폭력성</span>
                </div>
                <div className="detail-icon-item">
                  <div style={{ width: 44, height: 44, background: "rgba(255,255,255,0.1)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>💬</div>
                  <span className="detail-icon-label">대사</span>
                </div>
                <div className="detail-icon-item">
                  <div style={{ width: 44, height: 44, background: "rgba(255,255,255,0.1)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>⚠️</div>
                  <span className="detail-icon-label">모방위험</span>
                </div>
              </div>
            </div>
          </div>

          <p className="detail-release">
            {year || "-"} · {data?.first_air_date ?? "-"}
          </p>
        </div>

        {/* 바닥 여백 */}
        <div style={{ height: 16 }} />
      </div>
    </div>
  );
}