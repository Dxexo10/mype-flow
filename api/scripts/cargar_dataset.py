import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

import pandas as pd
from app.core.database import SessionLocal
from app.formalizacion.models import Empresa

df = pd.read_csv("../data/processed/dataset_unificado_limpio.csv", dtype={'ruc': str})

db = SessionLocal()

registros_insertados = 0
registros_omitidos = 0

for _, row in df.iterrows():
    ruc = row['ruc']
    if pd.isna(ruc) or ruc in ['nan', 'None']:
        registros_omitidos += 1
        continue
    
    ruc = str(ruc).strip()
    if ruc.endswith('.0'):
        ruc = ruc[:-2]
    
    if len(ruc) > 11:  # seguridad extra: si algo sigue mal, lo saltamos y lo reportamos
        print(f"RUC sospechoso, omitido: {ruc}")
        registros_omitidos += 1
        continue

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

    if registros_insertados % 500 == 0:
        db.commit()
        print(f"Progreso: {registros_insertados} insertados...")

db.commit()
db.close()

print(f"\nTotal insertados: {registros_insertados}")
print(f"Total omitidos (sin RUC): {registros_omitidos}")