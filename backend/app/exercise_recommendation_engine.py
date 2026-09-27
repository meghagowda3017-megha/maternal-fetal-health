from pathlib import Path
import pandas as pd

from app.exercise_safety import evaluate_exercise_safety


BASE_DIR = Path(__file__).resolve().parents[1]
EXERCISE_DIR = BASE_DIR / "dataset" / "exercise"

EXERCISES_FILE = EXERCISE_DIR / "pregnancy_exercises.csv"
WELLNESS_RULES_FILE = EXERCISE_DIR / "exercise_wellness_rules.csv"


# =========================================================
# DATA LOADING
# =========================================================

def load_exercises():
    """
    Load the pregnancy exercise dataset.
    """

    if not EXERCISES_FILE.exists():
        raise FileNotFoundError(
            f"Exercise dataset not found: {EXERCISES_FILE}"
        )

    return pd.read_csv(EXERCISES_FILE).fillna("")


def load_wellness_rules():
    """
    Load wellness recommendation rules.
    """

    if not WELLNESS_RULES_FILE.exists():
        raise FileNotFoundError(
            f"Wellness rules file not found: {WELLNESS_RULES_FILE}"
        )

    return pd.read_csv(WELLNESS_RULES_FILE).fillna("")


# =========================================================
# NORMALIZATION HELPERS
# =========================================================

def normalize(value):
    """
    Normalize text for reliable comparisons.
    """

    if value is None:
        return ""

    return str(value).strip().lower()


def get_pregnancy_weeks(pregnancy_info):
    """
    Safely retrieve pregnancy week.
    """

    if not pregnancy_info:
        return None

    value = pregnancy_info.get("weeks")

    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def get_trimester(pregnancy_info):
    """
    Retrieve trimester from pregnancy information.

    Supports:
    - First / First trimester
    - Second / Second trimester
    - Third / Third trimester
    - 1 / 2 / 3
    """

    if not pregnancy_info:
        return ""

    trimester = normalize(
        pregnancy_info.get("trimester", "")
    )

    if trimester in {
        "1",
        "first",
        "first trimester",
        "first_trimester",
    }:
        return "T1"

    if trimester in {
        "2",
        "second",
        "second trimester",
        "second_trimester",
    }:
        return "T2"

    if trimester in {
        "3",
        "third",
        "third trimester",
        "third_trimester",
    }:
        return "T3"

    return ""


# =========================================================
# SELF-CARE / ACTIVITY PREFERENCE HELPERS
# =========================================================

def get_selected_activity_categories(wellness):
    """
    Convert the user's Daily Wellness Self-care selections
    into exercise dataset categories.

    Daily Wellness options:
    - Walking
    - Prenatal Yoga
    - Stretching
    - Pelvic Floor Exercises
    - Light Strength
    - Breathing & Relaxation
    - Rest Day

    Rest Day is handled separately and is not mapped to an
    exercise category.
    """

    if not wellness:
        return []

    selected = wellness.get("selfCare", [])

    if isinstance(selected, str):
        selected = [selected]

    if not isinstance(selected, list):
        return []

    category_map = {
        "walking": "low-impact movement",
        "yoga": "prenatal yoga",
        "prenatal yoga": "prenatal yoga",
        "stretching": "stretching / mobility",
        "pelvic floor exercises": "pelvic floor",
        "pelvic floor": "pelvic floor",
        "light strength": "light strength",
        "breathing & relaxation": "breathing & relaxation",
        "breathing and relaxation": "breathing & relaxation",
    }

    categories = []

    for item in selected:
        normalized_item = normalize(item)

        if normalized_item == "rest day":
            continue

        category = category_map.get(normalized_item)

        if category and category not in categories:
            categories.append(category)

    return categories


def has_wellness_value(value):
    """
    Check whether a wellness field contains a meaningful value.

    Supports strings, numbers, and lists because Daily Wellness
    can store different types of selections.
    """

    if value is None:
        return False

    if isinstance(value, list):
        return len(value) > 0

    return str(value).strip() != ""


def get_missing_activity_wellness_fields(wellness):
    """
    Return the activity-specific wellness fields that are needed
    before exercise recommendations are shown.

    Feelings and Pain & Body Comfort are checked first so the
    recommendation engine does not suggest exercise without
    considering the user's current comfort context.
    """

    wellness = wellness or {}

    missing = []

    if not has_wellness_value(wellness.get("feelings")):
        missing.append("Feelings")

    if not has_wellness_value(wellness.get("pain")):
        missing.append("Pain & Body Comfort")

    return missing


