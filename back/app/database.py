from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import declarative_base, relationship, sessionmaker

Base = declarative_base()
engine= "Hola"
SessionLocal="Hola"
# Configuración de la base de datos
DATABASE_URL = "postgresql://youruser:yourpassword@db/yourdb"
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