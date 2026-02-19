import { NextResponse } from "next/server";

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

// 임시 더미 데이터(나중에 DB로 교체)
const GAME_DB: Record<string, ApiGame> = {
  "3498": {
    id: 3498,
    title: "넷플릭스 퍼즐 모음",
    description:
      "매일 뇌를 단련시키는 퍼즐 플레이 습관을 길러 보세요. 광고도, 인앱 구매도 없습니다.",

    bannerImage:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
    iconImage:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=512&q=80",

    // ✅ 넷플릭스 퍼즐 관련 공식 티저
    youtubeTrailerKey: "BjWFdn4j9cQ",
    // mp4 직접 링크를 쓰려면 videoUrl을 사용하세요(둘 다 있으면 videoUrl 우선)
    // videoUrl: "https://your-cdn.com/trailer.mp4",

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

  "2": {
    id: 2,
    title: "액션 러너",
    description: "빠른 반응 속도가 필요한 러닝 액션 게임입니다.",

    bannerImage:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80",
    iconImage:
      "https://images.unsplash.com/photo-1580128637423-2b4b5cc0a53d?auto=format&fit=crop&w=512&q=80",

    // mp4 예시(유튜브 대신 직접 video)
    videoUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",

    categoryText: "모바일 게임 · 액션 · 15+",
    age: "15+",
    modes: "싱글 플레이어",
    offlinePlay: "가능",
    platforms: "모바일",
    players: "1",
    compatibility: "iOS 16.0 이상, Android OS9 이상",
    controllerSupport: "O",
    languages: "한국어, 영어, 일본어",
    developer: "Action Studio",
    releaseYear: 2024,
    ratingReason: "폭력적인 장면 포함",
  },
};

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // Next.js 최신 버전에서 params가 Promise인 경우가 있어 await 필요
  const { id } = await context.params;

  // 실제로는 DB 조회하면 됩니다.
  const game = GAME_DB[id];

  if (!game) {
    return NextResponse.json(
      { message: "GAME_NOT_FOUND", id },
      { status: 404 }
    );
  }

  // 캐싱을 피하고 싶으면 아래 헤더를 추가할 수도 있어요
  return NextResponse.json(game, {
    status: 200,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
