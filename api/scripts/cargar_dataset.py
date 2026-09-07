import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

import pandas as pd
from app.core.database import SessionLocal
from app.formalizacion.models import Empresa

# Ajusta esta ruta al CSV/parquet que exportaste de Colab con el dataset ya limpio
df = pd.read_csv("../data/processed/dataset_unificado_limpio.csv")

db = SessionLocal()

registros_insertados = 0
registros_omitidos = 0

for _, row in df.iterrows():
    ruc = str(row['ruc']) if pd.notna(row['ruc']) else None
    if ruc is None:
        registros_omitidos += 1
        continue  # sin RUC, no podemos insertar (es la unique key)

    empresa = Empresa(
        ruc=ruc,
        razon_social=row['nombre'] if pd.notna(row['nombre']) else None,
        regimen_societario=None,
        tamano=row['tamano'],
        sector=row['sector'],
        departamento="LIMA",
        distrito=row['distrito'],
        capital_social=None,
        fecha_constitucion=None,
        es_formal=bool(row['es_formal']),
    )
    db.add(empresa)
    registros_insertados += 1

db.commit()
db.close()

print(f"Insertados: {registros_insertados}")
print(f"Omitidos (sin RUC): {registros_omitidos}")