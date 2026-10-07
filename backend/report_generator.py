from datetime import datetime, date
from io import BytesIO
from collections import Counter

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    KeepTogether,
)


# ============================================================
# BASIC HELPERS
# ============================================================

def value(record, key, default=None):
    if not isinstance(record, dict):
        return default

    result = record.get(key)

    if result is None:
        return default

    return result


def text(value_, default="Not recorded"):
    if value_ is None:
        return default

    if isinstance(value_, str):
        value_ = value_.strip()

        if not value_:
            return default

        return value_

    return str(value_)


def display(value_, default="Not recorded"):
    return text(value_, default)


def nested(record, *keys, default=None):
    current = record

    for key in keys:

        if not isinstance(current, dict):
            return default

        current = current.get(key)

        if current is None:
            return default

    return current


# ============================================================
# DATE HELPERS
# ============================================================

def parse_date(value_):
    """
    Handles:
    - YYYY-MM-DD
    - ISO datetime strings
    - DD/MM/YYYY
    - DD-MM-YYYY
    - locale strings such as:
      06/10/2026, 7:30:15 pm
    """

    if value_ is None:
        return None

    if isinstance(value_, datetime):
        return value_.date()

    if isinstance(value_, date):
        return value_

    raw = str(value_).strip()

    if not raw:
        return None

    # ISO date/datetime
    try:
        return datetime.fromisoformat(
            raw.replace("Z", "+00:00")
        ).date()
    except Exception:
        pass

    formats = [
        "%Y-%m-%d",
        "%d/%m/%Y",
        "%d-%m-%Y",
        "%m/%d/%Y",
        "%d/%m/%Y, %I:%M:%S %p",
        "%d/%m/%Y, %I:%M %p",
        "%m/%d/%Y, %I:%M:%S %p",
        "%m/%d/%Y, %I:%M %p",
    ]

    for fmt in formats:

        try:
            return datetime.strptime(
                raw,
                fmt
            ).date()
        except Exception:
            continue

    # Try the first date portion of a locale string
    try:
        first_part = raw.split(",")[0].strip()

        for fmt in [
            "%d/%m/%Y",
            "%m/%d/%Y",
            "%d-%m-%Y",
        ]:
            try:
                return datetime.strptime(
                    first_part,
                    fmt
                ).date()
            except Exception:
                pass

    except Exception:
        pass

    return None


def record_date(record):
    if not isinstance(record, dict):
        return None

    return parse_date(
        record.get("selectedDate")
        or record.get("date")
        or record.get("created_at")
        or record.get("createdAt")
    )


def filter_records(records, start_date, end_date):

    if not records:
        return []

    start = parse_date(start_date)
    end = parse_date(end_date)

    if not start or not end:
        return records

    filtered = []

    for record in records:

        current = record_date(record)

        if current is None:
            continue

        if start <= current <= end:
            filtered.append(record)

    return filtered


def latest_record(records):
    if not records:
        return None

    dated = [
        record
        for record in records
        if record_date(record) is not None
    ]

    if not dated:
        return records[-1]

    return max(
        dated,
        key=lambda record: record_date(record)
    )


def format_date(value_):
    parsed = parse_date(value_)

    if not parsed:
        return "Not recorded"

    return parsed.strftime("%d %b %Y")


def format_lmp(value_):
    if not value_:
        return "Not recorded"

    return format_date(value_)


# ============================================================
# VALUE / LIST HELPERS
# ============================================================

def as_list(value_):

    if value_ is None:
        return []

    if isinstance(value_, list):
        return value_

    if isinstance(value_, tuple):
        return list(value_)

    if isinstance(value_, str):

        cleaned = value_.strip()

        if not cleaned:
            return []

        return [cleaned]

    return [value_]


def clean_items(items):

    result = []

    for item in as_list(items):

        if item is None:
            continue

        if isinstance(item, dict):
            continue

        cleaned = str(item).strip()

        if cleaned:
            result.append(cleaned)

    return result


