from pathlib import Path
import re

import pandas as pd


# ============================================================
# NUTRITION DATASET PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[1]

NUTRITION_DIR = BASE_DIR / "dataset" / "nutrition"

FOODS_FILE = NUTRITION_DIR / "pregnancy_foods.csv"
CONDITIONS_FILE = NUTRITION_DIR / "nutrition_conditions.csv"


# ============================================================
# LOAD DATASETS
# ============================================================

def load_nutrition_data():
    """Load nutrition datasets."""

    foods = pd.read_csv(FOODS_FILE).fillna("")
    conditions = pd.read_csv(CONDITIONS_FILE).fillna("")

    return foods, conditions


# ============================================================
# TEXT HELPERS
# ============================================================

def normalize(value):
    """Convert a value into searchable lowercase text."""

    if value is None:
        return ""

    if isinstance(value, list):
        return " ".join(
            str(item) for item in value
        ).strip().lower()

    return str(value).strip().lower()


def as_list(value):
    """Convert CSV/list values into a clean list."""

    if value is None:
        return []

    if isinstance(value, list):
        return [
            str(item).strip()
            for item in value
            if str(item).strip()
        ]

    text = str(value).strip()

    if not text:
        return []

    return [
        item.strip()
        for item in re.split(r"[;,]", text)
        if item.strip()
    ]


def contains_any(text, values):
    """Return True if any value occurs in text."""

    text = normalize(text)

    return any(
        normalize(value) in text
        for value in values
    )


# ============================================================
# TAG NORMALIZATION
# ============================================================

def normalize_tag(value):
    """
    Normalize common nutrition tags.
    """

    text = normalize(value)

    aliases = {

        # ----------------------------------------------------
        # Food categories
        # ----------------------------------------------------

        "fruit": "fruits",
        "fruits": "fruits",

        "vegetable": "vegetables",
        "vegetables": "vegetables",

        "grain": "grains",
        "grains": "grains",

        "whole grain": "grains",
        "whole grains": "grains",

        "legume": "legumes",
        "legumes": "legumes",

        "bean": "legumes",
        "beans": "legumes",

        "lentil": "legumes",
        "lentils": "legumes",

        "nut": "nuts",
        "nuts": "nuts",

        "seed": "seeds",
        "seeds": "seeds",

        "dairy": "dairy",
        "dairy products": "dairy",

        "protein": "protein",
        "proteins": "protein",

        "egg": "egg",
        "eggs": "egg",

        "fish": "fish",
        "seafood": "seafood",

        "meat": "meat",
        "poultry": "poultry",

        # ----------------------------------------------------
        # Cravings
        # ----------------------------------------------------

        "sweet": "sweet",
        "sweets": "sweet",

        "salty": "salty",
        "salt": "salty",

        "sour": "sour",

        "spicy": "spicy",

        "crunchy": "crunchy",

        "carb": "carbs",
        "carbs": "carbs",

        "carbohydrate": "carbs",
        "carbohydrates": "carbs",

        # ----------------------------------------------------
        # Dietary types
        # ----------------------------------------------------

        "vegetarian": "vegetarian",
        "vegan": "vegan",
        "eggetarian": "eggetarian",
        "pescatarian": "pescatarian",

        "non-vegetarian": "non-vegetarian",
        "non vegetarian": "non-vegetarian",

        # ----------------------------------------------------
        # Allergens
        # ----------------------------------------------------

        "milk / dairy": "dairy",
        "milk": "dairy",

        "tree nuts": "nuts",
        "nut": "nuts",
        "nuts": "nuts",

        "peanuts": "peanuts",
        "peanut": "peanuts",

        "shellfish": "shellfish",
        "crustacean shellfish": "shellfish",
        "crustacean": "shellfish",

        "soy": "soy",
        "sesame": "sesame",
        "wheat": "wheat",

        "egg": "egg",
        "eggs": "egg",

        "fish": "fish",
    }

    return aliases.get(text, text)


