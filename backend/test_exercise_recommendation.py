from pprint import pprint

from app.exercise_recommendation_engine import (
    generate_activity_recommendations,
)


def run_test(title, pregnancy_info, wellness):
    print("\n" + "=" * 70)
    print(title)
    print("=" * 70)

    result = generate_activity_recommendations(
        pregnancy_info=pregnancy_info,
        wellness=wellness,
        limit=6,
    )

    print("Status:", result["status"])

    print("\nMessages:")
    pprint(result["messages"])

    print("\nRecommendations:")

    for item in result["recommendations"]:
        print(
            f"- {item['exercise_name']} "
            f"| {item['category']} "
            f"| {item['intensity']} "
            f"| safety={item['safety_status']}"
        )
        print(
            f"  Reason: {item['reason']}"
        )


# ---------------------------------------------------------
# TEST 1 — Normal pregnancy + normal wellness
# ---------------------------------------------------------

run_test(
    "TEST 1 — Normal pregnancy + normal wellness",
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

run_test(
    "TEST 2 — Low energy",
    {
        "weeks": 22,
        "trimester": "Second",
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
# TEST 3 — Poor sleep + stress/anxiety
# ---------------------------------------------------------

run_test(
    "TEST 3 — Poor sleep + stress/anxiety",
    {
        "weeks": 28,
        "trimester": "Third",
    },
    {
        "energy": 3,
        "sleep_quality": "Poor",
        "sleep_duration": 5,
        "water": 8,
        "mood": "Okay",
        "feelings": "Anxious",
        "pain": "",
    },
)


# ---------------------------------------------------------
# TEST 4 — Calf pain/swelling
# ---------------------------------------------------------

run_test(
    "TEST 4 — Calf pain/swelling",
    {
        "weeks": 24,
        "trimester": "Second",
    },
    {
        "energy": 4,
        "sleep_quality": "Good",
        "sleep_duration": 8,
        "water": 8,
        "mood": "Good",
        "feelings": "Fine",
        "pain": "Calf pain or swelling",
    },
)