from pathlib import Path
import re
import pandas as pd


BASE_DIR = Path(__file__).resolve().parents[1]
EXERCISE_DIR = BASE_DIR / "dataset" / "exercise"

SAFETY_RULES_FILE = EXERCISE_DIR / "exercise_safety_rules.csv"


def load_safety_rules():
    """
    Load exercise safety rules from the CSV dataset.
    """
    if not SAFETY_RULES_FILE.exists():
        raise FileNotFoundError(
            f"Safety rules file not found: {SAFETY_RULES_FILE}"
        )

    return pd.read_csv(SAFETY_RULES_FILE).fillna("")


def normalize(value):
    """
    Normalize text for reliable matching.
    Converts spaces, hyphens and punctuation into underscores.
    """
    if value is None:
        return ""

    value = str(value).strip().lower()

    value = re.sub(r"[^a-z0-9]+", "_", value)
    value = re.sub(r"_+", "_", value)

    return value.strip("_")


def pregnancy_weeks(pregnancy_info):
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


def get_wellness_values(wellness):
    """
    Create normalized wellness values for reliable matching.
    """
    wellness = wellness or {}

    return {
        normalize(key): normalize(value)
        for key, value in wellness.items()
        if value is not None
    }


def get_numeric_wellness(wellness, field):
    """
    Safely retrieve a numeric wellness value.
    """
    if not wellness:
        return None

    value = wellness.get(field)

    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def rule_matches(rule, pregnancy_info, wellness, exercise):
    """
    Determine whether a safety rule applies to the current context.
    """

    trigger_type = normalize(rule["Trigger_Type"])
    trigger_value = normalize(rule["Trigger_Value"])

    normalized_wellness = get_wellness_values(wellness)

    # ---------------------------------------------------------
    # POSITION RULES
    # ---------------------------------------------------------
    if trigger_type == "position":

        weeks = pregnancy_weeks(pregnancy_info)

        if (
            trigger_value == "supine"
            and weeks is not None
            and weeks >= 16
        ):
            position = normalize(
                exercise.get("Position", "")
            )

            return (
                "supine" in position
                or "lying" in position
            )

        return False

    # ---------------------------------------------------------
    # ACTIVITY TYPE RULES
    # ---------------------------------------------------------
    if trigger_type == "activity_type":

        exercise_text = " ".join(
            [
                normalize(exercise.get("Exercise_Name", "")),
                normalize(exercise.get("Category", "")),
                normalize(exercise.get("Subcategory", "")),
                normalize(exercise.get("Description", "")),
            ]
        )

        if trigger_value == "contact_sport":
            return any(
                term in exercise_text
                for term in [
                    "contact",
                    "collision",
                ]
            )

        if trigger_value == "high_fall_risk":
            return any(
                term in exercise_text
                for term in [
                    "high_fall_risk",
                    "fall_risk",
                    "climbing",
                    "skiing",
                    "horseback",
                ]
            )

        if trigger_value == "scuba_diving":
            return "scuba" in exercise_text

        return trigger_value in exercise_text

    # ---------------------------------------------------------
    # ENVIRONMENT RULES
    # ---------------------------------------------------------
    if trigger_type == "environment":

        exercise_text = " ".join(
            [
                normalize(exercise.get("Exercise_Name", "")),
                normalize(exercise.get("Description", "")),
                normalize(exercise.get("Instructions", "")),
            ]
        )

        if trigger_value == "hot_environment":
            return any(
                term in exercise_text
                for term in [
                    "hot_yoga",
                    "hot_pilates",
                    "excessive_heat",
                    "hot_environment",
                ]
            )

        return trigger_value in exercise_text

    # ---------------------------------------------------------
    # INTENSITY RULES
    # ---------------------------------------------------------
    if trigger_type == "intensity":

        exercise_intensity = normalize(
            exercise.get("Intensity", "")
        )

        if trigger_value == "unaccustomed_high_intensity":
            return exercise_intensity == "high"

        return False

    # ---------------------------------------------------------
    # TECHNIQUE RULES
    # ---------------------------------------------------------
    if trigger_type == "technique":

        exercise_text = " ".join(
            [
                normalize(exercise.get("Description", "")),
                normalize(exercise.get("Instructions", "")),
            ]
        )

        if trigger_value == "bouncing_or_jerky":
            return any(
                term in exercise_text
                for term in [
                    "bouncing",
                    "jerky",
                    "uncontrolled",
                ]
            )

        return trigger_value in exercise_text

    # ---------------------------------------------------------
    # WELLNESS RULES
    # ---------------------------------------------------------
    if trigger_type == "wellness":

        # Dizziness
        if trigger_value == "dizziness":
            return any(
                term in normalized_wellness
                for term in [
                    "dizziness",
                    "dizzy",
                    "feeling_faint",
                    "faint",
                ]
            ) or any(
                value in {
                    "dizziness",
                    "dizzy",
                    "feeling_faint",
                    "faint",
                }
                for value in normalized_wellness.values()
            )

        # Vaginal bleeding
        if trigger_value == "vaginal_bleeding":
            return any(
                value in {
                    "bleeding",
                    "vaginal_bleeding",
                }
                for value in normalized_wellness.values()
            )

        # Fluid leakage
        if trigger_value == "fluid_leakage":
            return any(
                value in {
                    "fluid_leakage",
                    "fluid_leak",
                    "leakage",
                }
                for value in normalized_wellness.values()
            )

        # Chest pain
        if trigger_value == "chest_pain":
            return any(
                value in {
                    "chest_pain",
                    "chest_discomfort",
                }
                for value in normalized_wellness.values()
            )

        # Unusual breathlessness
        if trigger_value == "unusual_breathlessness":
            return any(
                value in {
                    "unusual_breathlessness",
                    "breathlessness",
                    "shortness_of_breath",
                }
                for value in normalized_wellness.values()
            )

        # Painful contractions
        if trigger_value == "painful_contractions":
            return any(
                value in {
                    "painful_contractions",
                    "contractions",
                }
                for value in normalized_wellness.values()
            )

        # Abdominal pain
        if trigger_value == "abdominal_pain":
            return any(
                value in {
                    "abdominal_pain",
                    "abdominal_discomfort",
                }
                for value in normalized_wellness.values()
            )

        # Calf pain/swelling
        if trigger_value == "calf_pain_or_swelling":
            return any(
                value in {
                    "calf_pain",
                    "calf_swelling",
                    "calf_pain_or_swelling",
                }
                for value in normalized_wellness.values()
            )

        # Headache
        if trigger_value == "headache":
            return any(
                value in {
                    "headache",
                    "severe_headache",
                }
                for value in normalized_wellness.values()
            )

        # Balance-affecting weakness
        if trigger_value == "balance_affecting_weakness":
            return any(
                value in {
                    "balance_affecting_weakness",
                    "weakness_affecting_balance",
                }
                for value in normalized_wellness.values()
            )

        # Severe or worsening pain
        if trigger_value == "severe_or_worsening_pain":
            pain = normalized_wellness.get("pain", "")

            return pain in {
                "severe",
                "severe_pain",
                "worsening",
                "worsening_pain",
                "severe_or_worsening_pain",
            }

        # Low energy
        if trigger_value == "low_energy":
            energy = get_numeric_wellness(
                wellness,
                "energy",
            )

            return energy is not None and energy <= 2

        # Poor sleep
        if trigger_value == "poor_sleep":

            sleep_quality = normalized_wellness.get(
                "sleep_quality",
                "",
            )

            sleep_duration = get_numeric_wellness(
                wellness,
                "sleep_duration",
            )

            poor_quality = sleep_quality in {
                "poor",
                "low",
                "bad",
                "very_poor",
            }

            short_sleep = (
                sleep_duration is not None
                and sleep_duration < 6
            )

            return poor_quality or short_sleep

        # Mild general discomfort
        if trigger_value == "mild_general_discomfort":
            pain = normalized_wellness.get(
                "pain",
                "",
            )

            return pain in {
                "mild",
                "mild_discomfort",
                "minor_discomfort",
            }

        # Lower-back discomfort
        if trigger_value == "lower_back_discomfort":
            pain = normalized_wellness.get(
                "pain",
                "",
            )

            return any(
                term in pain
                for term in [
                    "lower_back",
                    "back_discomfort",
                    "mild_back",
                ]
            )

        # Stress/anxiety
        if trigger_value == "stress_or_anxiety":

            feelings = normalized_wellness.get(
                "feelings",
                "",
            )

            mood = normalized_wellness.get(
                "mood",
                "",
            )

            return any(
                term in feelings
                for term in [
                    "anxious",
                    "anxiety",
                    "stress",
                    "stressed",
                ]
            ) or any(
                term in mood
                for term in [
                    "anxious",
                    "anxiety",
                    "stress",
                    "stressed",
                ]
            )

        return False

    # ---------------------------------------------------------
    # HYDRATION RULES
    # ---------------------------------------------------------
    if trigger_type == "hydration":

        if trigger_value == "poor_hydration":
            water = get_numeric_wellness(
                wellness,
                "water",
            )

            return water is not None and water < 6

        return False

    # ---------------------------------------------------------
    # INDIVIDUAL CONTEXT
    # ---------------------------------------------------------
    if trigger_type == "individual_context":

        if trigger_value == "medical_restriction":
            return bool(
                pregnancy_info.get(
                    "medical_restriction",
                    False,
                )
            )

        return False

    return False