def tags_match(value_a, value_b):
    return normalize_tag(value_a) == normalize_tag(value_b)


def tag_set(value):
    return {
        normalize_tag(item)
        for item in as_list(value)
        if normalize_tag(item)
    }


# ============================================================
# FOOD CATEGORY HELPERS
# ============================================================

def get_food_category(food):
    """
    Convert the dataset category into a broad category.
    """

    category = normalize(
        food.get("Food_Category")
    )

    if "fruit" in category:
        return "fruits"

    if "vegetable" in category:
        return "vegetables"

    if "grain" in category:
        return "grains"

    if "legume" in category:
        return "legumes"

    if "bean" in category:
        return "legumes"

    if "lentil" in category:
        return "legumes"

    if "nut" in category:
        return "nuts"

    if "seed" in category:
        return "seeds"

    if "dairy" in category:
        return "dairy"

    if "egg" in category:
        return "egg"

    if "fish" in category:
        return "fish"

    if "seafood" in category:
        return "seafood"

    if "meat" in category:
        return "meat"

    if "poultry" in category:
        return "poultry"

    if "protein" in category:
        return "protein"

    return category or "other"


# ============================================================
# DAIRY FOOD DETECTION
# ============================================================

def is_dairy_food(food):
    """
    Determine whether a food is an actual dairy food.

    Plant-based alternatives such as oat or soy beverages
    are NOT treated as dairy foods.
    """

    category = get_food_category(food)

    # Dataset explicitly classifies it as dairy.
    if category == "dairy":
        return True

    food_name = normalize(
        food.get("Food_Name")
    )

    # --------------------------------------------------------
    # Plant-based alternatives are NOT dairy.
    # --------------------------------------------------------

    plant_based_terms = [
        "soy",
        "soya",
        "oat",
        "almond",
        "coconut",
        "rice",
        "cashew",
        "plant-based",
        "plant based",
    ]

    if any(
        term in food_name
        for term in plant_based_terms
    ):
        return False

    # --------------------------------------------------------
    # Obvious dairy food names.
    # --------------------------------------------------------

    actual_dairy_terms = [
        "milk",
        "yogurt",
        "yoghurt",
        "curd",
        "kefir",
        "lassi",
        "cheese",
        "paneer",
        "cottage cheese",
    ]

    return any(
        term in food_name
        for term in actual_dairy_terms
    )


# ============================================================
# CRAVING MATCHING
# ============================================================

def food_matches_single_craving(
    food,
    craving
):
    """
    Check whether one food satisfies one craving.

    Category-based cravings:
        Fruits
        Dairy
        Carbs

    Tag-based cravings:
        Sweet
        Salty
        Sour
        Spicy
        Crunchy
    """

    craving_tag = normalize_tag(craving)

    food_category = get_food_category(food)

    food_cravings = tag_set(
        food.get("Craving_Tags")
    )

    # --------------------------------------------------------
    # FRUITS
    # --------------------------------------------------------

    if craving_tag == "fruits":

        return (
            food_category == "fruits"
            or "fruits" in food_cravings
        )

    # --------------------------------------------------------
    # DAIRY
    # --------------------------------------------------------

    if craving_tag == "dairy":

        return is_dairy_food(food)

    # --------------------------------------------------------
    # CARBS
    # --------------------------------------------------------

    if craving_tag == "carbs":

        return (
            food_category == "grains"
            or "carbs" in food_cravings
        )

    # --------------------------------------------------------
    # SWEET / SALTY / SOUR / SPICY / CRUNCHY
    # --------------------------------------------------------

    if craving_tag in {
        "sweet",
        "salty",
        "sour",
        "spicy",
        "crunchy",
    }:

        return craving_tag in food_cravings

    # --------------------------------------------------------
    # UNKNOWN CRAVING
    # --------------------------------------------------------

    return False


