# Dockerfile

FROM python:3.10-slim

WORKDIR /app

COPY . .

RUN pip install --no-cache-dir fastapi uvicorn[standard] pandas scikit-learn joblib

CMD ["uvicorn", "ml_api:app", "--host", "0.0.0.0", "--port", "8000"]
