// 영화 데이터 타입 정의
export interface Movie{
// 1. 식별 및 제목 관련
  id: number;                   // 영화 고유 ID
  title: string;                // 표시 제목
  original_title: string;       // 원제 (언어별 필터링 시 유용)
  
  // 2. 미디어 관련 (이미지)
  poster_path: string | null;   // 세로 포스터 이미지 경로
  backdrop_path: string | null; // 가로 배경 이미지 경로
  video: boolean;               // 예고편 비디오 존재 여부
  
  // 3. 내용 및 통계 관련
  overview?: string;             // 영화 줄거리 요약
  adult?: boolean;               // 성인 영화 여부
  popularity?: number;           // 인기도 점수
  vote_average?: number;         // 평점 (0~10)
  vote_count?: number;           // 평점 투표 참여자 수
  
  // 4. 분류 및 메타데이터
  release_date?: string;         // 개봉일 (YYYY-MM-DD 형식)
  original_language?: string;    // 제작 국가 언어 코드 (en, ko 등)
  genre_ids?: number[];          // 장르 ID 배열

}

// API 호출 시 전체 응답 껍데기
export interface MovieResponse {
  page?: number;                 // 현재 페이지
  results?: Movie[];             // 영화 목록 배열
  total_pages?: number;          // 전체 페이지 수
  total_results?: number;        // 전체 데이터 개수
}