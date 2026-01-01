from dotenv import load_dotenv
import tmdbsimple as tmdb
import os
import pandas as pd
import time
from urllib.parse import quote

load_dotenv()

tmdb.API_KEY = os.getenv('TMDB_API')
tmdb.REQUESTS_TIMEOUT = 5

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(SCRIPT_DIR, "data", "movies_meta.csv")

df = pd.read_csv(CSV_PATH)
total_rows = len(df)

for index, row in df.iterrows():
    movie_id = row['id']
    movie_title = row['title']
    
    progress = ((index + 1) / total_rows) * 100
    print(f"Progress: {progress:.2f}% ({index + 1}/{total_rows}) - Processing: {movie_title} (ID: {movie_id})")
    
    try:
        identity = tmdb.Movies(movie_id)
        response = identity.info()
        poster_path = response.get('poster_path', '')
        
        if poster_path:
            df.at[index, 'poster_url'] = f"https://image.tmdb.org/t/p/w500/{poster_path}"
        else:
            encoded_title = quote(movie_title)
            df.at[index, 'poster_url'] = f"https://placehold.co/600x400?text={encoded_title}"
            print(f"  Warning: No poster found for {movie_title}, using placeholder")
    except Exception as e:
        encoded_title = quote(movie_title)
        df.at[index, 'poster_url'] = f"https://placehold.co/600x400?text={encoded_title}"
        print(f"  Error fetching poster for {movie_title}: {str(e)} - Using placeholder")
    
    time.sleep(0.25)
    
    
df.to_csv(CSV_PATH, index=False)
print(f"Saved updated CSV with poster_url to: {CSV_PATH}")