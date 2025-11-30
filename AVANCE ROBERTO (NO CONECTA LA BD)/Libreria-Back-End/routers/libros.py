"""
Router para la gestión de libros.

Incluye funcionalidades para:
- Crear libros
- Listar todos los libros (con búsqueda opcional)
- Obtener un libro por ID
- Actualizar parcialmente un libro
- Eliminar un libro

Cada endpoint usa modelos Pydantic para validación y modelos SQLAlchemy para
interactuar con la base de datos.
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from database import SessionLocal
from models import Libro
from schemas import LibroCreate, LibroUpdate, LibroOut

# Router de libros
router = APIRouter(prefix="/libros", tags=["Libros"])

# Dependencia para obtener sesión de DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
# Crear libros
@router.post("/", response_model=LibroOut, status_code=status.HTTP_201_CREATED)
def crear_libro(payload: LibroCreate, db: Session = Depends(get_db)):
    libro = Libro(**payload.model_dump())
    db.add(libro)
    db.commit()
    db.refresh(libro)
    return libro

# Listar todos los libros
@router.get("/", response_model=List[LibroOut])
def listar_libros(
    q: Optional[str] = Query(None, description="Filtra por nombre que contenga q"),
    db: Session = Depends(get_db)
):
    query = db.query(Libro)
    if q:
        query = query.filter(Libro.nombre.ilike(f"%{q}%"))
    return query.order_by(Libro.id_libro.desc()).all()

# Obtener un libro por ID
@router.get("/{libro_id}", response_model=LibroOut)
def obtener_libro(libro_id: int, db: Session = Depends(get_db)):
    libro = db.query(Libro).get(libro_id)
    if not libro:
        raise HTTPException(status_code=404, detail="Libro no encontrado")
    return libro

# Actualizar parcialmente un libro
@router.patch("/{libro_id}", response_model=LibroOut)
def actualizar_libro(libro_id: int, payload: LibroUpdate, db: Session = Depends(get_db)):
    libro = db.query(Libro).get(libro_id)
    if not libro:
        raise HTTPException(status_code=404, detail="Libro no encontrado")
    data = payload.model_dump(exclude_unset=True)
    for k, v in data.items():
        setattr(libro, k, v)
    db.commit()
    db.refresh(libro)
    return libro

# Eliminar un libro
@router.delete("/{libro_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_libro(libro_id: int, db: Session = Depends(get_db)):
    libro = db.query(Libro).get(libro_id)
    if not libro:
        raise HTTPException(status_code=404, detail="Libro no encontrado")
    db.delete(libro)
    db.commit()
    return