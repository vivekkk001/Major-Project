from fastapi import FastAPI
from pydantic import BaseModel
from ml_model import predict_department

app = FastAPI()

# Define request format
class ComplaintRequest(BaseModel):
    description: str

# API endpoint to classify complaints
@app.post("/predict")
def classify_complaint(data: ComplaintRequest):
    department = predict_department(data.description)
    return {"department": department}

# Run the API
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
