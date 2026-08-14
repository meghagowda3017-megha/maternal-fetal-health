from pathlib import Path

import joblib
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel


# --------------------------------------------------
# Load trained CTG model
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "ctg_model.joblib"

model_data = joblib.load(MODEL_PATH)

model = model_data["model"]
FEATURES = model_data["features"]


# --------------------------------------------------
# Create FastAPI application
# --------------------------------------------------

app = FastAPI(
    title="Maternal-Fetal Health API",
    version="1.0.0",
    description="Backend API for Maternal-Fetal Health Prediction System"
)


# --------------------------------------------------
# Input data model
# --------------------------------------------------

class CTGInput(BaseModel):
    LB: float
    AC: float
    FM: float
    UC: float
    ASTV: float
    MSTV: float
    ALTV: float
    MLTV: float
    DL: float
    DS: float
    DP: float
    DR: float
    Width: float
    Min: float
    Max: float
    Nmax: float
    Nzeros: float
    Mode: float
    Mean: float
    Median: float
    Variance: float
    Tendency: float


# --------------------------------------------------
# Home endpoint
# --------------------------------------------------

@app.get("/")
def home():
    return {
        "message": "Welcome to Maternal-Fetal Health API"
    }


# --------------------------------------------------
# Fetal health prediction endpoint
# --------------------------------------------------

@app.post("/predict/fetal-health")
def predict_fetal_health(data: CTGInput):

    input_data = pd.DataFrame(
        [[
            data.LB,
            data.AC,
            data.FM,
            data.UC,
            data.ASTV,
            data.MSTV,
            data.ALTV,
            data.MLTV,
            data.DL,
            data.DS,
            data.DP,
            data.DR,
            data.Width,
            data.Min,
            data.Max,
            data.Nmax,
            data.Nzeros,
            data.Mode,
            data.Mean,
            data.Median,
            data.Variance,
            data.Tendency
        ]],
        columns=FEATURES
    )

    # Get prediction
    prediction = int(model.predict(input_data)[0])

    # Get prediction probabilities
    probability_values = model.predict_proba(input_data)[0]

    labels = {
        1: "Normal",
        2: "Suspect",
        3: "Pathologic"
    }

    # Match each probability to its corresponding model class
    probabilities = {}

    for class_value, probability in zip(model.classes_, probability_values):
        class_value = int(class_value)
        probabilities[labels[class_value]] = round(float(probability), 2)

    return {
        "prediction": prediction,
        "fetal_health": labels[prediction],
        "probabilities": probabilities
    }