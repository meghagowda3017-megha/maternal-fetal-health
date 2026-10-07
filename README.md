# 🌸 Maternal Health & Wellness System

A full-stack web application designed to support pregnancy health and wellness through maternal risk assessment, pregnancy tracking, daily wellness monitoring, nutrition guidance, activity recommendations, health history, and doctor visit reporting.

The system combines a **React frontend**, **FastAPI backend**, **machine-learning based maternal risk prediction**, **SQLite database authentication**, and rule/logic-based pregnancy wellness recommendations into a single pregnancy wellness platform.

> **Disclaimer:** This project is intended for educational and wellness-support purposes. It is not a replacement for professional medical diagnosis, treatment, or advice from a qualified healthcare provider.

---

# 📌 Table of Contents

- [Project Overview](#-project-overview)
- [Objectives](#-objectives)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Frontend](#-frontend)
- [Backend](#-backend)
- [Machine Learning](#-machine-learning)
- [Authentication](#-authentication)
- [Pregnancy Tracking](#-pregnancy-tracking)
- [Maternal Risk Assessment](#-maternal-risk-assessment)
- [Daily Wellness](#-daily-wellness)
- [Wellness History](#-wellness-history)
- [Nutrition Module](#-nutrition-module)
- [Activity & Exercise Module](#-activity--exercise-module)
- [Maternal Wellness Dashboard](#-maternal-wellness-dashboard)
- [Doctor Visit Report](#-doctor-visit-report)
- [Database](#-database)
- [Data Storage](#-data-storage)
- [API Endpoints](#-api-endpoints)
- [Installation](#-installation)
- [Running the Project](#-running-the-project)
- [Frontend Setup](#-frontend-setup)
- [Backend Setup](#-backend-setup)
- [Testing the API](#-testing-the-api)
- [Git Workflow](#-git-workflow)
- [Environment Variables](#-environment-variables)
- [Security Considerations](#-security-considerations)
- [Current Project Status](#-current-project-status)
- [Known Limitations](#-known-limitations)
- [Future Enhancements](#-future-enhancements)
- [Contributors](#-contributors)
- [License](#-license)

---

# 🌷 Project Overview

Pregnancy involves continuous physical, emotional, nutritional, and lifestyle changes. Keeping track of these changes manually can make it difficult to identify patterns or maintain a complete record of pregnancy wellness.

The **Maternal Health & Wellness System** provides a centralized platform where a user can:

- Create an account
- Log in securely
- Create and maintain a pregnancy profile
- Track pregnancy week and trimester
- Calculate an estimated due date
- Perform maternal health risk assessments
- Record daily wellness information
- Track mood, energy, sleep, hydration, cravings, pain, and other wellness information
- Review historical health and wellness records
- Receive pregnancy-friendly nutrition guidance
- Receive pregnancy-friendly activity and exercise recommendations
- View maternal wellness trends
- Generate a doctor visit report

The application is designed as a modular full-stack system so additional healthcare and wellness features can be added in the future.

---

# 🎯 Objectives

The main objectives of the project are:

1. Provide a centralized pregnancy wellness platform.
2. Allow users to maintain individual accounts.
3. Track pregnancy progress based on the Last Menstrual Period (LMP).
4. Provide machine-learning assisted maternal risk prediction.
5. Allow users to record daily wellness information.
6. Provide nutrition guidance based on pregnancy context and preferences.
7. Provide pregnancy-friendly activity and exercise recommendations.
8. Maintain a history of health and wellness records.
9. Provide a dashboard for viewing wellness patterns.
10. Generate a structured report that can be used during doctor visits.
11. Provide a modular architecture for future healthcare features.

---

# ✨ Key Features

## 👤 User Authentication

- User registration
- User login
- Password hashing
- JWT-based authentication
- Individual user profiles
- Logout functionality
- User-specific application data

---

## 🤰 Pregnancy Tracking

Users can enter their:

- Last Menstrual Period (LMP)
- Pregnancy information

The system calculates and displays:

- Current pregnancy week
- Days into pregnancy
- Trimester
- Estimated due date
- Pregnancy progress

---

## 🩺 Maternal Risk Assessment

The application provides a machine-learning assisted maternal health risk assessment using:

- Age
- Systolic Blood Pressure
- Diastolic Blood Pressure
- Blood Sugar
- Body Temperature
- Heart Rate

The model predicts:

- Low Risk
- Mid Risk
- High Risk

The result is stored in the user's maternal assessment history.

---

## 🌸 Daily Wellness Check-in

Users can record daily wellness information including:

### Mood

- Great
- Good
- Okay
- Low

### Energy

Rated from:

- 1
- 2
- 3
- 4
- 5

### Feelings

Examples include:

- Mood Swing
- Not in Control
- Fine
- Happy
- Sad
- Sensitive
- Angry
- Excited
- Anxious

### Pain

Users can record pain-related information.

### Sleep

Users can record:

- Sleep quality
- Sleep duration

### Hydration

Users can record daily water intake.

### Cravings

Examples include:

- Sweet
- Salty
- Sour
- Spicy
- Carbs
- Fruits
- Dairy
- Crunchy
- Other

### Additional wellness information

- Discharge
- Skin
- Hair
- Weight
- Digestion
- Stool
- Meditation
- Self-care
- Ailments
- Notes

---

# 📊 Wellness History

The system maintains historical records for:

- Maternal assessments
- Daily wellness
- Nutrition
- Activity and exercise

Users can browse records by date through the Wellness History interface.

The history interface provides:

- Calendar-based navigation
- Date selection
- Category filtering
- Historical record viewing
- Record details

---

# 🥗 Nutrition Module

The Nutrition module provides pregnancy-friendly nutrition guidance.

It can consider information such as:

- Pregnancy week
- Trimester
- Cravings
- Dietary preference
- Food allergies
- Wellness information

Users can save nutrition-related information and recommendations.

The system is designed to provide **general educational nutrition guidance**, not medical dietary treatment.

---

# 🧘 Activity & Exercise Module

The Activity & Exercise module provides pregnancy-friendly movement recommendations.

Exercise categories include:

- Low-impact movement
- Stretching / mobility
- Pelvic floor
- Prenatal yoga
- Breathing & relaxation
- Light strength

The system uses exercise safety rules and pregnancy context to recommend appropriate activities.

The exercise dataset is designed to contain multiple exercises per category to reduce repetitive recommendations.

---

# 📈 Maternal Wellness Dashboard

The Maternal Wellness Dashboard combines information from different parts of the application.

It can display information related to:

- Wellness trends
- Mood
- Energy
- Hydration
- Cravings
- Nutrition
- Activity
- Maternal assessments
- Self-care

The dashboard provides a centralized view of the user's pregnancy wellness information.

---

# 🩺 Doctor Visit Report

The application includes a Doctor Visit Report module.

The report can combine:

- Patient name
- Pregnancy information
- Date range
- Maternal assessment history
- Wellness history
- Nutrition history
- Activity history

The backend generates a structured PDF report that can be reviewed during a healthcare appointment.

The report is intended to help organize information for discussion with a healthcare professional.

---

# 🛠 Technology Stack

## Frontend

| Technology | Purpose |
|---|---|
| React | Frontend UI |
| Vite | Development server and build tool |
| JavaScript | Application logic |
| JSX | React components |
| CSS | Styling |
| React Hooks | State and lifecycle management |
| Local Storage | Client-side user-specific application state |

---

## Backend

| Technology | Purpose |
|---|---|
| Python | Backend programming language |
| FastAPI | REST API framework |
| Uvicorn | ASGI server |
| SQLAlchemy | Database ORM |
| SQLite | Local database |
| Pydantic | Data validation |
| Passlib | Password hashing |
| bcrypt | Password hashing algorithm |
| python-jose | JWT token handling |
| Joblib | Machine-learning model loading |
| Pandas | Data processing |
| NumPy | Numerical processing |

---

## Machine Learning

| Technology | Purpose |
|---|---|
| Scikit-learn | Machine-learning algorithms |
| Joblib | Model serialization |
| Pandas | Dataset processing |
| NumPy | Numerical computation |

---

## Reporting

| Technology | Purpose |
|---|---|
| ReportLab | PDF report generation |

---

# 🏗 System Architecture

The application follows a client-server architecture.

```text
                    ┌─────────────────────────┐
                    │       User / Browser     │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │     React Frontend      │
                    │        + Vite            │
                    └────────────┬────────────┘
                                 │
                         HTTP / REST API
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │      FastAPI Backend    │
                    ├─────────────────────────┤
                    │ Authentication          │
                    │ Maternal Assessment     │
                    │ Nutrition               │
                    │ Exercise                │
                    │ Reports                 │
                    └───────┬─────────┬───────┘
                            │         │
                ┌───────────┘         └────────────┐
                ▼                                  ▼
       ┌─────────────────┐                ┌──────────────────┐
       │ SQLite Database │                │ ML Model         │
       │                 │                │                  │
       │ User Accounts   │                │ Maternal Risk   │
       │ Authentication  │                │ Prediction       │
       └─────────────────┘                └──────────────────┘


maternal-fetal-health/
│
├── .gitignore
├── README.md
│
├── backend/
│   │
│   ├── app/
│   │   │
│   │   ├── __pycache__/
│   │   │
│   │   ├── auth.py
│   │   ├── database.py
│   │   ├── exercise_recommendation_engine.py
│   │   ├── exercise_safety.py
│   │   ├── main.py
│   │   ├── models.py
│   │   └── nutrition_safety.py
│   │
│   ├── dataset/
│   │   │
│   │   ├── maternal+health+risk/
│   │   │   └── Maternal Health Risk Data Set.csv
│   │   │
│   │   └── pregnancy_exercises.csv
│   │
│   ├── maternal_model.joblib
│   ├── report_generator.py
│   ├── requirements.txt
│   └── venv/
│
└── frontend/
    │
    ├── package.json
    ├── package-lock.json
    │
    ├── public/
    │
    └── src/
        │
        ├── App.jsx
        ├── App.css
        ├── index.css
        ├── main.jsx
        │
        ├── components/
        │   │
        │   ├── ActivityExercise.jsx
        │   ├── ActivityExercise.css
        │   │
        │   ├── DailyWellness.jsx
        │   ├── DailyWellness.css
        │   │
        │   ├── MaternalWellnessDashboard.jsx
        │   ├── MaternalWellnessDashboard.css
        │   │
        │   ├── Nutrition.jsx
        │   ├── Nutrition.css
        │   │
        │   ├── PregnancyOverview.jsx
        │   ├── PregnancyOverview.css
        │   │
        │   ├── TrimesterWellness.jsx
        │   └── TrimesterWellness.css
        │
        └── pages/
            │
            ├── Auth.css
            ├── DoctorReport.css
            ├── DoctorReport.jsx
            ├── History.css
            ├── History.jsx
            ├── Home.css
            ├── Home.jsx
            ├── Login.css
            ├── Login.jsx
            ├── MaternalAssessment.css
            ├── MaternalAssessment.jsx
            └── Register.jsx