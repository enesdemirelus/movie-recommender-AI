"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Movie {
  id: number;
  title: string;
  poster_url?: string;
}

interface MovieDropdownProps {
  value?: string;
  onValueChange?: (value: string) => void;
}

export function MovieDropdown({
  value = "",
  onValueChange,
}: MovieDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const [movies, setMovies] = React.useState<Movie[]>([]);
  const [query, setQuery] = React.useState("");
  const [selectedMovie, setSelectedMovie] = React.useState<Movie | undefined>();

  React.useEffect(() => {
    if (!open) return;

    const controller = new AbortController();

    fetch(`/api/get-movies?query=${encodeURIComponent(query)}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then(setMovies)
      .catch(() => {});

    return () => controller.abort();
  }, [query, open]);

  // Update selectedMovie when value changes or when it's found in movies
  React.useEffect(() => {
    if (!value) {
      setSelectedMovie(undefined);
      return;
    }
    const found = movies.find((m) => m.title === value);
    if (found) {
      setSelectedMovie(found);
    }
  }, [value, movies]);

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === value ? "" : currentValue;
    onValueChange?.(newValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full max-w-[1600px] h-[80px] justify-between px-4"
        >
          {value ? (
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {selectedMovie?.poster_url && (
                <img
                  src={selectedMovie.poster_url}
                  alt={selectedMovie.title}
                  className="w-12 h-16 object-cover rounded-md border border-border shrink-0"
                />
              )}
              <span className="truncate">{selectedMovie?.title}</span>
            </div>
          ) : (
            "Select movie..."
          )}
          <ChevronsUpDown className="opacity-50 ml-auto shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) p-0"
        align="start"
      >
        <Command>
          <CommandInput
            placeholder="Search movie..."
            className="h-9"
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>No movie found.</CommandEmpty>
            <CommandGroup>
              {movies.map((movie) => (
                <CommandItem
                  key={movie.id}
                  value={movie.title}
                  onSelect={handleSelect}
                  className="py-3 px-4 h-auto"
                >
                  <div className="flex items-center gap-4 w-full">
                    {movie.poster_url && (
                      <img
                        src={movie.poster_url}
                        alt={movie.title}
                        className="w-12 h-16 object-cover rounded-md border border-border shrink-0"
                      />
                    )}
                    <span className="flex-1 truncate">{movie.title}</span>
                    <Check
                      className={cn(
                        "ml-auto shrink-0",
                        value === movie.title ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default MovieDropdown;
