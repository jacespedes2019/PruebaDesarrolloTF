from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from app.schema import FavoritoCreate, Favorito, FavoritosList
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

@router.delete("/favorites/{comic_id}", response_model=dict)
def remove_from_favorites(comic_id: int, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    success = ComicRepository.remove_comic_from_favorites(db=db, user_id=current_user.id, comic_id=comic_id)
    if not success:
        raise HTTPException(status_code=404, detail="Comic not found in favorites")
    return {"detail": "Comic removed from favorites"}

@router.get("/favorites/", response_model=FavoritosList)
def get_user_favorites(db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    favorites = ComicRepository.get_user_favorites(db=db, user_id=current_user.id)
    return {"favoritos": favorites}