import { NextResponse } from "next/server";

type ApiGame = {
  id: string;
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

const GAME_DB: Record<string, ApiGame> = {
  // ✅ 키를 games.json의 id와 일치시킴
  "netflix-puzzled": {
    id: "netflix-puzzled",
    title: "넷플릭스 퍼즐 모음",
    description:
      "매일 뇌를 단련시키는 퍼즐 플레이 습관을 길러 보세요. 광고도, 인앱 구매도 없습니다.",
    bannerImage:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
    iconImage:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=512&q=80",
    youtubeTrailerKey: "BjWFdn4j9cQ",
    categoryText: "모바일 게임 · 퍼즐 · 13+",
    age: "13+",
    modes: "싱글 플레이어",
    offlinePlay: "일부 기능 가능",
    platforms: "모바일",
    players: "1",
    compatibility: "iOS 17.0 이상, Android OS8 이상",
    controllerSupport: "X",
    languages: "한국어, 영어",
    developer: "Next Games",
    releaseYear: 2025,
    ratingReason: "간헐적 폭력, 공포 요소 포함",
  },

  "soljiok-choice": {
    id: "soljiok-choice",
    title: "솔로지옥: 초이스",
    description: "솔로지옥 시리즈의 공식 인터랙티브 게임입니다.",
    bannerImage:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80",
    iconImage:
      "https://images.unsplash.com/photo-1580128637423-2b4b5cc0a53d?auto=format&fit=crop&w=512&q=80",
    categoryText: "모바일 게임 · 연애 · 15+",
    age: "15+",
    modes: "싱글 플레이어",
    offlinePlay: "불가",
    platforms: "모바일",
    players: "1",
    compatibility: "iOS 16.0 이상, Android OS9 이상",
    controllerSupport: "X",
    languages: "한국어, 영어",
    developer: "Netflix Games",
    releaseYear: 2024,
    ratingReason: "선정적 주제 포함",
  },

  "squid-game-mobile": {
    id: "squid-game-mobile",
    title: "오징어 게임: 모바일 서바이벌",
    description: "456명 중 살아남아라. 오징어 게임 공식 모바일 게임.",
    bannerImage:
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1600&q=80",
    iconImage:
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=512&q=80",
    categoryText: "모바일 게임 · 서바이벌 · 15+",
    age: "15+",
    modes: "멀티 플레이어",
    offlinePlay: "불가",
    platforms: "모바일",
    players: "최대 32명",
    compatibility: "iOS 16.0 이상, Android OS9 이상",
    controllerSupport: "X",
    languages: "한국어, 영어, 일본어",
    developer: "Netflix Games",
    releaseYear: 2025,
    ratingReason: "폭력적인 장면 포함",
  },

  "dead-cells-netflix": {
    id: "dead-cells-netflix",
    title: "데드 셀: 넷플릭스 에디션",
    description: "로그라이크 액션 게임의 정수. 죽고 또 죽으며 강해져라.",
    bannerImage:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80",
    iconImage:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=512&q=80",
    categoryText: "모바일 게임 · 액션 · 16+",
    age: "16+",
    modes: "싱글 플레이어",
    offlinePlay: "가능",
    platforms: "모바일",
    players: "1",
    compatibility: "iOS 14.0 이상, Android OS8 이상",
    controllerSupport: "O",
    languages: "한국어, 영어, 일본어 외 다수",
    developer: "Motion Twin",
    releaseYear: 2023,
    ratingReason: "폭력적인 장면 포함",
  },

  "into-the-breach": {
    id: "into-the-breach",
    title: "인투 더 브리치",
    description: "완벽한 턴제 전략 게임. 인류를 구하라.",
    bannerImage:
      "https://images.unsplash.com/photo-1580327344181-c1163234e5a0?auto=format&fit=crop&w=1600&q=80",
    iconImage:
      "https://images.unsplash.com/photo-1580327344181-c1163234e5a0?auto=format&fit=crop&w=512&q=80",
    categoryText: "모바일 게임 · 전략 · 12+",
    age: "12+",
    modes: "싱글 플레이어",
    offlinePlay: "가능",
    platforms: "모바일",
    players: "1",
    compatibility: "iOS 14.0 이상, Android OS8 이상",
    controllerSupport: "O",
    languages: "한국어, 영어 외 다수",
    developer: "Subset Games",
    releaseYear: 2022,
    ratingReason: "경미한 폭력 포함",
  },
};

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const game = GAME_DB[id];

  if (!game) {
    // DB에 없으면 games.json name 기반으로 기본값 반환 (404 대신)
    return NextResponse.json(
      {
        id,
        title: id,
        description: "게임 설명을 준비 중입니다.",
        categoryText: "모바일 게임",
        age: "-",
        modes: "-",
        offlinePlay: "-",
        platforms: "모바일",
        players: "-",
        compatibility: "-",
        controllerSupport: "-",
        languages: "-",
        developer: "Netflix Games",
        releaseYear: "-",
      },
      { status: 200 }
    );
  }

  return NextResponse.json(game, {
    status: 200,
    headers: { "Cache-Control": "no-store" },
  });
}