def frequency_text(values, limit=6):

    cleaned = clean_items(values)

    if not cleaned:
        return "Not recorded"

    counter = Counter(cleaned)

    parts = []

    for item, count in counter.most_common(limit):

        if count > 1:
            parts.append(
                f"{item} ({count})"
            )
        else:
            parts.append(item)

    return ", ".join(parts)


def average(values):

    numbers = []

    for item in values:

        try:
            numbers.append(float(item))
        except Exception:
            continue

    if not numbers:
        return None

    return sum(numbers) / len(numbers)


def fmt_number(value_, decimals=2):

    try:
        number = float(value_)

        if decimals == 0:
            return str(int(round(number)))

        return f"{number:.{decimals}f}"

    except Exception:
        return "Not recorded"


# ============================================================
# REPORT STYLES
# ============================================================

styles = getSampleStyleSheet()

TITLE_STYLE = ParagraphStyle(
    "ReportTitle",
    parent=styles["Title"],
    fontName="Helvetica-Bold",
    fontSize=18,
    leading=22,
    alignment=TA_CENTER,
    spaceAfter=3 * mm,
)

SUBTITLE_STYLE = ParagraphStyle(
    "ReportSubtitle",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=11,
    leading=14,
    alignment=TA_CENTER,
    textColor=colors.HexColor("#666666"),
)

SECTION_STYLE = ParagraphStyle(
    "SectionHeading",
    parent=styles["Heading2"],
    fontName="Helvetica-Bold",
    fontSize=11,
    leading=14,
    textColor=colors.HexColor("#60446f"),
    spaceBefore=5 * mm,
    spaceAfter=2 * mm,
)

BODY_STYLE = ParagraphStyle(
    "Body",
    parent=styles["BodyText"],
    fontName="Helvetica",
    fontSize=9,
    leading=13,
    spaceAfter=1.5 * mm,
)

SMALL_STYLE = ParagraphStyle(
    "Small",
    parent=styles["BodyText"],
    fontName="Helvetica",
    fontSize=8,
    leading=11,
    textColor=colors.HexColor("#666666"),
)

LABEL_STYLE = ParagraphStyle(
    "Label",
    parent=styles["BodyText"],
    fontName="Helvetica-Bold",
    fontSize=8.5,
    leading=11,
)

VALUE_STYLE = ParagraphStyle(
    "Value",
    parent=styles["BodyText"],
    fontName="Helvetica",
    fontSize=8.5,
    leading=11,
)


# ============================================================
# TABLE HELPERS
# ============================================================

def information_table(rows):

    data = [
        [
            Paragraph("Information", LABEL_STYLE),
            Paragraph("Recorded value", LABEL_STYLE),
        ]
    ]

    for label, value_ in rows:

        data.append(
            [
                Paragraph(
                    text(label),
                    VALUE_STYLE
                ),
                Paragraph(
                    text(value_),
                    VALUE_STYLE
                ),
            ]
        )

    table = Table(
        data,
        colWidths=[
            58 * mm,
            112 * mm,
        ],
        repeatRows=1,
    )

    table.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, 0),
                    colors.HexColor("#f4edf8"),
                ),
                (
                    "TEXTCOLOR",
                    (0, 0),
                    (-1, 0),
                    colors.HexColor("#60446f"),
                ),
                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.35,
                    colors.HexColor("#dddddd"),
                ),
                (
                    "VALIGN",
                    (0, 0),
                    (-1, -1),
                    "TOP",
                ),
                (
                    "LEFTPADDING",
                    (0, 0),
                    (-1, -1),
                    6,
                ),
                (
                    "RIGHTPADDING",
                    (0, 0),
                    (-1, -1),
                    6,
                ),
                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    5,
                ),
                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    5,
                ),
            ]
        )
    )

    return table


def section_heading(title):
    return Paragraph(
        title,
        SECTION_STYLE
    )


# ============================================================
# PATIENT INFORMATION
# ============================================================

