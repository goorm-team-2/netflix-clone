import Homefridge from "@/components/feature/Homefridge";
import Row from "./trending/components/Row";
import Top10Row from "./trending/components/Top10Row";

type Item = {
  id: number;
  title: string;
  image: string;
  vote_average?: number;
  genre_ids?: number[];
  release_date?: string; 
  backdrop_path?: string | null;
  poster_path?: string | null;
  overview?: string;
};

type TmdbItem = {
  id: number;
  title?: string; 
  name?: string; 
  poster_path?: string | null;
  backdrop_path?: string | null;
  media_type?: "movie" | "tv" | "person";
  vote_average?: number;
  genre_ids?: number[];
  release_date?: string;
  first_air_date?: string;
  overview?: string;
};

const FALLBACK_IMG = "/top10_96min.jpg"; 

const imgW780 = (path?: string | null) =>
  path ? `https://image.tmdb.org/t/p/w780${path}` : FALLBACK_IMG;

const normTitle = (x: TmdbItem) => x.title ?? x.name ?? "Untitled";

async function fetchTmdb<T>(url: string): Promise<T> {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!apiKey) throw new Error("NEXT_PUBLIC_TMDB_API_KEY가 없습니다. (.env.local 확인)");

  const fullUrl = `${url}${url.includes("?") ? "&" : "?"}api_key=${apiKey}`;
  const res = await fetch(fullUrl, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`TMDB 요청 실패: ${res.status} (${fullUrl})`);
  return res.json();
}

function extractQuery(title: string) {
  const idx = title.indexOf("(와)");
  if (idx > 0) return title.slice(0, idx);
  const idx2 = title.indexOf("(과)");
  if (idx2 > 0) return title.slice(0, idx2);
  return title;
}

function toRowItem(x: TmdbItem): Item {
  return {
    id: x.id,
    title: normTitle(x),
    image: imgW780(x.backdrop_path ?? x.poster_path ?? null),
    vote_average: x.vote_average ?? 0,
    genre_ids: x.genre_ids ?? [],
    release_date: x.release_date ?? x.first_air_date ?? "",
    backdrop_path: x.backdrop_path ?? null,
    poster_path: x.poster_path ?? null,
    overview: x.overview ?? "",
  };
}

function toTop10Item(x: TmdbItem): Item {
  return {
    id: x.id,
    title: normTitle(x),

    image: imgW780(x.poster_path ?? x.backdrop_path ?? null),

    vote_average: x.vote_average ?? 0,
    genre_ids: x.genre_ids ?? [],
    release_date: x.release_date ?? x.first_air_date ?? "",
    backdrop_path: x.backdrop_path ?? null,
    poster_path: x.poster_path ?? null,
    overview: x.overview ?? "",
  };
}


function buildRowNoBlank(sources: TmdbItem[][], used: Set<number>, limit = 16): Item[] {
  const out: TmdbItem[] = [];

  const hasImage = (x: TmdbItem) =>
    !!(x.backdrop_path || x.poster_path);

  const pushUnique = (x: TmdbItem) => {
    if (x.media_type === "person") return false;
    if (used.has(x.id)) return false;
    if (!hasImage(x)) return false;  
    used.add(x.id);
    out.push(x);
    return true;
  };

  const pushAllowDup = (x: TmdbItem) => {
    if (x.media_type === "person") return false;
    if (!hasImage(x)) return false;  
    out.push(x);
    return true;
  };

  // 중복 최소화
  for (const list of sources) {
    for (const x of list) {
      if (out.length >= limit) break;
      pushUnique(x);
    }
    if (out.length >= limit) break;
  }

  // 반칸 방지
  if (out.length < limit) {
    for (const list of sources) {
      for (const x of list) {
        if (out.length >= limit) break;
        if (out.some((y) => y.id === x.id)) continue;
        pushAllowDup(x);
      }
      if (out.length >= limit) break;
    }
  }

  if (out.length < limit) {
    const flat = sources.flat().filter((x) => x.media_type !== "person");
    while (out.length < limit && flat.length > 0) {
      out.push(flat[out.length % flat.length]);
    }
  }

  return out.slice(0, limit).map(toRowItem);
}

