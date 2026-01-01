import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ExternalLink } from "lucide-react";

interface Movie {
  id: number;
  title: string;
  poster_url: string;
}

export interface MovieDetails {
  movieId: number;
  movieOverview: string;
  genres: string[];
  spokenLanguages: string[];
  releaseDate: string;
  productionCountries: string[];
  revenue: number;
  imdbId: string | null;
}

export function RecommendedMovies({ id, title, poster_url }: Movie) {
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/get-movie-details?movie_id=${id}`);
        const data = await response.json();
        setMovieDetails(data);
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovieDetails();
  }, [id]);

  const handleTMDBClick = () => {
    window.open(`https://www.themoviedb.org/movie/${id}`, "_blank");
  };

  const handleIMDBClick = () => {
    if (movieDetails?.imdbId) {
      window.open(
        `https://www.imdb.com/title/${movieDetails.imdbId}`,
        "_blank"
      );
    }
  };

  const formatRevenue = (revenue: number) => {
    if (revenue === 0) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(revenue);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="group relative overflow-hidden rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-black/20 cursor-pointer">
          <Image
            src={poster_url}
            alt={title}
            width={200}
            height={300}
            className={`w-full h-auto rounded-lg object-cover transition-all duration-500 group-hover:brightness-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          <DialogDescription className="sr-only">
            Movie details for {title}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : movieDetails ? (
          <div className="flex gap-4">
            {/* Poster Image */}
            <div className="shrink-0">
              <Image
                src={poster_url}
                alt={title}
                width={150}
                height={225}
                className="rounded-lg object-cover shadow-md"
              />
            </div>

            {/* Movie Details */}
            <div className="flex-1 space-y-3">
              {/* Release Date and Revenue */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground mb-1">
                    Release Date
                  </h4>
                  <p className="text-sm">
                    {movieDetails.releaseDate
                      ? new Date(movieDetails.releaseDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground mb-1">
                    Revenue
                  </h4>
                  <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {formatRevenue(movieDetails.revenue)}
                  </p>
                </div>
              </div>

              {/* Genres */}
              {movieDetails.genres && movieDetails.genres.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground mb-1.5">
                    Genres
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {movieDetails.genres.map((genre) => (
                      <Badge
                        key={genre}
                        variant="secondary"
                        className="text-xs"
                      >
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Overview */}
              {movieDetails.movieOverview && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground mb-1.5">
                    Overview
                  </h4>
                  <p className="text-xs leading-relaxed">
                    {movieDetails.movieOverview}
                  </p>
                </div>
              )}

              {/* Production Countries and Languages */}
              <div className="grid grid-cols-2 gap-3">
                {movieDetails.productionCountries &&
                  movieDetails.productionCountries.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground mb-1.5">
                        Countries
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {movieDetails.productionCountries.map((country) => (
                          <Badge
                            key={country}
                            variant="outline"
                            className="text-xs"
                          >
                            {country}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                {movieDetails.spokenLanguages &&
                  movieDetails.spokenLanguages.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground mb-1.5">
                        Languages
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {movieDetails.spokenLanguages.map((language) => (
                          <Badge
                            key={language}
                            variant="outline"
                            className="text-xs"
                          >
                            {language}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Failed to load movie details
          </div>
        )}

        <DialogFooter className="gap-2">
          {movieDetails?.imdbId && (
            <Button
              variant="outline"
              onClick={handleIMDBClick}
              className="flex-1"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View on IMDb
            </Button>
          )}
          <Button onClick={handleTMDBClick} className="flex-1">
            <ExternalLink className="mr-2 h-4 w-4" />
            View on TMDB
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
