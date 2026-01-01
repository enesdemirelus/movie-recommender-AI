import pandas as pd
import re
import ast
import numpy as np
from sentence_transformers import SentenceTransformer
import tensorflow as tf


def extract_names(text):
    data = ast.literal_eval(text)
    return " ".join([d["name"].lower().replace(" ", "") for d in data])

def extract_top_cast(text, n=3):
    data = ast.literal_eval(text)
    return " ".join([d["name"].lower().replace(" ", "") for d in data[:n]])

def extract_director(text):
    data = ast.literal_eval(text)
    for d in data:
        if d["job"] == "Director":
            return d["name"].lower().replace(" ", "")
    return ""

def clean_text(text):
    text = str(text).lower()
    text = re.sub(r"[^a-z0-9\s]", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


movies_df = pd.read_csv("backend/single-selector-recommender/data/tmdb_5000_movies.csv")
credits_df = pd.read_csv("backend/single-selector-recommender/data/tmdb_5000_credits.csv")

movies_df["overview"] = movies_df["overview"].fillna("").apply(clean_text)
movies_df["tagline"] = movies_df["tagline"].fillna("").apply(clean_text)
movies_df["title"] = movies_df["title"].fillna("").apply(clean_text)
movies_df["genres"] = movies_df["genres"].apply(extract_names)
movies_df["keywords"] = movies_df["keywords"].apply(extract_names)
credits_df["cast"] = credits_df["cast"].apply(extract_top_cast)
credits_df["crew"] = credits_df["crew"].apply(extract_director)

credits_df = credits_df.drop(columns=["title"])

movies_df = movies_df.merge(
    credits_df,
    left_on="id",
    right_on="movie_id",
    how="left"
)

movies_df["content"] = (
    movies_df["title"] + " " +
    movies_df["overview"] + " " +
    movies_df["genres"] + " " +
    movies_df["keywords"] + " " +
    movies_df["cast"] + " " +
    movies_df["crew"]
)

movies_df[["title", "content"]].head()

model = SentenceTransformer("all-MiniLM-L6-v2")

movie_vectors = model.encode(
    movies_df["content"].tolist(),
    normalize_embeddings=True
)

np.save("movie_vectors.npy", movie_vectors)
movies_df[["id", "title"]].to_csv("movies_meta.csv", index=False)

# def recommend(title, n=10):
#     idx = movies_df.index[movies_df["title"] == title][0]
#     target_vec = movie_vectors[idx]
#     scores = np.dot(movie_vectors, target_vec)
#     scores = scores.numpy()
#     top_indices = scores.argsort()[::-1][1:n+1]
#     return movies_df.iloc[top_indices][["title"]]


# print(recommend("the avengers", n=10))