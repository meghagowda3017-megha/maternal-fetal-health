from fastapi import FastAPI

app = FastAPI(
    title="Maternal-Fetal Health API",
    version="1.0.0",
    description="Backend API for Maternal-Fetal Health Prediction System"
)

@app.get("/")
def home():
    return {
        "message": "Welcome to Maternal-Fetal Health API"
    }