def matches_craving_focus(
    food,
    cravings
):
    """
    Decide whether a food satisfies ALL selected cravings.

    Multiple cravings use AND logic.

    Example:

        Sweet + Dairy

    means:

        Sweet AND Dairy
    """

    if not cravings:
        return True

    for craving in cravings:

        if not food_matches_single_craving(
            food,
            craving
        ):
            return False

    return True


# ============================================================
# WELLNESS -> CONDITION DETECTION
# ============================================================

def detect_conditions(wellness):
    """
    Convert today's wellness information into nutrition
    guidance categories.

    This is not medical diagnosis.
    """

    if not wellness:
        return []

    detected = []

    digestion = as_list(
        wellness.get("digestion")
    )

    stool = as_list(
        wellness.get("stool")
    )

    cravings = as_list(
        wellness.get("cravings")
    )

    digestion_text = normalize(digestion)
    stool_text = normalize(stool)

    # --------------------------------------------------------
    # Digestive wellness
    # --------------------------------------------------------

    if contains_any(
        digestion_text,
        ["nausea"]
    ):
        detected.append("Nausea")

    if contains_any(
        digestion_text,
        ["vomiting", "vomit"]
    ):
        detected.append("Vomiting")

    if contains_any(
        digestion_text,
        ["bloated", "bloating"]
    ):
        detected.append("Bloating")

    if contains_any(
        digestion_text,
        ["heartburn"]
    ):
        detected.append("Heartburn")

    if contains_any(
        digestion_text,
        ["constipation"]
    ):
        detected.append("Constipation")

    if contains_any(
        digestion_text + " " + stool_text,
        ["diarrhea", "loose motion"]
    ):
        detected.append(
            "Diarrhea / loose motion"
        )

    # --------------------------------------------------------
    # Appetite
    # --------------------------------------------------------

    if contains_any(
        normalize(wellness.get("appetite")),
        ["low", "poor"]
    ):
        detected.append("Low appetite")

    # --------------------------------------------------------
    # Energy
    # --------------------------------------------------------

    energy = wellness.get("energy")

    try:

        if (
            energy not in (None, "")
            and float(energy) <= 2
        ):
            detected.append(
                "Fatigue / low energy"
            )

    except (TypeError, ValueError):
        pass

    # --------------------------------------------------------
    # Hydration
    # --------------------------------------------------------

    water = wellness.get("water")

    try:

        if (
            water not in (None, "")
            and float(water) < 5
        ):
            detected.append(
                "Dehydration concern"
            )

    except (TypeError, ValueError):
        pass

    # --------------------------------------------------------
    # Cravings
    # --------------------------------------------------------

    craving_map = {

        "Sweet": "Sweet craving",

        "Salty": "Salty craving",

        "Sour": "Sour craving",

        "Spicy": "Spicy craving",

        "Crunchy": "Crunchy craving",

        "Carbs": "Carbohydrate craving",

        "Fruits": "Fruit craving",

        "Dairy": "Dairy craving",
    }

    for craving in cravings:

        for key, condition in craving_map.items():

            if tags_match(
                craving,
                key
            ):
                detected.append(condition)

    # --------------------------------------------------------
    # Remove duplicates
    # --------------------------------------------------------

    unique = []

    for condition in detected:

        if condition not in unique:
            unique.append(condition)

    return unique


# ============================================================
# DIETARY PREFERENCE
# ============================================================

