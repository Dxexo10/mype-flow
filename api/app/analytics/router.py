from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from app.core.database import get_db
from app.formalizacion.models import Empresa
from app.analytics.models import BenchmarkNacional

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/resumen")
def resumen_general(db: Session = Depends(get_db)):
    total = db.execute(select(func.count(Empresa.id))).scalar()
    formales = db.execute(select(func.count(Empresa.id)).where(Empresa.es_formal == True)).scalar()
    micro = db.execute(select(func.count(Empresa.id)).where(Empresa.tamano == 'micro')).scalar()
    pequena = db.execute(select(func.count(Empresa.id)).where(Empresa.tamano == 'pequeña')).scalar()

    return {
        "total_empresas": total,
        "formales": formales,
        "informales": total - formales,
        "tasa_informalidad_muestra": round((total - formales) / total * 100, 2),
        "micro": micro,
        "pequena": pequena,
    }


@router.get("/por-sector")
def distribucion_por_sector(db: Session = Depends(get_db)):
    resultado = db.execute(
        select(Empresa.sector, func.count(Empresa.id))
        .group_by(Empresa.sector)
        .order_by(func.count(Empresa.id).desc())
    ).all()
    return [{"sector": r[0], "cantidad": r[1]} for r in resultado]


@router.get("/por-distrito")
def distribucion_por_distrito(db: Session = Depends(get_db)):
    resultado = db.execute(
        select(Empresa.distrito, func.count(Empresa.id), func.avg(Empresa.area))
        .group_by(Empresa.distrito)
    ).all()
    return [{"distrito": r[0], "cantidad": r[1], "area_promedio": round(float(r[2]), 2) if r[2] else None} for r in resultado]


@router.get("/benchmarks")
def obtener_benchmarks(db: Session = Depends(get_db)):
    resultado = db.execute(select(BenchmarkNacional)).scalars().all()
    return [
        {"anio": b.anio, "metrica": b.metrica, "valor": float(b.valor), "segmento": b.segmento}
        for b in resultado
    ]


@router.get("/comparacion-informalidad")
def comparar_informalidad_vs_benchmark(db: Session = Depends(get_db)):
    total = db.execute(select(func.count(Empresa.id))).scalar()
    informales = db.execute(select(func.count(Empresa.id)).where(Empresa.es_formal == False)).scalar()
    tasa_muestra = round(informales / total * 100, 2) if total else 0

    benchmark = db.execute(
        select(BenchmarkNacional).where(
            BenchmarkNacional.metrica == "tasa_informalidad",
            BenchmarkNacional.anio == 2024
        )
    ).scalars().first()

    return {
        "tasa_informalidad_muestra": tasa_muestra,
        "tasa_informalidad_nacional_2024": float(benchmark.valor) if benchmark else None,
        "diferencia": round(tasa_muestra - float(benchmark.valor), 2) if benchmark else None
    }