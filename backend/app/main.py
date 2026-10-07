from pathlib import Path
from typing import Any, Dict, List, Optional

import joblib
import pandas as pd

from fastapi import (
    FastAPI,
    Depends,
    HTTPException,
    status,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from pydantic import BaseModel

from sqlalchemy.orm import Session

from app.database import (
    Base,
    engine,
    get_db,
)

from app.models import User

from app.auth import (
    hash_password,
    verify_password,
    create_access_token,
)

from app.recommendation_engine import (
    generate_nutrition_recommendations
)

from app.nutrition_safety import (
    build_safety_summary
)

from app.exercise_recommendation_engine import (
    generate_activity_recommendations
)

# IMPORTANT:
# report_generator.py is in backend/
# NOT inside backend/app/

from report_generator import (
    generate_doctor_report_pdf
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
# MATERNAL MODEL
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
# FASTAPI
# ==================================================

app = FastAPI(
    title="Maternal Health and Wellness API",
    version="1.0.0",
    description=(
        "Backend API for Maternal Health and "
        "Wellness System"
    )
)


# ==================================================
# DATABASE
# ==================================================

Base.metadata.create_all(bind=engine)


# ==================================================
# CORS
# ==================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# ==================================================
# MATERNAL HEALTH INPUT
# ==================================================

class MaternalHealthInput(BaseModel):

    Age: float
    SystolicBP: float
    DiastolicBP: float
    BS: float
    BodyTemp: float
    HeartRate: float


# ==================================================
# AUTHENTICATION INPUT
# ==================================================

class RegisterInput(BaseModel):

    name: str
    email: str
    password: str
    confirm_password: str


class LoginInput(BaseModel):

    email: str
    password: str


# ==================================================
# NUTRITION INPUT
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
# ACTIVITY INPUT
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
# DOCTOR REPORT INPUT
# ==================================================

class DoctorReportInput(BaseModel):

    start_date: str

    end_date: str

    patient_name: Optional[str] = "Patient"

    pregnancy_info: Optional[
        Dict[str, Any]
    ] = None

    maternal_history: Optional[
        List[Dict[str, Any]]
    ] = None

    wellness_history: Optional[
        List[Dict[str, Any]]
    ] = None

    nutrition_history: Optional[
        List[Dict[str, Any]]
    ] = None

    activity_history: Optional[
        List[Dict[str, Any]]
    ] = None

# ==================================================
# HOME
# ==================================================

@app.get("/")
def home():

    return {
        "message":
            "Welcome to Maternal Health and Wellness API"
    }


# ==================================================
# HEALTH
# ==================================================

@app.get("/health")
def health_check():

    return {
        "status": "healthy",

        "maternal_model": "loaded",

        "nutrition_engine": "loaded",

        "nutrition_safety": "loaded",

        "activity_engine": "loaded",

        "activity_safety": "loaded",

        "doctor_report": "loaded",
    }


# ==================================================
# REGISTER
# ==================================================

@app.post("/auth/register")
def register(
    data: RegisterInput,
    db: Session = Depends(get_db)
):

    # Check whether passwords match

    if data.password != data.confirm_password:

        raise HTTPException(
            status_code=400,
            detail="Passwords do not match."
        )

    # Check whether email already exists

    existing_user = (
        db.query(User)
        .filter(
            User.email == data.email
        )
        .first()
    )

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email is already registered."
        )

    # Create new user

    new_user = User(
        name=data.name,
        email=data.email,
        password_hash=hash_password(
            data.password
        )
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return {
        "message": "Registration successful.",

        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email
        }
    }


# ==================================================
# LOGIN
# ==================================================

@app.post("/auth/login")
def login(
    data: LoginInput,
    db: Session = Depends(get_db)
):

    # Find user by email

    user = (
        db.query(User)
        .filter(
            User.email == data.email
        )
        .first()
    )

    # Invalid email

    if not user:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    # Invalid password

    if not verify_password(
        data.password,
        user.password_hash
    ):

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    # Create JWT token

    access_token = create_access_token(
        user.id
    )

    return {
        "message": "Login successful.",

        "access_token": access_token,

        "token_type": "bearer",

        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
    }


# ==================================================
# MATERNAL RISK PREDICTION
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
            data.HeartRate,
        ]],
        columns=MATERNAL_FEATURES,
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
        probability_values,
    ):

        probabilities[
            str(class_value)
        ] = round(
            float(probability),
            2,
        )

    return {
        "prediction": prediction,

        "probabilities":
            probabilities,
    }


# ==================================================
# NUTRITION
# ==================================================

@app.post(
    "/nutrition/recommendations"
)
def nutrition_recommendations(
    data: NutritionRecommendationInput
):

    wellness = (
        data.wellness or {}
    )

    pregnancy_info = (
        data.pregnancy_info or {}
    )

    dietary_preference = (
        data.dietary_preference or ""
    )

    food_allergies = (
        data.food_allergies or []
    )

    recommendations = (
        generate_nutrition_recommendations(
            pregnancy_info=pregnancy_info,

            wellness=wellness,

            dietary_preference=
                dietary_preference,

            food_allergies=
                food_allergies,

            limit=data.limit,
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
            safety_summary,
    }


# ==================================================
# ACTIVITY
# ==================================================

@app.post(
    "/activity/recommendations"
)
def activity_recommendations(
    data: ActivityRecommendationInput
):

    wellness = (
        data.wellness or {}
    )

    pregnancy_info = (
        data.pregnancy_info or {}
    )

    recommendations = (
        generate_activity_recommendations(
            pregnancy_info=
                pregnancy_info,

            wellness=
                wellness,

            limit=data.limit,
        )
    )

    return recommendations


# ==================================================
# EXERCISE DATASET
# ==================================================

@app.get(
    "/activity/exercises"
)
def get_activity_exercises():

    if not EXERCISE_DATASET_PATH.exists():

        return {
            "status": "error",

            "message":
                "Exercise dataset not found.",

            "exercises": [],
        }

    try:

        exercise_data = pd.read_csv(
            EXERCISE_DATASET_PATH
        )

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

            "count":
                len(exercises),

            "exercises":
                exercises,
        }

    except Exception as error:

        print(
            "Unable to load exercise dataset:",
            error,
        )

        return {
            "status": "error",

            "message":
                "Unable to load exercise dataset.",

            "exercises": [],
        }


    
# ==================================================
# DOCTOR REPORT PDF
# ==================================================

@app.post(
    "/doctor-report/pdf"
)
def doctor_report_pdf(
    data: DoctorReportInput
):

    try:

        pdf_buffer, filename = (
            generate_doctor_report_pdf(

                start_date=data.start_date,

                end_date=data.end_date,

                patient_name=(
                    data.patient_name or "Patient"
                ),

                pregnancy_info=(
                    data.pregnancy_info or {}
                ),

                maternal_history=(
                    data.maternal_history or []
                ),

                wellness_history=(
                    data.wellness_history or []
                ),

                nutrition_history=(
                    data.nutrition_history or []
                ),

                activity_history=(
                    data.activity_history or []
                ),
            )
        )

        return StreamingResponse(

            pdf_buffer,

            media_type="application/pdf",

            headers={
                "Content-Disposition":
                    f'attachment; filename="{filename}"'
            },
        )

    except Exception as error:

        print(
            "Unable to generate doctor report:",
            repr(error),
        )

        raise HTTPException(

            status_code=500,

            detail=(
                "Unable to generate doctor report."
            ),
        )