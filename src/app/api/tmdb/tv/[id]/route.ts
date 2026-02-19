import { NextResponse } from "next/server";

export async function GET(req: Request, context: any) {
  try {
    const TMDB_KEY = process.env.TMDB_API_KEY;

    // Next 버전에 따라 params가 Promise일 수도, 객체일 수도 있어서 둘 다 대응해요
    const params = await (typeof context?.params?.then === "function"
      ? context.params
      : Promise.resolve(context.params));

    const id = params?.id;

    if (!TMDB_KEY) {
      console.error("[TMDB] TMDB_API_KEY is missing");
      return NextResponse.json(
        { error: "TMDB_API_KEY is missing" },
        { status: 500 }
      );
    }

    if (!id) {
      console.error("[TMDB] params.id is missing", { params });
      return NextResponse.json(
        { error: "params.id is missing", params },
        { status: 500 }
      );
    }

    const url =
      `https://api.themoviedb.org/3/tv/${id}` +
      `?api_key=${TMDB_KEY}` +
      `&language=ko-KR` +
      `&append_to_response=videos,credits,recommendations`;

    const res = await fetch(url, { cache: "no-store" });
    const bodyText = await res.text();

    if (!res.ok) {
      console.error("[TMDB] request failed", {
        status: res.status,
        bodyText,
      });

      return NextResponse.json(
        { error: "TMDB request failed", status: res.status, body: bodyText },
        { status: res.status }
      );
    }

    return NextResponse.json(JSON.parse(bodyText));
  } catch (e) {
    console.error("[TMDB] route crashed", e);
    return NextResponse.json(
      { error: "Server Error", message: String(e) },
      { status: 500 }
    );
  }
}
