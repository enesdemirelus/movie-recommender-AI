# Movie Recommender AI

A personal, end-to-end movie recommendation project that combines a **modern Next.js UI** with **precomputed embedding vectors** to return **10 similar movies** for a selected title.

This repo is intentionally **not** written as a public “how to run it” tutorial — it’s a showcase of the system design, UX, and recommendation approach.

## Preview

| Screen                    | Light mode                                                                | Dark mode                                                               |
| ------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **Main page**             | ![Main page (light)](./docs/images/main-light.png)                        | ![Main page (dark)](./docs/images/main-dark.png)                        |
| **Searching movie**       | ![Searching movie (light)](./docs/images/search-light.png)                | ![Searching movie (dark)](./docs/images/search-dark.png)                |
| **Movie recommendations** | ![Movie recommendations (light)](./docs/images/recommendations-light.png) | ![Movie recommendations (dark)](./docs/images/recommendations-dark.png) |
| **More movie details**    | ![More movie details (light)](./docs/images/details-light.png)            | ![More movie details (dark)](./docs/images/details-dark.png)            |

## Highlights

- **Fast recommendations**: similarity search over precomputed vectors (no heavy model inference at request time)
- **Clean UX**: search + select a movie, then browse ranked recommendations
- **Practical architecture**: Next.js App Router API routes power the app with local datasets
- **Data pipeline included**: Python scripts to generate embeddings + metadata from the TMDB 5000 dataset

## What’s inside

- **Frontend**: `frontend/movie-recommender-ai/`

  - **UI**: Next.js (App Router) + Tailwind + shadcn/ui
  - **Local data**: `frontend/movie-recommender-ai/data/`
    - `movies_meta.json`: movie id/title (+ optional poster path)
    - `movie_vectors.json`: embedding vectors aligned by index with `movies_meta.json`
  - **Server routes (API)**: `frontend/movie-recommender-ai/app/api/`
    - `get-movies`: search/list titles
    - `recommend-movies`: vector similarity ranking
    - `get-movie-details`: movie detail enrichment (via TMDB when configured)

- **Backend (data work)**: `backend/`
  - `single-selector-recommender/`: generates embeddings + metadata from the TMDB 5000 dataset
  - `multi-selector-recommender[todo]/`: **TODO** — planned multi-select recommendation track. I’ll implement a **content-based recommendation** approach here (blending/aggregating the selected movies’ content vectors) to produce recommendations from multiple picks.

## How recommendations work

For a chosen movie with vector \(v\):

- Compute a similarity score against every other movie vector \(v_i\) using dot product: \(score_i = v \cdot v_i\)
- Sort by score descending
- Return the top 10 (excluding the selected title)

## Data & generation notes

The UI uses the JSON datasets in `frontend/movie-recommender-ai/data/`. The Python pipeline in `backend/single-selector-recommender/` is responsible for producing the underlying embeddings/metadata used during development.

## Credits

- Dataset: TMDB 5000 movies/credits
- TMDB API for poster images and more movie details.
