"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import MovieDropdown from "./components/MovieDropdown";
import { Button } from "@/components/ui/button";
import { SparklesIcon } from "lucide-react";
import { ModeToggle } from "./components/ModeToggle";
import { RecommendedMovies } from "./components/RecommendedMovies";

interface Movie {
  id: number;
  title: string;
  poster_url: string;
}

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<string>("");
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  const handleReset = () => {
    setMovies([]);
    setSelectedMovie("");
    setRecommendations([]);
    setLoadingRecommendations(false);
    setError(null);
  };

  const handleClick = async () => {
    let movie = movies.find((m) => m.title === selectedMovie);

    if (!movie) {
      try {
        const searchRes = await axios.get<Movie[]>(
          `/api/get-movies?query=${encodeURIComponent(selectedMovie)}&limit=1`
        );
        movie = searchRes.data.find((m) => m.title === selectedMovie);

        if (!movie) {
          setError("Selected movie not found");
          return;
        }
      } catch (err) {
        setError("Failed to find movie");
        return;
      }
    }

    setLoadingRecommendations(true);
    try {
      const res = await axios.get(`/api/recommend-movies?movie_id=${movie.id}`);
      setRecommendations(res.data);
    } catch (err) {
      setError("Failed to load recommendations");
    } finally {
      setLoadingRecommendations(false);
    }
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get<Movie[]>("/api/get-movies");
        setMovies(res.data);
      } catch (err) {
        setError("Failed to load movies");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <>
      <div className="flex justify-end p-4">
        <ModeToggle />
      </div>
      <div className="container mx-auto p-6">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <>
            <MovieDropdown
              value={selectedMovie}
              onValueChange={setSelectedMovie}
            />
            <div className="flex flex-row gap-2">
              <Button
                variant="outline"
                className="mt-2"
                disabled={selectedMovie === ""}
                onClick={handleClick}
              >
                <SparklesIcon className="mr-1" />
                Click to see recommendations
              </Button>
              <Button
                variant="outline"
                className="mt-2"
                onClick={handleReset}
                disabled={
                  loadingRecommendations || recommendations.length === 0
                }
              >
                Reset
              </Button>
            </div>
          </>
        )}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {loadingRecommendations ? (
            <div className="col-span-full text-center py-8">
              Loading recommendations...
            </div>
          ) : (
            recommendations.map((movie, i) => (
              <div
                key={movie.id}
                className="animate-in fade-in duration-500"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <RecommendedMovies {...movie} />
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
