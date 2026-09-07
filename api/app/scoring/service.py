import os
import joblib
import pandas as pd

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELO_TRANSICION = joblib.load(os.path.join(BASE_DIR, "ml", "artifacts", "modelo_transicion.pkl"))
MODELO_FACTORING = joblib.load(os.path.join(BASE_DIR, "ml", "artifacts", "modelo_factoring.pkl"))

# Debe coincidir EXACTO con las columnas dummy generadas en el entrenamiento
SECTORES = [
    'ALIMENTOS_BEBIDAS', 'ALMACENAMIENTO_LOGISTICA', 'COMERCIO_MINORISTA',
    'EDUCACION', 'FINANCIERO', 'HOTELERIA', 'OTROS', 'RECREACION_DEPORTE',
    'SALUD', 'SERVICIOS_ADMINISTRATIVOS', 'SERVICIOS_DIVERSOS',
    'SERVICIOS_PERSONALES', 'SERVICIOS_PROFESIONALES', 'SERVICIOS_TECNICOS',
    'SIN_DATO'
]

def construir_features_transicion(empresa):
    fila = {
        'area': float(empresa.area) if empresa.area is not None else 0.0,
        'num_locales': empresa.num_locales if empresa.num_locales is not None else 1,
        'anio': empresa.anio if empresa.anio is not None else 2024,
        'es_formal': int(empresa.es_formal),
    }
    for s in SECTORES:
        fila[f'sector_{s}'] = 1 if empresa.sector == s else 0
    return pd.DataFrame([fila])


def construir_features_factoring(empresa):
    fila = {
        'area': float(empresa.area) if empresa.area is not None else 0.0,
        'num_locales': empresa.num_locales if empresa.num_locales is not None else 1,
        'anio': empresa.anio if empresa.anio is not None else 2024,
        'es_formal': int(empresa.es_formal),
        'tamano_pequena': 1 if empresa.tamano == 'pequeña' else 0,
    }
    for s in SECTORES:
        fila[f'sector_{s}'] = 1 if empresa.sector == s else 0
    return pd.DataFrame([fila])


def predecir_transicion(empresa):
    X = construir_features_transicion(empresa)
    X = X[MODELO_TRANSICION.feature_names_in_]
    proba = MODELO_TRANSICION.predict_proba(X)[0][1]
    return float(proba)


def predecir_factoring(empresa):
    X = construir_features_factoring(empresa)
    X = X[MODELO_FACTORING.feature_names_in_]
    proba = MODELO_FACTORING.predict_proba(X)[0][1]
    return float(proba)