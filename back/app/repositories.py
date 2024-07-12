import requests
from app.security import verify_password
from sqlalchemy.orm import Session
from app.models import Usuario, Favorito
import hashlib
import time

PRIVATE_API_KEY = "d00e75ecabecfcf0504f67018c490cb528a15774"
PUBLIC_API_KEY = "b53ca958fa0a20f0f9564adf22a61fd0"

class UserRepository:
    @staticmethod
    def get_user(db: Session, user_id: int):
        return db.query(Usuario).filter(Usuario.id == user_id).first()

    @staticmethod
    def create_user(db: Session, user: dict):
        db_user = Usuario(**user)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Usuario:
        user = db.query(Usuario).filter(Usuario.email == email).first()
        return user
    
    @staticmethod
    def authenticate_user(db: Session, email: str, password: str):
        user = UserRepository.get_user_by_email(db, email)
        if not user:
            return False
        if not verify_password(password, user.password):
            return False
        return user

class ComicRepository:
    
    @staticmethod
    def generate_hash():
        ts = str(time.time())
        to_hash = ts + PRIVATE_API_KEY + PUBLIC_API_KEY
        hash_md5 = hashlib.md5(to_hash.encode()).hexdigest()
        return ts, hash_md5
    
    @staticmethod
    def fetch_comics(limit: int = 20):
        ts, hash_md5 = ComicRepository.generate_hash()
        params = {
            'apikey': PUBLIC_API_KEY,
            'ts': ts,
            'hash': hash_md5,
            'limit': limit
        }
        url = "https://gateway.marvel.com/v1/public/comics"
        response = requests.get(url, params=params)
        data = response.json()
        print(data)
        comics = []
        if 'data' in data and 'results' in data['data']:
            for comic in data['data']['results']:
                simplified_comic = {
                    'id': comic['id'],
                    'title': comic['title'],
                    'image': comic['thumbnail']['path'] + '.' + comic['thumbnail']['extension'] if 'thumbnail' in comic else 'No image available'
                }
                comics.append(simplified_comic)
        return comics

    @staticmethod
    def fetch_comic_details(comic_id: int):
        ts, hash_md5 = ComicRepository.generate_hash()
        params = {
            'apikey': PUBLIC_API_KEY,
            'ts': ts,
            'hash': hash_md5
        }
        url = f"https://gateway.marvel.com/v1/public/comics/{comic_id}"
        response = requests.get(url, params=params)
        comic_data = response.json()
        if 'data' in comic_data and 'results' in comic_data['data']:
            comic = comic_data['data']['results'][0]
            simplified_comic = {
                'id': comic['id'],
                'title': comic['title'],
                'variantDescription': comic.get('variantDescription', ''),
                'description': comic.get('description', ''),
                'format': comic.get('format', ''),
                'pageCount': comic.get('pageCount', ''),
                'series': comic['series']['name'] if 'series' in comic else '',
                'dates': [{ 'type': date['type'], 'date': date['date'] } for date in comic.get('dates', [])],
                'prices': [{ 'type': price['type'], 'price': price['price'] } for price in comic.get('prices', [])],
                'image': comic['thumbnail']['path'] + '.' + comic['thumbnail']['extension'] if 'thumbnail' in comic else '',
                'creators': [creator['name'] for creator in comic['creators']['items']],
                'characters': [character['name'] for character in comic['characters']['items']]
            }
            return simplified_comic
        return {}

    @staticmethod
    def add_comic_to_favorites(db: Session, favorite: dict):
        db_favorite = Favorito(**favorite)
        db.add(db_favorite)
        db.commit()
        db.refresh(db_favorite)
        return db_favorite