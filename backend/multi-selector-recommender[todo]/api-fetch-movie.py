import os
from dotenv import load_dotenv
import tmdbsimple as tmdb
import json
import time

load_dotenv()
tmdb.API_KEY = os.getenv("TMDB_API")

discover = tmdb.Discover()

all_movies = []


for page in range(1, 21):
    response = discover.movie(
        sort_by="popularity.desc",
        primary_release_date_gte="1990-01-01",
        page=page
    )
    all_movies.extend(response["results"])
    time.sleep(0.25)

dataset = []

for idx, m in enumerate(all_movies, start=1):
    movie = tmdb.Movies(m["id"])
    details = movie.info()
    keywords = movie.keywords()

    if not details.get("overview"):
        continue

    poster_path = details.get("poster_path")
    poster_url = f"https://image.tmdb.org/t/p/w500{poster_path}" if poster_path else None

    dataset.append({
        "id": details["id"],
        "title": details["title"],
        "overview": details["overview"],
        "genres": [g["name"] for g in details.get("genres", [])],
        "keywords": [k["name"] for k in keywords.get("keywords", [])],
        "release_date": details.get("release_date"),
        "popularity": details.get("popularity"),
        "vote_average": details.get("vote_average"),
        "poster_url": poster_url
    })



with open("tmdb_movies_raw.json", "w") as f:
    json.dump(dataset, f, indent=2)

