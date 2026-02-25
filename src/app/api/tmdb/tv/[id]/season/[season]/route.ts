import { NextResponse } from "next/server";

export async function GET(req: Request, context: any) {
  try {
    const TMDB_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

    const params = await (typeof context?.params?.then === "function"
      ? context.params
      : Promise.resolve(context.params));

    const id = params?.id;
    const season = params?.season;

    if (!TMDB_KEY) {
      console.error("[TMDB] TMDB_API_KEY is missing");
      return NextResponse.json(
        { error: "TMDB_API_KEY is missing" },
        { status: 500 }
      );
    }

    if (!id || !season) {
      console.error("[TMDB] params missing", { params });
      return NextResponse.json(
        { error: "params missing", params },
        { status: 500 }
      );
    }

    const url =
      `https://api.themoviedb.org/3/tv/${id}/season/${season}` +
      `?api_key=${TMDB_KEY}` +
      `&language=ko-KR`;

    const res = await fetch(url, { cache: "no-store" });
    const bodyText = await res.text();

    if (!res.ok) {
      console.error("[TMDB] season request failed", {
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
    console.error("[TMDB] season route crashed", e);
    return NextResponse.json(
      { error: "Server Error", message: String(e) },
      { status: 500 }
    );
  }
}
