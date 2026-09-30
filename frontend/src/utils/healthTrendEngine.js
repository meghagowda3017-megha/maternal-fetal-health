// ============================================================
// HEALTH TREND ENGINE
// Maternal Health and Wellness Project
// ============================================================
//
// This engine analyzes previous maternal assessments.
//
// It is designed for:
// - trend observation
// - comparison of recent assessments
// - wellness decision support
//
// It does NOT diagnose medical conditions.
// ============================================================


// ------------------------------------------------------------
// SAFE NUMBER CONVERSION
// ------------------------------------------------------------

const toNumber = (value) => {
  const number = Number(value)

  return Number.isFinite(number)
    ? number
    : null
}


// ------------------------------------------------------------
// SORT ASSESSMENTS BY DATE
// ------------------------------------------------------------

const sortAssessmentsByDate = (assessments) => {
  return [...assessments]
    .filter((item) => item && item.date)
    .sort(
      (a, b) =>
        new Date(a.date) - new Date(b.date)
    )
}


// ------------------------------------------------------------
// GET VALID NUMERIC VALUES
// ------------------------------------------------------------

const getValues = (assessments, field) => {
  return assessments
    .map((assessment) =>
      toNumber(assessment?.data?.[field])
    )
    .filter(
      (value) => value !== null
    )
}


// ------------------------------------------------------------
// DETERMINE BASIC TREND
// ------------------------------------------------------------

const getTrend = (values) => {
  if (values.length < 2) {
    return 'insufficient_data'
  }

  const first = values[0]
  const last = values[values.length - 1]

  const difference = last - first

  // Small changes are treated as stable for this
  // simple first version.
  const tolerance =
    Math.max(
      Math.abs(first) * 0.05,
      0.1
    )

  if (difference > tolerance) {
    return 'increasing'
  }

  if (difference < -tolerance) {
    return 'decreasing'
  }

  return 'stable'
}


// ------------------------------------------------------------
// TREND MESSAGE
// ------------------------------------------------------------

const getTrendMessage = (
  label,
  trend
) => {
  if (trend === 'increasing') {
    return `${label} shows an upward pattern across the recorded assessments.`
  }

  if (trend === 'decreasing') {
    return `${label} shows a downward pattern across the recorded assessments.`
  }

  if (trend === 'stable') {
    return `${label} appears relatively stable across the recorded assessments.`
  }

  return `There are not enough recorded assessments to identify a ${label.toLowerCase()} trend yet.`
}


// ------------------------------------------------------------
// RISK CATEGORY TREND
// ------------------------------------------------------------

const getRiskTrend = (assessments) => {
  if (assessments.length < 2) {
    return {
      status: 'insufficient_data',
      message:
        'At least two assessments are needed to compare risk categories.',
    }
  }

  const previous =
    assessments[assessments.length - 2]

  const latest =
    assessments[assessments.length - 1]

  const previousRisk =
    previous.riskClass || 'unknown'

  const latestRisk =
    latest.riskClass || 'unknown'

  if (
    previousRisk === latestRisk
  ) {
    return {
      status: 'stable',
      previous: previousRisk,
      latest: latestRisk,
      message:
        `The latest assessment remains in the ${latestRisk} risk category.`,
    }
  }

  return {
    status: 'changed',
    previous: previousRisk,
    latest: latestRisk,
    message:
      `The latest assessment category changed from ${previousRisk} to ${latestRisk}.`,
  }
}


// ------------------------------------------------------------
// MAIN TREND ENGINE
// ------------------------------------------------------------

export const analyzeMaternalHealthTrends = (
  assessmentHistory = []
) => {

  const assessments =
    sortAssessmentsByDate(
      assessmentHistory
    )

  // Only maternal records belong here.
  const maternalAssessments =
    assessments.filter(
      (item) =>
        item.type === 'Maternal'
    )

  // ----------------------------------------------------------
  // NO DATA
  // ----------------------------------------------------------

  if (
    maternalAssessments.length === 0
  ) {
    return {
      status: 'no_data',
      assessmentCount: 0,
      message:
        'No maternal assessments have been recorded yet.',
      trends: {},
      riskTrend: null,
      latestAssessment: null,
      previousAssessment: null,
    }
  }

  // ----------------------------------------------------------
  // LATEST / PREVIOUS
  // ----------------------------------------------------------

  const latestAssessment =
    maternalAssessments[
      maternalAssessments.length - 1
    ]

  const previousAssessment =
    maternalAssessments.length >= 2
      ? maternalAssessments[
          maternalAssessments.length - 2
        ]
      : null

  // ----------------------------------------------------------
  // MEASUREMENT VALUES
  // ----------------------------------------------------------

  const systolicValues =
    getValues(
      maternalAssessments,
      'SystolicBP'
    )

  const diastolicValues =
    getValues(
      maternalAssessments,
      'DiastolicBP'
    )

  const bloodSugarValues =
    getValues(
      maternalAssessments,
      'BS'
    )

  const heartRateValues =
    getValues(
      maternalAssessments,
      'HeartRate'
    )

  const bodyTemperatureValues =
    getValues(
      maternalAssessments,
      'BodyTemp'
    )

  // ----------------------------------------------------------
  // TRENDS
  // ----------------------------------------------------------

  const trends = {
    systolicBP: {
      trend: getTrend(
        systolicValues
      ),
      message: getTrendMessage(
        'Systolic blood pressure',
        getTrend(systolicValues)
      ),
    },

    diastolicBP: {
      trend: getTrend(
        diastolicValues
      ),
      message: getTrendMessage(
        'Diastolic blood pressure',
        getTrend(diastolicValues)
      ),
    },

    bloodSugar: {
      trend: getTrend(
        bloodSugarValues
      ),
      message: getTrendMessage(
        'Blood sugar',
        getTrend(bloodSugarValues)
      ),
    },

    heartRate: {
      trend: getTrend(
        heartRateValues
      ),
      message: getTrendMessage(
        'Heart rate',
        getTrend(heartRateValues)
      ),
    },

    bodyTemperature: {
      trend: getTrend(
        bodyTemperatureValues
      ),
      message: getTrendMessage(
        'Body temperature',
        getTrend(bodyTemperatureValues)
      ),
    },
  }

  // ----------------------------------------------------------
  // PREGNANCY CONTEXT
  // ----------------------------------------------------------

  const latestPregnancy =
    latestAssessment.pregnancy || null

  // ----------------------------------------------------------
  // RETURN RESULT
  // ----------------------------------------------------------

  return {
    status: 'available',

    assessmentCount:
      maternalAssessments.length,

    latestAssessment,

    previousAssessment,

    latestPregnancy,

    trends,

    riskTrend:
      getRiskTrend(
        maternalAssessments
      ),
  }
}