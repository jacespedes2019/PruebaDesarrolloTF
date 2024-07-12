from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import declarative_base, relationship
from app.database import SessionLocal, engine, Base

# Definición del modelo Usuario
class Usuario(Base):
    __tablename__ = 'usuarios'

    id = Column(Integer, primary_key=True, index=True)
    password = Column(String)
    nombre = Column(String)
    identificacion = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)

    # Relación uno a muchos con Favorito
    favoritos = relationship('Favorito', back_populates='usuario')

# Definición del modelo Favorito para los cómics favoritos de los usuarios
class Favorito(Base):
    __tablename__ = 'favoritos'

    id = Column(Integer, primary_key=True, index=True)
    comic_id = Column(Integer, index=True)
    title = Column(String)
    description = Column(String, nullable=True)
    image = Column(String)
    usuario_id = Column(Integer, ForeignKey('usuarios.id'))

    # Relación muchos a uno con Usuario
    usuario = relationship('Usuario', back_populates='favoritos')

# Crear las tablas en la base de datos
# Base.metadata.create_all(bind=engine)