def matches_dietary_preference(
    food,
    dietary_preference
):
    """
    Hard filter based on dietary preference.
    """

    preference = normalize(
        dietary_preference
    )

    if (
        not preference
        or preference == "no specific preference"
    ):
        return True

    dietary_type = normalize_tag(
        food.get("Dietary_Type")
    )

    # --------------------------------------------------------
    # VEGETARIAN
    # --------------------------------------------------------

    if preference == "vegetarian":

        return dietary_type in {
            "vegetarian",
            "vegan",
        }

    # --------------------------------------------------------
    # VEGAN
    # --------------------------------------------------------

    if preference == "vegan":

        return dietary_type == "vegan"

    # --------------------------------------------------------
    # EGGETARIAN
    # --------------------------------------------------------

    if preference == "eggetarian":

        return dietary_type in {
            "eggetarian",
            "vegetarian",
            "vegan",
        }

    # --------------------------------------------------------
    # PESCATARIAN
    # --------------------------------------------------------

    if preference == "pescatarian":

        return dietary_type in {
            "pescatarian",
            "fish",
            "seafood",
            "eggetarian",
            "vegetarian",
            "vegan",
        }

    # --------------------------------------------------------
    # NON-VEGETARIAN
    # --------------------------------------------------------

    if preference == "non-vegetarian":

        return dietary_type in {
            "non-vegetarian",
            "meat",
            "poultry",
            "fish",
            "seafood",
            "eggetarian",
            "pescatarian",
        }

    return True


# ============================================================
# DIETARY PREFERENCE SCORING
# ============================================================

def get_preference_score(
    food,
    dietary_preference
):
    """
    Give a ranking boost to foods that closely match
    the selected dietary preference.
    """

    preference = normalize(
        dietary_preference
    )

    if (
        not preference
        or preference == "no specific preference"
    ):
        return 0

    dietary_type = normalize_tag(
        food.get("Dietary_Type")
    )

    # --------------------------------------------------------
    # VEGAN
    # --------------------------------------------------------

    if preference == "vegan":

        if dietary_type == "vegan":
            return 10

    # --------------------------------------------------------
    # VEGETARIAN
    # --------------------------------------------------------

    if preference == "vegetarian":

        if dietary_type == "vegetarian":
            return 10

        if dietary_type == "vegan":
            return 8

    # --------------------------------------------------------
    # EGGETARIAN
    # --------------------------------------------------------

    if preference == "eggetarian":

        if dietary_type == "eggetarian":
            return 10

        if dietary_type == "vegetarian":
            return 8

        if dietary_type == "vegan":
            return 7

    # --------------------------------------------------------
    # PESCATARIAN
    # --------------------------------------------------------

    if preference == "pescatarian":

        if dietary_type in {
            "pescatarian",
            "fish",
            "seafood",
        }:
            return 10

        if dietary_type == "eggetarian":
            return 8

        if dietary_type == "vegetarian":
            return 7

        if dietary_type == "vegan":
            return 6

    # --------------------------------------------------------
    # NON-VEGETARIAN
    # --------------------------------------------------------

    if preference == "non-vegetarian":

        if dietary_type in {
            "non-vegetarian",
            "meat",
            "poultry",
        }:
            return 10

        if dietary_type in {
            "fish",
            "seafood",
            "pescatarian",
        }:
            return 9

        if dietary_type == "eggetarian":
            return 8

    return 0


# ============================================================
# ALLERGEN FILTER
# ============================================================

