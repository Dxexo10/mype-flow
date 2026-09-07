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

def construir_features_transicion(empresa, num_locales: int, area: float, anio: int):
    """
    empresa: objeto SQLAlchemy Empresa
    num_locales, area, anio: vienen de agregaciones/datos que aún no viven en la tabla empresa tal cual
    """
    fila = {
        'area': area,
        'num_locales': num_locales,
        'anio': anio,
        'es_formal': int(empresa.es_formal),
    }
    for s in SECTORES:
        fila[f'sector_{s}'] = 1 if empresa.sector == s else 0

    return pd.DataFrame([fila])


def construir_features_factoring(empresa, num_locales: int, area: float, anio: int):
    fila = {
        'area': area,
        'num_locales': num_locales,
        'anio': anio,
        'es_formal': int(empresa.es_formal),
        'tamano_pequena': 1 if empresa.tamano == 'pequeña' else 0,
    }
    for s in SECTORES:
        fila[f'sector_{s}'] = 1 if empresa.sector == s else 0

    return pd.DataFrame([fila])


def predecir_transicion(empresa, num_locales, area, anio):
    X = construir_features_transicion(empresa, num_locales, area, anio)
    X = X[MODELO_TRANSICION.feature_names_in_]  # reordena columnas exacto como en entrenamiento
    proba = MODELO_TRANSICION.predict_proba(X)[0][1]
    return float(proba)


def predecir_factoring(empresa, num_locales, area, anio):
    X = construir_features_factoring(empresa, num_locales, area, anio)
    X = X[MODELO_FACTORING.feature_names_in_]
    proba = MODELO_FACTORING.predict_proba(X)[0][1]
    return float(proba)