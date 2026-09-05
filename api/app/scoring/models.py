from sqlalchemy import Column, Integer, String, Numeric, Date, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from app.core.database import Base

class Scoring(Base):
    __tablename__ = "scoring"

    id = Column(Integer, primary_key=True)
    empresa_id = Column(Integer, ForeignKey("empresa.id"))
    tipo_modelo = Column(String(30), nullable=False)
    probabilidad = Column(Numeric(5, 4), nullable=False)
    version_modelo = Column(String(20))
    features_usadas = Column(JSON)
    fecha_evaluacion = Column(DateTime, server_default=func.now())


class FacturaNegociable(Base):
    __tablename__ = "factura_negociable"

    id = Column(Integer, primary_key=True)
    empresa_id = Column(Integer, ForeignKey("empresa.id"))
    monto = Column(Numeric(12, 2), nullable=False)
    fecha_emision = Column(Date, nullable=False)
    fecha_negociacion = Column(Date)
    estado = Column(String(30), default="emitida")