def has_allergen_conflict(
    food,
    food_allergies
):
    """
    Return True if the food conflicts with
    any selected allergy.

    Uses:
        1. Dataset allergen tags
        2. Food category
        3. Obvious food-name indicators

    This helps catch foods when the dataset allergen
    column is blank but the food itself clearly indicates
    the allergen.
    """

    selected_allergies = {
        normalize_tag(item)
        for item in (food_allergies or [])
        if normalize_tag(item)
    }

    if not selected_allergies:
        return False

    food_allergens = {
        normalize_tag(item)
        for item in as_list(
            food.get("Allergen_Tags")
        )
        if normalize_tag(item)
    }

    food_name = normalize(
        food.get("Food_Name")
    )

    food_category = get_food_category(food)

    dietary_type = normalize_tag(
        food.get("Dietary_Type")
    )

    # --------------------------------------------------------
    # Direct dataset intersection
    # --------------------------------------------------------

    if selected_allergies.intersection(
        food_allergens
    ):
        return True

    # ========================================================
    # DAIRY
    # ========================================================

    if "dairy" in selected_allergies:

        # Actual dairy food
        if is_dairy_food(food):
            return True

        # Explicit dataset allergen
        if "dairy" in food_allergens:
            return True

    # ========================================================
    # NUTS
    # ========================================================

    if "nuts" in selected_allergies:

        if "nuts" in food_allergens:
            return True

        obvious_nut_terms = [
            "almond",
            "walnut",
            "cashew",
            "pistachio",
            "pecan",
            "hazelnut",
            "macadamia",
            "brazil nut",
            "mixed nuts",
            "tree nut",
            "tree nuts",
        ]

        if any(
            term in food_name
            for term in obvious_nut_terms
        ):
            return True

    # ========================================================
    # PEANUTS
    # ========================================================

    if "peanuts" in selected_allergies:

        if "peanuts" in food_allergens:
            return True

        peanut_terms = [
            "peanut",
            "peanuts",
            "groundnut",
            "groundnuts",
        ]

        if any(
            term in food_name
            for term in peanut_terms
        ):
            return True

    # ========================================================
    # SHELLFISH
    # ========================================================

    if "shellfish" in selected_allergies:

        if "shellfish" in food_allergens:
            return True

        shellfish_terms = [
            "shrimp",
            "prawn",
            "prawns",
            "crab",
            "lobster",
            "crayfish",
            "shellfish",
            "clam",
            "clams",
            "mussel",
            "mussels",
            "oyster",
            "oysters",
        ]

        if any(
            term in food_name
            for term in shellfish_terms
        ):
            return True

        if food_category == "seafood":
            # Only treat as shellfish when the
            # dataset itself identifies shellfish.
            if "shellfish" in food_allergens:
                return True

    # ========================================================
    # EGG
    # ========================================================

    if "egg" in selected_allergies:

        if "egg" in food_allergens:
            return True

        egg_terms = [
            "egg",
            "eggs",
        ]

        if any(
            term in food_name
            for term in egg_terms
        ):
            return True

        if food_category == "egg":
            return True

    # ========================================================
    # FISH
    # ========================================================

    if "fish" in selected_allergies:

        if "fish" in food_allergens:
            return True

        fish_terms = [
            "salmon",
            "tuna",
            "sardine",
            "sardines",
            "trout",
            "cod",
            "tilapia",
            "mackerel",
            "anchovy",
            "herring",
            "fish",
        ]

        if any(
            term in food_name
            for term in fish_terms
        ):
            return True

        if food_category == "fish":
            return True

    # ========================================================
    # SOY
    # ========================================================

    if "soy" in selected_allergies:

        if "soy" in food_allergens:
            return True

        soy_terms = [
            "soy",
            "soya",
            "tofu",
            "tempeh",
            "edamame",
        ]

        if any(
            term in food_name
            for term in soy_terms
        ):
            return True

    # ========================================================
    # SESAME
    # ========================================================

    if "sesame" in selected_allergies:

        if "sesame" in food_allergens:
            return True

        sesame_terms = [
            "sesame",
            "tahini",
        ]

        if any(
            term in food_name
            for term in sesame_terms
        ):
            return True

    # ========================================================
    # WHEAT
    # ========================================================

    if "wheat" in selected_allergies:

        if "wheat" in food_allergens:
            return True

        wheat_terms = [
            "wheat",
            "bread",
            "pasta",
            "chapati",
            "roti",
            "flour",
        ]

        if any(
            term in food_name
            for term in wheat_terms
        ):
            return True

    return False


# ============================================================
# HARD SAFETY FILTER
# ============================================================

def passes_safety_filter(food):
    """
    Keep only foods marked as suitable in the knowledge base.
    """

    safety = normalize(
        food.get("Pregnancy_Safety")
    )

    if safety not in {
        "safe",
        "generally safe",
        "best choice",
        "generally suitable when safely prepared",
    }:
        return False

    category = normalize(
        food.get("Food_Category")
    )

    # --------------------------------------------------------
    # Fish mercury filtering
    # --------------------------------------------------------

    if (
        "fish" in category
        or "seafood" in category
    ):

        mercury = normalize(
            food.get(
                "Fish_Mercury_Category"
            )
        )

        if mercury not in {
            "best choice",
            "good choice",
        }:
            return False

    return True


