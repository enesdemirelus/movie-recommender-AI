import rawVectors from "@/data/movie_vectors.json";
import rawMovies from "@/data/movies_meta.json";
import { NextResponse } from "next/server";

const movieVectors = rawVectors as number[][];
const movies = rawMovies as MovieMeta[];

type MovieMeta = {
  id: number;
  title: string;
  poster_path?: string | null;
};

type ScoreItem = {
  i: number;
  score: number;
};

function dot(a: number[], b: number[]) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const movieId = searchParams.get("movie_id");

  if (!movieId) {
    return NextResponse.json({ error: "movie_id required" }, { status: 400 });
  }

  const idx = movies.findIndex((m) => String(m.id) === movieId);
  if (idx === -1) {
    return NextResponse.json({ error: "movie not found" }, { status: 404 });
  }

  const target = movieVectors[idx];

  const scores = movieVectors.map((vec, i) => ({
    i,
    score: dot(vec, target),
  }));

  scores.sort((a, b) => b.score - a.score);

  const recommendations = scores.slice(1, 11).map((s) => movies[s.i]);

  return NextResponse.json(recommendations);
}
