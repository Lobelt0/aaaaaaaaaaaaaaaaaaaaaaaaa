# ============================================================
#   MAIN.PY — COMPLETO, LIMPIO Y ACTUALIZADO
# ============================================================

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine

# Routers
from routers.usuarios import router as usuarios_router
from routers.puntos_venta import router as puntos_venta_router
from routers.libros import router as libros_router
from routers.inventario_pv import router as inventario_pv_router
from routers.inventario import router as inventario_global_router
from routers.materias_primas import router as materias_primas_router


# Crear tablas (si no existen)
Base.metadata.create_all(bind=engine)


# ============================================================
#   Inicializar FastAPI
# ============================================================
app = FastAPI(
    title="Sistema de Inventario Librería",
    description="API para gestionar libros, puntos de venta, inventario y materias primas",
    version="2.0"
)

# ============================================================
#   CORS para permitir que el frontend se conecte
# ============================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # Cambia esto si deseas limitar el acceso
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
#   Registra todos los routers
# ============================================================
app.include_router(usuarios_router)
app.include_router(puntos_venta_router)
app.include_router(libros_router)
app.include_router(inventario_pv_router)       # Fabricación + Ventas
app.include_router(inventario_global_router)   # Inventario global (solo lectura + entrada/salida)
app.include_router(materias_primas_router)     # Gestión de papel y otros MP


# ============================================================
#   Endpoint raíz
# ============================================================
@app.get("/")
def root():
    return {"message": "API funcionando correctamente"}