def evaluate_exercise_safety(
    exercise,
    pregnancy_info=None,
    wellness=None,
):
    """
    Evaluate one exercise against the safety rules.

    Returns:
        {
            "status": "safe" | "modify" | "stop_referral",
            "matched_rules": [...],
            "messages": [...],
            "modifications": [...]
        }
    """

    pregnancy_info = pregnancy_info or {}
    wellness = wellness or {}

    rules = load_safety_rules()

    matched_rules = []
    messages = []
    modifications = []

    status = "safe"

    for _, rule in rules.iterrows():

        if not rule_matches(
            rule,
            pregnancy_info,
            wellness,
            exercise,
        ):
            continue

        action = normalize(rule["Action"])
        severity = normalize(rule["Severity"])

        matched_rules.append(
            {
                "rule_id": rule["Rule_ID"],
                "trigger": rule["Trigger_Value"],
                "action": rule["Action"],
                "severity": rule["Severity"],
            }
        )

        message = str(rule["Message"]).strip()

        if message and message not in messages:
            messages.append(message)

        # Stop/referral always has highest priority.
        if action == "stop_referral":
            status = "stop_referral"

        elif (
            action in {
                "exclude",
                "modify",
                "prioritize_gentle",
                "prioritize_relaxation",
            }
            and status == "safe"
        ):
            status = "modify"

        if severity == "high" and status == "safe":
            status = "modify"

        if action == "modify":
            notes = str(
                rule["Implementation_Notes"]
            ).strip()

            if notes and notes not in modifications:
                modifications.append(notes)

    return {
        "status": status,
        "matched_rules": matched_rules,
        "messages": messages,
        "modifications": modifications,
    }