from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Modelo Pydantic para Usuario
class UsuarioBase(BaseModel):
    password: str
    nombre: str
    identificacion: str
    email: str

class UsuarioCreate(UsuarioBase):
    pass

class UsuarioUpdate(UsuarioBase):
    pass

class UsuarioInDBBase(UsuarioBase):
    id: int

    class Config:
        orm_mode = True

class Usuario(UsuarioInDBBase):
    pass

# Modelo Pydantic para Favorito
class FavoritoBase(BaseModel):
    comic_id: int
    title: str
    description: Optional[str] = None
    image: Optional[str] = None

class FavoritoCreate(FavoritoBase):
    pass

class FavoritoUpdate(FavoritoBase):
    pass

class FavoritoInDBBase(FavoritoBase):
    id: int
    usuario_id: int

    class Config:
        orm_mode = True

class Favorito(FavoritoInDBBase):
    pass

# Modelo Pydantic para Lista de Favoritos
class FavoritosList(BaseModel):
    items: List[Favorito]

# Modelo Pydantic para Usuario con Favoritos
class UsuarioWithFavoritos(UsuarioInDBBase):
    favoritos: List[Favorito] = []

class UsuariosList(BaseModel):
    items: List[UsuarioWithFavoritos]
