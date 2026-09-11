# api/scripts/cargar_benchmarks.py
import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.core.database import SessionLocal
from app.analytics.models import BenchmarkNacional

db = SessionLocal()

benchmarks = [
    {"anio": 2024, "metrica": "tasa_informalidad", "valor": 86.8, "segmento": "general"},
    {"anio": 2023, "metrica": "tasa_informalidad", "valor": 86.3, "segmento": "general"},
    {"anio": 2024, "metrica": "empleo_informal", "valor": 82.3, "segmento": "general"},
    {"anio": 2024, "metrica": "empleo_informal", "valor": 89.7, "segmento": "micro"},
    {"anio": 2024, "metrica": "empleo_informal", "valor": 48.1, "segmento": "pequeña"},
    {"anio": 2024, "metrica": "matriz_movilidad_se_mantiene_micro", "valor": 95.7, "segmento": "micro"},
    {"anio": 2024, "metrica": "matriz_movilidad_crece_a_pequena", "valor": 4.0, "segmento": "micro"},
    {"anio": 2024, "metrica": "matriz_movilidad_retrocede_a_micro", "valor": 40.8, "segmento": "pequeña"},
    {"anio": 2025, "metrica": "factoring_pct_usuarios_mype", "valor": 84.9, "segmento": "general"},
]

for b in benchmarks:
    db.add(BenchmarkNacional(**b))

db.commit()
db.close()
print(f"Insertados {len(benchmarks)} benchmarks nacionales")