function buildTop10NoBlank(sources: TmdbItem[][], used: Set<number>, limit = 10): Item[] {
  const out: TmdbItem[] = [];

  const pushUnique = (x: TmdbItem) => {
    if (x.media_type === "person") return false;
    if (used.has(x.id)) return false;
    used.add(x.id);
    out.push(x);
    return true;
  };

  const pushAllowDup = (x: TmdbItem) => {
    if (x.media_type === "person") return false;
    out.push(x);
    return true;
  };

  for (const list of sources) {
    for (const x of list) {
      if (out.length >= limit) break;
      pushUnique(x);
    }
    if (out.length >= limit) break;
  }

  if (out.length < limit) {
    for (const list of sources) {
      for (const x of list) {
        if (out.length >= limit) break;
        if (out.some((y) => y.id === x.id)) continue;
        pushAllowDup(x);
      }
      if (out.length >= limit) break;
    }
  }

  if (out.length < limit) {
    const flat = sources.flat().filter((x) => x.media_type !== "person");
    while (out.length < limit && flat.length > 0) {
      out.push(flat[out.length % flat.length]);
    }
  }

  return out.slice(0, limit).map(toTop10Item);
}


function qs(params: Record<string, string | number | boolean | undefined>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined) continue;
    sp.set(k, String(v));
  }
  return sp.toString();
}

async function fetchDiscoverMovie(params: Record<string, any>, pages = [1, 2, 3]) {
  const results: TmdbItem[][] = [];
  for (const p of pages) {
    const url = `https://api.themoviedb.org/3/discover/movie?${qs({
      language: "ko-KR",
      include_adult: false,
      sort_by: "popularity.desc",
      page: p,
      ...params,
    })}`;
    const res = await fetchTmdb<{ results: TmdbItem[] }>(url);
    // discover, movie에는 미디어 타입이 없을 수 있어 보정
    results.push(res.results.map((x) => ({ ...x, media_type: "movie" })));
  }
  return results;
}

async function fetchDiscoverTv(params: Record<string, any>, pages = [1, 2, 3]) {
  const results: TmdbItem[][] = [];
  for (const p of pages) {
    const url = `https://api.themoviedb.org/3/discover/tv?${qs({
      language: "ko-KR",
      include_adult: false,
      sort_by: "popularity.desc",
      page: p,
      ...params,
    })}`;
    const res = await fetchTmdb<{ results: TmdbItem[] }>(url);
    results.push(res.results.map((x) => ({ ...x, media_type: "tv" })));
  }
  return results;
}

// ~와 비슷한 콘텐츠

async function findSeedByTitle(title: string) {
  const q = encodeURIComponent(extractQuery(title));
  const res = await fetchTmdb<{ results: TmdbItem[] }>(
    `https://api.themoviedb.org/3/search/multi?language=ko-KR&include_adult=false&query=${q}&page=1`
  );
  const seed = res.results.find((x) => x.media_type === "movie" || x.media_type === "tv");
  return seed ?? null;
}

async function fetchRecsAndSimilar(seed: TmdbItem) {
  const type = seed.media_type; 
  const id = seed.id;

  const [rec, sim] = await Promise.all([
    fetchTmdb<{ results: TmdbItem[] }>(
      `https://api.themoviedb.org/3/${type}/${id}/recommendations?language=ko-KR&page=1`
    ),
    fetchTmdb<{ results: TmdbItem[] }>(
      `https://api.themoviedb.org/3/${type}/${id}/similar?language=ko-KR&page=1`
    ),
  ]);

  // 결과에 미디어 타입이 없을 수 있으니까 보정
  const fixed = [...rec.results, ...sim.results].map((x) => ({ ...x, media_type: type as any }));
  return fixed;
}

async function buildSimilarRow(title: string, used: Set<number>, limit = 16): Promise<Item[]> {
  const seed = await findSeedByTitle(title);

  // seed 못 찾으면 트렌딩으로 fallback
  if (!seed) {
    const fb = await fetchTmdb<{ results: TmdbItem[] }>(
      "https://api.themoviedb.org/3/trending/all/week?language=ko-KR&page=1"
    );
    return buildRowNoBlank([fb.results], used, limit);
  }

  const recs = await fetchRecsAndSimilar(seed);

  // 부족하면 seed 타입 기반으로 보강
  const fallback =
    seed.media_type === "tv"
      ? await fetchTmdb<{ results: TmdbItem[] }>(
          "https://api.themoviedb.org/3/tv/popular?language=ko-KR&page=1"
        )
      : await fetchTmdb<{ results: TmdbItem[] }>(
          "https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1"
        );

  const fixedFallback = fallback.results.map((x) => ({ ...x, media_type: seed.media_type as any }));
  return buildRowNoBlank([recs, fixedFallback], used, limit);
}