# =========================================================
# TRIMESTER SUITABILITY
# =========================================================

def check_trimester_suitability(
    exercise,
    pregnancy_info,
):
    """
    Check whether an exercise is listed as suitable
    for the current trimester.

    Returns:

    {
        "suitable": True/False,
        "modification": "...",
        "reason": "..."
    }
    """

    trimester = get_trimester(pregnancy_info)

    if trimester == "T1":

        suitable = normalize(
            exercise.get("Suitable_T1", "")
        )

        modification = str(
            exercise.get("Modification_T1", "")
        ).strip()

    elif trimester == "T2":

        suitable = normalize(
            exercise.get("Suitable_T2", "")
        )

        modification = str(
            exercise.get("Modification_T2", "")
        ).strip()

    elif trimester == "T3":

        suitable = normalize(
            exercise.get("Suitable_T3", "")
        )

        modification = str(
            exercise.get("Modification_T3", "")
        ).strip()

    else:
        # If trimester is unavailable, do not invent one.
        return {
            "suitable": True,
            "modification": "",
            "reason": "",
        }

    # Explicitly unsuitable
    if suitable in {
        "no",
        "not suitable",
        "not_suitable",
        "false",
    }:
        return {
            "suitable": False,
            "modification": "",
            "reason": (
                "This activity is not listed as suitable "
                "for the current trimester."
            ),
        }

    return {
        "suitable": True,
        "modification": modification,
        "reason": "",
    }


# =========================================================
# WELLNESS RULE MATCHING
# =========================================================

def wellness_rule_matches(
    rule,
    wellness,
):
    """
    Determine whether a wellness rule applies.

    Handles both numeric and text-based wellness values.
    """

    if not wellness:
        return False

    field = normalize(
        rule["Wellness_Field"]
    )

    expected = normalize(
        rule["Wellness_Value"]
    )

    # Try exact field first.
    actual = wellness.get(
        rule["Wellness_Field"]
    )

    # Also support normalized field names.
    if actual is None:

        for key, value in wellness.items():

            if normalize(key) == field:
                actual = value
                break

    if actual is None:
        return False

    if str(actual).strip() == "":
        return False

    actual_normalized = normalize(actual)

    # -----------------------------------------------------
    # ENERGY
    # -----------------------------------------------------

    if field == "energy":

        try:
            actual_number = float(actual)
            expected_number = float(expected)
        except (TypeError, ValueError):
            return False

        return actual_number == expected_number

    # -----------------------------------------------------
    # WATER
    # -----------------------------------------------------

    if field == "water":

        try:
            actual_number = float(actual)
            expected_number = float(expected)
        except (TypeError, ValueError):
            return False

        return actual_number == expected_number

    # -----------------------------------------------------
    # SLEEP DURATION
    # -----------------------------------------------------

    if field == "sleep_duration":

        # -------------------------------------------------
        # Text-based sleep values
        # -------------------------------------------------

        text_values = {
            "short",
            "normal",
            "long",
            "adequate",
            "inadequate",
            "poor",
            "good",
        }

        if expected in text_values:
            return actual_normalized == expected

        # -------------------------------------------------
        # Numeric sleep duration
        # -------------------------------------------------

        try:
            actual_number = float(actual)
        except (TypeError, ValueError):
            return False

        # Example:
        # expected = "<6"
        if expected.startswith("<"):

            try:
                threshold = float(
                    expected[1:]
                )

                return actual_number < threshold

            except ValueError:
                return False

        # Example:
        # expected = ">8"
        if expected.startswith(">"):

            try:
                threshold = float(
                    expected[1:]
                )

                return actual_number > threshold

            except ValueError:
                return False

        # Example:
        # expected = "8"
        try:
            return actual_number == float(expected)

        except ValueError:
            return False

    # -----------------------------------------------------
    # TEXT FIELDS
    # -----------------------------------------------------

    return actual_normalized == expected


# =========================================================
# WELLNESS ADJUSTMENTS
# =========================================================

