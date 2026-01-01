# Backend (data prep)

This repo’s backend folder is currently a **collection of Python scripts** used to fetch/clean movie data and generate embeddings used by the frontend.

The frontend app does **not** call these scripts at runtime — it uses prebuilt JSON datasets committed under `frontend/movie-recommender-ai/data/`.

## Structure

- `single-selector-recommender/`
  - `tokenizer.py`: builds text features from the TMDB 5000 dataset and generates embedding vectors
  - `add-movie-posters.py`: enriches the metadata CSV with TMDB poster URLs (or a placeholder)
  - `data/`: raw TMDB 5000 CSVs + local outputs

- `multi-selector-recommender[todo]/` (WIP)
  - `api-fetch-movie.py`: fetches popular movies + details from TMDB into JSON
  - `clean-json.py`: cleans/filters raw JSON and normalizes overviews (note: paths may need tweaking)
  - `data/`: raw/processed JSON snapshots

## Requirements (suggested)

There is no pinned `requirements.txt` yet. If you plan to run these scripts, you’ll typically need:

- `pandas`, `numpy`
- `python-dotenv`
- `tmdbsimple`
- `sentence-transformers`

`tokenizer.py` also imports `tensorflow` (depending on your environment, SentenceTransformers may work without you using TF directly, but the import is there).

## Generating vectors + metadata (single selector)

The recommender used by the frontend is currently powered by vectors generated in:

- `backend/single-selector-recommender/tokenizer.py`

Important: that script uses hard-coded paths like `backend/single-selector-recommender/...`, and writes outputs to the **repo root**, so run it from the repository root:

```bash
python backend/single-selector-recommender/tokenizer.py
```

Outputs (written to repo root):

- `movie_vectors.npy`
- `movies_meta.csv`

## Adding poster URLs

This script reads `backend/single-selector-recommender/data/movies_meta.csv` and adds a `poster_url` column by calling TMDB:

```bash
TMDB_API=your_tmdb_api_key_here python backend/single-selector-recommender/add-movie-posters.py
```

If TMDB doesn’t return a poster, it falls back to a `placehold.co` image with the title.

