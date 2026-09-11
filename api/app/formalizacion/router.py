from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.core.database import get_db
from app.formalizacion.models import Empresa, Tramite
from app.formalizacion.schemas import (
    RecomendacionRegimenRequest, RecomendacionRegimenResponse,
    TramiteCreate, TramiteResponse
)
from app.formalizacion import service

router = APIRouter(prefix="/formalizacion", tags=["formalizacion"])


@router.post("/recomendar-regimen", response_model=RecomendacionRegimenResponse)
def recomendar_regimen(data: RecomendacionRegimenRequest):
    resultado = service.recomendar_regimen(
        data.capital_social, data.numero_socios,
        data.tiene_dni_electronico, data.conoce_regimen_sacs
    )
    return resultado


@router.post("/tramites", response_model=TramiteResponse)
def crear_tramite(data: TramiteCreate, db: Session = Depends(get_db)):
    empresa = db.get(Empresa, data.empresa_id)
    if not empresa:
        raise HTTPException(status_code=404, detail="Empresa no encontrada")

    tramite = Tramite(
        empresa_id=data.empresa_id,
        tipo=data.tipo,
        requiere_notaria=data.requiere_notaria
    )
    db.add(tramite)
    db.commit()
    db.refresh(tramite)
    return tramite


@router.get("/tramites/{empresa_id}", response_model=list[TramiteResponse])
def listar_tramites(empresa_id: int, db: Session = Depends(get_db)):
    tramites = db.execute(
        select(Tramite).where(Tramite.empresa_id == empresa_id)
    ).scalars().all()
    return tramites


@router.patch("/tramites/{tramite_id}/completar", response_model=TramiteResponse)
def completar_tramite(tramite_id: int, db: Session = Depends(get_db)):
    tramite = db.get(Tramite, tramite_id)
    if not tramite:
        raise HTTPException(status_code=404, detail="Trámite no encontrado")

    tramite.estado = "completado"
    from datetime import datetime
    tramite.fecha_fin = datetime.now()
    db.commit()
    db.refresh(tramite)
    return tramite