def build_patient_section(
    story,
    patient_name,
    maternal_records
):

    story.append(
        section_heading(
            "PATIENT INFORMATION"
        )
    )

    latest = latest_record(
        maternal_records
    )

    age = None

    if latest:

        data = latest.get(
            "data",
            {}
        )

        if isinstance(data, dict):
            age = data.get("Age")

    story.append(
        information_table(
            [
                (
                    "Name",
                    display(
                        patient_name,
                        "Patient"
                    ),
                ),
                (
                    "Age",
                    (
                        f"{age} years"
                        if age not in [None, ""]
                        else "Not recorded"
                    ),
                ),
            ]
        )
    )


# ============================================================
# PREGNANCY INFORMATION
# ============================================================

def build_pregnancy_section(
    story,
    pregnancy_info,
    maternal_records
):

    story.append(
        section_heading(
            "PREGNANCY INFORMATION"
        )
    )

    pregnancy_info = (
        pregnancy_info
        if isinstance(
            pregnancy_info,
            dict
        )
        else {}
    )

    latest = latest_record(
        maternal_records
    )

    maternal_pregnancy = {}

    if latest:
        maternal_pregnancy = (
            latest.get(
                "pregnancy",
                {}
            )
            or {}
        )

    weeks = (
        pregnancy_info.get("weeks")
        or maternal_pregnancy.get("week")
    )

    days = (
        pregnancy_info.get("days")
        or maternal_pregnancy.get("days")
    )

    trimester = (
        pregnancy_info.get("trimester")
        or maternal_pregnancy.get("trimester")
    )

    due_date = (
        pregnancy_info.get("dueDate")
        or maternal_pregnancy.get("dueDate")
    )

    lmp_date = (
        pregnancy_info.get("lmpDate")
    )

    week_text = "Not recorded"

    if weeks is not None:

        week_text = f"Week {weeks}"

        if days is not None:
            week_text += f" + {days} days"

    story.append(
        information_table(
            [
                (
                    "Pregnancy week",
                    week_text,
                ),
                (
                    "Trimester",
                    display(
                        trimester
                    ),
                ),
                (
                    "LMP",
                    format_lmp(
                        lmp_date
                    ),
                ),
                (
                    "Expected due date",
                    display(
                        due_date
                    ),
                ),
            ]
        )
    )


# ============================================================
# MATERNAL HEALTH ASSESSMENT
# ============================================================

def build_maternal_assessment_section(
    story,
    maternal_records
):

    story.append(
        section_heading(
            "MATERNAL HEALTH ASSESSMENT"
        )
    )

    latest = latest_record(
        maternal_records
    )

    if not latest:

        story.append(
            Paragraph(
                "No maternal health assessment was recorded during the selected period.",
                BODY_STYLE,
            )
        )

        return

    data = latest.get(
        "data",
        {}
    )

    if not isinstance(data, dict):
        data = {}

    systolic = data.get(
        "SystolicBP"
    )

    diastolic = data.get(
        "DiastolicBP"
    )

    blood_pressure = "Not recorded"

    if (
        systolic not in [None, ""]
        and diastolic not in [None, ""]
    ):
        blood_pressure = (
            f"{systolic} / {diastolic} mmHg"
        )

    blood_sugar = data.get("BS")
    body_temp = data.get("BodyTemp")
    heart_rate = data.get("HeartRate")

    risk_level = (
        latest.get("riskClass")
        or latest.get("result")
        or "Not recorded"
    )

    assessment_date = format_date(
        latest.get("date")
        or latest.get("selectedDate")
    )

    story.append(
        information_table(
            [
                (
                    "Assessment date",
                    assessment_date,
                ),
                (
                    "Blood pressure",
                    blood_pressure,
                ),
                (
                    "Blood sugar",
                    (
                        f"{blood_sugar} mmol/L"
                        if blood_sugar not in [None, ""]
                        else "Not recorded"
                    ),
                ),
                (
                    "Body temperature",
                    (
                        f"{body_temp} °F"
                        if body_temp not in [None, ""]
                        else "Not recorded"
                    ),
                ),
                (
                    "Heart rate",
                    (
                        f"{heart_rate} bpm"
                        if heart_rate not in [None, ""]
                        else "Not recorded"
                    ),
                ),
            ]
        )
    )

    story.append(
        Spacer(1, 2 * mm)
    )

    risk_table = Table(
        [
            [
                Paragraph(
                    "<b>Risk classification</b>",
                    VALUE_STYLE
                ),
                Paragraph(
                    f"<b>{display(risk_level)}</b>",
                    VALUE_STYLE
                ),
            ]
        ],
        colWidths=[
            58 * mm,
            112 * mm,
        ],
    )

    risk_table.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, -1),
                    colors.HexColor("#f8f2fa"),
                ),
                (
                    "BOX",
                    (0, 0),
                    (-1, -1),
                    0.6,
                    colors.HexColor("#c9a9dc"),
                ),
                (
                    "LEFTPADDING",
                    (0, 0),
                    (-1, -1),
                    6,
                ),
                (
                    "RIGHTPADDING",
                    (0, 0),
                    (-1, -1),
                    6,
                ),
                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    6,
                ),
                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    6,
                ),
            ]
        )
    )

    story.append(
        risk_table
    )