# ============================================================
# CONDITION MATCHING
# ============================================================

def get_condition_rows(
    conditions_df,
    detected_conditions
):
    """Return matching nutrition-condition rows."""

    if not detected_conditions:
        return conditions_df.iloc[0:0]

    wanted = {
        normalize(item)
        for item in detected_conditions
    }

    mask = conditions_df["Condition"].apply(
        lambda value:
        normalize(value) in wanted
    )

    return conditions_df[mask]


# ============================================================
# FOOD SCORING
# ============================================================

def score_food(
    food,
    detected_conditions,
    condition_rows,
    cravings,
    dietary_preference,
):
    """
    Explainable recommendation score.

    Craving matching receives a strong score because
    the selected cravings have already filtered the
    candidate pool.
    """

    score = 0

    reasons = []

    food_categories = tag_set(
        food.get("Food_Category")
    )

    # Use broad normalized category as well
    broad_category = get_food_category(food)

    food_cravings = tag_set(
        food.get("Craving_Tags")
    )

    food_meal_types = tag_set(
        food.get("Meal_Types")
    )

    # --------------------------------------------------------
    # CRAVINGS
    # --------------------------------------------------------

    for craving in cravings or []:

        craving_tag = normalize_tag(
            craving
        )

        # ----------------------------------------------------
        # Fruits
        # ----------------------------------------------------

        if (
            craving_tag == "fruits"
            and (
                broad_category == "fruits"
                or "fruits" in food_cravings
            )
        ):

            score += 10

            reasons.append(
                "matches your fruit craving"
            )

        # ----------------------------------------------------
        # Dairy
        # ----------------------------------------------------

        elif (
            craving_tag == "dairy"
            and is_dairy_food(food)
        ):

            score += 10

            reasons.append(
                "matches your dairy craving"
            )

        # ----------------------------------------------------
        # Carbohydrates
        # ----------------------------------------------------

        elif (
            craving_tag == "carbs"
            and (
                broad_category == "grains"
                or "carbs" in food_cravings
            )
        ):

            score += 10

            reasons.append(
                "matches your carbohydrate craving"
            )

        # ----------------------------------------------------
        # Sweet / Salty / Sour / Spicy / Crunchy
        # ----------------------------------------------------

        elif craving_tag in food_cravings:

            score += 10

            reasons.append(
                f"matches your {craving.lower()} craving"
            )

    # --------------------------------------------------------
    # WELLNESS CONDITIONS
    # --------------------------------------------------------

    for _, condition in condition_rows.iterrows():

        suggested_categories = tag_set(
            condition.get(
                "Suggested_Food_Categories"
            )
        )

        suggested_cravings = tag_set(
            condition.get(
                "Suggested_Craving_Tags"
            )
        )

        # ----------------------------------------------------
        # Category support
        # ----------------------------------------------------

        if (
            food_categories.intersection(
                suggested_categories
            )
            or broad_category in suggested_categories
        ):

            score += 3

            reasons.append(
                "supports the nutrition focus for "
                f"{condition['Condition']}"
            )

        # ----------------------------------------------------
        # Craving support
        # ----------------------------------------------------

        if food_cravings.intersection(
            suggested_cravings
        ):

            score += 2

    # --------------------------------------------------------
    # DIETARY PREFERENCE
    # --------------------------------------------------------

    preference_score = get_preference_score(
        food,
        dietary_preference
    )

    if preference_score > 0:

        score += preference_score

        preference_text = normalize(
            dietary_preference
        )

        if (
            preference_text
            and preference_text
            != "no specific preference"
        ):

            reasons.append(
                f"matches your "
                f"{preference_text} preference"
            )

    # --------------------------------------------------------
    # MEAL TYPE
    # --------------------------------------------------------

    meal_bonus = 0

    if "breakfast" in food_meal_types:
        meal_bonus += 1

    if "snack" in food_meal_types:
        meal_bonus += 1

    if "lunch" in food_meal_types:
        meal_bonus += 1

    if "dinner" in food_meal_types:
        meal_bonus += 1

    score += min(meal_bonus, 2)

    # --------------------------------------------------------
    # GENERAL FALLBACK
    # --------------------------------------------------------

    if score == 0:

        score = 1

        reasons.append(
            "is a pregnancy-friendly option "
            "from your nutrition food list"
        )

    # --------------------------------------------------------
    # REMOVE DUPLICATE REASONS
    # --------------------------------------------------------

    unique_reasons = []

    for reason in reasons:

        if reason not in unique_reasons:
            unique_reasons.append(reason)

    return score, unique_reasons


