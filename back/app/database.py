from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
import os
from dotenv import load_dotenv

Base = declarative_base()
engine= "Hola"
SessionLocal="Hola"
# Configuración de la base de datos
# Cargar las variables de entorno desde el archivo .env
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

try:
        engine = create_engine(DATABASE_URL)
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
except Exception as e:
    print('Unable to access postgresql database', repr(e))
    
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()