# ============================================================
# DAILY WELLNESS
# ============================================================

def build_wellness_section(
    story,
    wellness_records
):

    story.append(
        section_heading(
            "DAILY WELLNESS SUMMARY"
        )
    )

    if not wellness_records:

        story.append(
            Paragraph(
                "No daily wellness check-ins were recorded during the selected period.",
                BODY_STYLE,
            )
        )

        return

    moods = []
    energies = []
    sleep_hours = []
    water_values = []
    cravings = []

    for record in wellness_records:

        moods.append(
            record.get("mood")
        )

        energy = record.get("energy")

        if energy not in [None, ""]:
            energies.append(
                energy
            )

        hours = record.get(
            "sleepHours"
        )

        minutes = record.get(
            "sleepMinutes"
        )

        try:

            total_hours = (
                float(hours or 0)
                + float(minutes or 0) / 60
            )

            if total_hours > 0:
                sleep_hours.append(
                    total_hours
                )

        except Exception:
            pass

        water = record.get(
            "water"
        )

        if water not in [None, ""]:
            try:
                water_values.append(
                    float(water)
                )
            except Exception:
                pass

        cravings.extend(
            clean_items(
                record.get(
                    "cravings"
                )
            )
        )

    avg_energy = average(
        energies
    )

    avg_sleep = average(
        sleep_hours
    )

    avg_water = average(
        water_values
    )

    mood_summary = frequency_text(
        moods
    )

    if avg_energy is None:
        energy_summary = "Not recorded"
    else:
        energy_summary = (
            f"{fmt_number(avg_energy)} / 5"
        )

    if avg_sleep is None:
        sleep_summary = "Not recorded"
    else:
        sleep_summary = (
            f"{fmt_number(avg_sleep)} hours average"
        )

    if avg_water is None:
        water_summary = "Not recorded"
    else:
        water_summary = (
            f"{fmt_number(avg_water)} glasses average"
        )

    story.append(
        information_table(
            [
                (
                    "Check-ins recorded",
                    str(len(wellness_records)),
                ),
                (
                    "Mood",
                    mood_summary,
                ),
                (
                    "Average energy",
                    energy_summary,
                ),
                (
                    "Sleep",
                    sleep_summary,
                ),
                (
                    "Water intake",
                    water_summary,
                ),
                (
                    "Cravings",
                    frequency_text(
                        cravings
                    ),
                ),
            ]
        )
    )


# ============================================================
# WELLNESS OBSERVATIONS
# ============================================================

