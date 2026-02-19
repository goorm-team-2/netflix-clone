"use client";

import { useEffect, useMemo, useState } from "react";
import "./GameModal.css";

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameId?: string | number;
}

const TEST_GAME_ID: number = 1;
const API_BASE = "/api/games";

type ApiGame = {
  id: string | number;
  title: string;
  description?: string;
  bannerImage?: string;
  iconImage?: string;
  youtubeTrailerKey?: string;
  videoUrl?: string;
  categoryText?: string;
  age?: string;
  modes?: string;
  offlinePlay?: string;
  platforms?: string;
  players?: string;
  compatibility?: string;
  controllerSupport?: string;
  languages?: string;
  developer?: string;
  releaseYear?: string | number;
  ratingReason?: string;
};

function stripHtml(input?: string) {
  if (!input) return "";
  return input.replace(/<[^>]*>/g, "").trim();
}

export default function GameModal({ isOpen, onClose, gameId }: GameModalProps) {
  const id = gameId ?? TEST_GAME_ID;

  const [data, setData] = useState<ApiGame | null>(null);
  const [loading, setLoading] = useState(false);
  const [isBannerPlaying, setIsBannerPlaying] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    setData(null);
    setIsBannerPlaying(false);

    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load game data");
        const json = (await res.json()) as ApiGame;
        if (cancelled) return;
        setData(json);
      } catch {
        if (!cancelled) setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [isOpen, id]);

  const title = data?.title ?? (loading ? "로딩중..." : "");
  const description = useMemo(() => stripHtml(data?.description), [data?.description]);

  const bannerStyle = useMemo(() => {
    if (data?.bannerImage) {
      return { backgroundImage: `url(${data.bannerImage})`, backgroundSize: "cover", backgroundPosition: "center" };
    }
    return undefined;
  }, [data?.bannerImage]);

  const iconStyle = useMemo(() => {
    if (data?.iconImage) {
      return { backgroundImage: `url(${data.iconImage})`, backgroundSize: "cover", backgroundPosition: "center" };
    }
    return undefined;
  }, [data?.iconImage]);

  const bannerTrailerSrc = useMemo(() => {
    if (data?.youtubeTrailerKey) {
      return `https://www.youtube-nocookie.com/embed/${data.youtubeTrailerKey}?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1`;
    }
    return "";
  }, [data?.youtubeTrailerKey]);

  useEffect(() => {
    if (!isOpen) return;
    if (data?.youtubeTrailerKey || data?.videoUrl) {
      setIsBannerPlaying(true);
    }
  }, [isOpen, data?.youtubeTrailerKey, data?.videoUrl]);

  const age = data?.age ?? "";
  const isR19 = age.includes("19") || age === "19+";

  const handleClose = () => {
    setIsBannerPlaying(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="game-overlay" onClick={handleClose}>
      <div className="game-modal" onClick={(e) => e.stopPropagation()}>

        {/* 닫기 버튼 - MovieModal/SeriesModal과 통일 */}
        <button className="game-close" onClick={handleClose} type="button">
          ✕
        </button>

        {/* 배너 */}
        <div className="game-banner">
          <div className="game-banner-img" style={bannerStyle} />

          {isBannerPlaying ? (
            <div className="game-banner-video" onClick={(e) => e.stopPropagation()}>
              {data?.videoUrl ? (
                <video
                  src={data.videoUrl}
                  controls
                  autoPlay
                  muted
                  playsInline
                />
              ) : bannerTrailerSrc ? (
                <iframe
                  src={bannerTrailerSrc}
                  title="Game Trailer"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              ) : null}

              <button
                className="game-banner-video-close"
                onClick={() => setIsBannerPlaying(false)}
                type="button"
              >
                닫기
              </button>
            </div>
          ) : null}
        </div>

        {/* 메인 정보 */}
        <div className="game-main">
          <div className="game-left">
            <div className="game-icon" style={iconStyle} />
            <div>
              <p className="netflix-label">NETFLIX</p>
              <h1 className="game-title">{title}</h1>
              <p className="game-meta">{data?.categoryText ?? "모바일 게임 · - · -"}</p>
            </div>
          </div>

          {/* 아이콘 버튼 - MovieModal/SeriesModal과 통일 */}
          <div className="game-actions">
            <button
              className="game-icon-btn"
              type="button"
              title="내가 찜한 콘텐츠에 추가"
              onClick={() => {
                if (data?.youtubeTrailerKey || data?.videoUrl) setIsBannerPlaying(true);
              }}
            >
              ＋
            </button>
            <button className="game-icon-btn" type="button" title="좋아요">
              {/*
                좋아요 아이콘 이미지로 교체 가능:
                <img className="icon-img" src="여기에_좋아요_아이콘_경로" alt="좋아요" />
              */}
              👍
            </button>
          </div>
        </div>

        {/* 설명 */}
        <div className="game-desc">
          <p>{description || "게임 설명이 없습니다."}</p>
          <div className="game-info-right">
            <p>모드: {data?.modes ?? "-"}</p>
            <p>오프라인 플레이: {data?.offlinePlay ?? "-"}</p>
          </div>
        </div>

        {/* QR / 다운로드 배너 이미지 */}
        <div className="game-qr-wrap">
          {/* 이미지 경로만 교체하면 됩니다 */}
          <img className="game-qr-image" src="./gamebanner.png" alt="QR 다운로드 안내" />
        </div>

        {/* 상세 정보 - MovieModal/SeriesModal과 통일 */}
        <div className="game-detail">
          <h2>{title ? `${title} 상세 정보` : "상세 정보"}</h2>

          <div className="game-detail-row">
            <span className="game-detail-label">카테고리:</span>
            <span className="game-detail-value">{data?.categoryText ?? "-"}</span>
          </div>
          <div className="game-detail-row">
            <span className="game-detail-label">모드:</span>
            <span className="game-detail-value">{data?.modes ?? "-"}</span>
          </div>
          <div className="game-detail-row">
            <span className="game-detail-label">플레이어:</span>
            <span className="game-detail-value">{data?.players ?? "-"}</span>
          </div>
          <div className="game-detail-row">
            <span className="game-detail-label">이용 가능 플랫폼:</span>
            <span className="game-detail-value">{data?.platforms ?? "-"}</span>
          </div>
          <div className="game-detail-row">
            <span className="game-detail-label">오프라인 플레이:</span>
            <span className="game-detail-value">{data?.offlinePlay ?? "-"}</span>
          </div>
          <div className="game-detail-row">
            <span className="game-detail-label">호환성:</span>
            <span className="game-detail-value">{data?.compatibility ?? "-"}</span>
          </div>
          <div className="game-detail-row">
            <span className="game-detail-label">컨트롤러 지원:</span>
            <span className="game-detail-value">{data?.controllerSupport ?? "-"}</span>
          </div>
          <div className="game-detail-row">
            <span className="game-detail-label">언어:</span>
            <span className="game-detail-value">{data?.languages ?? "-"}</span>
          </div>
          <div className="game-detail-row">
            <span className="game-detail-label">개발자:</span>
            <span className="game-detail-value">{data?.developer ?? "-"}</span>
          </div>
          <div className="game-detail-row">
            <span className="game-detail-label">출시 연도:</span>
            <span className="game-detail-value">{data?.releaseYear ?? "-"}</span>
          </div>

          {/* 관람등급 - MovieModal/SeriesModal과 통일 */}
          <div className="game-detail-rating-row">
            <span className="game-detail-label">관람등급:</span>
            <div className="game-detail-rating-content">
              <div className="game-detail-rating-main">
                {/*
                  등급 이미지로 교체 가능:
                  <img className="game-detail-rating-img" src="여기에_등급_이미지_경로" alt={age} />
                */}
                <span className={`game-age-badge${isR19 ? " r19" : ""}`}>
                  {age || "-"}
                </span>
                <span className="game-detail-rating-text">
                  {isR19 ? "청소년 이용불가" : "15세이상관람가"}
                </span>
              </div>

              {data?.ratingReason && (
                <p className="game-rating-reason">{data.ratingReason}</p>
              )}

              {/* 아이콘 그룹 - MovieModal/SeriesModal과 통일 */}
              <div className="game-detail-icons">
                {/*
                  각 아이콘 이미지로 교체 가능:
                  <div className="game-detail-icon-item">
                    <img className="game-detail-icon-img" src="여기에_폭력성_아이콘_경로" alt="폭력성" />
                    <span className="game-detail-icon-label">폭력성</span>
                  </div>
                */}
                <div className="game-detail-icon-item">
                  <div style={{ width: 44, height: 44, background: "rgba(255,255,255,0.1)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>👊</div>
                  <span className="game-detail-icon-label">폭력성</span>
                </div>
                <div className="game-detail-icon-item">
                  <div style={{ width: 44, height: 44, background: "rgba(255,255,255,0.1)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>💬</div>
                  <span className="game-detail-icon-label">대사</span>
                </div>
              </div>
            </div>
          </div>

          {loading && (
            <p style={{ marginTop: 12, color: "#aaa" }}>게임 정보를 불러오는 중이에요</p>
          )}
        </div>

      </div>
    </div>
  );
}