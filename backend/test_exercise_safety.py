from app.exercise_safety import evaluate_exercise_safety


def test_case(title, exercise, pregnancy_info, wellness):
    print("\n" + "=" * 60)
    print(title)
    print("=" * 60)

    result = evaluate_exercise_safety(
        exercise=exercise,
        pregnancy_info=pregnancy_info,
        wellness=wellness,
    )

    print("Status:", result["status"])
    print("Matched rules:", result["matched_rules"])
    print("Messages:", result["messages"])
    print("Modifications:", result["modifications"])


# ---------------------------------------------------------
# TEST 1 — Normal wellness
# ---------------------------------------------------------

test_case(
    "TEST 1 — Normal wellness",
    {
        "Exercise_Name": "Walking",
        "Category": "Low-impact movement",
        "Subcategory": "Walking",
        "Intensity": "Gentle",
        "Position": "Standing",
        "Description": "Gentle walking",
        "Instructions": "Walk comfortably at an easy pace.",
    },
    {
        "weeks": 12,
        "trimester": "First",
    },
    {
        "energy": 5,
        "sleep_quality": "Good",
        "sleep_duration": 8,
        "water": 8,
        "mood": "Great",
        "feelings": "Fine",
        "pain": "",
    },
)


# ---------------------------------------------------------
# TEST 2 — Low energy
# ---------------------------------------------------------

test_case(
    "TEST 2 — Low energy",
    {
        "Exercise_Name": "Walking",
        "Category": "Low-impact movement",
        "Subcategory": "Walking",
        "Intensity": "Gentle",
        "Position": "Standing",
        "Description": "Gentle walking",
        "Instructions": "Walk comfortably at an easy pace.",
    },
    {
        "weeks": 12,
        "trimester": "First",
    },
    {
        "energy": 2,
        "sleep_quality": "Good",
        "sleep_duration": 8,
        "water": 8,
        "mood": "Good",
        "feelings": "Fine",
        "pain": "",
    },
)


# ---------------------------------------------------------
# TEST 3 — Poor sleep
# ---------------------------------------------------------

test_case(
    "TEST 3 — Poor sleep",
    {
        "Exercise_Name": "Walking",
        "Category": "Low-impact movement",
        "Subcategory": "Walking",
        "Intensity": "Gentle",
        "Position": "Standing",
        "Description": "Gentle walking",
        "Instructions": "Walk comfortably at an easy pace.",
    },
    {
        "weeks": 20,
        "trimester": "Second",
    },
    {
        "energy": 4,
        "sleep_quality": "Poor",
        "sleep_duration": 5,
        "water": 8,
        "mood": "Okay",
        "feelings": "Sensitive",
        "pain": "",
    },
)


# ---------------------------------------------------------
# TEST 4 — Calf pain/swelling
# ---------------------------------------------------------

test_case(
    "TEST 4 — Calf pain/swelling",
    {
        "Exercise_Name": "Walking",
        "Category": "Low-impact movement",
        "Subcategory": "Walking",
        "Intensity": "Gentle",
        "Position": "Standing",
        "Description": "Gentle walking",
        "Instructions": "Walk comfortably at an easy pace.",
    },
    {
        "weeks": 24,
        "trimester": "Second",
    },
    {
        "energy": 4,
        "sleep_quality": "Good",
        "sleep_duration": 8,
        "water": 8,
        "mood": "Okay",
        "feelings": "Fine",
        "pain": "Calf pain or swelling",
    },
)


# ---------------------------------------------------------
# TEST 5 — Supine exercise after approximately 16 weeks
# ---------------------------------------------------------

test_case(
    "TEST 5 — Supine exercise after 16 weeks",
    {
        "Exercise_Name": "Supported floor exercise",
        "Category": "Stretching / mobility",
        "Subcategory": "Gentle mobility",
        "Intensity": "Gentle",
        "Position": "Seated / standing / lying",
        "Description": "Gentle exercise with a lying position.",
        "Instructions": "Perform slowly and comfortably.",
    },
    {
        "weeks": 20,
        "trimester": "Second",
    },
    {
        "energy": 4,
        "sleep_quality": "Good",
        "sleep_duration": 8,
        "water": 8,
        "mood": "Good",
        "feelings": "Fine",
        "pain": "",
    },
)