def build_wellness_observations(
    story,
    wellness_records
):

    story.append(
        section_heading(
            "WELLNESS OBSERVATIONS"
        )
    )

    if not wellness_records:

        story.append(
            Paragraph(
                "No wellness observations were recorded during the selected period.",
                BODY_STYLE,
            )
        )

        return

    fields = [
        (
            "Feelings",
            "feelings",
        ),
        (
            "Pain / body comfort",
            "pain",
        ),
        (
            "Sleep quality",
            "sleepQuality",
        ),
        (
            "Bleeding / discharge",
            "discharge",
        ),
        (
            "Digestion",
            "digestion",
        ),
        (
            "Skin",
            "skin",
        ),
        (
            "Hair",
            "hair",
        ),
        (
            "Ailments / symptoms",
            "ailments",
        ),
    ]

    rows = []

    for label, key in fields:

        values = []

        for record in wellness_records:

            current = record.get(
                key
            )

            values.extend(
                clean_items(current)
            )

        rows.append(
            (
                label,
                frequency_text(values)
            )
        )

    # Notes / feelings written by user
    notes = []

    for record in wellness_records:

        for key in [
            "notes",
            "feelingsNotes",
            "painNotes",
            "symptoms",
        ]:

            current = record.get(
                key
            )

            if isinstance(
                current,
                str
            ) and current.strip():

                notes.append(
                    current.strip()
                )

    if notes:

        rows.append(
            (
                "Recorded notes",
                " | ".join(
                    notes[-5:]
                ),
            )
        )

    story.append(
        information_table(
            rows
        )
    )


# ============================================================
# NUTRITION
# ============================================================

def build_nutrition_section(
    story,
    nutrition_records,
    wellness_records
):

    story.append(
        section_heading(
            "NUTRITION SUMMARY"
        )
    )

    if not nutrition_records:

        story.append(
            Paragraph(
                "No nutrition records were recorded during the selected period.",
                BODY_STYLE,
            )
        )

        return

    dietary_preferences = []
    allergies = []
    nutrition_cravings = []
    focus = []

    for record in nutrition_records:

        dietary_preferences.extend(
            clean_items(
                record.get(
                    "dietaryPreference"
                )
                or record.get(
                    "dietaryPreferences"
                )
                or record.get(
                    "preference"
                )
            )
        )

        allergies.extend(
            clean_items(
                record.get(
                    "allergies"
                )
                or record.get(
                    "foodAllergies"
                )
            )
        )

        nutrition_cravings.extend(
            clean_items(
                record.get(
                    "cravings"
                )
            )
        )

        focus.extend(
            clean_items(
                record.get(
                    "nutritionFocus"
                )
                or record.get(
                    "focus"
                )
                or record.get(
                    "selectedFoods"
                )
            )
        )

    # Wellness cravings are useful context for the nutrition
    # section when nutrition records themselves do not contain them.
    if not nutrition_cravings:

        for record in wellness_records:

            nutrition_cravings.extend(
                clean_items(
                    record.get(
                        "cravings"
                    )
                )
            )

    story.append(
        information_table(
            [
                (
                    "Nutrition records",
                    str(len(nutrition_records)),
                ),
                (
                    "Dietary preference",
                    frequency_text(
                        dietary_preferences
                    ),
                ),
                (
                    "Food allergies",
                    frequency_text(
                        allergies
                    ),
                ),
                (
                    "Recorded cravings",
                    frequency_text(
                        nutrition_cravings
                    ),
                ),
                (
                    "Nutrition focus",
                    frequency_text(
                        focus
                    ),
                ),
            ]
        )
    )


# ============================================================
# ACTIVITY & EXERCISE
# ============================================================

def build_activity_section(
    story,
    activity_records
):

    story.append(
        section_heading(
            "ACTIVITY & EXERCISE"
        )
    )

    if not activity_records:

        story.append(
            Paragraph(
                "No activity plans were recorded during the selected period.",
                BODY_STYLE,
            )
        )

        return

    categories = []
    exercises = []
    statuses = []

    for record in activity_records:

        statuses.append(
            record.get(
                "status"
            )
        )

        recommendations = record.get(
            "recommendations",
            []
        )

        if not isinstance(
            recommendations,
            list
        ):
            recommendations = []

        for recommendation in recommendations:

            if not isinstance(
                recommendation,
                dict
            ):
                continue

            category = (
                recommendation.get(
                    "category"
                )
            )

            exercise_name = (
                recommendation.get(
                    "exercise_name"
                )
                or recommendation.get(
                    "name"
                )
            )

            if category:
                categories.append(
                    str(category)
                )

            if exercise_name:
                exercises.append(
                    str(exercise_name)
                )

    story.append(
        information_table(
            [
                (
                    "Activity plans recorded",
                    str(len(activity_records)),
                ),
                (
                    "Categories",
                    frequency_text(
                        categories
                    ),
                ),
                (
                    "Exercises",
                    frequency_text(
                        exercises,
                        limit=10
                    ),
                ),
                (
                    "Activity status",
                    frequency_text(
                        statuses
                    ),
                ),
            ]
        )
    )


