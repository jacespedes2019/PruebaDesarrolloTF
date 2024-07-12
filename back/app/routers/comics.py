from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.schema import FavoritoCreate, Favorito
from app.database import get_db
from app.repositories import ComicRepository
from app.security import get_current_user
from app.models import Usuario

router = APIRouter(prefix="/comics", tags=["comics"])

@router.get("/")
def list_comics(page: int = Query(0, ge=0), limit: int = Query(20, gt=0)):
    return ComicRepository.fetch_comics(page=page, limit=limit)

@router.get("/total")
def get_total_comics_and_pages(limit: int = 20):
    return ComicRepository.get_total_comics_and_pages(limit=limit)

@router.get("/{comic_id}")
def comic_detail(comic_id: int):
    return ComicRepository.fetch_comic_details(comic_id=comic_id)

@router.post("/favorites/", response_model=Favorito)
def add_to_favorites(favorite: FavoritoCreate, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    favorite_data = favorite.dict()
    favorite_data['usuario_id'] = current_user.id
    return ComicRepository.add_comic_to_favorites(db=db, favorite=favorite_data)
