"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import css from "./video.module.css";
import { Movie } from "@/components/video/movie"; 

// 장르 ID -> 한글 변환기
const genreMap: { [key: number]: string } = {
  28: "액션", 12: "모험", 16: "애니메이션", 35: "코미디", 80: "범죄",
  99: "다큐멘터리", 18: "드라마", 10751: "가족", 14: "판타지", 36: "역사",
  27: "공포", 10402: "음악", 9648: "미스터리", 10749: "로맨스", 878: "SF",
  10770: "TV 영화", 53: "스릴러", 10752: "전쟁", 37: "서부",
};

interface VedioProps {
  movie: Movie;
  onClick?: () => void;
}

export default function Vedio({ movie, onClick }: VedioProps) {
  const router = useRouter();


  // ----- 상태 관리 (찜하기, 좋아요, 호버 등) -----

  const [isMyList, setIsMyList] = useState(false); // 찜하기 여부
  const [reaction, setReaction] = useState<string | null>(null); // 'like', 'dislike', 'verylike'
  
  const [isHovered, setIsHovered] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  // 이미지 주소 처리
  const initialImage = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
    : movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/no-image.png";

  const [imgSrc, setImgSrc] = useState(initialImage);

  // ----- [불러오기] 컴포넌트 켜질 때 localStorage 확인 -----
  useEffect(() => {
    // 찜하기 상태 불러오기
    const savedList = localStorage.getItem(`myList_${movie.id}`);
    if (savedList) {
      setIsMyList(JSON.parse(savedList));
    }

    // 좋아요 반응 불러오기
    const savedReaction = localStorage.getItem(`reaction_${movie.id}`);
    if (savedReaction) {
      setReaction(savedReaction);
    }
  }, [movie.id]);


  // ----- [이벤트 핸들러] 저장 및 클릭 처리 -----
 
  // 찜하기 토글 함수
  const toggleMyList = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = !isMyList;
    setIsMyList(newState);
    localStorage.setItem(`myList_${movie.id}`, JSON.stringify(newState));
  };

  // 반응형 좋아요 선택 함수
  const handleReaction = (e: React.MouseEvent, type: string) => {
    e.stopPropagation();
    
    // 이미 선택된 걸 또 누르면 취소(null), 아니면 선택(type)
    const newReaction = reaction === type ? null : type;
    setReaction(newReaction);
    
    if (newReaction) {
      localStorage.setItem(`reaction_${movie.id}`, newReaction);
    } else {
      localStorage.removeItem(`reaction_${movie.id}`);
    }
  };

  // 호버 및 네비게이션
  const handleMouseEnter = () => {
    const newTimer = setTimeout(() => {
      setIsHovered(true);
    }, 500);
    setTimer(newTimer);
  };

  const handleMouseLeave = () => {
    if (timer) clearTimeout(timer);
    setIsHovered(false);
  };

   // 재생 페이지로 이동
  const goToWatch = () => {
    router.push(`/watch/${movie.id}`);
  };
  // 상세정보 페이지로 이동
  const goToDetail = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/detail/${movie.id}`);
  };

  // --- 데이터 가공 ---
  const matchScore = Math.floor((movie.vote_average || 0) * 10);
  const genreText = movie.genre_ids
    ? movie.genre_ids.map((id) => genreMap[id]).slice(0, 3).join(" • ")
    : "";
  const releaseYear = movie.release_date ? movie.release_date.split("-")[0] : "";

  // --- 화면 렌더링 ---
  return (
    <div 
      className={css.wrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className={`common-videoBox ${css['videoBox']} ${isHovered ? css.hovered : ""}`}
        onClick={onClick || goToWatch}
      >
        {/* 이미지 영역 */}
        <div className={css.mediaWrapper} onClick={goToWatch}>
          <img 
            className={css.movieImage} 
            src={imgSrc} 
            alt={movie.title} 
            onError={() => setImgSrc("/no-image.png")}
          />
        </div>

        {/* 제목 (이미지 오류일 때 안보임) */}
        {imgSrc !== "/no-image.png" && (
           <div className={css.titleOverlay}>
             {movie.title}
           </div>
        )}

        {/* 정보 오버레이 (호버 시에만 등장) */}
        {isHovered && (
          <div className={`common-infoOverlay`} onClick={goToDetail}>
            
            {/* 버튼 그룹 */}
            <div className={css.icons}>
              {/* 재생 버튼 */}
              <button className={css.playButton} onClick={(e) => { e.stopPropagation(); goToWatch(); }}>
                <img className={css.buttonIcon} src="/play.svg" alt="Play" />
              </button>
              
              {/* 내가 찜한 콘텐츠 버튼 */}
              <button
                className={css.iconButton} 
                onClick={toggleMyList}
                data-tooltip={isMyList ? "내가 찜한 콘텐츠에서 삭제" : "내가 찜한 콘텐츠에 추가"}>
                  <img 
                    className={css.buttonIcon}
                    src={isMyList ? "/check.svg" : "/plus.svg"} 
                    alt="My List"/>
              </button>
              
              {/* 좋아요 래퍼 버튼 */}
              <div className={css.likeWrapper}>
                {/* 메인 버튼: 선택한 반응 보여주기 */}
                <button 
                  className={css.iconButton}
                  onClick={(e) => handleReaction(e, "like")}
                >
                  <img 
                    className={css.buttonIcon} 
                    src={
                      reaction === "dislike" ? "/dislike-filled.svg" :
                      reaction === "verylike" ? "/verylike-filled.svg" :
                      reaction === "like" ? "/like-filled.svg" : 
                      "/like.svg"
                    } 
                    alt="Like" 
                  />
                </button>

                {/* 숨겨진 반응 메뉴 */}
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

              {/* 상세정보 버튼 */}
              <button className={`${css.iconButton} ${css.moreInfo}`} data-tooltip="회차 및 상세정보" onClick={goToDetail}>
                <img className={css.buttonIcon} src="/info.svg" alt="More Info" />
              </button>
            </div>

            {/* 메타 정보 */}
            <div className={css.metaData}>
              <span className={css.matchScore}>{matchScore}% 일치</span>
              <span className={css.ageLimit}>{movie.adult ? "19+" : "15+"}</span>
              <span className={css.duration}>{releaseYear}</span>
              <span className={css.hdLabel}>HD</span>
            </div>

            {/* 장르 */}
            <div className={css.genres}>
              {genreText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