async function buildSearchRow(query: string, used: Set<number>, limit = 16): Promise<Item[]> {
  const q = encodeURIComponent(query);
  const res = await fetchTmdb<{ results: TmdbItem[] }>(
    `https://api.themoviedb.org/3/search/multi?language=ko-KR&include_adult=false&query=${q}&page=1`
  );
  const tvPop = await fetchTmdb<{ results: TmdbItem[] }>(
    "https://api.themoviedb.org/3/tv/popular?language=ko-KR&page=1"
  );

  const tvFixed = tvPop.results.map((x) => ({ ...x, media_type: "tv" as const }));
  return buildRowNoBlank([res.results, tvFixed], used, limit);
}

export default async function HomePage() {
  const used = new Set<number>();

  const pickedPool = await fetchTmdb<{ results: TmdbItem[] }>(
    "https://api.themoviedb.org/3/trending/all/week?language=ko-KR&page=1"
  );
  const picked5 = buildRowNoBlank([pickedPool.results], used, 5);

  const [tvDay, movieDay] = await Promise.all([
    fetchTmdb<{ results: TmdbItem[] }>("https://api.themoviedb.org/3/trending/tv/day?language=ko-KR&page=1"),
    fetchTmdb<{ results: TmdbItem[] }>("https://api.themoviedb.org/3/trending/movie/day?language=ko-KR&page=1"),
  ]);
  const top10Series = buildTop10NoBlank([tvDay.results], used, 10);
  const top10Movie = buildTop10NoBlank([movieDay.results], used, 10);

  const watching = await fetchTmdb<{ results: TmdbItem[] }>(
    "https://api.themoviedb.org/3/trending/all/day?language=ko-KR&page=1"
  );
  const aRow = buildRowNoBlank([watching.results], used, 16);

  const forYou = await fetchTmdb<{ results: TmdbItem[] }>(
    "https://api.themoviedb.org/3/trending/all/week?language=ko-KR&page=1"
  );
  const bRow = buildRowNoBlank([forYou.results], used, 16);


  const comedyMoviesSrc = await fetchDiscoverMovie({ with_genres: 35 });
  const comedyMovies = buildRowNoBlank(comedyMoviesSrc, used, 16);

  const usMoviesSrc = await fetchDiscoverMovie({ with_original_language: "en" });
  const usMovies = buildRowNoBlank(usMoviesSrc, used, 16);

  const nowPlayingSrc = await fetchDiscoverMovie({ region: "KR" });
  const nowPlaying = buildRowNoBlank(nowPlayingSrc, used, 16);

  const romanceHollywoodSrc = await fetchDiscoverMovie({ with_genres: 10749, with_original_language: "en" });
  const romanceHollywood = buildRowNoBlank(romanceHollywoodSrc, used, 16);

  const romanceKoComedyTvSrc = await fetchDiscoverTv({ with_genres: "35,10749", with_original_language: "ko" });
  const romanceKoComedyTv = buildRowNoBlank(romanceKoComedyTvSrc, used, 16);

  const romanceKoTvSrc = await fetchDiscoverTv({ with_genres: 10749, with_original_language: "ko" });
  const romanceKoTv = buildRowNoBlank(romanceKoTvSrc, used, 16);

  const acclaimedTvSrc = await fetchDiscoverTv({
    sort_by: "vote_average.desc",
    "vote_count.gte": 500,
  });
  const acclaimedTv = buildRowNoBlank(acclaimedTvSrc, used, 16);

  const inspiringSrc = await fetchDiscoverMovie({
    with_genres: 18,
    sort_by: "vote_average.desc",
    "vote_count.gte": 400,
  });
  const inspiring = buildRowNoBlank(inspiringSrc, used, 16);

  const dateNightSrc = await fetchDiscoverMovie({ with_genres: 10749 });
  const dateNight = buildRowNoBlank(dateNightSrc, used, 16);

  const bookLikeSrc = await fetchDiscoverMovie({ with_genres: "18,10749" });
  const bookLike = buildRowNoBlank(bookLikeSrc, used, 16);

  const womenStoriesSrc = await fetchDiscoverMovie({
    with_genres: 18,
    sort_by: "vote_average.desc",
    "vote_count.gte": 300,
  });
  const womenStories = buildRowNoBlank(womenStoriesSrc, used, 16);

  const evergreenRomanceSrc = await fetchDiscoverMovie({ with_genres: 10749 });
  const evergreenRomance = buildRowNoBlank(evergreenRomanceSrc, used, 16);

  const feelGoodUsSrc = await fetchDiscoverMovie({
    with_original_language: "en",
    sort_by: "vote_average.desc",
    "vote_count.gte": 300,
  });
  const feelGoodUs = buildRowNoBlank(feelGoodUsSrc, used, 16);

  const kidsBookUsSrc = await fetchDiscoverMovie({
    with_genres: 10751,
    with_original_language: "en",
  });
  const kidsBookUs = buildRowNoBlank(kidsBookUsSrc, used, 16);
  const romanceWorldSrc = await fetchDiscoverMovie({ with_genres: 10749 });
  const romanceWorld = buildRowNoBlank(romanceWorldSrc, used, 16);
  const periodRomanceTvSrc = await fetchDiscoverTv({
    with_genres: 10749,
    sort_by: "vote_average.desc",
    "vote_count.gte": 200,
  });
  const periodRomanceTv = buildRowNoBlank(periodRomanceTvSrc, used, 16);

  const ninetiesSrc = await fetchDiscoverMovie({
    sort_by: "popularity.desc",
    "primary_release_date.gte": "1990-01-01",
    "primary_release_date.lte": "1999-12-31",
  });
  const nineties = buildRowNoBlank(ninetiesSrc, used, 16);
  const koComedyTvSrc = await fetchDiscoverTv({ with_genres: 35, with_original_language: "ko" });
  const koComedyTv = buildRowNoBlank(koComedyTvSrc, used, 16);
  const girlsNightSrc = await fetchDiscoverMovie({ with_genres: "18,10749" });
  const girlsNight = buildRowNoBlank(girlsNightSrc, used, 16);
  const japanFamilySrc = await fetchDiscoverMovie({ with_original_language: "ja", with_genres: 10751 });
  const japanFamily = buildRowNoBlank(japanFamilySrc, used, 16);
  const comingOfAgeSrc = await fetchDiscoverMovie({ with_genres: 18 });
  const comingOfAge = buildRowNoBlank(comingOfAgeSrc, used, 16);

  const awardsLikeSrc = await fetchDiscoverMovie({
    sort_by: "vote_average.desc",
    "vote_count.gte": 1500,
  });
  const awardsLike = buildRowNoBlank(awardsLikeSrc, used, 16);

  const chillSrc = await fetchDiscoverMovie({ with_genres: "35,10751" });
  const chill = buildRowNoBlank(chillSrc, used, 16);

  const bookishUsSrc = await fetchDiscoverMovie({ with_original_language: "en", with_genres: "18,10751" });
  const bookishUs = buildRowNoBlank(bookishUsSrc, used, 16);

  // ~와 비슷한 콘텐츠 전부 seed 기반 추천으로 생성
  const simCatmask = await buildSimilarRow("울고 싶은 나는 고양이 가면을 쓴다(와) 비슷한 콘텐츠", used, 16);
  const simLastletter = await buildSimilarRow("더 라스트 레터(와) 비슷한 콘텐츠", used, 16);
  const simImsolo = await buildSimilarRow("나는 솔로(와) 비슷한 콘텐츠", used, 16);
  const simLastsong = await buildSimilarRow("라스트 송(와) 비슷한 콘텐츠", used, 16);
  const simSeattle = await buildSimilarRow("시애틀의 잠 못 이루는 밤(와)과 비슷한 콘텐츠", used, 16);
  const simKate = await buildSimilarRow("케이트(와) 비슷한 콘텐츠", used, 16);
  const simSleeping = await buildSimilarRow("잠든 여인(와) 비슷한 콘텐츠", used, 16);
  const simOperation = await buildSimilarRow("오퍼레이션 피날레(와)과 비슷한 콘텐츠", used, 16);
  const simGrimm = await buildSimilarRow("그림 형제: 마르바덴 숲의 전설(와) 비슷한 콘텐츠", used, 16);
  const wwe = await buildSearchRow("WWE", used, 16);

 return (
  <main style={{ background: "#141414", color: "white", paddingBottom: 80 }}>
    <section className="home-hero">
      <Homefridge />
    </section>

    <section className="home-rows">
      <div style={{ maxWidth: 1600, margin: "0 auto", width: "100%" }}>
        <Row title="내가 찜한 리스트" items={picked5} indicatorCount={0} loop={false} />

        <Row title="다인 님이 시청 중인 콘텐츠" items={aRow} indicatorCount={3} showProgress />
        <Row title="꼭 챙겨 보세요! 회원님을 위한 콘텐츠" items={bRow} indicatorCount={7} />
        <Row title="코미디 영화" items={comedyMovies} indicatorCount={7} />

        <Top10Row title="오늘 대한민국의 TOP 10 시리즈" items={top10Series} variant="series" />

        <Row title="미국 영화" items={usMovies} indicatorCount={7} />

        <Row
          title="울고 싶은 나는 고양이 가면을 쓴다(와) 비슷한 콘텐츠"
          items={simCatmask}
          indicatorCount={7}
        />

        <Row title="WWE: 라이브 & 공개 예정" items={wwe} indicatorCount={3} />

        <Top10Row title="오늘 대한민국의 TOP 10 영화" items={top10Movie} variant="movie" />

        <Row title="넷플릭스에 새로 올라온 콘텐츠" items={nowPlaying} indicatorCount={13} />
        <Row title="로맨틱한 할리우드 영화" items={romanceHollywood} indicatorCount={7} />
        <Row title="로맨틱한 한국 코미디 시리즈" items={romanceKoComedyTv} indicatorCount={7} />
        <Row title="로맨스는 역시 K-콘텐츠" items={romanceKoTv} indicatorCount={7} />
        <Row title="작품성을 인정받은 시리즈" items={acclaimedTv} indicatorCount={7} />
        <Row title="더 라스트 레터(와) 비슷한 콘텐츠" items={simLastletter} indicatorCount={7} />
        <Row title="영감을 받고 싶다면?" items={inspiring} indicatorCount={7} />
        <Row title="연인과의 로맨틱한 밤을 위한 영화" items={dateNight} indicatorCount={7} />
        <Row title="도서 원작 영화" items={bookLike} indicatorCount={7} />
        <Row title="빛나는 그녀들의 이야기" items={womenStories} indicatorCount={7} />
        <Row title="나는 솔로(와) 비슷한 콘텐츠" items={simImsolo} indicatorCount={7} />
        <Row title="라스트 송(와)과 비슷한 콘텐츠" items={simLastsong} indicatorCount={7} />
        <Row title="시애틀의 잠 못 이루는 밤(와)과 비슷한 콘텐츠" items={simSeattle} indicatorCount={7} />
        <Row title="언제나 사랑받는 로맨스 콘텐츠" items={evergreenRomance} indicatorCount={7} />
        <Row title="느낌 좋은 미국 영화" items={feelGoodUs} indicatorCount={7} />
        <Row title="아동 도서 원작 미국 영화" items={kidsBookUs} indicatorCount={6} />
        <Row title="로맨틱한 해외 영화" items={romanceWorld} indicatorCount={7} />
        <Row title="로맨틱한 시대극 시리즈" items={periodRomanceTv} indicatorCount={7} />
        <Row title="1990년대 영화" items={nineties} indicatorCount={7} />
        <Row title="우정에 관한 한국 TV 코미디" items={koComedyTv} indicatorCount={4} />
        <Row title="여자들끼리 즐기는 콘텐츠" items={girlsNight} indicatorCount={7} />
        <Row title="케이트(와) 비슷한 콘텐츠" items={simKate} indicatorCount={7} />
        <Row title="잠든 여인(와) 비슷한 콘텐츠" items={simSleeping} indicatorCount={7} />
        <Row title="오퍼레이션 피날레(와)과 비슷한 콘텐츠" items={simOperation} indicatorCount={7} />
        <Row title="일본 가족 영화" items={japanFamily} indicatorCount={7} />
        <Row title="그림 형제: 마르바덴 숲의 전설(와) 비슷한 콘텐츠" items={simGrimm} indicatorCount={7} />
        <Row title="어른이 되는 중" items={comingOfAge} indicatorCount={7} />
        <Row title="골든글로브 수상 영화" items={awardsLike} indicatorCount={7} />
        <Row title="느긋한 휴식을 위해" items={chill} indicatorCount={7} />
        <Row title="도서 원작 느낌 좋은 미국 영화" items={bookishUs} indicatorCount={7} />
      </div>
    </section>
  </main>
 )
};
