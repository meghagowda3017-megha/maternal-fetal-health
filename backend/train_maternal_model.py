from pathlib import Path

import joblib
import pandas as pd

from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split


# --------------------------------------------------
# Load dataset
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent

DATASET_PATH = (
    BASE_DIR
    / "dataset"
    / "maternal+health+risk"
    / "Maternal Health Risk Data Set.csv"
)

df = pd.read_csv(DATASET_PATH)

print("Original dataset shape:", df.shape)


# --------------------------------------------------
# Select features and target
# --------------------------------------------------

FEATURES = [
    "Age",
    "SystolicBP",
    "DiastolicBP",
    "BS",
    "BodyTemp",
    "HeartRate"
]

TARGET = "RiskLevel"

X = df[FEATURES]
y = df[TARGET]


# --------------------------------------------------
# Check dataset
# --------------------------------------------------

print("\nFeatures:")
print(FEATURES)

print("\nTarget:")
print(TARGET)

print("\nRisk distribution:")
print(y.value_counts())


# --------------------------------------------------
# Train-test split
# --------------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("\nTraining samples:", len(X_train))
print("Testing samples:", len(X_test))


# --------------------------------------------------
# Train Random Forest model
# --------------------------------------------------

model = RandomForestClassifier(
    n_estimators=200,
    random_state=42,
    class_weight="balanced"
)

model.fit(X_train, y_train)


# --------------------------------------------------
# Evaluate model
# --------------------------------------------------

y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)

print("\nModel Accuracy:")
print(f"{accuracy:.4f}")

print("\nClassification Report:")
print(
    classification_report(
        y_test,
        y_pred
    )
)


# --------------------------------------------------
# Save model
# --------------------------------------------------

MODEL_PATH = BASE_DIR / "maternal_model.joblib"

model_data = {
    "model": model,
    "features": FEATURES
}

joblib.dump(model_data, MODEL_PATH)

print("\nModel saved as:")
print(MODEL_PATH)