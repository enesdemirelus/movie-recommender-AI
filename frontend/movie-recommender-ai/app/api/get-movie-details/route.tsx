import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const movieId = searchParams.get("movie_id");

    if (!movieId) {
      return NextResponse.json(
        { error: "movie_id is required" },
        { status: 400 }
      );
    }

    if (!process.env.TMDB_API) {
      return NextResponse.json(
        { error: "TMDB API key not configured" },
        { status: 500 }
      );
    }

    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.TMDB_API}`
    );

    const data = response.data;

    // Extract only the required fields
    const movieDetails = {
      movieId: data.id,
      movieOverview: data.overview,
      genres: data.genres?.map((genre: { name: string }) => genre.name) || [],
      spokenLanguages:
        data.spoken_languages?.map(
          (lang: { name: string; english_name: string }) =>
            lang.english_name || lang.name
        ) || [],
      releaseDate: data.release_date,
      productionCountries:
        data.production_countries?.map(
          (country: { name: string }) => country.name
        ) || [],
      revenue: data.revenue || 0,
      imdbId: data.imdb_id,
    };

    return NextResponse.json(movieDetails);
  } catch (error) {
    console.error("Error fetching movie details:", error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          error:
            error.response?.data?.status_message ||
            "Failed to fetch movie details",
        },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