# ============================================================
# OVERALL SUMMARY
# ============================================================

def build_overall_summary(
    story,
    maternal_records,
    wellness_records,
    nutrition_records,
    activity_records
):

    story.append(
        section_heading(
            "OVERALL SUMMARY"
        )
    )

    total = (
        len(maternal_records)
        + len(wellness_records)
        + len(nutrition_records)
        + len(activity_records)
    )

    latest_maternal = latest_record(
        maternal_records
    )

    summary_parts = []

    summary_parts.append(
        f"{total} record(s) were available "
        "for the selected report period."
    )

    if maternal_records:

        summary_parts.append(
            f"{len(maternal_records)} "
            "maternal health assessment(s) "
            "were recorded."
        )

    if wellness_records:

        summary_parts.append(
            f"{len(wellness_records)} "
            "daily wellness check-in(s) "
            "were recorded."
        )

    if nutrition_records:

        summary_parts.append(
            f"{len(nutrition_records)} "
            "nutrition record(s) were recorded."
        )

    if activity_records:

        summary_parts.append(
            f"{len(activity_records)} "
            "activity plan(s) were recorded."
        )

    if latest_maternal:

        risk = (
            latest_maternal.get(
                "riskClass"
            )
            or latest_maternal.get(
                "result"
            )
        )

        if risk:

            summary_parts.append(
                f"The latest recorded maternal "
                f"risk classification was "
                f"{risk}."
            )

    for item in summary_parts:

        story.append(
            Paragraph(
                item,
                BODY_STYLE
            )
        )


# ============================================================
# CLINICAL REVIEW
# ============================================================

def build_clinical_review(
    story,
    maternal_records,
    wellness_records,
    nutrition_records,
    activity_records
):

    story.append(
        section_heading(
            "OBSERVATIONS FOR CLINICAL REVIEW"
        )
    )

    observations = []

    latest_maternal = latest_record(
        maternal_records
    )

    if latest_maternal:

        assessment_date = format_date(
            latest_maternal.get(
                "date"
            )
            or latest_maternal.get(
                "selectedDate"
            )
        )

        risk = (
            latest_maternal.get(
                "riskClass"
            )
            or latest_maternal.get(
                "result"
            )
        )

        observations.append(
            f"Latest maternal health assessment: "
            f"{assessment_date}."
        )

        if risk:

            observations.append(
                f"Recorded model risk classification: "
                f"{risk}."
            )

    if wellness_records:

        observations.append(
            f"{len(wellness_records)} daily wellness "
            "check-in(s) were available for review."
        )

    if nutrition_records:

        observations.append(
            f"{len(nutrition_records)} nutrition "
            "record(s) were available for review."
        )

    if activity_records:

        observations.append(
            f"{len(activity_records)} activity "
            "plan(s) were available for review."
        )

    if not observations:

        observations.append(
            "No clinical observations were recorded "
            "during the selected period."
        )

    for observation in observations:

        story.append(
            Paragraph(
                f"• {observation}",
                BODY_STYLE
            )
        )

    story.append(
        Spacer(1, 2 * mm)
    )

    story.append(
        Paragraph(
            "These observations summarize information entered "
            "into the application. They are provided for clinical "
            "review and discussion only and are not diagnoses or "
            "treatment recommendations.",
            SMALL_STYLE,
        )
    )


# ============================================================
# DISCLAIMER
# ============================================================

