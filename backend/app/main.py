from pathlib import Path

import joblib
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel


# --------------------------------------------------
# Paths
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent


# --------------------------------------------------
# Load trained CTG model
# --------------------------------------------------

CTG_MODEL_PATH = BASE_DIR / "ctg_model.joblib"

ctg_model_data = joblib.load(CTG_MODEL_PATH)

ctg_model = ctg_model_data["model"]
CTG_FEATURES = ctg_model_data["features"]


# --------------------------------------------------
# Load trained Maternal Health Risk model
# --------------------------------------------------

MATERNAL_MODEL_PATH = BASE_DIR / "maternal_model.joblib"

maternal_model_data = joblib.load(MATERNAL_MODEL_PATH)

maternal_model = maternal_model_data["model"]
MATERNAL_FEATURES = maternal_model_data["features"]


# --------------------------------------------------
# Create FastAPI application
# --------------------------------------------------

app = FastAPI(
    title="Maternal-Fetal Health API",
    version="1.0.0",
    description="Backend API for Maternal-Fetal Health Prediction System"
)


# --------------------------------------------------
# CTG input data model
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
# Maternal health input data model
# --------------------------------------------------

class MaternalHealthInput(BaseModel):
    Age: float
    SystolicBP: float
    DiastolicBP: float
    BS: float
    BodyTemp: float
    HeartRate: float


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
        columns=CTG_FEATURES
    )

    prediction = int(ctg_model.predict(input_data)[0])

    probability_values = ctg_model.predict_proba(input_data)[0]

    labels = {
        1: "Normal",
        2: "Suspect",
        3: "Pathologic"
    }

    probabilities = {}

    for class_value, probability in zip(
        ctg_model.classes_,
        probability_values
    ):
        class_value = int(class_value)
        probabilities[labels[class_value]] = round(
            float(probability),
            2
        )

    return {
        "prediction": prediction,
        "fetal_health": labels[prediction],
        "probabilities": probabilities
    }


# --------------------------------------------------
# Maternal health risk prediction endpoint
# --------------------------------------------------

@app.post("/predict/maternal-risk")
def predict_maternal_risk(data: MaternalHealthInput):

    input_data = pd.DataFrame(
        [[
            data.Age,
            data.SystolicBP,
            data.DiastolicBP,
            data.BS,
            data.BodyTemp,
            data.HeartRate
        ]],
        columns=MATERNAL_FEATURES
    )

    prediction = maternal_model.predict(input_data)[0]

    probability_values = maternal_model.predict_proba(input_data)[0]

    probabilities = {}

    for class_value, probability in zip(
        maternal_model.classes_,
        probability_values
    ):
        probabilities[str(class_value)] = round(
            float(probability),
            2
        )

    return {
        "prediction": prediction,
        "probabilities": probabilities
    }