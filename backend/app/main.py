from pathlib import Path
from typing import Any, Dict, List, Optional

import joblib
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.recommendation_engine import (
    generate_nutrition_recommendations
)

from app.nutrition_safety import (
    build_safety_summary
)

from app.exercise_recommendation_engine import (
    generate_activity_recommendations
)


# ==================================================
# PATHS
# ==================================================

BASE_DIR = Path(__file__).resolve().parent.parent


# ==================================================
# EXERCISE DATASET
# ==================================================

EXERCISE_DATASET_PATH = (
    BASE_DIR
    / "dataset"
    / "exercise"
    / "pregnancy_exercises.csv"
)


# ==================================================
# LOAD TRAINED CTG MODEL
# ==================================================

CTG_MODEL_PATH = BASE_DIR / "ctg_model.joblib"

ctg_model_data = joblib.load(
    CTG_MODEL_PATH
)

ctg_model = ctg_model_data["model"]

CTG_FEATURES = (
    ctg_model_data["features"]
)


# ==================================================
# LOAD TRAINED MATERNAL HEALTH MODEL
# ==================================================

MATERNAL_MODEL_PATH = (
    BASE_DIR / "maternal_model.joblib"
)

maternal_model_data = joblib.load(
    MATERNAL_MODEL_PATH
)

maternal_model = (
    maternal_model_data["model"]
)

MATERNAL_FEATURES = (
    maternal_model_data["features"]
)


# ==================================================
# CREATE FASTAPI APPLICATION
# ==================================================

app = FastAPI(
    title="Maternal-Fetal Health API",
    version="1.0.0",
    description=(
        "Backend API for Maternal-Fetal "
        "Health Prediction System"
    )
)


# ==================================================
# CORS CONFIGURATION
# ==================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# ==================================================
# CTG INPUT DATA MODEL
# ==================================================

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


# ==================================================
# MATERNAL HEALTH INPUT DATA MODEL
# ==================================================

class MaternalHealthInput(BaseModel):

    Age: float
    SystolicBP: float
    DiastolicBP: float
    BS: float
    BodyTemp: float
    HeartRate: float


# ==================================================
# NUTRITION RECOMMENDATION INPUT
# ==================================================

class NutritionRecommendationInput(BaseModel):

    pregnancy_info: Optional[
        Dict[str, Any]
    ] = None

    wellness: Optional[
        Dict[str, Any]
    ] = None

    dietary_preference: Optional[
        str
    ] = None

    food_allergies: Optional[
        List[str]
    ] = None

    limit: int = 8


# ==================================================
# ACTIVITY RECOMMENDATION INPUT
# ==================================================

class ActivityRecommendationInput(BaseModel):

    pregnancy_info: Optional[
        Dict[str, Any]
    ] = None

    wellness: Optional[
        Dict[str, Any]
    ] = None

    limit: int = 6


# ==================================================
# HOME ENDPOINT
# ==================================================

@app.get("/")
def home():

    return {
        "message":
            "Welcome to Maternal-Fetal Health API"
    }


# ==================================================
# HEALTH CHECK ENDPOINT
# ==================================================

@app.get("/health")
def health_check():

    return {
        "status": "healthy",

        "ctg_model": "loaded",

        "maternal_model": "loaded",

        "nutrition_engine": "loaded",

        "nutrition_safety": "loaded",

        "activity_engine": "loaded",

        "activity_safety": "loaded"
    }


# ==================================================
# FETAL HEALTH PREDICTION
# ==================================================

@app.post("/predict/fetal-health")
def predict_fetal_health(
    data: CTGInput
):

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

    prediction = int(
        ctg_model.predict(
            input_data
        )[0]
    )

    probability_values = (
        ctg_model.predict_proba(
            input_data
        )[0]
    )

    labels = {
        1: "Normal",
        2: "Suspect",
        3: "Pathologic"
    }

    probabilities = {}

    for (
        class_value,
        probability
    ) in zip(
        ctg_model.classes_,
        probability_values
    ):

        class_value = int(
            class_value
        )

        probabilities[
            labels[class_value]
        ] = round(
            float(probability),
            2
        )

    return {
        "prediction": prediction,

        "fetal_health":
            labels[prediction],

        "probabilities":
            probabilities
    }


# ==================================================
# MATERNAL HEALTH RISK PREDICTION
# ==================================================

@app.post("/predict/maternal-risk")
def predict_maternal_risk(
    data: MaternalHealthInput
):

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

    prediction = (
        maternal_model.predict(
            input_data
        )[0]
    )

    probability_values = (
        maternal_model.predict_proba(
            input_data
        )[0]
    )

    probabilities = {}

    for (
        class_value,
        probability
    ) in zip(
        maternal_model.classes_,
        probability_values
    ):

        probabilities[
            str(class_value)
        ] = round(
            float(probability),
            2
        )

    return {
        "prediction": prediction,

        "probabilities":
            probabilities
    }


# ==================================================
# NUTRITION RECOMMENDATION ENDPOINT
# ==================================================

@app.post(
    "/nutrition/recommendations"
)
def nutrition_recommendations(
    data: NutritionRecommendationInput
):

    wellness = (
        data.wellness
        or {}
    )

    pregnancy_info = (
        data.pregnancy_info
        or {}
    )

    dietary_preference = (
        data.dietary_preference
        or ""
    )

    food_allergies = (
        data.food_allergies
        or []
    )

    recommendations = (
        generate_nutrition_recommendations(
            pregnancy_info=pregnancy_info,

            wellness=wellness,

            dietary_preference=
                dietary_preference,

            food_allergies=
                food_allergies,

            limit=data.limit
        )
    )

    safety_summary = (
        build_safety_summary(
            wellness
        )
    )

    return {
        **recommendations,

        "safety":
            safety_summary
    }


# ==================================================
# ACTIVITY RECOMMENDATION ENDPOINT
# ==================================================

@app.post(
    "/activity/recommendations"
)
def activity_recommendations(
    data: ActivityRecommendationInput
):

    wellness = (
        data.wellness
        or {}
    )

    pregnancy_info = (
        data.pregnancy_info
        or {}
    )

    recommendations = (
        generate_activity_recommendations(
            pregnancy_info=
                pregnancy_info,

            wellness=
                wellness,

            limit=data.limit
        )
    )

    return recommendations


# ==================================================
# EXERCISE BROWSING ENDPOINT
# ==================================================

@app.get("/activity/exercises")
def get_activity_exercises():

    if not EXERCISE_DATASET_PATH.exists():

        return {
            "status": "error",

            "message":
                "Exercise dataset not found.",

            "exercises": []
        }

    try:

        exercise_data = pd.read_csv(
            EXERCISE_DATASET_PATH
        )

        # Replace missing values with empty strings
        exercise_data = (
            exercise_data.fillna("")
        )

        exercises = (
            exercise_data.to_dict(
                orient="records"
            )
        )

        return {
            "status": "success",

            "count": len(exercises),

            "exercises": exercises
        }

    except Exception as error:

        print(
            "Unable to load exercise dataset:",
            error
        )

        return {
            "status": "error",

            "message":
                "Unable to load exercise dataset.",

            "exercises": []
        }