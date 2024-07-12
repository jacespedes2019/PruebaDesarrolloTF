from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.schema import UsuarioCreate, Usuario, UsuarioWithFavoritos
from app.database import get_db
from app.repositories import UserRepository
from app.security import create_access_token, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES, timedelta, status
from app.models import Usuario as UsuarioModel

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=Usuario)
def create_user(user: UsuarioCreate, db: Session = Depends(get_db)):
    db_user = UserRepository.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return UserRepository.create_user(db=db, user=user.dict())

@router.post("/token")
def login_for_access_token(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = UserRepository.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UsuarioWithFavoritos)
def read_users_me(current_user: UsuarioModel = Depends(get_current_user)):
    return current_user