def get_wellness_adjustments(
    wellness,
    category,
):
    """
    Collect wellness-based recommendation adjustments.
    """

    rules = load_wellness_rules()

    adjustments = []
    reasons = []
    matched_rules = []

    category_normalized = normalize(
        category
    )

    for _, rule in rules.iterrows():

        if not wellness_rule_matches(
            rule,
            wellness,
        ):
            continue

        rule_category = normalize(
            rule["Exercise_Category"]
        )

        # Empty/general category applies broadly.
        category_matches = (
            not rule_category
            or rule_category in {
                "all",
                "general",
                "any",
            }
            or rule_category == category_normalized
        )

        if not category_matches:
            continue

        action = normalize(
            rule["Action"]
        )

        matched_rules.append(
            {
                "rule_id": rule["Rule_ID"],
                "field": rule["Wellness_Field"],
                "value": rule["Wellness_Value"],
                "action": rule["Action"],
                "priority": rule["Priority"],
            }
        )

        adjustment = str(
            rule["Recommendation_Adjustment"]
        ).strip()

        reason = str(
            rule["Reason"]
        ).strip()

        if adjustment and adjustment not in adjustments:
            adjustments.append(
                adjustment
            )

        if reason and reason not in reasons:
            reasons.append(
                reason
            )

    return {
        "adjustments": adjustments,
        "reasons": reasons,
        "matched_rules": matched_rules,
    }


# =========================================================
# EXERCISE SCORING
# =========================================================

def score_exercise(
    exercise,
    pregnancy_info,
    wellness,
):
    """
    Score an exercise for recommendation ranking.

    This is a ranking score, not a medical safety score.
    """

    score = 0
    reasons = []

    category = normalize(
        exercise.get("Category", "")
    )

    intensity = normalize(
        exercise.get("Intensity", "")
    )

    difficulty = normalize(
        exercise.get("Difficulty", "")
    )

    # -----------------------------------------------------
    # Beginner-friendly exercises
    # -----------------------------------------------------

    if difficulty == "beginner":
        score += 2

    # -----------------------------------------------------
    # Gentle activities
    # -----------------------------------------------------

    if intensity == "gentle":

        score += 3

        reasons.append(
            "gentle activity option"
        )

    elif intensity == "gentle to moderate":

        score += 2

    # -----------------------------------------------------
    # Wellness context
    # -----------------------------------------------------

    wellness_adjustments = get_wellness_adjustments(
        wellness,
        exercise.get("Category", ""),
    )

    for rule in wellness_adjustments[
        "matched_rules"
    ]:

        action = normalize(
            rule["action"]
        )

        if action == "prioritize":
            score += 4

        elif action == "allow":
            score += 1

        elif action == "modify":
            score += 1

    # -----------------------------------------------------
    # Category preferences from wellness rules
    # -----------------------------------------------------

    adjustment_text = " ".join(
        wellness_adjustments[
            "adjustments"
        ]
    ).lower()

    # Gentle recommendation
    if (
        "gentle" in adjustment_text
        and intensity == "gentle"
    ):
        score += 3

    # Relaxation recommendation
    if (
        "relaxation" in adjustment_text
        and category == "breathing & relaxation"
    ):

        score += 5

        reasons.append(
            "supports relaxation"
        )

    # Mobility recommendation
    if (
        "mobility" in adjustment_text
        and category in {
            "stretching / mobility",
            "low-impact movement",
        }
    ):

        score += 3

        reasons.append(
            "supports gentle mobility"
        )

    # -----------------------------------------------------
    # Pregnancy trimester
    # -----------------------------------------------------

    trimester = get_trimester(
        pregnancy_info
    )

    if trimester:

        suitability = check_trimester_suitability(
            exercise,
            pregnancy_info,
        )

        if suitability["modification"]:
            score += 1

    return {
        "score": score,
        "reasons": reasons,
        "wellness": wellness_adjustments,
    }


# =========================================================
# RECOMMENDATION GENERATION
# =========================================================

