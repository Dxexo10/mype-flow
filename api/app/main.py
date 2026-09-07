from fastapi import FastAPI
from sqlalchemy import text
from app.core.database import engine

app = FastAPI(title="MYPE Flow API")

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