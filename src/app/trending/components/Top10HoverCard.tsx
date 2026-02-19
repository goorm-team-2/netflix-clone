"use client";

import { useEffect, useMemo, useState } from "react";
import css from "@/components/video/video.module.css";

const genreMap: { [key: number]: string } = {
  28: "액션",
  12: "모험",
  16: "애니메이션",
  35: "코미디",
  80: "범죄",
  99: "다큐멘터리",
  18: "드라마",
  10751: "가족",
  14: "판타지",
  36: "역사",
  27: "공포",
  10402: "음악",
  9648: "미스터리",
  10749: "로맨스",
  878: "SF",
  10770: "TV 영화",
  53: "스릴러",
  10752: "전쟁",
  37: "서부",
};

type Item = {
  id: number;
  title: string;
  image: string;
  backdrop_path?: string | null;
  poster_path?: string | null;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  adult?: boolean;
  genre_ids?: number[];
  match?: number;
  age?: string;
  year?: string;
  quality?: string;
  genresText?: string;
};

export default function Top10HoverCard({
  item,
  hideTitleOverlay = true,
}: {
  item: Item;
  hideTitleOverlay?: boolean;
}) {
  const [isMyList, setIsMyList] = useState(false);
  const [reaction, setReaction] = useState<string | null>(null); 

  useEffect(() => {
    const savedList = localStorage.getItem(`myList_${item.id}`);
    if (savedList) setIsMyList(JSON.parse(savedList));

    const savedReaction = localStorage.getItem(`reaction_${item.id}`);
    if (savedReaction) setReaction(savedReaction);
  }, [item.id]);

  const toggleMyList = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isMyList;
    setIsMyList(next);
    localStorage.setItem(`myList_${item.id}`, JSON.stringify(next));
  };

  const handleReaction = (e: React.MouseEvent, type: string) => {
    e.stopPropagation();
    const next = reaction === type ? null : type;
    setReaction(next);
    if (next) localStorage.setItem(`reaction_${item.id}`, next);
    else localStorage.removeItem(`reaction_${item.id}`);
  };

  const hoverImage = useMemo(() => {
    const backdrop = item.backdrop_path
      ? `https://image.tmdb.org/t/p/w780${item.backdrop_path}`
      : "";
    const poster = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "";
    return backdrop || poster || item.image || "/no-image.png";
  }, [item]);

  const matchScore =
    item.match ?? Math.floor(((item.vote_average ?? 0) * 10));

  const age = item.age ?? (item.adult ? "19+" : "15+");

  const year =
    item.year ??
    (item.release_date?.split("-")[0] ||
      item.first_air_date?.split("-")[0] ||
      "");

  const quality = item.quality ?? "HD";

  const genresText =
    item.genresText ??
    (item.genre_ids?.map((id) => genreMap[id]).filter(Boolean).slice(0, 3).join(" • ") ?? "");

  return (
    <div className={css.wrapper}>
      <div className={`common-videoBox ${css["videoBox"]} ${css.hovered}`}>
        <div className={css.mediaWrapper}>
          <img className={css.movieImage} src={hoverImage} alt={item.title} />
        </div>

        {!hideTitleOverlay && (
          <div className={css.titleOverlay}>{item.title}</div>
        )}

        <div className={`common-infoOverlay`}>
          <div className={css.icons}>
            <button className={css.playButton}>
              <img className={css.buttonIcon} src="/play.svg" alt="Play" />
            </button>

            <button
              className={css.iconButton}
              onClick={toggleMyList}
              data-tooltip={isMyList ? "내가 찜한 콘텐츠에서 삭제" : "내가 찜한 콘텐츠에 추가"}
            >
              <img
                className={css.buttonIcon}
                src={isMyList ? "/check.svg" : "/plus.svg"}
                alt="My List"
              />
            </button>

            <div className={css.likeWrapper}>
              <button className={css.iconButton} onClick={(e) => handleReaction(e, "like")}>
                <img
                  className={css.buttonIcon}
                  src={
                    reaction === "dislike"
                      ? "/dislike-filled.svg"
                      : reaction === "verylike"
                      ? "/verylike-filled.svg"
                      : reaction === "like"
                      ? "/like-filled.svg"
                      : "/like.svg"
                  }
                  alt="Like"
                />
              </button>

              <div className={css.reactionMenu}>
                <button
                  className={css.reactionButton}
                  data-tooltip="마음에 안 들어요"
                  onClick={(e) => handleReaction(e, "dislike")}
                >
                  <img
                    className={css.reactionIcon}
                    src={reaction === "dislike" ? "/dislike-filled.svg" : "/dislike.svg"}
                    alt="Dislike"
                  />
                </button>

                <button
                  className={css.reactionButton}
                  data-tooltip="좋아요"
                  onClick={(e) => handleReaction(e, "like")}
                >
                  <img
                    className={css.reactionIcon}
                    src={reaction === "like" ? "/like-filled.svg" : "/like.svg"}
                    alt="Like"
                  />
                </button>

                <button
                  className={css.reactionButton}
                  data-tooltip="최고예요!"
                  onClick={(e) => handleReaction(e, "verylike")}
                >
                  <img
                    className={css.reactionIcon}
                    src={reaction === "verylike" ? "/verylike-filled.svg" : "/verylike.svg"}
                    alt="VeryLike"
                  />
                </button>
              </div>
            </div>

            <button className={`${css.iconButton} ${css.moreInfo}`} data-tooltip="회차 및 상세정보">
              <img className={css.buttonIcon} src="/info.svg" alt="More Info" />
            </button>
          </div>

          <div className={css.metaData}>
            <span className={css.matchScore}>{matchScore}% 일치</span>
            <span className={css.ageLimit}>{age}</span>
            <span className={css.duration}>{year}</span>
            <span className={css.hdLabel}>{quality}</span>
          </div>

          <div className={css.genres}>{genresText}</div>
        </div>
      </div>
    </div>
  );
}