def generate_activity_recommendations(
    pregnancy_info=None,
    wellness=None,
    limit=6,
):
    """
    Generate personalized pregnancy activity
    recommendations.

    Safety is always evaluated before ranking.

    Activity recommendations are personalized from the Daily
    Wellness Check-in:
    - Feelings and Pain & Body Comfort are checked before exercise.
    - Self-care selections control which exercise categories can
      be recommended.
    - Rest Day returns a supportive rest message instead of
      exercise cards.
    - Safety/referral conditions always override preferences.
    """

    pregnancy_info = (
        pregnancy_info or {}
    )

    wellness = (
        wellness or {}
    )

    # -----------------------------------------------------
    # Validate recommendation limit
    # -----------------------------------------------------

    try:
        limit = int(limit)

    except (TypeError, ValueError):
        limit = 6

    limit = max(
        1,
        min(limit, 12),
    )

    # -----------------------------------------------------
    # Load exercise dataset
    # -----------------------------------------------------

    exercises = load_exercises()

    # -----------------------------------------------------
    # Evaluate safety for every exercise
    # -----------------------------------------------------

    safety_results = []

    for _, exercise in exercises.iterrows():

        exercise_dict = exercise.to_dict()

        safety = evaluate_exercise_safety(
            exercise=exercise_dict,
            pregnancy_info=pregnancy_info,
            wellness=wellness,
        )

        safety_results.append(
            {
                "exercise": exercise_dict,
                "safety": safety,
            }
        )

    # =====================================================
    # GLOBAL WELLNESS REFERRAL CHECK
    # =====================================================
    # =====================================================

    global_referral_messages = {
        "dizziness":
            "Stop exercise and seek medical advice promptly.",

        "vaginal_bleeding":
            "Stop exercise and seek medical advice promptly.",

        "fluid_leakage":
            "Stop exercise and seek medical advice promptly.",

        "chest_pain":
            "Stop exercise and seek medical advice promptly.",

        "unusual_breathlessness":
            "Stop exercise and seek medical advice promptly.",

        "painful_contractions":
            "Stop exercise and seek medical advice promptly.",

        "abdominal_pain":
            "Stop exercise and seek medical advice promptly.",

        "calf_pain_or_swelling":
            "Stop exercise and seek medical advice promptly.",

        "headache":
            "Stop exercise and seek medical advice promptly.",

        "balance_affecting_weakness":
            "Stop exercise and seek medical advice promptly.",

        "severe_or_worsening_pain":
            "Stop exercise and seek medical advice promptly.",

        "medical_restriction":
            "Stop exercise and follow the medical guidance provided by your healthcare professional.",
    }

    referral_messages = []

    for result in safety_results:

        safety = result["safety"]

        if safety["status"] != "stop_referral":
            continue

        for rule in safety.get(
            "matched_rules",
            []
        ):

            trigger = normalize(
                rule.get("trigger", "")
            )

            if trigger not in global_referral_messages:
                continue

            message = global_referral_messages[trigger]

            if message not in referral_messages:
                referral_messages.append(
                    message
                )

    # -----------------------------------------------------
    # If a global wellness referral condition is present,
    # do not return exercise recommendations.
    # -----------------------------------------------------

    if referral_messages:

        return {
            "status": "medical_advice",
            "pregnancy": pregnancy_info,
            "wellness_context": wellness,
            "recommendations": [],
            "messages": referral_messages,
        }

    # =====================================================
    # REST DAY CHECK
    # =====================================================

    selected_self_care = wellness.get("selfCare", [])

    if isinstance(selected_self_care, str):
        selected_self_care = [selected_self_care]

    if not isinstance(selected_self_care, list):
        selected_self_care = []

    normalized_self_care = {
        normalize(item)
        for item in selected_self_care
        if normalize(item)
    }

    if "rest day" in normalized_self_care:
        return {
            "status": "rest_day",
            "pregnancy": pregnancy_info,
            "wellness_context": wellness,
            "recommendations": [],
            "messages": [
                (
                    "Today is a rest day. Give your body some time "
                    "to rest and recover. Take care of yourself, "
                    "stay comfortable, and listen to what your body "
                    "needs. 🌷"
                )
            ],
        }

    # =====================================================
    # FEELINGS + PAIN / BODY COMFORT CHECK
    # =====================================================
    # These fields are required for activity recommendations so
    # the system considers the user's current physical and
    # emotional comfort before suggesting exercise.
    missing_wellness_fields = get_missing_activity_wellness_fields(
        wellness
    )

    if missing_wellness_fields:
        return {
            "status": "wellness_context_missing",
            "pregnancy": pregnancy_info,
            "wellness_context": wellness,
            "recommendations": [],
            "messages": [
                (
                    "Please complete today's "
                    + " and ".join(missing_wellness_fields)
                    + " in the Wellness Check-in before getting "
                      "exercise recommendations."
                )
            ],
        }

    # =====================================================
    # SELF-CARE ACTIVITY PREFERENCE CHECK
    # =====================================================
    selected_categories = get_selected_activity_categories(
        wellness
    )

    if not selected_categories:
        return {
            "status": "activity_preference_missing",
            "pregnancy": pregnancy_info,
            "wellness_context": wellness,
            "recommendations": [],
            "messages": [
                (
                    "Choose what you did for yourself today in "
                    "the Self-care section of your Wellness "
                    "Check-in so we can suggest matching "
                    "activities."
                )
            ],
        }

    # =====================================================
    # RANK SAFE / MODIFIED EXERCISES
    # =====================================================

    ranked = []

    for result in safety_results:

        exercise = result["exercise"]
        safety = result["safety"]

        # -------------------------------------------------
        # Self-care category preference
        # -------------------------------------------------
        # Only recommend activities matching what the user
        # selected in today's Wellness Check-in.
        exercise_category = normalize(
            exercise.get("Category", "")
        )

        if exercise_category not in selected_categories:
            continue

        # Never recommend an exercise with
        # stop/referral status.
        if safety["status"] == "stop_referral":
            continue

        # -------------------------------------------------
        # Trimester suitability
        # -------------------------------------------------

        suitability = check_trimester_suitability(
            exercise,
            pregnancy_info,
        )

        if not suitability["suitable"]:
            continue

        # -------------------------------------------------
        # Calculate recommendation score
        # -------------------------------------------------

        scoring = score_exercise(
            exercise,
            pregnancy_info,
            wellness,
        )

        ranked.append(
            {
                "exercise": exercise,
                "safety": safety,
                "suitability": suitability,
                "score": scoring["score"],
                "reasons": scoring["reasons"],
            }
        )

    # -----------------------------------------------------
    # Sort highest score first
    # -----------------------------------------------------

    ranked.sort(
        key=lambda item: item["score"],
        reverse=True,
    )

    # -----------------------------------------------------
    # Build final recommendation list
    # -----------------------------------------------------

    recommendations = []

    for item in ranked[:limit]:

        exercise = item["exercise"]
        safety = item["safety"]
        suitability = item["suitability"]

        reasons = list(
            item["reasons"]
        )

        if not reasons:

            reasons.append(
                "fits the available pregnancy and wellness context"
            )

        recommendations.append(
            {
                "exercise_id": exercise.get(
                    "Exercise_ID",
                    "",
                ),

                "exercise_name": exercise.get(
                    "Exercise_Name",
                    "",
                ),

                "category": exercise.get(
                    "Category",
                    "",
                ),

                "subcategory": exercise.get(
                    "Subcategory",
                    "",
                ),

                "description": exercise.get(
                    "Description",
                    "",
                ),

                "benefits": exercise.get(
                    "Benefits",
                    "",
                ),

                "intensity": exercise.get(
                    "Intensity",
                    "",
                ),

                "difficulty": exercise.get(
                    "Difficulty",
                    "",
                ),

                "position": exercise.get(
                    "Position",
                    "",
                ),

                "equipment": exercise.get(
                    "Equipment",
                    "",
                ),

                "instructions": exercise.get(
                    "Instructions",
                    "",
                ),

                "reason": "; ".join(
                    reasons
                ),

                "modification": suitability[
                    "modification"
                ],

                "modification_notes": exercise.get(
                    "Modification_Notes",
                    "",
                ),

                "wellness_considerations": exercise.get(
                    "Wellness_Considerations",
                    "",
                ),

                "safety_status": safety[
                    "status"
                ],

                "safety_messages": safety[
                    "messages"
                ],

                "safety_modifications": safety[
                    "modifications"
                ],

                "source": exercise.get(
                    "Source",
                    "",
                ),

                "source_url": exercise.get(
                    "Source_URL",
                    "",
                ),
            }
        )

    # -----------------------------------------------------
    # No recommendations
    # -----------------------------------------------------

    if not recommendations:

        return {
            "status": "no_recommendations",
            "pregnancy": pregnancy_info,
            "wellness_context": wellness,
            "recommendations": [],
            "messages": [
                (
                    "No matching activity recommendations "
                    "were found for the current context."
                )
            ],
        }

    # -----------------------------------------------------
    # Successful response
    # -----------------------------------------------------

    return {
        "status": "recommendations_available",
        "pregnancy": pregnancy_info,
        "wellness_context": wellness,
        "recommendations": recommendations,
        "messages": [],
    }
