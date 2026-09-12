# MYPE FLOW

![Estado](https://img.shields.io/badge/estado-en%20desarrollo-yellow)
![Licencia](https://img.shields.io/badge/licencia-MIT-blue)
![Backend](https://img.shields.io/badge/backend-FastAPI-009688)
![Frontend](https://img.shields.io/badge/frontend-Next.js-000000)
![Lenguaje](https://img.shields.io/badge/lenguaje-TypeScript-3178C6)

Plataforma de diagnóstico, scoring y gestión digital de formalización para MYPEs peruanas. Unifica en un solo panel la recomendación de régimen societario, la gestión de trámites, dos modelos predictivos de machine learning y un dashboard comparativo contra benchmarks nacionales de informalidad.

---

**MYPE FLOW** is a digital formalization platform for Peruvian micro and small enterprises (MYPEs). It combines a one-panel dashboard with régime recommendation, paperwork tracking, two machine-learning scoring models and a comparative analytics view against national informality benchmarks.

---

## 1. Funcionalidades principales

### Módulo de Formalización (`formalizacion`)
- **Recomendación de régimen societario**: un asistente de 4 preguntas (capital social, número de socios, DNI electrónico, conocimiento del régimen SACS) devuelve el régimen recomendado, su justificación y las barreras detectadas.
- **Checklist de trámites**: al buscar una empresa por RUC se cargan sus trámites (constitución, aumento de capital, nombramiento de gerente, disolución). Cada trámite puede crearse y marcarse como completado, con barra de progreso de avance.

### Módulo de Scoring (`scoring`)
- **Transición micro → pequeña**: probabilidad de que una microempresa crezca (Random Forest).
- **Elegibilidad de factoring**: probabilidad de que una empresa sea elegible para factoring (Random Forest).
- Ambos sirven predicciones reales por RUC y se visualizan con gauges en el detalle de cada empresa.

### Módulo de Analytics (`analytics`)
- Resumen general, distribución por sector y por distrito, benchmark nacional de informalidad y comparación de la muestra contra el valor nacional 2024.

---

### Main features

- **Formalization module**: a 4-question assistant (share capital, number of partners, e-DNI, SACS régime awareness) returns the recommended corporate régime, its rationale and detected barriers.
- **Paperwork checklist**: searching a company by RUC loads its procedures (incorporation, capital increase, manager appointment, dissolution). Each can be created and marked as completed, with a progress bar.
- **Scoring module**: micro → small transition probability and factoring eligibility probability, both served per RUC by Random Forest models and shown as gauges in the company detail.
- **Analytics module**: general summary, sector/district distribution, national informality benchmark and sample-vs-national comparison.

---

## 2. Arquitectura

Monolito modular en el backend con tres módulos independientes (`formalizacion`, `scoring`, `analytics`), base de datos PostgreSQL (Supabase) y frontend Next.js.

```
                        ┌─────────────────────────────┐
                        │         Next.js (web/)      │
                        │   App Router + TypeScript   │
                        │   Tailwind CSS v4 / recharts│
                        └──────────────┬──────────────┘
                                       │ HTTP / JSON (http://127.0.0.1:8000)
                                       ▼
                        ┌─────────────────────────────┐
                        │        FastAPI (api/)       │
                        │  MYPE Flow API (ufficorn)   │
                        │  ┌─────────┬───────────┐    │
                        │  │formali- │ analytics │    │
                        │  │zación   └───────────┘    │
                        │  │scoring ──────────────────┤
                        │  │   └── RandomForest .pkl  │
                        │  │       (artifacts/)       │
                        └──────────────┬──────────────┘
                                       │ SQLAlchemy + Alembic
                                       ▼
                        ┌─────────────────────────────┐
                        │   PostgreSQL (Supabase)     │
                        │  21,160 empresas reales     │
                        └─────────────────────────────┘
```

Los modelos (`modelo_transicion.pkl`, `modelo_factoring.pkl`) se entrenaron en Google Colab y se sirven desde `api/app/scoring/ml/artifacts/`, cargados con `joblib` al iniciar el servicio de scoring.

---

### Architecture

Modular monolith on the backend with three independent modules (`formalizacion`, `scoring`, `analytics`), PostgreSQL on Supabase and a Next.js frontend.

```
Next.js (web/) ── HTTP/JSON ──> FastAPI (api/): formalizacion · scoring · analytics
                                   │  scoring uses RandomForest .pkl artifacts
                                   └─ SQLAlchemy + Alembic ──> PostgreSQL (Supabase), 21,160 real companies
```

The models (`modelo_transicion.pkl`, `modelo_factoring.pkl`) were trained in Google Colab and are served from `api/app/scoring/ml/artifacts/`, loaded with `joblib` on scoring-service startup.

---

## 3. Stack tecnológico

| Capa | Tecnología | Versión |
| --- | --- | --- |
| Backend | FastAPI (Python) | (sin fijar, ver `requirements.txt`) |
| ORM / Migraciones | SQLAlchemy + Alembic | (sin fijar) |
| Base de datos | PostgreSQL (Supabase) | — |
| Modelos ML | scikit-learn + pandas + joblib | (sin fijar) |
| Frontend | Next.js (App Router) | 16.3.4 |
| Frontend | React | 19.2.8 |
| Frontend | Tailwind CSS | v4 |
| Frontend | recharts | ^3.10.1 |
| Frontend | lucide-react | ^1.44.0 |
| Frontend | TypeScript | ^5 |

> `requirements.txt` no fija versiones de paquetes; la compatibilidad de `scikit-learn` entre el entorno de entrenamiento (Colab) y producción está pendiente de pinsear (ver Roadmap).

---

### Technology stack

| Layer | Technology | Version |
| --- | --- | --- |
| Backend | FastAPI (Python) | (unpinned, see `requirements.txt`) |
| ORM / Migrations | SQLAlchemy + Alembic | (unpinned) |
| Database | PostgreSQL (Supabase) | — |
| ML models | scikit-learn + pandas + joblib | (unpinned) |
| Frontend | Next.js (App Router) | 16.3.4 |
| Frontend | React | 19.2.8 |
| Frontend | Tailwind CSS | v4 |
| Frontend | recharts | ^3.10.1 |
| Frontend | lucide-react | ^1.44.0 |
| Frontend | TypeScript | ^5 |

> `requirements.txt` does not pin package versions; aligning `scikit-learn` between the training (Colab) and production environments is a pending item (see Roadmap).

---

## 4. Modelo de datos

Seis tablas definidas con SQLAlchemy (modelos en `api/app/formalizacion/models.py`, `api/app/scoring/models.py` y `api/app/analytics/models.py`):

| Tabla | Columnas principales | Descripción |
| --- | --- | --- |
| `empresa` | `id`, `ruc` (11), `razon_social`, `tamano`, `sector`, `distrito`, `departamento`, `area`, `num_locales`, `anio`, `es_formal`, `regimen_societario`, `capital_social`, `fecha_constitucion` | Una empresa puede tener varias filas (una por local/licencia). |
| `tramite` | `id`, `empresa_id`, `tipo`, `estado`, `requiere_notaria`, `fecha_inicio`, `fecha_fin` | Trámites de formalización por empresa. |
| `historial_tamano` | `id`, `empresa_id`, `anio`, `tamano` (unique `empresa_id`+`anio`) | Historial de tamaño por año. |
| `scoring` | `id`, `empresa_id`, `tipo_modelo`, `probabilidad`, `version_modelo`, `features_usadas` (JSON), `fecha_evaluacion` | Resultados de los modelos de scoring. |
| `factura_negociable` | `id`, `empresa_id`, `monto`, `fecha_emision`, `fecha_negociacion`, `estado` | Facturas negociables emitidas por la empresa. |
| `benchmark_nacional` | `id`, `anio`, `metrica`, `valor`, `segmento` | Valores oficiales de referencia (p. ej. tasa de informalidad 2024). |

---

### Data model

Six tables defined with SQLAlchemy (models in `api/app/formalizacion/models.py`, `api/app/scoring/models.py` and `api/app/analytics/models.py`):

| Table | Main columns | Description |
| --- | --- | --- |
| `empresa` | `id`, `ruc` (11), `razon_social`, `tamano`, `sector`, `distrito`, `departamento`, `area`, `num_locales`, `anio`, `es_formal`, `regimen_societario`, `capital_social`, `fecha_constitucion` | One company may have several rows (one per premise/licence). |
| `tramite` | `id`, `empresa_id`, `tipo`, `estado`, `requiere_notaria`, `fecha_inicio`, `fecha_fin` | Formalization procedures per company. |
| `historial_tamano` | `id`, `empresa_id`, `anio`, `tamano` (unique `empresa_id`+`anio`) | Size history per year. |
| `scoring` | `id`, `empresa_id`, `tipo_modelo`, `probabilidad`, `version_modelo`, `features_usadas` (JSON), `fecha_evaluacion` | Scoring model results. |
| `factura_negociable` | `id`, `empresa_id`, `monto`, `fecha_emision`, `fecha_negociacion`, `estado` | Negotiable invoices issued by the company. |
| `benchmark_nacional` | `id`, `anio`, `metrica`, `valor`, `segmento` | Official reference values (e.g. 2024 informality rate). |

---

## 5. Documentación de API

Base URL: `http://127.0.0.1:8000` · Docs interactivos (Swagger) en `/docs`.

| Método | Endpoint | Descripción |
| --- | --- | --- |
| GET | `/health` | Health check con estado de la conexión a la base de datos. |
| GET | `/scoring/transicion/{ruc}` | Probabilidad de crecer de micro a pequeña (solo microempresas; 400 en caso contrario). |
| GET | `/scoring/factoring/{ruc}` | Probabilidad de elegibilidad para factoring. |
| GET | `/analytics/resumen` | Totales de la muestra (formales/informales, micro/pequeña, tasa de informalidad). |
| GET | `/analytics/por-sector` | Cantidad de empresas por sector. |
| GET | `/analytics/por-distrito` | Cantidad y área promedio por distrito. |
| GET | `/analytics/benchmarks` | Valores del benchmark nacional. |
| GET | `/analytics/comparacion-informalidad` | Tasa de la muestra vs. tasa nacional 2024. |
| GET | `/formalizacion/empresas` | Listado paginado con filtros `sector`, `tamano`, `distrito`, `es_formal`, `skip`, `limit`. |
| GET | `/formalizacion/empresas/{ruc}` | Detalle de una empresa por RUC (404 si no existe). |
| POST | `/formalizacion/recomendar-regimen` | Recomienda régimen societario con `{capital_social, numero_socios, tiene_dni_electronico, conoce_regimen_sacs}`. |
| POST | `/formalizacion/tramites` | Crea un trámite con `{empresa_id, tipo, requiere_notaria}`. |
| GET | `/formalizacion/tramites/{empresa_id}` | Lista los trámites de una empresa. |
| PATCH | `/formalizacion/tramites/{id}/completar` | Marca un trámite como completado. |

---

### API documentation

Base URL: `http://127.0.0.1:8000` · Interactive docs (Swagger) at `/docs`.

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/health` | Health check including database connectivity. |
| GET | `/scoring/transicion/{ruc}` | Micro → small growth probability (micro only; 400 otherwise). |
| GET | `/scoring/factoring/{ruc}` | Factoring eligibility probability. |
| GET | `/analytics/resumen` | Sample totals (formal/informal, micro/small, informality rate). |
| GET | `/analytics/por-sector` | Companies per sector. |
| GET | `/analytics/por-distrito` | Count and average area per district. |
| GET | `/analytics/benchmarks` | National benchmark values. |
| GET | `/analytics/comparacion-informalidad` | Sample rate vs. national 2024 rate. |
| GET | `/formalizacion/empresas` | Paginated listing with `sector`, `tamano`, `distrito`, `es_formal`, `skip`, `limit` filters. |
| GET | `/formalizacion/empresas/{ruc}` | Company detail by RUC (404 if not found). |
| POST | `/formalizacion/recomendar-regimen` | Recommends a corporate régime with `{capital_social, numero_socios, tiene_dni_electronico, conoce_regimen_sacs}`. |
| POST | `/formalizacion/tramites` | Creates a procedure with `{empresa_id, tipo, requiere_notaria}`. |
| GET | `/formalizacion/tramites/{empresa_id}` | Lists procedures for a company. |
| PATCH | `/formalizacion/tramites/{id}/completar` | Marks a procedure as completed. |

---

## 6. Origen del proyecto y contexto

MYPE Flow está inspirado en una noticia real de **RPP** (artículo de Javier Prialé, actualizado el **29 de agosto de 2026**): *"Formalización mype: Gobierno de Keiko Fujimori prepara gratuidad de trámites y servicios para frenar la informalidad"*.

El Ejecutivo pidió al Congreso **facultades legislativas por 120 días** para modificar la **Ley N.° 32353** (*Ley para la Formalización, Desarrollo y Competitividad de la Micro y Pequeña Empresa*).

> **Importante (transparencia):** esto es una **PROPUESTA**, aún **no** es ley vigente. Todo depende de que el Congreso apruebe las facultades legislativas y de los decretos que luego emita el Ejecutivo. Ninguna parte de MYPE Flow da por hecho ese escenario.

### Cifras oficiales citadas en el artículo (reales, usadas como contexto)

- **86.8%** de las MYPE eran informales en 2024 (**86.3%** en 2023).
- **5.48 millones** de MYPE en 2024: **2.34 millones** formales y **3.14 millones** informales.
- **Empleo informal en MYPE**: **82.3%** general, **89.7%** en microempresas, **48.1%** en pequeñas empresas.
- **Matriz de movilidad 2015–2024**: el **95.7%** de las microempresas permaneció como micro, el **4%** pasó a pequeña; el **40.8%** de las pequeñas retrocedió a micro.
- En **2025** se negociaron **S/ 52,057 millones** en facturas negociables; las MYPE representaron el **84.9%** de los usuarios de factoring.
- **Caso SACS**: constituir cuesta **S/ 18.70 sin notario**, pero solo **5,298 sociedades** se registraron bajo este régimen entre 2021 y dic. 2024 (**menos del 1%** de las +770,000 empresas constituidas por otros regímenes). La conclusión del artículo: el problema no es el costo, sino 3 barreras reales: **(1)** SACS solo permite constituir en línea, no otros actos societarios; **(2)** exige firma digital, una barrera tecnológica por la baja penetración del DNI electrónico; **(3)** bajo conocimiento del régimen incluso en agencias bancarias.

### Cómo se mapea MYPE Flow con esas barreras

La plataforma se diseñó 1 a 1 contra las barreras del artículo:

| Barrera del artículo | Solución en MYPE Flow |
| --- | --- |
| Costos/desconocimiento de trámites y regímenes | Asistente de recomendación de régimen + checklist de trámites paso a paso. |
| Acceso a financiamiento | Motor de scoring con dos modelos predictivos (transición y factoring). |
| Falta de foco/medición | Dashboard comparando la muestra contra benchmarks nacionales. |

---

### Project origin and context

MYPE Flow is inspired by a real news story from **RPP** (article by Javier Prialé, updated **August 29, 2026**): *"Formalización mype: Gobierno de Keiko Fujimori prepara gratuidad de trámites y servicios para frenar la informalidad"*.

The Executive requested **120 days of legislative powers** from Congress to amend **Law No. 32353** (*Law for the Formalization, Development and Competitiveness of Micro and Small Enterprises*).

> **Important (transparency):** this is a **PROPOSAL**, **not** yet current law. It depends on Congress approving the legislative powers and on the decrees the Executive then issues. Nothing in MYPE Flow assumes that scenario.

### Official figures cited in the article (real, used as context)

- **86.8%** of MYPEs were informal in 2024 (**86.3%** in 2023).
- **5.48 million** MYPEs in 2024: **2.34 million** formal and **3.14 million** informal.
- **Informal employment in MYPEs**: **82.3%** overall, **89.7%** in micro-enterprises, **48.1%** in small enterprises.
- **2015–2024 mobility matrix**: **95.7%** of micro-enterprises stayed micro, **4%** moved to small; **40.8%** of small enterprises fell back to micro.
- In **2025**, **S/ 52,057 million** were traded in negotiable invoices; MYPEs made up **84.9%** of factoring users.
- **SACS case**: incorporation costs **S/ 18.70 without a notary**, yet only **5,298** companies registered under this régime between 2021 and Dec. 2024 (**less than 1%** of the +770,000 companies incorporated under other régimes). The article's conclusion: the problem is not cost but 3 real barriers: **(1)** SACS only allows online incorporation, not other corporate acts; **(2)** it requires a digital signature, a technological barrier caused by the low penetration of the e-DNI; **(3)** low awareness of the régime, even at bank branches.

### How MYPE Flow maps to those barriers

The platform was designed 1:1 against the article's barriers:

| Article barrier | MYPE Flow solution |
| --- | --- |
| Costs/lack of awareness of procedures and régimes | Régime recommendation assistant + step-by-step paperwork checklist. |
| Access to financing | Scoring engine with two predictive models (transition and factoring). |
| Lack of focus/measurement | Dashboard comparing the sample against national benchmarks. |

---

## 7. Fuente de datos y limitaciones

> **Sección crítica de transparencia.** El dataset **no** proviene de fuentes privadas ni simuladas a voluntad: se construyó combinando dos datasets **reales** de [`datosabiertos.gob.pe`](https://www.datosabiertos.gob.pe):

- **Licencias de Funcionamiento — Municipalidad Distrital de Chorrillos**: **9,767** registros, **2019–2026**.
- **Licencias de Funcionamiento/Edificación — Municipalidad de San Isidro**: **16,424** registros originales, **1990–2026**, filtrados a **12,376** con documento tipo RUC.

Combinados y limpiados: **22,143** registros, de los cuales **21,160** con RUC válido se cargaron a la base de datos final.

### Limitaciones declaradas honestamente

1. **Cobertura geográfica**: solo **2 distritos de Lima** (Chorrillos y San Isidro). No hay representatividad nacional. Además hay sesgo de composición: San Isidro es más corporativo/formal; Chorrillos, comercio popular.
2. **Error de escala en el área de Chorrillos**: el área venía dividida entre 1000 en la fuente original (error corregido dividiendo de nuevo durante la limpieza).
3. **Variables sintéticas calibradas**: el **tamaño** (micro/pequeña) y la **formalidad** **no existen** en los datasets de licencias municipales. Se generaron así:
   - Tamaño: score compuesto = **65% percentil de `num_locales` por RUC** + **35% percentil de `area` dentro de su sector**; se clasifica por corte de percentil **96%/4%**, replicando la proporción nacional micro/pequeña.
   - Formalidad: se asigna con **probabilidad condicional al tamaño** (89.7% informal en micro, 48.1% en pequeña — cifras oficiales), **no** de forma determinística.
4. **Variable de transición simulada**: crecer de micro a pequeña es una **simulación probabilística** ligada a un log-odds calibrado a **4.3% base** + efecto moderado de `num_locales`/`area`. Consecuencia conocida y no oculta: el modelo de transición terminó con **AUC 0.544** (señal moderada, no fuerte) y el feature de mayor peso fue **"año"**, de forma **no causal**.
5. **Elegibilidad de factoring con filtro casi-binario**: la variable usa la formalidad como filtro (~**1%** de informales elegibles vs. **~25–31%** base en formales, modulado por sector/tamaño/num_locales). Por diseño dio una señal mucho más fuerte: **AUC 0.875** y **recall 0.80**.
6. **Un RUC puede repetirse varias veces** (hasta **62**): cada fila es un **local/licencia**, no una empresa consolidada. Una misma empresa puede ser cadena de minimarkets, oficinas administrativas, telefonía o agencias bancarias.

**Conclusión de uso**: MYPE Flow demuestra el pipeline completo (datos abiertos → limpieza → calibración de variables → modelos → API → frontend), pero sus predicciones de tamaño/formalidad/transición se deben interpretar como **estimaciones calibradas**, no como registros oficiales.

---

### Data source and limitations

> **Critical transparency section.** The dataset does **not** come from private or freely simulated sources: it was built by combining two **real** datasets from [`datosabiertos.gob.pe`](https://www.datosabiertos.gob.pe):

- **Business Licences — District Municipality of Chorrillos**: **9,767** records, **2019–2026**.
- **Business/Building Licences — Municipality of San Isidro**: **16,424** original records, **1990–2026**, filtered to **12,376** with RUC-type document.

Combined and cleaned: **22,143** records, of which **21,160** with a valid RUC were loaded into the final database.

### Honestly declared limitations

1. **Geographic coverage**: only **2 districts of Lima** (Chorrillos and San Isidro) — no national representativeness. Composition bias: San Isidro is more corporate/formal; Chorrillos is popular retail.
2. **Area scale error in Chorrillos**: area came divided by 1000 in the original source (corrected by dividing again during cleaning).
3. **Calibrated synthetic variables**: **size** (micro/small) and **formality** do **not** exist in the municipal licence datasets. They were generated as:
   - Size: composite score = **65th percentile of `num_locales` per RUC** + **35th percentile of `area` within sector**; classified by a **96%/4%** percentile cutoff, replicating the national micro/small proportion.
   - Formality: assigned with **probability conditional on size** (89.7% informal in micro, 48.1% in small — official figures), **not** deterministically.
4. **Simulated transition variable**: growing from micro to small is a **probabilistic simulation** tied to a log-odds calibrated at **4.3% base** plus a moderate effect of `num_locales`/`area`. Known, unhidden consequence: the transition model ended with **AUC 0.544** (moderate signal, not strong) and the top feature was **"year"**, in a **non-causal** way.
5. **Almost-binary factoring eligibility filter**: the variable uses formality as a filter (**~1%** of informal eligible vs. **~25–31%** base among formal, modulated by sector/size/num_locales). By design this produced a much stronger signal: **AUC 0.875** and **recall 0.80**.
6. **A RUC may repeat many times** (up to **62**): each row is a **premise/licence**, not a consolidated company. The same company may be a chain of minimarkets, administrative offices, telecoms or bank branches.

**Usage conclusion**: MYPE Flow demonstrates the full pipeline (open data → cleaning → variable calibration → models → API → frontend), but its size/formality/transition predictions should be read as **calibrated estimates**, not official records.

---

## 8. Metodología de los modelos de ML

Dos modelos **Random Forest** (`RandomForestClassifier`) entrenados en Google Colab, persistidos con `joblib` y servidos desde `api/app/scoring/ml/artifacts/`.

| Modelo | Predice | Variables principales | AUC | Observación |
| --- | --- | --- | --- | --- |
| `modelo_transicion.pkl` | Probabilidad de pasar de micro a pequeña | `area`, `num_locales`, `anio`, `es_formal`, sector (dummies) | **0.544** | Señal moderada; el feature "año" pesa más por diseño del dataset, no por causalidad. |
| `modelo_factoring.pkl` | Probabilidad de ser elegible para factoring | `area`, `num_locales`, `anio`, `es_formal`, `tamano_pequena`, sector (dummies) | **0.875** (recall 0.80) | Señal fuerte, esperable, porque la elegibilidad fue calibrada sobre el filtro de formalidad. |

La arquitectura de features (columnas `sector_*` y orden) debe coincidir **exactamente** con la usada en entrenamiento (`feature_names_in_` del estimador) — véase `api/app/scoring/service.py`.

---

### ML model methodology

Two **Random Forest** models (`RandomForestClassifier`) trained in Google Colab, persisted with `joblib` and served from `api/app/scoring/ml/artifacts/`.

| Model | Predicts | Main features | AUC | Notes |
| --- | --- | --- | --- | --- |
| `modelo_transicion.pkl` | Micro → small transition probability | `area`, `num_locales`, `anio`, `es_formal`, sector (dummies) | **0.544** | Moderate signal; "year" dominates by dataset design, not causality. |
| `modelo_factoring.pkl` | Factoring eligibility probability | `area`, `num_locales`, `anio`, `es_formal`, `tamano_pequena`, sector (dummies) | **0.875** (recall 0.80) | Strong signal, expected, because eligibility was calibrated on the formality filter. |

The feature layout (`sector_*` columns and ordering) must match **exactly** what was used in training (`feature_names_in_` of the estimator) — see `api/app/scoring/service.py`.

---

## 9. Getting Started

### Backend (`api/`)

Requisitos: Python 3.10+ y acceso a una instancia de PostgreSQL (el proyecto usa Supabase con PostgreSQL).

```bash
cd api

# 1. Configuración del entorno
cp .env.example .env          # editar DATABASE_URL
# DATABASE_URL=postgresql://usuario:password@host:5432/nombre_db

# 2. Instalar dependencias
pip install -r requirements.txt
# En sistemas con PEP 668 (externally-managed-environment), usa:
# pip install -r requirements.txt --break-system-packages   (o un venv; hay una carpeta venv/ en api/)

# 3. Crear/actualizar las tablas
alembic upgrade head

# 4. (Opcional) Cargar datos de demostración
#    python scripts/cargar_benchmarks.py
#    python scripts/cargar_dataset.py

# 5. Levantar la API (Swagger en http://127.0.0.1:8000/docs)
uvicorn app.main:app --reload
```

### Frontend (`web/`)

Requisitos: Node.js 18+ y npm.

```bash
cd web
npm install
npm run dev        # http://localhost:3000
```

El frontend apunta por defecto a `http://127.0.0.1:8000` (ver `web/lib/api.ts`), por lo que basta con tener la API corriendo.

---

### Getting Started

### Backend (`api/`)

Requirements: Python 3.10+ and access to a PostgreSQL instance (the project uses Supabase with PostgreSQL).

```bash
cd api

# 1. Environment setup
cp .env.example .env          # edit DATABASE_URL
# DATABASE_URL=postgresql://usuario:password@host:5432/nombre_db

# 2. Install dependencies
pip install -r requirements.txt
# On PEP 668 (externally-managed-environment) systems, use:
# pip install -r requirements.txt --break-system-packages   (or a venv; a venv/ folder exists in api/)

# 3. Create/update tables
alembic upgrade head

# 4. (Optional) Load demo data
#    python scripts/cargar_benchmarks.py
#    python scripts/cargar_dataset.py

# 5. Start the API (Swagger at http://127.0.0.1:8000/docs)
uvicorn app.main:app --reload
```

### Frontend (`web/`)

Requirements: Node.js 18+ and npm.

```bash
cd web
npm install
npm run dev        # http://localhost:3000
```

The frontend defaults to `http://127.0.0.1:8000` (see `web/lib/api.ts`), so just having the API running is enough.

---

## 10. Estado actual y roadmap

### Estado actual

Funcional de punta a punta en entorno local:

- **Backend**: los 3 módulos (`formalizacion`, `scoring`, `analytics`) y los 2 modelos ML sirviendo predicciones reales sobre **~21,160 empresas** reales cargadas en PostgreSQL.
- **Frontend**: landing page, dashboard analítico, listado y detalle de empresas con scoring visual (gauges) y módulo de formalización (recomendación de régimen + checklist de trámites).
- Todo conectado a la **API real** — sin datos mock.

### Roadmap pendiente

- [ ] Despliegue en producción: **Render/Fly.io** para la API, **Vercel** para el frontend.
- [ ] **Docker** + **CI/CD** con GitHub Actions.
- [ ] **Fijar la versión de scikit-learn** entre el entorno de entrenamiento (Colab) y el de producción.

---

### Current status and roadmap

**Current status** — fully functional end-to-end in a local environment:

- **Backend**: the 3 modules (`formalizacion`, `scoring`, `analytics`) and the 2 ML models serving real predictions over **~21,160 real companies** loaded into PostgreSQL.
- **Frontend**: landing page, analytics dashboard, company listing/detail with visual scoring (gauges) and a formalization module (régime recommendation + paperwork checklist).
- Everything connected to the **real API** — no mock data.

**Pending roadmap**:

- [ ] Production deployment: **Render/Fly.io** for the API, **Vercel** for the frontend.
- [ ] **Docker** + **CI/CD** with GitHub Actions.
- [ ] **Pin the scikit-learn version** between the training (Colab) and production environments.

---

## 11. Autor

**Diego** — estudiante de Ciencias de la Computación en Perú, **7mo ciclo completado**, enfocado en **fintech y desarrollo fullstack**.

Este es un proyecto de **portafolio individual** con objetivo de postular a **prácticas pre-profesionales en bancos y fintechs peruanas** (BBVA, BCP, Interbank). No es un proyecto grupal ni académico institucional.

---

### Author

**Diego** — Computer Science student in Peru, **completed 7th semester**, focused on **fintech and full-stack development**.

This is an **individual portfolio project** aimed at applying for **pre-professional internships in Peruvian banks and fintechs** (BBVA, BCP, Interbank). It is not a group or institutional academic project.

---

## Licencia

MIT — para uso educativo y de portafolio.

---

### License

MIT — for educational and portfolio use.