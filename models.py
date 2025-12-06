# ============================================================
#   MODELOS SQLALCHEMY — MODELS.PY (OPTIMIZADO + FIX)
# ============================================================

from sqlalchemy import (
    Column, Integer, String, Enum, Text, ForeignKey,
    DateTime, DECIMAL
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum


# ============================================================
# ENUMS
# ============================================================

class TipoPuntoVenta(enum.Enum):
    tienda = "tienda"
    metro = "metro"
    online = "online"


class RolUsuario(enum.Enum):
    admin = "admin"
    vendedor = "vendedor"


class TipoMovimientoLibro(enum.Enum):
    entrada = "entrada"
    salida = "salida"
    venta = "venta"
    ajuste = "ajuste"


class TipoMovimientoMP(enum.Enum):
    entrada = "entrada"
    salida = "salida"
    ajuste = "ajuste"


# ============================================================
# TABLA: puntos_venta
# ============================================================

class PuntoVenta(Base):
    __tablename__ = "puntos_venta"

    id_punto_venta = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    ubicacion = Column(String(150))
    tipo = Column(Enum(TipoPuntoVenta))

    usuarios = relationship("Usuario", back_populates="punto_venta")
    inventario = relationship("InventarioPV", back_populates="punto_venta")


# ============================================================
# TABLA: usuarios
# ============================================================

class Usuario(Base):
    __tablename__ = "usuarios"

    id_usuario = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    email = Column(String(100))
    contrasena = Column(String(255), nullable=False)
    rol = Column(Enum(RolUsuario), nullable=False, default="vendedor")

    punto_venta_id = Column(Integer, ForeignKey("puntos_venta.id_punto_venta"))
    punto_venta = relationship("PuntoVenta", back_populates="usuarios")

    movimientos_libros = relationship("MovimientoLibro", back_populates="usuario")
    movimientos_mp = relationship("MovimientoMP", back_populates="usuario")


# ============================================================
# TABLA: libros
# ============================================================

class Libro(Base):
    __tablename__ = "libros"

    id_libro = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(150), nullable=False)
    categoria = Column(String(100))
    descripcion = Column(Text)
    precio = Column(DECIMAL(10, 2))
    paginas_por_libro = Column(Integer, nullable=False)
    fecha_creacion = Column(DateTime, server_default=func.now(), nullable=False)

    inventario_global = relationship("InventarioLibro", back_populates="libro")
    inventarios_pv = relationship("InventarioPV", back_populates="libro")


# ============================================================
# TABLA: inventario_libros
# ============================================================

class InventarioLibro(Base):
    __tablename__ = "inventario_libros"

    id_inventario = Column(Integer, primary_key=True, autoincrement=True)
    libro_id = Column(Integer, ForeignKey("libros.id_libro"), nullable=False)
    stock = Column(Integer, nullable=False, default=0)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    libro = relationship("Libro", back_populates="inventario_global")
    movimientos = relationship("MovimientoLibro", back_populates="inventario")


# ============================================================
# TABLA: movimientos_libros
# ============================================================

class MovimientoLibro(Base):
    __tablename__ = "movimientos_libros"

    id_mov_libro = Column(Integer, primary_key=True, autoincrement=True)
    inventario_id = Column(Integer, ForeignKey("inventario_libros.id_inventario"), nullable=False)
    tipo = Column(Enum(TipoMovimientoLibro), nullable=False)
    cantidad = Column(Integer, nullable=False)

    # FIX: permitir NULL y SET NULL  
    usuario_id = Column(
        Integer,
        ForeignKey("usuarios.id_usuario", ondelete="SET NULL"),
        nullable=True
    )

    fecha_movimiento = Column(DateTime, server_default=func.now(), nullable=False)
    observaciones = Column(Text)

    inventario = relationship("InventarioLibro", back_populates="movimientos")
    usuario = relationship("Usuario", back_populates="movimientos_libros")


# ============================================================
# TABLA: inventario_pv
# ============================================================

class InventarioPV(Base):
    __tablename__ = "inventario_pv"

    id_inventario = Column(Integer, primary_key=True, autoincrement=True)
    id_libro = Column(Integer, ForeignKey("libros.id_libro"), nullable=False)
    id_punto_venta = Column(Integer, ForeignKey("puntos_venta.id_punto_venta"), nullable=False)
    stock = Column(Integer, default=0)
    stock_minimo = Column(Integer)

    libro = relationship("Libro", back_populates="inventarios_pv")
    punto_venta = relationship("PuntoVenta", back_populates="inventario")


# ============================================================
# TABLA: materias_primas
# ============================================================

class MateriaPrima(Base):
    __tablename__ = "materias_primas"

    id_mp = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    unidad = Column(String(50), nullable=False)
    stock_actual = Column(Integer, default=0, nullable=False)
    stock_minimo = Column(Integer, default=0, nullable=False)

    movimientos = relationship("MovimientoMP", back_populates="materia_prima")


# ============================================================
# TABLA: movimientos_mp  (CON FIX DE USUARIO NULLABLE)
# ============================================================

class MovimientoMP(Base):
    __tablename__ = "movimientos_mp"

    id_mov_mp = Column(Integer, primary_key=True, index=True)
    mp_id = Column(Integer, ForeignKey("materias_primas.id_mp"), nullable=False)
    tipo = Column(Enum(TipoMovimientoMP), nullable=False)
    cantidad = Column(Integer, nullable=False)

    # 🔥 FIX IMPORTANTE:
    # usuario_id ahora es NULLABLE y respeta ON DELETE SET NULL
    usuario_id = Column(
        Integer,
        ForeignKey("usuarios.id_usuario", ondelete="SET NULL"),
        nullable=True
    )

    fecha_movimiento = Column(DateTime, server_default=func.now(), nullable=False)
    observaciones = Column(Text)

    materia_prima = relationship("MateriaPrima", back_populates="movimientos")
    usuario = relationship("Usuario", back_populates="movimientos_mp")
