# ============================================================
# NUTRITION SAFETY + RED-FLAG LAYER
# ============================================================

import re


def normalize(value):
    if value is None:
        return ""
    if isinstance(value, list):
        return " ".join(str(item) for item in value).lower()
    return str(value).strip().lower()


def as_list(value):
    if value is None:
        return []
    if isinstance(value, list):
        return [str(item).strip() for item in value if str(item).strip()]
    text = str(value).strip()
    if not text:
        return []
    return [item.strip() for item in re.split(r"[;,]", text) if item.strip()]


def contains_any(text, values):
    text = normalize(text)
    return any(normalize(value) in text for value in values)


# ============================================================
# HARD FOOD-SAFETY FILTER
# ============================================================

def is_food_safe_for_recommendation(food):
    """
    Hard safety gate. Run this BEFORE recommendation scoring.
    It does not diagnose or treat medical conditions.
    """

    pregnancy_safety = normalize(food.get("Pregnancy_Safety"))

    if pregnancy_safety not in {
        "safe",
        "generally safe",
        "best choice",
    }:
        return False

    category = normalize(food.get("Food_Category"))

    if "fish" in category or "seafood" in category:
        mercury_category = normalize(
            food.get("Fish_Mercury_Category")
        )

        if mercury_category not in {
            "best choice",
            "good choice",
        }:
            return False

    return True


# ============================================================
# PREPARATION-SAFETY NOTES
# ============================================================

def get_food_safety_notes(food):
    notes = []

    preparation = str(
        food.get("Preparation_Safety", "")
    ).strip()

    if preparation:
        notes.append(preparation)

    category = normalize(food.get("Food_Category"))

    if "fish" in category or "seafood" in category:
        notes.append(
            "Choose a fully cooked preparation and follow "
            "pregnancy food-safety guidance."
        )

    return list(dict.fromkeys(notes))


# ============================================================
# RED-FLAG DETECTION
# ============================================================

def get_red_flags(wellness):
    """
    Returns general safety prompts based on recorded wellness
    labels. These are prompts, not diagnoses.
    """

    if not wellness:
        return []

    flags = []

    digestion = as_list(wellness.get("digestion"))
    stool = as_list(wellness.get("stool"))

    digestion_text = normalize(digestion)
    stool_text = normalize(stool)

    # Vomiting
    if contains_any(digestion_text, ["vomiting", "vomit"]):
        flags.append({
            "type": "hydration",
            "severity": "attention",
            "condition": "Vomiting",
            "message": (
                "If vomiting is persistent or you are unable "
                "to keep fluids down, contact your healthcare "
                "professional."
            ),
        })

    # Diarrhea / loose motion
    if contains_any(
        digestion_text + " " + stool_text,
        ["diarrhea", "loose motion"],
    ):
        flags.append({
            "type": "digestive",
            "severity": "attention",
            "condition": "Diarrhea / loose motion",
            "message": (
                "If diarrhea is persistent or accompanied by "
                "dehydration, fever, blood in stool, or severe "
                "abdominal pain, seek medical advice."
            ),
        })

    # Very low recorded water intake
    water = wellness.get("water")

    try:
        water_value = float(water)

        if water_value < 3:
            flags.append({
                "type": "hydration",
                "severity": "attention",
                "condition": "Low recorded water intake",
                "message": (
                    "Your recorded water intake is low today. "
                    "If you cannot keep fluids down or have "
                    "signs of dehydration, seek medical advice."
                ),
            })

    except (TypeError, ValueError):
        pass

    # Multiple digestive symptoms
    digestive_symptoms = 0

    for symptom in [
        "nausea",
        "vomiting",
        "bloating",
        "heartburn",
        "constipation",
        "diarrhea",
        "loose motion",
    ]:
        if symptom in digestion_text or symptom in stool_text:
            digestive_symptoms += 1

    if digestive_symptoms >= 3:
        flags.append({
            "type": "digestive",
            "severity": "caution",
            "condition": "Multiple digestive symptoms",
            "message": (
                "Several digestive symptoms were recorded today. "
                "If symptoms are severe, worsening, or persistent, "
                "contact your healthcare professional."
            ),
        })

    return flags


# ============================================================
# SAFETY SUMMARY
# ============================================================

def build_safety_summary(wellness=None):
    red_flags = get_red_flags(wellness or {})

    return {
        "has_red_flags": len(red_flags) > 0,
        "red_flags": red_flags,
        "general_food_safety": [
            "Use pasteurized dairy and dairy products.",
            "Avoid raw or undercooked fish, shellfish, meat, poultry, and eggs.",
            "Wash fresh fruits and vegetables thoroughly.",
            "Follow clean, separate, cook, and chill food-safety practices.",
            "Choose lower-mercury fish and follow current pregnancy fish guidance.",
        ],
        "disclaimer": (
            "Nutrition suggestions are educational and are not "
            "a diagnosis or substitute for prenatal medical care."
        ),
    }
