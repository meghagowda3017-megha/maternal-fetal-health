import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report


# --------------------------------------------------
# 1. Load dataset
# --------------------------------------------------

file_path = "dataset/cardiotocography/CTG.xlsx"

df = pd.read_excel(
    file_path,
    sheet_name="Raw Data"
)

print("Original dataset shape:", df.shape)


# --------------------------------------------------
# 2. Remove completely empty rows
# --------------------------------------------------

df = df.dropna(how="all").copy()

print("After removing empty rows:", df.shape)


# --------------------------------------------------
# 3. Select CTG features
# --------------------------------------------------

features = [
    "LB",
    "AC",
    "FM",
    "UC",
    "ASTV",
    "MSTV",
    "ALTV",
    "MLTV",
    "DL",
    "DS",
    "DP",
    "DR",
    "Width",
    "Min",
    "Max",
    "Nmax",
    "Nzeros",
    "Mode",
    "Mean",
    "Median",
    "Variance",
    "Tendency"
]

target = "NSP"


# --------------------------------------------------
# 4. Keep only required columns
# --------------------------------------------------

df = df[features + [target]]

print("Selected columns:", len(features))


# --------------------------------------------------
# 5. Remove rows with missing values
# --------------------------------------------------

df = df.dropna().copy()

print("Dataset after cleaning:", df.shape)


# --------------------------------------------------
# 6. Separate input and target
# --------------------------------------------------

X = df[features]
y = df[target].astype(int)


# --------------------------------------------------
# 7. Split into training and testing data
# --------------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


print("Training samples:", len(X_train))
print("Testing samples:", len(X_test))


# --------------------------------------------------
# 8. Train Random Forest model
# --------------------------------------------------

model = RandomForestClassifier(
    n_estimators=200,
    random_state=42,
    class_weight="balanced"
)

model.fit(X_train, y_train)


# --------------------------------------------------
# 9. Evaluate model
# --------------------------------------------------

y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)

print("\nModel Accuracy:")
print(f"{accuracy:.4f}")

print("\nClassification Report:")
print(
    classification_report(
        y_test,
        y_pred,
        target_names=[
            "Normal",
            "Suspect",
            "Pathologic"
        ]
    )
)


# --------------------------------------------------
# 10. Save trained model
# --------------------------------------------------

model_data = {
    "model": model,
    "features": features
}

joblib.dump(
    model_data,
    "ctg_model.joblib"
)

print("\nModel saved as: ctg_model.joblib")