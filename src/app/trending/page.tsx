import Row from "./components/Row";
import Top10Row from "./components/Top10Row";

type TmdbItem = {
  id: number;
  title?: string;
  release_date?: string;
  name?: string;
  first_air_date?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  genre_ids?: number[];
};

const imgW780 = (path?: string | null) =>
  path ? `https://image.tmdb.org/t/p/w780${path}` : "/images/placeholder.jpg";

const rowImage = (m: TmdbItem) => imgW780(m.backdrop_path ?? m.poster_path ?? null);
const top10Image = (m: TmdbItem) => imgW780(m.poster_path ?? m.backdrop_path ?? null);

async function fetchTmdb<T>(url: string): Promise<T> {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!apiKey) {
    throw new Error("NEXT_PUBLIC_TMDB_API_KEY가 없습니다. (.env.local 확인)");
  }

  const fullUrl = `${url}${url.includes("?") ? "&" : "?"}api_key=${apiKey}`;

  const res = await fetch(fullUrl, {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error(`TMDB 요청 실패: ${res.status}`);
  return res.json();
}

// 로우에 넘길 아이템
function toRowItems(results: TmdbItem[], limit: number) {
  return results.slice(0, limit).map((m) => ({
    id: m.id,
    title: m.title ?? m.name ?? "Untitled",
    image: rowImage(m), 

    // 호버 카드용
    vote_average: m.vote_average ?? 0,
    genre_ids: m.genre_ids ?? [],
    release_date: (m.release_date ?? m.first_air_date ?? "") as string,
    backdrop_path: m.backdrop_path ?? null,
    poster_path: m.poster_path ?? null,
  }));
}

// 탑텐에 넘길 아이템
function toTop10Items(results: TmdbItem[], limit: number) {
  return results.slice(0, limit).map((m) => ({
    id: m.id,
    title: m.title ?? m.name ?? "Untitled",
    image: top10Image(m), 

    vote_average: m.vote_average ?? 0,
    genre_ids: m.genre_ids ?? [],
    release_date: (m.release_date ?? m.first_air_date ?? "") as string,
    backdrop_path: m.backdrop_path ?? null,
    poster_path: m.poster_path ?? null,
  }));
}

export default async function TrendingPage() {
  const trendingAll = await fetchTmdb<{ results: TmdbItem[] }>(
    "https://api.themoviedb.org/3/trending/all/week?language=ko-KR&page=1"
  );

  const popularMovies = await fetchTmdb<{ results: TmdbItem[] }>(
    "https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1"
  );

  const topRatedMovies = await fetchTmdb<{ results: TmdbItem[] }>(
    "https://api.themoviedb.org/3/movie/top_rated?language=ko-KR&page=1"
  );

  const upcomingMovies = await fetchTmdb<{ results: TmdbItem[] }>(
    "https://api.themoviedb.org/3/movie/upcoming?language=ko-KR&page=1&region=KR"
  );

  const trendingTv = await fetchTmdb<{ results: TmdbItem[] }>(
    "https://api.themoviedb.org/3/trending/tv/day?language=ko-KR&page=1"
  );

  const trendingMovie = await fetchTmdb<{ results: TmdbItem[] }>(
    "https://api.themoviedb.org/3/trending/movie/day?language=ko-KR&page=1"
  );

  const listA = toRowItems(trendingAll.results, 16);
  const listNextWeek = toRowItems(upcomingMovies.results, 16);
  const listThisWeek = toRowItems(popularMovies.results, 16);
  const listWorth = toRowItems(topRatedMovies.results, 16);

  const topSeries = toTop10Items(trendingTv.results, 10);
  const topMovie = toTop10Items(trendingMovie.results, 10);

  return (
    <main style={{ paddingTop: 90, paddingBottom: 80, maxWidth: 1600, margin: "0 auto", width: "100%" }}>
      <Row title="넷플릭스의 새로운 콘텐츠" items={listA} indicatorCount={7} />

      <Top10Row title="오늘 대한민국의 TOP 10 시리즈" items={topSeries as any} variant="series" />
      <Top10Row title="오늘 대한민국의 TOP 10 영화" items={topMovie as any} variant="movie" />

      <Row title="다음 주 공개 콘텐츠" items={listNextWeek} indicatorCount={4} />
      <Row title="이번 주 공개 콘텐츠" items={listThisWeek} indicatorCount={3} />
      <Row title="기다림이 아깝지 않은 콘텐츠" items={listWorth} indicatorCount={7} />
    </main>
  );
}

