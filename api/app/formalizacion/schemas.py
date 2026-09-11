from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class RecomendacionRegimenRequest(BaseModel):
    capital_social: float
    numero_socios: int
    tiene_dni_electronico: bool
    conoce_regimen_sacs: bool

class RecomendacionRegimenResponse(BaseModel):
    regimen_recomendado: str
    justificacion: str
    barreras_detectadas: list[str]

class TramiteCreate(BaseModel):
    empresa_id: int
    tipo: str  # 'constitucion' | 'aumento_capital' | 'nombramiento_gerente' | 'disolucion'
    requiere_notaria: bool = True

class TramiteResponse(BaseModel):
    id: int
    empresa_id: int
    tipo: str
    estado: str
    requiere_notaria: bool
    fecha_inicio: datetime
    fecha_fin: Optional[datetime]

    class Config:
        from_attributes = True