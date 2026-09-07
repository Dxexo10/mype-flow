from sqlalchemy import Column, Integer, String, Numeric, Date, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base
from sqlalchemy import Column, Integer, String, Date, UniqueConstraint
from app.core.database import Base

class Empresa(Base):
    __tablename__ = "empresa"

    id = Column(Integer, primary_key=True)
    ruc = Column(String(11), nullable=False)
    razon_social = Column(String(255))
    regimen_societario = Column(String(50))
    tamano = Column(String(20), nullable=False)
    sector = Column(String(100))
    departamento = Column(String(100))
    distrito = Column(String(100))
    capital_social = Column(Numeric(12, 2))
    fecha_constitucion = Column(Date)
    es_formal = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())


class Tramite(Base):
    __tablename__ = "tramite"

    id = Column(Integer, primary_key=True)
    empresa_id = Column(Integer, ForeignKey("empresa.id"))
    tipo = Column(String(50), nullable=False)
    estado = Column(String(30), default="pendiente")
    requiere_notaria = Column(Boolean, default=True)
    fecha_inicio = Column(DateTime, server_default=func.now())
    fecha_fin = Column(DateTime)

class HistorialTamano(Base):
    __tablename__ = "historial_tamano"

    id = Column(Integer, primary_key=True)
    empresa_id = Column(Integer, ForeignKey("empresa.id"))
    anio = Column(Integer, nullable=False)
    tamano = Column(String(20), nullable=False)

    __table_args__ = (UniqueConstraint('empresa_id', 'anio', name='uq_empresa_anio'),)