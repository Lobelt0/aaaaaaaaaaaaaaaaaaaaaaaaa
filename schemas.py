# ============================================================
#   SCHEMAS.PY — NUEVO COMPLETO  (ACTUALIZADO)
# ============================================================

from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime


# ============================================================
#   LIBROS
# ============================================================

class LibroBase(BaseModel):
    nombre: str = Field(..., min_length=1, max_length=150)
    categoria: Optional[str] = None
    descripcion: Optional[str] = None
    precio: Optional[float] = None
    paginas_por_libro: int


class LibroCreate(LibroBase):
    pass


class LibroUpdate(BaseModel):
    nombre: Optional[str] = None
    categoria: Optional[str] = None
    descripcion: Optional[str] = None
    precio: Optional[float] = None
    paginas_por_libro: Optional[int] = None


class LibroOut(BaseModel):
    id_libro: int
    nombre: str
    precio: Optional[float]
    stock_total: int

    class Config:
        from_attributes = True


# ============================================================
#   INVENTARIO GLOBAL
# ============================================================

class InventarioOut(BaseModel):
    id_inventario: int
    libro_id: int
    stock: int
    updated_at: datetime

    class Config:
        from_attributes = True


class AjusteStock(BaseModel):
    delta: int


class FijarStock(BaseModel):
    stock: int = Field(..., ge=0)


# ============================================================
#   INVENTARIO PV
# ============================================================

class InventarioPVBase(BaseModel):
    id_libro: int
    id_punto_venta: int
    stock: int = 0


class InventarioPVCreate(InventarioPVBase):
    pass


class InventarioPVOut(BaseModel):
    id_inventario: int
    id_libro: int
    libro: str
    paginas_por_libro: int      # ⭐ NECESARIO PARA EDITAR STOCK
    id_punto_venta: int
    punto_venta: str
    stock: int
    stock_minimo: int | None = None
    precio: float | None = None

    class Config:
        from_attributes = True


class VentaPV(BaseModel):
    id_inventario_pv: int
    cantidad: int = Field(..., gt=0)
    usuario_id: Optional[int] = None


# ============================================================
#   MOVIMIENTOS DE LIBROS
# ============================================================

class MovimientoCreate(BaseModel):
    inventario_id: int
    tipo: str = Field(..., pattern="^(entrada|salida|venta|ajuste)$")
    cantidad: int = Field(..., gt=0)
    usuario_id: Optional[int] = None
    fecha_movimiento: Optional[datetime] = None
    observaciones: Optional[str] = None


class MovimientoOut(BaseModel):
    id_mov_libro: int
    inventario_id: int
    tipo: str
    cantidad: int
    usuario_id: Optional[int]
    fecha_movimiento: datetime
    observaciones: Optional[str]

    class Config:
        from_attributes = True


# ============================================================
#   USUARIOS
# ============================================================

class UsuarioBase(BaseModel):
    nombre: str = Field(..., min_length=1, max_length=100)
    email: Optional[EmailStr] = None
    rol: str = Field(..., pattern="^(admin|vendedor)$")
    punto_venta_id: Optional[int] = None


class UsuarioCreate(UsuarioBase):
    contrasena: str = Field(..., min_length=6)


class UsuarioUpdate(BaseModel):
    nombre: Optional[str] = None
    email: Optional[EmailStr] = None
    rol: Optional[str] = None
    punto_venta_id: Optional[int] = None
    contrasena: Optional[str] = None


class UsuarioOut(UsuarioBase):
    id_usuario: int

    class Config:
        from_attributes = True


# ============================================================
#   MATERIAS PRIMAS
# ============================================================

class MPBase(BaseModel):
    nombre: str
    unidad: str
    stock_minimo: int


class MPCrear(MPBase):
    stock_actual: int = 0


class MPActualizar(BaseModel):
    nombre: Optional[str] = None
    unidad: Optional[str] = None
    stock_minimo: Optional[int] = None


class MPEntrada(BaseModel):
    cantidad: int
    usuario_id: Optional[int] = None
    observaciones: Optional[str] = None


class MPOut(MPBase):
    id_mp: int
    stock_actual: int

    class Config:
        from_attributes = True


# ============================================================
#   PUNTOS DE VENTA
# ============================================================

class PuntoVentaOut(BaseModel):
    id_punto_venta: int
    nombre: str
    ubicacion: str | None = None
    tipo: str

    class Config:
        from_attributes = True
