from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.core.database import get_db
from app.formalizacion.models import Empresa
from app.scoring import service

router = APIRouter(prefix="/scoring", tags=["scoring"])


@router.get("/transicion/{ruc}")
def scoring_transicion(ruc: str, db: Session = Depends(get_db)):
    empresa = db.execute(select(Empresa).where(Empresa.ruc == ruc)).scalars().first()
    if not empresa:
        raise HTTPException(status_code=404, detail="Empresa no encontrada")
    if empresa.tamano != 'micro':
        raise HTTPException(status_code=400, detail="El modelo de transición solo aplica a microempresas")

    probabilidad = service.predecir_transicion(empresa)
    return {
        "ruc": empresa.ruc,
        "sector": empresa.sector,
        "probabilidad_crecer_a_pequena": round(probabilidad, 4)
    }


@router.get("/factoring/{ruc}")
def scoring_factoring(ruc: str, db: Session = Depends(get_db)):
    empresa = db.execute(select(Empresa).where(Empresa.ruc == ruc)).scalars().first()
    if not empresa:
        raise HTTPException(status_code=404, detail="Empresa no encontrada")

    probabilidad = service.predecir_factoring(empresa)
    return {
        "ruc": empresa.ruc,
        "sector": empresa.sector,
        "es_formal": empresa.es_formal,
        "probabilidad_elegible_factoring": round(probabilidad, 4)
    }