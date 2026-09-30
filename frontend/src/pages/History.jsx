import { useMemo, useState } from 'react'
import './History.css'

function History({
  history = [],
  wellnessHistory = [],
  nutritionHistory = [],
  activityHistory = [],
  onBack,
  onClear,
  onDelete,
  onClearWellness,
  onDeleteWellness,
  onClearNutrition,
  onDeleteNutrition,
  onClearActivity,
  onDeleteActivity,
}) {
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedWellness, setSelectedWellness] = useState(null)
  const [selectedNutrition, setSelectedNutrition] = useState(null)
  const [selectedActivity, setSelectedActivity] = useState(null)

  const [selectedDate, setSelectedDate] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  /* ============================================
     DISPLAY HELPERS
     ============================================ */

  const displayValue = (value) => {
    if (
      value === undefined ||
      value === null ||
      value === '' ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return 'Not entered'
    }

    if (Array.isArray(value)) {
      return value.join(', ')
    }

    return value
  }

  const formatDate = (dateValue) => {
    if (!dateValue) return 'Date not available'

    const date = new Date(dateValue)

    if (Number.isNaN(date.getTime())) {
      return dateValue
    }

    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const getDateKey = (value) => {
    if (!value) return ''

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
      return ''
    }

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  const normalizeKey = (key) =>
    String(key || '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')

  const findNestedValue = (item, aliases) => {
    if (!item || typeof item !== 'object') return null

    const wanted = new Set(
      aliases.map((alias) => normalizeKey(alias))
    )

    const visited = new Set()

    const search = (value) => {
      if (!value || typeof value !== 'object') return null
      if (visited.has(value)) return null

      visited.add(value)

      for (const [key, child] of Object.entries(value)) {
        if (wanted.has(normalizeKey(key))) {
          if (child !== undefined && child !== null && child !== '') {
            return child
          }
        }
      }

      for (const child of Object.values(value)) {
        if (child && typeof child === 'object') {
          const found = search(child)
          if (found !== null && found !== undefined && found !== '') {
            return found
          }
        }
      }

      return null
    }

    return search(item)
  }

  const getItemDate = (item) => {
    return findNestedValue(item, [
      'selectedDate',
      'date',
      'createdAt',
      'timestamp',
    ]) || ''
  }

  const matchesSelectedDate = (item) => {
    if (!selectedDate) return true

    return getDateKey(getItemDate(item)) === selectedDate
  }

  const hasDate = (items, date) => {
    return items.some(
      (item) => getDateKey(getItemDate(item)) === date
    )
  }

  /* ============================================
     CALENDAR DATA
     ============================================ */

  const availableDates = useMemo(() => {
    const dates = new Set()

    ;[
      ...history,
      ...wellnessHistory,
      ...nutritionHistory,
      ...activityHistory,
    ].forEach((item) => {
      const date = getDateKey(getItemDate(item))

      if (date) {
        dates.add(date)
      }
    })

    return dates
  }, [
    history,
    wellnessHistory,
    nutritionHistory,
    activityHistory,
  ])

  const historyDates = useMemo(() => {
    return Array.from(availableDates).sort()
  }, [availableDates])

  const [calendarMonth, setCalendarMonth] = useState(() => {
    const initialDate =
      historyDates.length > 0
        ? new Date(historyDates[historyDates.length - 1])
        : new Date()

    return new Date(
      initialDate.getFullYear(),
      initialDate.getMonth(),
      1
    )
  })

  const calendarTitle = calendarMonth.toLocaleDateString(
    'en-IN',
    {
      month: 'long',
      year: 'numeric',
    }
  )

  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear()
    const month = calendarMonth.getMonth()

    const firstDay = new Date(year, month, 1)
    const startingDay = firstDay.getDay()

    const daysInMonth = new Date(
      year,
      month + 1,
      0
    ).getDate()

    const previousMonthDays = new Date(
      year,
      month,
      0
    ).getDate()

    const days = []

    for (let i = startingDay - 1; i >= 0; i--) {
      const day = previousMonthDays - i

      days.push({
        day,
        date: getDateKey(
          new Date(year, month - 1, day)
        ),
        outside: true,
      })
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        date: getDateKey(
          new Date(year, month, day)
        ),
        outside: false,
      })
    }

    while (days.length < 42) {
      const nextDay = days.length - (
        startingDay + daysInMonth
      ) + 1

      days.push({
        day: nextDay,
        date: getDateKey(
          new Date(year, month + 1, nextDay)
        ),
        outside: true,
      })
    }

    return days
  }, [calendarMonth])

  const goToPreviousMonth = () => {
    setCalendarMonth(
      (previous) =>
        new Date(
          previous.getFullYear(),
          previous.getMonth() - 1,
          1
        )
    )
  }

  const goToNextMonth = () => {
    setCalendarMonth(
      (previous) =>
        new Date(
          previous.getFullYear(),
          previous.getMonth() + 1,
          1
        )
    )
  }

  const goToToday = () => {
    const today = new Date()

    setCalendarMonth(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      )
    )

    setSelectedDate(getDateKey(today))
  }

  const selectCalendarDate = (date) => {
    setSelectedDate(date)

    const selected = new Date(date)

    setCalendarMonth(
      new Date(
        selected.getFullYear(),
        selected.getMonth(),
        1
      )
    )
  }

  const clearDateFilter = () => {
    setSelectedDate('')
  }

  const clearAllFilters = () => {
    setSelectedDate('')
    setSelectedCategory('all')
  }

  /* ============================================
     FILTERED HISTORY
     ============================================ */

  const filteredAssessmentHistory = useMemo(() => {
    if (
      selectedCategory !== 'all' &&
      selectedCategory !== 'assessment'
    ) {
      return []
    }

    return history.filter(matchesSelectedDate)
  }, [
    history,
    selectedDate,
    selectedCategory,
  ])

  const filteredWellnessHistory = useMemo(() => {
    if (
      selectedCategory !== 'all' &&
      selectedCategory !== 'wellness'
    ) {
      return []
    }

    return wellnessHistory.filter(matchesSelectedDate)
  }, [
    wellnessHistory,
    selectedDate,
    selectedCategory,
  ])

  const filteredNutritionHistory = useMemo(() => {
    if (
      selectedCategory !== 'all' &&
      selectedCategory !== 'nutrition'
    ) {
      return []
    }

    return nutritionHistory.filter(matchesSelectedDate)
  }, [
    nutritionHistory,
    selectedDate,
    selectedCategory,
  ])

  const filteredActivityHistory = useMemo(() => {
    if (
      selectedCategory !== 'all' &&
      selectedCategory !== 'activity'
    ) {
      return []
    }

    return activityHistory.filter(matchesSelectedDate)
  }, [
    activityHistory,
    selectedDate,
    selectedCategory,
  ])

  const totalFilteredRecords =
    filteredAssessmentHistory.length +
    filteredWellnessHistory.length +
    filteredNutritionHistory.length +
    filteredActivityHistory.length


  /* ============================================
     HISTORY TRENDS
     ============================================ */

  const getNumericValue = (value) => {
    if (value === undefined || value === null || value === '') return null
    const number = Number(value)
    return Number.isFinite(number) ? number : null
  }

  const buildNumericTrend = (items, getter) =>
    [...items]
      .map((item) => ({
        date: getItemDate(item),
        value: getNumericValue(getter(item)),
      }))
      .filter((item) => item.value !== null && item.date)
      .sort(
        (a, b) =>
          new Date(a.date).getTime() -
          new Date(b.date).getTime()
      )

  const getTrendDirection = (items) => {
    if (items.length < 2) {
      return { label: 'Not enough data', className: 'neutral' }
    }

    const previous = items[items.length - 2].value
    const latest = items[items.length - 1].value

    if (latest > previous) {
      return { label: 'Increasing', className: 'up' }
    }

    if (latest < previous) {
      return { label: 'Decreasing', className: 'down' }
    }

    return { label: 'Stable', className: 'stable' }
  }

  const getAverage = (items) => {
    if (items.length === 0) return null
    return (
      items.reduce((sum, item) => sum + item.value, 0) /
      items.length
    )
  }

  const formatTrendNumber = (value, decimals = 1) => {
    if (value === null || value === undefined) return '—'
    return Number(value).toFixed(decimals)
  }

  const trendData = useMemo(() => {
    const systolicBP = buildNumericTrend(
      history,
      (item) =>
        findNestedValue(item, [
          'systolicBP',
          'SystolicBP',
          'systolic blood pressure',
          'systolicBloodPressure',
        ])
    )

    const bloodSugar = buildNumericTrend(
      history,
      (item) =>
        findNestedValue(item, [
          'bs',
          'BS',
          'bloodSugar',
          'blood sugar',
          'bloodGlucose',
        ])
    )

    const heartRate = buildNumericTrend(
      history,
      (item) =>
        findNestedValue(item, [
          'heartRate',
          'HeartRate',
          'heart rate',
        ])
    )

    const bodyTemperature = buildNumericTrend(
      history,
      (item) =>
        findNestedValue(item, [
          'bodyTemp',
          'BodyTemp',
          'bodyTemperature',
          'body temperature',
          'temperature',
        ])
    )

    const energy = buildNumericTrend(
      wellnessHistory,
      (item) =>
        findNestedValue(item, ['energy'])
    )

    const water = buildNumericTrend(
      wellnessHistory,
      (item) =>
        findNestedValue(item, [
          'water',
          'waterIntake',
          'water intake',
        ])
    )

    const sleep = buildNumericTrend(
      wellnessHistory,
      (item) => {
        const duration = findNestedValue(item, [
          'sleepDuration',
          'sleep duration',
        ])

        if (duration !== null && duration !== undefined && duration !== '') {
          return duration
        }

        const hours = findNestedValue(item, [
          'sleepHours',
          'sleep hours',
        ])
        const minutes = findNestedValue(item, [
          'sleepMinutes',
          'sleep minutes',
        ])

        if (hours === null && minutes === null) {
          return null
        }

        const totalHours =
          (Number(hours) || 0) +
          (Number(minutes) || 0) / 60

        return totalHours > 0 ? totalHours : null
      }
    )

    const riskCounts = history.reduce(
      (counts, item) => {
        const risk = String(
          findNestedValue(item, [
            'riskClass',
            'risk',
            'result',
            'prediction',
          ]) || ''
        ).toLowerCase()

        if (risk.includes('high')) {
          counts.high += 1
        } else if (
          risk.includes('mid') ||
          risk.includes('medium')
        ) {
          counts.medium += 1
        } else if (risk.includes('low')) {
          counts.low += 1
        }

        return counts
      },
      { low: 0, medium: 0, high: 0 }
    )

    return {
      systolicBP,
      bloodSugar,
      heartRate,
      bodyTemperature,
      energy,
      water,
      sleep,
      riskCounts,
    }
  }, [history, wellnessHistory])

  const renderTrendCard = ({
    title,
    icon,
    items,
    unit,
    decimals = 1,
  }) => {
    const direction = getTrendDirection(items)
    const latest =
      items.length > 0
        ? items[items.length - 1].value
        : null
    const average = getAverage(items)
    const chartItems = items.slice(-7)

    const maxValue =
      chartItems.length > 0
        ? Math.max(...chartItems.map((item) => item.value))
        : 1

    const minValue =
      chartItems.length > 0
        ? Math.min(...chartItems.map((item) => item.value))
        : 0

    const range = maxValue - minValue

    return (
      <div className="history-trend-card">
        <div className="history-trend-card-header">
          <div className="history-trend-icon">{icon}</div>

          <div>
            <h4>{title}</h4>
            <span>
              {items.length}{' '}
              {items.length === 1 ? 'record' : 'records'}
            </span>
          </div>

          <span
            className={`history-trend-direction ${direction.className}`}
          >
            {direction.label}
          </span>
        </div>

        <div className="history-trend-values">
          <div>
            <span>Latest</span>
            <strong>
              {formatTrendNumber(latest, decimals)}
              {latest !== null ? ` ${unit}` : ''}
            </strong>
          </div>

          <div>
            <span>Average</span>
            <strong>
              {formatTrendNumber(average, decimals)}
              {average !== null ? ` ${unit}` : ''}
            </strong>
          </div>
        </div>

        {chartItems.length > 0 ? (
          <div className="history-trend-chart">
            {chartItems.map((point, index) => {
              const height =
                range === 0
                  ? 55
                  : 25 +
                    ((point.value - minValue) / range) * 60

              return (
                <div
                  className="history-trend-bar-wrap"
                  key={`${point.date}-${index}`}
                  title={`${formatDate(point.date)}: ${formatTrendNumber(
                    point.value,
                    decimals
                  )} ${unit}`}
                >
                  <div
                    className="history-trend-bar"
                    style={{ height: `${height}%` }}
                  />
                </div>
              )
            })}
          </div>
        ) : (
          <div className="history-trend-no-data">
            Add more records to see this trend.
          </div>
        )}

        {chartItems.length > 0 && (
          <div className="history-trend-chart-label">
            Last {chartItems.length}{' '}
            {chartItems.length === 1 ? 'record' : 'records'}
          </div>
        )}
      </div>
    )
  }

  /* ============================================
     HISTORY VALUE HELPERS
     ============================================ */

  const getAssessmentValue = (item, key, legacyKey = null) => {
    if (!item) return null

    return (
      item[key] ??
      (legacyKey ? item[legacyKey] : undefined) ??
      item.data?.[key] ??
      (legacyKey ? item.data?.[legacyKey] : undefined) ??
      item.formData?.[key] ??
      (legacyKey ? item.formData?.[legacyKey] : undefined) ??
      item.inputData?.[key] ??
      (legacyKey ? item.inputData?.[legacyKey] : undefined) ??
      null
    )
  }

  const getSleepDurationText = (item) => {
    if (!item) return 'Not entered'

    const hours = item.sleepHours ?? item.wellness?.sleepHours ?? null
    const minutes = item.sleepMinutes ?? item.wellness?.sleepMinutes ?? null

    if (hours !== null && hours !== undefined && hours !== '') {
      return `${hours}h ${minutes || 0}m`
    }

    if (minutes !== null && minutes !== undefined && minutes !== '') {
      return `0h ${minutes}m`
    }

    if (item.sleepDuration !== undefined && item.sleepDuration !== null && item.sleepDuration !== '') {
      return item.sleepDuration
    }

    return 'Not entered'
  }

  /* ============================================
     MODAL HELPERS
     ============================================ */

  const openAssessmentDetails = (item) => {
    setSelectedItem(item)
  }

  const closeAssessmentDetails = () => {
    setSelectedItem(null)
  }

  const openWellnessDetails = (item) => {
    setSelectedWellness(item)
  }

  const closeWellnessDetails = () => {
    setSelectedWellness(null)
  }

  const openNutritionDetails = (item) => {
    setSelectedNutrition(item)
  }

  const closeNutritionDetails = () => {
    setSelectedNutrition(null)
  }

  const openActivityDetails = (item) => {
    setSelectedActivity(item)
  }

  const closeActivityDetails = () => {
    setSelectedActivity(null)
  }

  /* ============================================
     DELETE HANDLERS
     ============================================ */

  const handleDeleteAssessment = (id) => {
    if (onDelete) {
      onDelete(id)
    }

    closeAssessmentDetails()
  }

  const handleDeleteWellness = (id) => {
    if (onDeleteWellness) {
      onDeleteWellness(id)
    }

    closeWellnessDetails()
  }

  const handleDeleteNutrition = (id) => {
    if (onDeleteNutrition) {
      onDeleteNutrition(id)
    }

    closeNutritionDetails()
  }

  const handleDeleteActivity = (id) => {
    if (onDeleteActivity) {
      onDeleteActivity(id)
    }

    closeActivityDetails()
  }

  /* ============================================
     CLEAR HANDLERS
     ============================================ */

  const handleClearAssessment = () => {
    if (history.length === 0) return

    const confirmed = window.confirm(
      'Are you sure you want to clear all maternal assessment history?'
    )

    if (confirmed && onClear) {
      onClear()
    }
  }

  const handleClearWellness = () => {
    if (wellnessHistory.length === 0) return

    const confirmed = window.confirm(
      'Are you sure you want to clear all wellness history?'
    )

    if (confirmed && onClearWellness) {
      onClearWellness()
    }
  }

  const handleClearNutrition = () => {
    if (nutritionHistory.length === 0) return

    const confirmed = window.confirm(
      'Are you sure you want to clear all nutrition history?'
    )

    if (confirmed && onClearNutrition) {
      onClearNutrition()
    }
  }

  const handleClearActivity = () => {
    if (activityHistory.length === 0) return

    const confirmed = window.confirm(
      'Are you sure you want to clear all activity history?'
    )

    if (confirmed && onClearActivity) {
      onClearActivity()
    }
  }

  /* ============================================
     RENDER
     ============================================ */

  return (
    <section className="history-section">

      {/* ========================================
          HEADER
          ======================================== */}

      <div className="history-header">

        <div>
          <span className="section-label">
            Your Journey
          </span>

          <h2>
            Wellness History
          </h2>

          <p>
            Review your maternal health, wellness,
            nutrition, and activity records over time.
          </p>
        </div>

        <button
          type="button"
          className="history-back-button"
          onClick={onBack}
        >
          ← Back
        </button>

      </div>


      {/* ========================================
          DATE / CATEGORY FILTERS
          ======================================== */}

      <div className="history-filter-panel">

        <div className="history-filter-header">

          <div>
            <strong>
              Find a previous day
            </strong>

            <span>
              Select a date or category to view
              specific records.
            </span>
          </div>

          {(selectedDate ||
            selectedCategory !== 'all') && (
            <button
              type="button"
              className="history-clear-filters"
              onClick={clearAllFilters}
            >
              Clear Filters
            </button>
          )}

        </div>


        {/* CATEGORY FILTER */}

        <div className="history-category-filter">

          <button
            type="button"
            className={
              selectedCategory === 'all'
                ? 'history-filter-chip active'
                : 'history-filter-chip'
            }
            onClick={() =>
              setSelectedCategory('all')
            }
          >
            All
          </button>

          <button
            type="button"
            className={
              selectedCategory === 'assessment'
                ? 'history-filter-chip active'
                : 'history-filter-chip'
            }
            onClick={() =>
              setSelectedCategory('assessment')
            }
          >
            🩺 Assessment
          </button>

          <button
            type="button"
            className={
              selectedCategory === 'wellness'
                ? 'history-filter-chip active'
                : 'history-filter-chip'
            }
            onClick={() =>
              setSelectedCategory('wellness')
            }
          >
            🌸 Wellness
          </button>

          <button
            type="button"
            className={
              selectedCategory === 'nutrition'
                ? 'history-filter-chip active'
                : 'history-filter-chip'
            }
            onClick={() =>
              setSelectedCategory('nutrition')
            }
          >
            🥗 Nutrition
          </button>

          <button
            type="button"
            className={
              selectedCategory === 'activity'
                ? 'history-filter-chip active'
                : 'history-filter-chip'
            }
            onClick={() =>
              setSelectedCategory('activity')
            }
          >
            🏃 Activity
          </button>

        </div>


        {/* CALENDAR */}

        <div className="history-calendar">

          <div className="history-calendar-header">

            <button
              type="button"
              className="history-calendar-nav"
              onClick={goToPreviousMonth}
              aria-label="Previous month"
            >
              ‹
            </button>

            <div className="history-calendar-title">
              <strong>
                {calendarTitle}
              </strong>

              <button
                type="button"
                onClick={goToToday}
              >
                Today
              </button>
            </div>

            <button
              type="button"
              className="history-calendar-nav"
              onClick={goToNextMonth}
              aria-label="Next month"
            >
              ›
            </button>

          </div>


          <div className="history-calendar-weekdays">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>


          <div className="history-calendar-grid">

            {calendarDays.map((calendarDay) => {
              const isSelected =
                selectedDate === calendarDay.date

              const hasRecords =
                availableDates.has(calendarDay.date)

              const isToday =
                calendarDay.date ===
                getDateKey(new Date())

              return (
                <button
                  key={calendarDay.date}
                  type="button"
                  className={[
                    'history-calendar-day',
                    calendarDay.outside
                      ? 'outside'
                      : '',
                    isSelected
                      ? 'selected'
                      : '',
                    hasRecords
                      ? 'has-records'
                      : '',
                    isToday
                      ? 'today'
                      : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() =>
                    selectCalendarDate(
                      calendarDay.date
                    )
                  }
                >
                  <span>
                    {calendarDay.day}
                  </span>

                  {hasRecords && (
                    <i />
                  )}
                </button>
              )
            })}

          </div>

          <div className="history-calendar-legend">

            <span>
              <i className="legend-record" />
              Has records
            </span>

            <span>
              <i className="legend-selected" />
              Selected
            </span>

          </div>

        </div>


        {/* SELECTED DATE */}

        {selectedDate && (
          <div className="history-selected-date">

            <div>
              <span>
                Showing records for
              </span>

              <strong>
                {formatDate(selectedDate)}
              </strong>
            </div>

            <button
              type="button"
              onClick={clearDateFilter}
            >
              Show All Dates
            </button>

          </div>
        )}

      </div>


      {/* ========================================
          FILTER RESULT SUMMARY
          ======================================== */}

      <div className="history-filter-summary">

        <div>
          <strong>
            {totalFilteredRecords}
          </strong>

          <span>
            {totalFilteredRecords === 1
              ? 'record found'
              : 'records found'}
          </span>
        </div>

        <span>
          {selectedCategory === 'all'
            ? 'All categories'
            : selectedCategory === 'assessment'
              ? 'Maternal assessments'
              : selectedCategory === 'wellness'
                ? 'Daily wellness'
                : selectedCategory === 'nutrition'
                  ? 'Nutrition'
                  : 'Activity & exercise'}
        </span>

      </div>



      {/* ========================================
          HEALTH TRENDS
          ======================================== */}

      <div className="history-trends-section">
        <div className="history-trends-header">
          <div>
            <span className="section-label">
              Patterns Over Time
            </span>

            <h3>Health & Wellness Trends</h3>

            <p>
              Review how your recorded maternal health
              and daily wellness measurements have changed.
            </p>
          </div>

          <div className="history-trends-count">
            <strong>
              {history.length + wellnessHistory.length}
            </strong>
            <span>measurable records</span>
          </div>
        </div>

        {history.length === 0 &&
        wellnessHistory.length === 0 ? (
          <div className="history-trends-empty">
            <div className="history-trends-empty-icon">
              📊
            </div>

            <h4>Trends will appear here</h4>

            <p>
              Complete maternal assessments and daily
              wellness check-ins to build your health history.
            </p>
          </div>
        ) : (
          <>
            <div className="history-trend-group-title">
              <span>🩺</span>
              Maternal Health Measurements
            </div>

            <div className="history-trend-grid">
              {renderTrendCard({
                title: 'Systolic BP',
                icon: '❤️',
                items: trendData.systolicBP,
                unit: 'mmHg',
                decimals: 0,
              })}

              {renderTrendCard({
                title: 'Blood Sugar',
                icon: '🩸',
                items: trendData.bloodSugar,
                unit: '',
                decimals: 1,
              })}

              {renderTrendCard({
                title: 'Heart Rate',
                icon: '💗',
                items: trendData.heartRate,
                unit: 'bpm',
                decimals: 0,
              })}

              {renderTrendCard({
                title: 'Body Temperature',
                icon: '🌡️',
                items: trendData.bodyTemperature,
                unit: '°',
                decimals: 1,
              })}
            </div>

            <div className="history-risk-overview">
              <div>
                <span className="history-risk-overview-icon">
                  🩺
                </span>

                <div>
                  <strong>Assessment Risk Overview</strong>
                  <span>Recorded prediction results</span>
                </div>
              </div>

              <div className="history-risk-counts">
                <span className="history-risk-count low">
                  <strong>{trendData.riskCounts.low}</strong>
                  Low
                </span>

                <span className="history-risk-count medium">
                  <strong>{trendData.riskCounts.medium}</strong>
                  Medium
                </span>

                <span className="history-risk-count high">
                  <strong>{trendData.riskCounts.high}</strong>
                  High
                </span>
              </div>
            </div>

            <div className="history-trend-group-title">
              <span>🌸</span>
              Daily Wellness Measurements
            </div>

            <div className="history-trend-grid">
              {renderTrendCard({
                title: 'Energy',
                icon: '⚡',
                items: trendData.energy,
                unit: '/ 5',
                decimals: 1,
              })}

              {renderTrendCard({
                title: 'Water Intake',
                icon: '💧',
                items: trendData.water,
                unit: '',
                decimals: 1,
              })}

              {renderTrendCard({
                title: 'Sleep Duration',
                icon: '😴',
                items: trendData.sleep,
                unit: 'hrs',
                decimals: 1,
              })}
            </div>

            <div className="history-trends-note">
              <span>💡</span>

              <p>
                These charts summarize values you have recorded
                in your history. They are for tracking patterns
                and do not diagnose or predict medical conditions.
              </p>
            </div>
          </>
        )}
      </div>


      {/* ========================================
          ASSESSMENT HISTORY
          ======================================== */}

      {(selectedCategory === 'all' ||
        selectedCategory === 'assessment') && (
        <div className="history-section-block">

          <div className="history-section-title">
            <span className="history-section-icon">
              🩺
            </span>

            Maternal Assessment History
          </div>

          {filteredAssessmentHistory.length === 0 ? (

            <div className="history-empty">

              <div className="history-empty-icon">
                🩺
              </div>

              <h3>
                No assessment records
              </h3>

              <p>
                {selectedDate
                  ? 'There is no maternal assessment recorded for this date.'
                  : 'Your maternal risk assessments will appear here.'}
              </p>

            </div>

          ) : (

            <div className="history-container">

              <div className="history-top-bar">

                <div>
                  <strong>
                    {filteredAssessmentHistory.length}{' '}
                    assessment
                    {filteredAssessmentHistory.length !==
                    1
                      ? 's'
                      : ''}
                  </strong>

                  <span>
                    Maternal health risk records
                  </span>
                </div>

                {!selectedDate && (
                  <button
                    type="button"
                    className="clear-history-button"
                    onClick={handleClearAssessment}
                  >
                    Clear Assessment History
                  </button>
                )}

              </div>


              <div className="history-list">

                {filteredAssessmentHistory.map(
                  (item) => (
                    <div
                      className="history-item"
                      key={item.id}
                      onClick={() =>
                        openAssessmentDetails(item)
                      }
                    >

                      <div className="history-item-icon">
                        🩺
                      </div>

                      <div className="history-item-info">

                        <div className="history-item-title">
                          Maternal Risk Assessment
                        </div>

                        <div className="history-item-date">
                          {displayValue(item.date)}
                        </div>

                      </div>

                      <div className="history-item-result">

                        <span
                          className={`history-risk ${
                            item.riskClass || ''
                          }`}
                        >
                          {displayValue(item.result)}
                        </span>

                      </div>

                      <div className="history-item-arrow">
                        →
                      </div>

                    </div>
                  )
                )}

              </div>

            </div>
          )}

        </div>
      )}


      {/* ========================================
          WELLNESS HISTORY
          ======================================== */}

      {(selectedCategory === 'all' ||
        selectedCategory === 'wellness') && (
        <div className="history-section-block wellness-history-block">

          <div className="history-section-title">

            <span className="history-section-icon wellness-history-icon">
              🌸
            </span>

            Daily Wellness History

          </div>


          {filteredWellnessHistory.length === 0 ? (

            <div className="history-empty wellness-empty">

              <div className="history-empty-icon">
                🌸
              </div>

              <h3>
                No wellness records
              </h3>

              <p>
                {selectedDate
                  ? 'There is no wellness check-in recorded for this date.'
                  : 'Your daily wellness check-ins will appear here.'}
              </p>

            </div>

          ) : (

            <div className="history-container wellness-history-container">

              <div className="history-top-bar">

                <div>
                  <strong>
                    {filteredWellnessHistory.length}{' '}
                    wellness check-in
                    {filteredWellnessHistory.length !==
                    1
                      ? 's'
                      : ''}
                  </strong>

                  <span>
                    Mood, energy, sleep, hydration,
                    cravings and more
                  </span>
                </div>

                {!selectedDate && (
                  <button
                    type="button"
                    className="clear-history-button"
                    onClick={handleClearWellness}
                  >
                    Clear Wellness History
                  </button>
                )}

              </div>


              <div className="history-list">

                {filteredWellnessHistory.map(
                  (item) => (
                    <div
                      className="wellness-history-item"
                      key={item.id}
                      onClick={() =>
                        openWellnessDetails(item)
                      }
                    >

                      <div className="wellness-item-icon">
                        🌸
                      </div>

                      <div className="history-item-info">

                        <div className="history-item-title">
                          Daily Wellness Check-in
                        </div>

                        <div className="history-item-date">
                          {displayValue(
                            item.selectedDate ||
                            item.date
                          )}
                        </div>

                        <div className="wellness-summary">

                          <span>
                            Mood:{' '}
                            {displayValue(
                              item.mood
                            )}
                          </span>

                          <span>
                            Energy:{' '}
                            {displayValue(
                              item.energy
                            )}
                          </span>

                          <span>
                            Water:{' '}
                            {displayValue(
                              item.water
                            )}
                          </span>

                        </div>

                      </div>

                      <div className="history-item-result">

                        <span className="history-risk low">
                          Wellness
                        </span>

                      </div>

                      <div className="history-item-arrow">
                        →
                      </div>

                    </div>
                  )
                )}

              </div>

            </div>
          )}

        </div>
      )}


      {/* ========================================
          NUTRITION HISTORY
          ======================================== */}

      {(selectedCategory === 'all' ||
        selectedCategory === 'nutrition') && (
        <div className="history-section-block nutrition-history-block">

          <div className="history-section-title">

            <span className="history-section-icon nutrition-history-icon">
              🥗
            </span>

            Nutrition History

          </div>


          {filteredNutritionHistory.length === 0 ? (

            <div className="history-empty nutrition-empty">

              <div className="history-empty-icon">
                🥗
              </div>

              <h3>
                No nutrition records
              </h3>

              <p>
                {selectedDate
                  ? 'There is no nutrition plan recorded for this date.'
                  : 'Your saved nutrition plans will appear here.'}
              </p>

            </div>

          ) : (

            <div className="history-container nutrition-history-container">

              <div className="history-top-bar">

                <div>
                  <strong>
                    {filteredNutritionHistory.length}{' '}
                    nutrition plan
                    {filteredNutritionHistory.length !==
                    1
                      ? 's'
                      : ''}
                  </strong>

                  <span>
                    Personalized pregnancy nutrition
                    guidance
                  </span>
                </div>

                {!selectedDate && (
                  <button
                    type="button"
                    className="clear-history-button"
                    onClick={handleClearNutrition}
                  >
                    Clear Nutrition History
                  </button>
                )}

              </div>


              <div className="history-list">

                {filteredNutritionHistory.map(
                  (item) => (
                    <div
                      className="history-item nutrition-history-item"
                      key={item.id}
                      onClick={() =>
                        openNutritionDetails(item)
                      }
                    >

                      <div className="history-item-icon nutrition-item-icon">
                        🥗
                      </div>

                      <div className="history-item-info">

                        <div className="history-item-title">
                          Nutrition Plan
                        </div>

                        <div className="history-item-date">
                          {displayValue(
                            item.selectedDate ||
                            item.date
                          )}
                        </div>

                        <div className="wellness-summary">

                          {item.dietaryPreference && (
                            <span>
                              {item.dietaryPreference}
                            </span>
                          )}

                          {item.foodAllergies && (
                            <span>
                              Allergies noted
                            </span>
                          )}

                          {item.recommendations && (
                            <span>
                              {item.recommendations.length}{' '}
                              recommendations
                            </span>
                          )}

                        </div>

                      </div>

                      <div className="history-item-result">

                        <span className="history-risk low">
                          Saved
                        </span>

                      </div>

                      <div className="history-item-arrow">
                        →
                      </div>

                    </div>
                  )
                )}

              </div>

            </div>
          )}

        </div>
      )}


      {/* ========================================
          ACTIVITY HISTORY
          ======================================== */}

      {(selectedCategory === 'all' ||
        selectedCategory === 'activity') && (
        <div className="history-section-block activity-history-block">

          <div className="history-section-title">

            <span className="history-section-icon activity-history-icon">
              🏃
            </span>

            Activity & Exercise History

          </div>


          {filteredActivityHistory.length === 0 ? (

            <div className="history-empty activity-empty">

              <div className="history-empty-icon">
                🏃
              </div>

              <h3>
                No activity records
              </h3>

              <p>
                {selectedDate
                  ? 'There is no activity plan recorded for this date.'
                  : 'Your activity and exercise plans will appear here.'}
              </p>

            </div>

          ) : (

            <div className="history-container activity-history-container">

              <div className="history-top-bar">

                <div>
                  <strong>
                    {filteredActivityHistory.length}{' '}
                    activity plan
                    {filteredActivityHistory.length !==
                    1
                      ? 's'
                      : ''}
                  </strong>

                  <span>
                    Pregnancy-safe activity and
                    exercise guidance
                  </span>
                </div>

                {!selectedDate && (
                  <button
                    type="button"
                    className="clear-history-button"
                    onClick={handleClearActivity}
                  >
                    Clear Activity History
                  </button>
                )}

              </div>


              <div className="history-list">

                {filteredActivityHistory.map(
                  (item) => {

                    const status =
                      item.status ||
                      item.plan_status ||
                      item.planStatus ||
                      'recommendations_available'

                    const statusClass =
                      status === 'stop_referral'
                        ? 'stop'
                        : status === 'modify'
                          ? 'modify'
                          : ''

                    return (
                      <div
                        className="activity-history-item"
                        key={item.id}
                        onClick={() =>
                          openActivityDetails(item)
                        }
                      >

                        <div className="activity-item-icon">
                          🏃
                        </div>

                        <div className="history-item-info">

                          <div className="history-item-title">
                            Activity Plan
                          </div>

                          <div className="history-item-date">
                            {displayValue(
                              item.selectedDate ||
                              item.date
                            )}
                          </div>

                          <span
                            className={`activity-status ${statusClass}`}
                          >
                            {status ===
                            'stop_referral'
                              ? 'Medical Advice'
                              : status ===
                                'modify'
                                ? 'Modified'
                                : 'Recommendations Available'}
                          </span>

                        </div>

                        <div className="history-item-result">

                          <span className="history-risk low">
                            Saved
                          </span>

                        </div>

                        <div className="history-item-arrow">
                          →
                        </div>

                      </div>
                    )
                  }
                )}

              </div>

            </div>
          )}

        </div>
      )}


      {/* ========================================
          ASSESSMENT DETAILS MODAL
          ======================================== */}

      {selectedItem && (
        <div
          className="history-modal-overlay"
          onClick={closeAssessmentDetails}
        >

          <div
            className="history-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="history-modal-header">

              <div>
                <span className="section-label">
                  Maternal Health
                </span>

                <h2>
                  Assessment Details
                </h2>
              </div>

              <button
                type="button"
                className="modal-close-button"
                onClick={closeAssessmentDetails}
              >
                ×
              </button>

            </div>


            <div className="history-detail-result">

              <span>
                Prediction Result
              </span>

              <strong
                className={
                  selectedItem.riskClass || ''
                }
              >
                {displayValue(
                  selectedItem.result
                )}
              </strong>

            </div>


            <div className="history-detail-date">

              <span>
                Assessment Date
              </span>

              <strong>
                {displayValue(
                  selectedItem.date
                )}
              </strong>

            </div>


            {(selectedItem.pregnancyWeek ||
              selectedItem.trimester) && (
              <div className="history-data-section">

                <h3>
                  Pregnancy Context
                </h3>

                <div className="history-data-grid">

                  <div className="history-data-item">
                    <span>
                      Pregnancy Week
                    </span>

                    <strong>
                      {displayValue(
                        selectedItem.pregnancyWeek
                      )}
                    </strong>
                  </div>

                  <div className="history-data-item">
                    <span>
                      Trimester
                    </span>

                    <strong>
                      {displayValue(
                        selectedItem.trimester
                      )}
                    </strong>
                  </div>

                </div>

              </div>
            )}


            <div className="history-data-section">

              <h3>
                Assessment Data
              </h3>

              <div className="history-data-grid">

                <div className="history-data-item">
                  <span>
                    Age
                  </span>

                  <strong>
                    {displayValue(
                      getAssessmentValue(selectedItem, 'age', 'Age')
                    )}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>
                    Systolic BP
                  </span>

                  <strong>
                    {displayValue(
                      getAssessmentValue(selectedItem, 'systolicBP', 'SystolicBP')
                    )}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>
                    Diastolic BP
                  </span>

                  <strong>
                    {displayValue(
                      getAssessmentValue(selectedItem, 'diastolicBP', 'DiastolicBP')
                    )}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>
                    Blood Sugar
                  </span>

                  <strong>
                    {displayValue(
                      getAssessmentValue(selectedItem, 'bs', 'BS')
                    )}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>
                    Body Temperature
                  </span>

                  <strong>
                    {displayValue(
                      getAssessmentValue(selectedItem, 'bodyTemp', 'BodyTemp')
                    )}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>
                    Heart Rate
                  </span>

                  <strong>
                    {displayValue(
                      getAssessmentValue(selectedItem, 'heartRate', 'HeartRate')
                    )}
                  </strong>
                </div>

              </div>

            </div>


            {selectedItem.probabilities && (
              <div className="history-data-section">

                <h3>
                  Prediction Confidence
                </h3>

                <div className="history-probabilities">

                  {Object.entries(
                    selectedItem.probabilities
                  ).map(
                    ([label, probability]) => (
                      <div
                        className="history-probability"
                        key={label}
                      >
                        <span>
                          {label}
                        </span>

                        <strong>
                          {typeof probability ===
                          'number'
                            ? `${(
                                probability * 100
                              ).toFixed(1)}%`
                            : displayValue(
                                probability
                              )}
                        </strong>
                      </div>
                    )
                  )}

                </div>

              </div>
            )}


            <div className="history-modal-actions">

              <button
                type="button"
                className="modal-delete-button"
                onClick={() =>
                  handleDeleteAssessment(
                    selectedItem.id
                  )
                }
              >
                Delete
              </button>

              <button
                type="button"
                className="modal-done-button"
                onClick={
                  closeAssessmentDetails
                }
              >
                Done
              </button>

            </div>

          </div>

        </div>
      )}


      {/* ========================================
          WELLNESS DETAILS MODAL
          ======================================== */}

      {selectedWellness && (
        <div
          className="history-modal-overlay"
          onClick={closeWellnessDetails}
        >

          <div
            className="history-modal wellness-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="history-modal-header">

              <div>
                <span className="section-label">
                  Daily Wellness
                </span>

                <h2>
                  Wellness Details
                </h2>
              </div>

              <button
                type="button"
                className="modal-close-button"
                onClick={closeWellnessDetails}
              >
                ×
              </button>

            </div>


            <div className="history-detail-date">

              <span>
                Check-in Date
              </span>

              <strong>
                {displayValue(
                  selectedWellness.selectedDate ||
                  selectedWellness.date
                )}
              </strong>

            </div>


            <div className="history-data-section">

              <h3>
                Daily Wellness
              </h3>

              <div className="history-data-grid">

                <div className="history-data-item">
                  <span>
                    Mood
                  </span>

                  <strong>
                    {displayValue(
                      selectedWellness.mood
                    )}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>
                    Energy
                  </span>

                  <strong>
                    {displayValue(
                      selectedWellness.energy
                    )}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>
                    Feelings
                  </span>

                  <strong>
                    {displayValue(
                      selectedWellness.feelings
                    )}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>
                    Pain
                  </span>

                  <strong>
                    {displayValue(
                      selectedWellness.pain
                    )}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>
                    Sleep Quality
                  </span>

                  <strong>
                    {displayValue(
                      selectedWellness.sleepQuality
                    )}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>
                    Sleep Duration
                  </span>

                  <strong>
                    {getSleepDurationText(selectedWellness)}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>
                    Water Intake
                  </span>

                  <strong>
                    {displayValue(
                      selectedWellness.water
                    )}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>
                    Cravings
                  </span>

                  <strong>
                    {displayValue(
                      selectedWellness.cravings
                    )}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>
                    Discharge
                  </span>

                  <strong>
                    {displayValue(
                      selectedWellness.discharge
                    )}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>
                    Skin
                  </span>

                  <strong>
                    {displayValue(
                      selectedWellness.skin
                    )}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>
                    Hair
                  </span>

                  <strong>
                    {displayValue(
                      selectedWellness.hair
                    )}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>
                    Weight
                  </span>

                  <strong>
                    {displayValue(
                      selectedWellness.weight
                    )}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>
                    Digestion
                  </span>

                  <strong>
                    {displayValue(
                      selectedWellness.digestion
                    )}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>
                    Stool
                  </span>

                  <strong>
                    {displayValue(
                      selectedWellness.stool
                    )}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>
                    Meditation
                  </span>

                  <strong>
                    {displayValue(
                      selectedWellness.meditationMinutes
                    )}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>
                    Self-care
                  </span>

                  <strong>
                    {displayValue(
                      selectedWellness.selfCare
                    )}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>
                    Ailments
                  </span>

                  <strong>
                    {displayValue(
                      selectedWellness.ailments
                    )}
                  </strong>
                </div>

              </div>

            </div>


            {selectedWellness.notes && (
              <div className="wellness-history-notes">

                <h3>
                  Notes
                </h3>

                <p>
                  {selectedWellness.notes}
                </p>

              </div>
            )}


            <div className="history-modal-actions">

              <button
                type="button"
                className="modal-delete-button"
                onClick={() =>
                  handleDeleteWellness(
                    selectedWellness.id
                  )
                }
              >
                Delete
              </button>

              <button
                type="button"
                className="modal-done-button"
                onClick={
                  closeWellnessDetails
                }
              >
                Done
              </button>

            </div>

          </div>

        </div>
      )}


      {/* ========================================
          NUTRITION DETAILS MODAL
          ======================================== */}

      {selectedNutrition && (
        <div
          className="history-modal-overlay"
          onClick={closeNutritionDetails}
        >

          <div
            className="history-modal nutrition-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="history-modal-header">

              <div>
                <span className="section-label">
                  Nutrition
                </span>

                <h2>
                  Nutrition Plan Details
                </h2>
              </div>

              <button
                type="button"
                className="modal-close-button"
                onClick={closeNutritionDetails}
              >
                ×
              </button>

            </div>


            <div className="history-detail-date">

              <span>
                Plan Date
              </span>

              <strong>
                {displayValue(
                  selectedNutrition.selectedDate ||
                  selectedNutrition.date
                )}
              </strong>

            </div>


            {selectedNutrition.pregnancyInfo && (
              <div className="history-data-section">

                <h3>
                  Pregnancy Context
                </h3>

                <div className="history-data-grid">

                  <div className="history-data-item">
                    <span>
                      Pregnancy Week
                    </span>

                    <strong>
                      {displayValue(
                        selectedNutrition
                          .pregnancyInfo
                          .weeks
                      )}
                    </strong>
                  </div>

                  <div className="history-data-item">
                    <span>
                      Trimester
                    </span>

                    <strong>
                      {displayValue(
                        selectedNutrition
                          .pregnancyInfo
                          .trimester
                      )}
                    </strong>
                  </div>

                </div>

              </div>
            )}


            <div className="history-data-section">

              <h3>
                Food Preferences
              </h3>

              <div className="history-data-grid">

                <div className="history-data-item">
                  <span>
                    Dietary Preference
                  </span>

                  <strong>
                    {displayValue(
                      selectedNutrition
                        .dietaryPreference ||
                      selectedNutrition
                        .dietary_preference
                    )}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>
                    Food Allergies
                  </span>

                  <strong>
                    {displayValue(
                      selectedNutrition
                        .foodAllergies ||
                      selectedNutrition
                        .food_allergies
                    )}
                  </strong>
                </div>

              </div>

            </div>


            {selectedNutrition.wellness && (
              <div className="history-data-section">

                <h3>
                  Wellness Context
                </h3>

                <div className="history-data-grid">

                  <div className="history-data-item">
                    <span>
                      Mood
                    </span>

                    <strong>
                      {displayValue(
                        selectedNutrition
                          .wellness
                          .mood
                      )}
                    </strong>
                  </div>

                  <div className="history-data-item">
                    <span>
                      Energy
                    </span>

                    <strong>
                      {displayValue(
                        selectedNutrition
                          .wellness
                          .energy
                      )}
                    </strong>
                  </div>

                  <div className="history-data-item">
                    <span>
                      Cravings
                    </span>

                    <strong>
                      {displayValue(
                        selectedNutrition
                          .wellness
                          .cravings
                      )}
                    </strong>
                  </div>

                  <div className="history-data-item">
                    <span>
                      Water
                    </span>

                    <strong>
                      {displayValue(
                        selectedNutrition
                          .wellness
                          .water
                      )}
                    </strong>
                  </div>

                </div>

              </div>
            )}


            {selectedNutrition.recommendations &&
              selectedNutrition.recommendations.length >
                0 && (
                <div className="history-data-section">

                  <h3>
                    Recommendations
                  </h3>

                  <ul className="history-recommendation-list">

                    {selectedNutrition
                      .recommendations
                      .map(
                        (
                          recommendation,
                          index
                        ) => (
                          <li
                            className="history-recommendation-item"
                            key={index}
                          >
                            {typeof recommendation ===
                            'string'
                              ? recommendation
                              : recommendation.name ||
                                recommendation.description ||
                                recommendation.title ||
                                JSON.stringify(
                                  recommendation
                                )}
                          </li>
                        )
                      )}

                  </ul>

                </div>
              )}


            {selectedNutrition.safety && (
              <div className="history-data-section">

                <h3>
                  Safety Information
                </h3>

                <div className="history-recommendation-list">

                  {Array.isArray(
                    selectedNutrition.safety
                  ) ? (
                    selectedNutrition.safety.map(
                      (message, index) => (
                        <div
                          className="history-recommendation-item"
                          key={index}
                        >
                          {typeof message ===
                          'string'
                            ? message
                            : JSON.stringify(
                                message
                              )}
                        </div>
                      )
                    )
                  ) : (
                    <div className="history-recommendation-item">
                      {typeof selectedNutrition.safety ===
                      'string'
                        ? selectedNutrition.safety
                        : JSON.stringify(
                            selectedNutrition.safety
                          )}
                    </div>
                  )}

                </div>

              </div>
            )}


            <div className="history-modal-actions">

              <button
                type="button"
                className="modal-delete-button"
                onClick={() =>
                  handleDeleteNutrition(
                    selectedNutrition.id
                  )
                }
              >
                Delete
              </button>

              <button
                type="button"
                className="modal-done-button"
                onClick={
                  closeNutritionDetails
                }
              >
                Done
              </button>

            </div>

          </div>

        </div>
      )}


      {/* ========================================
          ACTIVITY DETAILS MODAL
          ======================================== */}

      {selectedActivity && (
        <div
          className="history-modal-overlay"
          onClick={closeActivityDetails}
        >

          <div
            className="history-modal activity-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="history-modal-header">

              <div>
                <span className="section-label">
                  Activity & Exercise
                </span>

                <h2>
                  Activity Plan Details
                </h2>
              </div>

              <button
                type="button"
                className="modal-close-button"
                onClick={closeActivityDetails}
              >
                ×
              </button>

            </div>


            <div className="history-detail-date">

              <span>
                Plan Date
              </span>

              <strong>
                {displayValue(
                  selectedActivity.selectedDate ||
                  selectedActivity.date
                )}
              </strong>

            </div>


            {(selectedActivity.pregnancyInfo ||
              selectedActivity.pregnancy_info) && (
              <div className="history-data-section">

                <h3>
                  Pregnancy Context
                </h3>

                <div className="history-data-grid">

                  <div className="history-data-item">
                    <span>
                      Pregnancy Week
                    </span>

                    <strong>
                      {displayValue(
                        (
                          selectedActivity
                            .pregnancyInfo ||
                          selectedActivity
                            .pregnancy_info
                        ).weeks
                      )}
                    </strong>
                  </div>

                  <div className="history-data-item">
                    <span>
                      Trimester
                    </span>

                    <strong>
                      {displayValue(
                        (
                          selectedActivity
                            .pregnancyInfo ||
                          selectedActivity
                            .pregnancy_info
                        ).trimester
                      )}
                    </strong>
                  </div>

                </div>

              </div>
            )}


            {(selectedActivity.status ||
              selectedActivity.plan_status ||
              selectedActivity.planStatus) && (
              <div className="history-data-section">

                <h3>
                  Plan Status
                </h3>

                <div className="history-data-item">

                  <span>
                    Status
                  </span>

                  <strong>
                    {displayValue(
                      selectedActivity.status ||
                      selectedActivity.plan_status ||
                      selectedActivity.planStatus
                    )}
                  </strong>

                </div>

              </div>
            )}


            {selectedActivity.wellness && (
              <div className="history-data-section">

                <h3>
                  Wellness Context
                </h3>

                <div className="history-data-grid">

                  <div className="history-data-item">
                    <span>
                      Energy
                    </span>

                    <strong>
                      {displayValue(
                        selectedActivity
                          .wellness
                          .energy
                      )}
                    </strong>
                  </div>

                  <div className="history-data-item">
                    <span>
                      Sleep
                    </span>

                    <strong>
                      {displayValue(
                        selectedActivity
                          .wellness
                          .sleepQuality
                      )}
                    </strong>
                  </div>

                  <div className="history-data-item">
                    <span>
                      Feelings
                    </span>

                    <strong>
                      {displayValue(
                        selectedActivity
                          .wellness
                          .feelings
                      )}
                    </strong>
                  </div>

                  <div className="history-data-item">
                    <span>
                      Pain
                    </span>

                    <strong>
                      {displayValue(
                        selectedActivity
                          .wellness
                          .pain
                      )}
                    </strong>
                  </div>

                </div>

              </div>
            )}


            {selectedActivity.messages &&
              selectedActivity.messages.length >
                0 && (
                <div className="history-data-section">

                  <h3>
                    Guidance
                  </h3>

                  <ul className="history-recommendation-list">

                    {selectedActivity.messages.map(
                      (message, index) => (
                        <li
                          className="history-recommendation-item"
                          key={index}
                        >
                          {message}
                        </li>
                      )
                    )}

                  </ul>

                </div>
              )}


            {selectedActivity.recommendations &&
              selectedActivity.recommendations.length >
                0 && (
                <div className="history-data-section">

                  <h3>
                    Recommended Activities
                  </h3>

                  <div className="history-recommendation-list">

                    {selectedActivity
                      .recommendations
                      .map(
                        (
                          recommendation,
                          index
                        ) => (
                          <div
                            className="activity-detail-card"
                            key={index}
                          >

                            <h3>
                              {displayValue(
                                recommendation.name ||
                                recommendation.title ||
                                recommendation.exercise ||
                                `Activity ${index + 1}`
                              )}
                            </h3>

                            <p>
                              <strong>
                                Category:
                              </strong>{' '}
                              {displayValue(
                                recommendation.category
                              )}
                            </p>

                            <p>
                              <strong>
                                Intensity:
                              </strong>{' '}
                              {displayValue(
                                recommendation.intensity
                              )}
                            </p>

                            <p>
                              <strong>
                                Description:
                              </strong>{' '}
                              {displayValue(
                                recommendation.description
                              )}
                            </p>

                            <p>
                              <strong>
                                Benefits:
                              </strong>{' '}
                              {displayValue(
                                recommendation.benefits
                              )}
                            </p>

                            <p>
                              <strong>
                                Reason:
                              </strong>{' '}
                              {displayValue(
                                recommendation.reason
                              )}
                            </p>

                            {recommendation.modification && (
                              <p>
                                <strong>
                                  Modification:
                                </strong>{' '}
                                {displayValue(
                                  recommendation.modification
                                )}
                              </p>
                            )}

                            {recommendation.modification_notes && (
                              <p>
                                <strong>
                                  Modification Notes:
                                </strong>{' '}
                                {displayValue(
                                  recommendation.modification_notes
                                )}
                              </p>
                            )}

                            {recommendation.safety_status && (
                              <p>
                                <strong>
                                  Safety Status:
                                </strong>{' '}
                                {displayValue(
                                  recommendation.safety_status
                                )}
                              </p>
                            )}

                            {recommendation.safety_messages && (
                              <p>
                                <strong>
                                  Safety:
                                </strong>{' '}
                                {displayValue(
                                  recommendation.safety_messages
                                )}
                              </p>
                            )}

                          </div>
                        )
                      )}

                  </div>

                </div>
              )}


            {selectedActivity.source && (
              <div className="activity-safety">

                <h3>
                  Recommendation Source
                </h3>

                <p>
                  {displayValue(
                    selectedActivity.source
                  )}
                </p>

              </div>
            )}


            <div className="history-modal-actions">

              <button
                type="button"
                className="modal-delete-button"
                onClick={() =>
                  handleDeleteActivity(
                    selectedActivity.id
                  )
                }
              >
                Delete
              </button>

              <button
                type="button"
                className="modal-done-button"
                onClick={
                  closeActivityDetails
                }
              >
                Done
              </button>

            </div>

          </div>

        </div>
      )}

    </section>
  )
}

export default History