# ============================================================
# DIVERSITY SELECTION
# ============================================================

def select_diverse_recommendations(
    recommendations,
    limit
):
    """
    Select recommendations while creating variety.

    Priority:
        1. Different food categories
        2. Different primary meal types
        3. Highest scoring remaining foods

    Important:
        Diversity never introduces a food that failed
        craving, preference, allergy, or safety filtering.
    """

    if not recommendations:
        return []

    selected = []

    selected_names = set()

    selected_categories = set()

    selected_meal_types = set()

    # --------------------------------------------------------
    # First pass:
    # Prefer different food categories.
    # --------------------------------------------------------

    for item in recommendations:

        if len(selected) >= limit:
            break

        name = item["food_name"]

        if name in selected_names:
            continue

        category = normalize(
            item.get("_broad_category")
        ) or "other"

        if category in selected_categories:
            continue

        selected.append(item)

        selected_names.add(name)

        selected_categories.add(category)

        meal_types = as_list(
            item.get("meal_types")
        )

        if meal_types:
            selected_meal_types.add(
                normalize(meal_types[0])
            )

    # --------------------------------------------------------
    # Second pass:
    # Prefer different primary meal types.
    # --------------------------------------------------------

    for item in recommendations:

        if len(selected) >= limit:
            break

        name = item["food_name"]

        if name in selected_names:
            continue

        meal_types = as_list(
            item.get("meal_types")
        )

        primary_meal_type = (
            normalize(meal_types[0])
            if meal_types
            else "other"
        )

        if primary_meal_type in selected_meal_types:
            continue

        selected.append(item)

        selected_names.add(name)

        selected_meal_types.add(
            primary_meal_type
        )

    # --------------------------------------------------------
    # Third pass:
    # Fill remaining slots using highest scoring foods.
    # --------------------------------------------------------

    for item in recommendations:

        if len(selected) >= limit:
            break

        name = item["food_name"]

        if name in selected_names:
            continue

        selected.append(item)

        selected_names.add(name)

    return selected[:limit]


# ============================================================
# MAIN RECOMMENDATION FUNCTION
# ============================================================

