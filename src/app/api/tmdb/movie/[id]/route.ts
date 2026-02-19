import { NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!TMDB_API_KEY) {
    return NextResponse.json(
      { error: "TMDB_KEY is missing. Check .env.local." },
      { status: 500 }
    );
  }

  const url =
    `https://api.themoviedb.org/3/movie/${id}` +
    `?api_key=${TMDB_API_KEY}` +
    `&language=ko-KR` +
    `&append_to_response=videos,credits,recommendations`;

  const res = await fetch(url, { cache: "no-store" });
  const text = await res.text();

  // ✅ TMDB가 404면 404로 그대로 내려보내기
  if (!res.ok) {
    return NextResponse.json(
      { error: "TMDB request failed", tmdbStatus: res.status, body: text },
      { status: res.status }
    );
  }

  return new NextResponse(text, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
