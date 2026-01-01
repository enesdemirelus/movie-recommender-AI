# Movie Recommender AI

A small movie recommender web app built with **Next.js (App Router)** on the frontend and a couple of **Python data-prep scripts** on the backend.

The current UI lets you pick a movie and returns **10 similar movies** using a precomputed embedding vector for each title.

## What’s in this repo

- **Frontend**: `frontend/movie-recommender-ai/` (Next.js + Tailwind + Radix UI)

  - Uses local datasets in `frontend/movie-recommender-ai/data/`:
    - `movies_meta.json`: movie id/title (+ optional poster path)
    - `movie_vectors.json`: embedding vectors aligned by index with `movies_meta.json`
  - API routes (server-side):
    - `GET /api/get-movies` (search / list)
    - `GET /api/recommend-movies?movie_id=...` (dot-product similarity)
    - `GET /api/get-movie-details?movie_id=...` (TMDB lookup, requires API key)

- **Backend**: `backend/`
  - `single-selector-recommender/`: generates embeddings + metadata from the TMDB 5000 dataset.
  - `multi-selector-recommender[todo]/`: WIP scripts to fetch/clean TMDB content.

## Quickstart (Frontend)

Prereqs:

- Node.js 18+ recommended

From the frontend directory:

```bash
cd frontend/movie-recommender-ai
npm install
npm run dev
```

Open `http://localhost:3000`.

### TMDB API key (optional, but recommended)

The app can run without TMDB, but the “movie details” call will fail unless you set an API key.

Create `frontend/movie-recommender-ai/.env.local`:

```bash
TMDB_API=your_tmdb_api_key_here
```

## Backend notes (data generation)

The frontend ships with prebuilt JSON datasets, so **you don’t need the backend to run the app**.

If you want to regenerate vectors/metadata:

- `backend/single-selector-recommender/tokenizer.py`
  - Reads CSVs from `backend/single-selector-recommender/data/`
  - Builds a text “content” field (title + overview + genres + keywords + cast + director)
  - Encodes it with `SentenceTransformer("all-MiniLM-L6-v2")`
  - Writes outputs to the repo root:
    - `movie_vectors.npy`
    - `movies_meta.csv`

See `backend/README.md` for more details and suggested Python dependencies.

## How recommendations work (today)

Given a selected movie:

- Find its vector \(v\)
- Score every other movie by dot product \(score_i = v \cdot v_i\)
- Sort descending and return the top 10 (excluding the movie itself)

## Repo housekeeping

- `movie_vectors.npy` / `movies_meta.csv` at the repo root are generated artifacts used during development.
- The frontend uses JSON equivalents in `frontend/movie-recommender-ai/data/`.
