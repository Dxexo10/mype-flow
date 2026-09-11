from fastapi import FastAPI
from sqlalchemy import text
from app.core.database import engine
from app.scoring.router import router as scoring_router
from app.analytics.router import router as analytics_router
from app.formalizacion.router import router as formalizacion_router

app = FastAPI(title="MYPE Flow API")
app.include_router(scoring_router)
app.include_router(analytics_router)
app.include_router(formalizacion_router)

@app.get("/")
def root():
    return {"mensaje": "MYPE Flow API funcionando"}

@app.get("/health")
def health_check():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "error", "database": str(e)}