def build_disclaimer(story):

    story.append(
        Spacer(1, 5 * mm)
    )

    disclaimer_table = Table(
        [
            [
                Paragraph(
                    "<b>DISCLAIMER</b>",
                    LABEL_STYLE
                )
            ],
            [
                Paragraph(
                    "Educational and decision-support purposes only. "
                    "Not a medical diagnosis. This report does not "
                    "replace professional medical care.",
                    SMALL_STYLE,
                )
            ],
        ],
        colWidths=[
            170 * mm
        ],
    )

    disclaimer_table.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, -1),
                    colors.HexColor("#faf7fc"),
                ),
                (
                    "BOX",
                    (0, 0),
                    (-1, -1),
                    0.6,
                    colors.HexColor("#d8c5e3"),
                ),
                (
                    "LEFTPADDING",
                    (0, 0),
                    (-1, -1),
                    8,
                ),
                (
                    "RIGHTPADDING",
                    (0, 0),
                    (-1, -1),
                    8,
                ),
                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    6,
                ),
                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    6,
                ),
            ]
        )
    )

    story.append(
        disclaimer_table
    )


# ============================================================
# MAIN PDF GENERATOR
# ============================================================

def generate_doctor_report_pdf(
    start_date,
    end_date,
    patient_name="Patient",
    pregnancy_info=None,
    maternal_history=None,
    wellness_history=None,
    nutrition_history=None,
    activity_history=None,
):

    maternal_history = (
        maternal_history
        if isinstance(
            maternal_history,
            list
        )
        else []
    )

    wellness_history = (
        wellness_history
        if isinstance(
            wellness_history,
            list
        )
        else []
    )

    nutrition_history = (
        nutrition_history
        if isinstance(
            nutrition_history,
            list
        )
        else []
    )

    activity_history = (
        activity_history
        if isinstance(
            activity_history,
            list
        )
        else []
    )

    maternal_records = filter_records(
        maternal_history,
        start_date,
        end_date
    )

    wellness_records = filter_records(
        wellness_history,
        start_date,
        end_date
    )

    nutrition_records = filter_records(
        nutrition_history,
        start_date,
        end_date
    )

    activity_records = filter_records(
        activity_history,
        start_date,
        end_date
    )

    story = []

    # --------------------------------------------------------
    # REPORT HEADER
    # --------------------------------------------------------

    story.append(
        Spacer(1, 2 * mm)
    )

    story.append(
        Paragraph(
            "MATERNAL HEALTH & WELLNESS",
            TITLE_STYLE,
        )
    )

    story.append(
        Paragraph(
            "MEDICAL REPORT",
            TITLE_STYLE,
        )
    )

    story.append(
        Spacer(1, 1 * mm)
    )

    story.append(
        Paragraph(
            f"Report Date: "
            f"{datetime.now().strftime('%d %B %Y')}",
            SUBTITLE_STYLE,
        )
    )

    story.append(
        Spacer(1, 5 * mm)
    )

    # --------------------------------------------------------
    # SECTIONS
    # --------------------------------------------------------

    build_patient_section(
        story,
        patient_name,
        maternal_records
    )

    build_pregnancy_section(
        story,
        pregnancy_info,
        maternal_records
    )

    build_maternal_assessment_section(
        story,
        maternal_records
    )

    build_wellness_section(
        story,
        wellness_records
    )

    build_wellness_observations(
        story,
        wellness_records
    )

    build_nutrition_section(
        story,
        nutrition_records,
        wellness_records
    )

    build_activity_section(
        story,
        activity_records
    )

    build_overall_summary(
        story,
        maternal_records,
        wellness_records,
        nutrition_records,
        activity_records
    )

    build_clinical_review(
        story,
        maternal_records,
        wellness_records,
        nutrition_records,
        activity_records
    )

    build_disclaimer(
        story
    )

    # --------------------------------------------------------
    # PDF
    # --------------------------------------------------------

    buffer = BytesIO()

    document = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=20 * mm,
        leftMargin=20 * mm,
        topMargin=18 * mm,
        bottomMargin=18 * mm,
        title="Maternal Health & Wellness Medical Report",
        author="Maternal Health and Wellness System",
    )

    document.build(
        story
    )

    buffer.seek(0)

    filename = (
        f"doctor_visit_report_"
        f"{str(start_date).replace('-', '')}_"
        f"{str(end_date).replace('-', '')}.pdf"
    )

    return buffer, filename