def generate_nutrition_recommendations(
    wellness=None,
    dietary_preference="",
    food_allergies=None,
    pregnancy_info=None,
    limit=12,
):
    """
    Generate personalized educational food suggestions.

    The engine considers:

    - pregnancy stage
    - today's wellness
    - cravings
    - dietary preference
    - allergies
    - nutrition conditions
    - food safety

    Multiple cravings are treated as AND conditions.

    Example:

        Sweet + Dairy

    requires a food to satisfy both Sweet
    and Dairy.
    """

    wellness = wellness or {}

    food_allergies = (
        food_allergies or []
    )

    pregnancy_info = (
        pregnancy_info or {}
    )

    # --------------------------------------------------------
    # Safe limit
    # --------------------------------------------------------

    try:
        limit = int(limit)

    except (TypeError, ValueError):

        limit = 12

    if limit < 1:
        limit = 1

    if limit > 20:
        limit = 20

    # --------------------------------------------------------
    # Load datasets
    # --------------------------------------------------------

    foods_df, conditions_df = (
        load_nutrition_data()
    )

    # --------------------------------------------------------
    # Detect wellness conditions
    # --------------------------------------------------------

    detected_conditions = (
        detect_conditions(wellness)
    )

    # --------------------------------------------------------
    # Matching condition rows
    # --------------------------------------------------------

    condition_rows = get_condition_rows(
        conditions_df,
        detected_conditions
    )

    # --------------------------------------------------------
    # Cravings
    # --------------------------------------------------------

    cravings = as_list(
        wellness.get("cravings")
    )

    # --------------------------------------------------------
    # Generate candidates
    # --------------------------------------------------------

    recommendations = []

    for _, row in foods_df.iterrows():

        food = row.to_dict()

        # ----------------------------------------------------
        # SAFETY
        # ----------------------------------------------------

        if not passes_safety_filter(food):
            continue

        # ----------------------------------------------------
        # CRAVING FOCUS
        # ----------------------------------------------------

        if not matches_craving_focus(
            food,
            cravings
        ):
            continue

        # ----------------------------------------------------
        # DIETARY PREFERENCE
        # ----------------------------------------------------

        if not matches_dietary_preference(
            food,
            dietary_preference
        ):
            continue

        # ----------------------------------------------------
        # ALLERGIES
        # ----------------------------------------------------

        if has_allergen_conflict(
            food,
            food_allergies
        ):
            continue

        # ----------------------------------------------------
        # SCORE
        # ----------------------------------------------------

        score, reasons = score_food(
            food,
            detected_conditions,
            condition_rows,
            cravings,
            dietary_preference
        )

        broad_category = get_food_category(
            food
        )

        recommendations.append(
            {
                "food_name": food.get(
                    "Food_Name",
                    ""
                ),

                "category": food.get(
                    "Food_Category",
                    ""
                ),

                "dietary_type": food.get(
                    "Dietary_Type",
                    ""
                ),

                "key_nutrients": food.get(
                    "Key_Nutrients",
                    ""
                ),

                "meal_types": food.get(
                    "Meal_Types",
                    ""
                ),

                "score": score,

                "reasons": reasons,

                "preparation_safety": food.get(
                    "Preparation_Safety",
                    ""
                ),

                "fish_mercury_category": food.get(
                    "Fish_Mercury_Category",
                    ""
                ),

                "_broad_category":
                    broad_category,
            }
        )

    # --------------------------------------------------------
    # Sort by score
    # --------------------------------------------------------

    recommendations.sort(
        key=lambda item: (
            -item["score"],
            item["food_name"]
        )
    )

    # --------------------------------------------------------
    # Create diverse result
    # --------------------------------------------------------

    diverse_recommendations = (
        select_diverse_recommendations(
            recommendations,
            limit
        )
    )

    # --------------------------------------------------------
    # Remove internal fields
    # --------------------------------------------------------

    final_recommendations = []

    for item in diverse_recommendations:

        clean_item = {
            key: value
            for key, value in item.items()
            if not key.startswith("_")
        }

        final_recommendations.append(
            clean_item
        )

    # --------------------------------------------------------
    # RESPONSE
    # --------------------------------------------------------

    return {

        "pregnancy_context": {

            "week": (
                pregnancy_info.get("weeks")
                if pregnancy_info
                else None
            ),

            "trimester": (
                pregnancy_info.get("trimester")
                if pregnancy_info
                else None
            ),
        },

        "detected_wellness_conditions": (
            detected_conditions
        ),

        "cravings": cravings,

        "dietary_preference": (
            dietary_preference
        ),

        "food_allergies": (
            food_allergies
        ),

        "recommendations":
            final_recommendations,

        "disclaimer": (
            "These are educational food suggestions "
            "based on recorded wellness information. "
            "They are not a medical diagnosis or "
            "individualized medical treatment."
        ),
    }