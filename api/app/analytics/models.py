from sqlalchemy import Column, Integer, String, Numeric
from app.core.database import Base

class BenchmarkNacional(Base):
    __tablename__ = "benchmark_nacional"

    id = Column(Integer, primary_key=True)
    anio = Column(Integer, nullable=False)
    metrica = Column(String(100), nullable=False)
    valor = Column(Numeric(10, 4), nullable=False)
    segmento = Column(String(30))