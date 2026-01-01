import json
import re
from collections import Counter

MIN_OVERVIEW_LEN = 50
MAX_VOCAB_SIZE = 20000
MIN_WORD_FREQ = 5

def normalize_text(text):
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

with open("backend/data/tmdb_movies_raw.json", "r") as f:
    raw = json.load(f)

cleaned = []

for m in raw:
    overview = m.get("overview", "")
    genres = m.get("genres", [])

    if not overview or len(overview) < MIN_OVERVIEW_LEN:
        continue
    if not genres:
        continue

    cleaned.append({
        "id": m["id"],
        "title": m["title"],
        "overview": normalize_text(overview),
        "genres": genres,
        "keywords": m.get("keywords", []),
        "release_date": m.get("release_date")
    })

word_counter = Counter()

for m in cleaned:
    word_counter.update(m["overview"].split())

vocab = {
    w for w, c in word_counter.items()
    if c >= MIN_WORD_FREQ
}

vocab = set(list(vocab)[:MAX_VOCAB_SIZE])

for m in cleaned:
    m["overview"] = " ".join(
        w for w in m["overview"].split() if w in vocab
    )

with open("backend/data/tmdb_movies_processed.json", "w") as f:
    json.dump(cleaned, f, indent=2)
