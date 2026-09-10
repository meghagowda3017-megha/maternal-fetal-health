import { useState } from 'react'
import './MaternalWellnessDashboard.css'

function MaternalWellnessDashboard({
  wellnessHistory,
  pregnancyInfo,
  nutritionHistory,
  onBack,
  onNutritionClick,
}) {
  // ==================================================
  // SAFE DATA
  // ==================================================

  const safeWellnessHistory = wellnessHistory || []
  const safeNutritionHistory = nutritionHistory || []

  // ==================================================
  // NUTRITION INFORMATION
  // ==================================================

  const latestNutritionPlan =
    safeNutritionHistory.length > 0
      ? safeNutritionHistory[0]
      : null

  const nutritionRecommendations =
    latestNutritionPlan?.recommendations || []

  const nutritionAllergies =
    latestNutritionPlan?.foodAllergies || []

  const nutritionCravings =
    latestNutritionPlan?.wellness?.cravings || []

  const nutritionPreference =
    latestNutritionPlan?.dietaryPreference ||
    'No specific preference'

  // ==================================================
  // BASIC CALCULATIONS
  // ==================================================

  const totalCheckIns =
    safeWellnessHistory.length

  // ==================================================
  // WELLNESS TREND DATA
  // ==================================================

  const trendData = safeWellnessHistory
    .slice(0, 7)
    .reverse()
    .map((item) => ({
      date: item.date || 'Unknown date',
      energy: Number(item.energy) || 0,
      water: Number(item.water) || 0,
      sleep:
        (Number(item.sleepHours) || 0) +
        (Number(item.sleepMinutes) || 0) / 60,
      mood: item.mood || 'Not entered',
    }))

  // ==================================================
  // AVERAGE ENERGY
  // ==================================================

  const energyValues = safeWellnessHistory
    .map((item) => Number(item.energy))
    .filter((value) => !isNaN(value))

  const averageEnergy =
    energyValues.length > 0
      ? (
          energyValues.reduce(
            (sum, value) => sum + value,
            0
          ) / energyValues.length
        ).toFixed(1)
      : '—'

  // ==================================================
  // AVERAGE WATER
  // ==================================================

  const waterValues = safeWellnessHistory
    .map((item) => Number(item.water))
    .filter((value) => !isNaN(value))

  const averageWater =
    waterValues.length > 0
      ? (
          waterValues.reduce(
            (sum, value) => sum + value,
            0
          ) / waterValues.length
        ).toFixed(1)
      : '—'

  // ==================================================
  // AVERAGE SLEEP
  // ==================================================

  const sleepValues = safeWellnessHistory
    .map((item) => {
      const hours = Number(item.sleepHours) || 0
      const minutes = Number(item.sleepMinutes) || 0

      if (hours === 0 && minutes === 0) {
        return null
      }

      return hours + minutes / 60
    })
    .filter((value) => value !== null)

  const averageSleep =
    sleepValues.length > 0
      ? (
          sleepValues.reduce(
            (sum, value) => sum + value,
            0
          ) / sleepValues.length
        ).toFixed(1)
      : '—'

  // ==================================================
  // AVERAGE MEDITATION
  // ==================================================

  const meditationValues = safeWellnessHistory
    .map((item) => Number(item.meditationMinutes))
    .filter((value) => !isNaN(value))

  const averageMeditation =
    meditationValues.length > 0
      ? (
          meditationValues.reduce(
            (sum, value) => sum + value,
            0
          ) / meditationValues.length
        ).toFixed(0)
      : '—'

  // ==================================================
  // MOST COMMON MOOD
  // ==================================================

  const moodCounts = {}

  safeWellnessHistory.forEach((item) => {
    if (item.mood) {
      moodCounts[item.mood] =
        (moodCounts[item.mood] || 0) + 1
    }
  })

  const mostCommonMood =
    Object.keys(moodCounts).length > 0
      ? Object.keys(moodCounts).reduce(
          (a, b) =>
            moodCounts[a] > moodCounts[b]
              ? a
              : b
        )
      : '—'

  // ==================================================
  // MOOD EMOJI
  // ==================================================

  const moodEmoji = {
    Great: '😊',
    Good: '🙂',
    Okay: '😐',
    Low: '😔',
  }

  // ==================================================
  // WELLNESS INSIGHTS
  // ==================================================

  const getEnergyInsight = () => {
    if (energyValues.length === 0) {
      return 'No energy data has been recorded yet.'
    }

    const average = Number(averageEnergy)

    if (average >= 4) {
      return 'Your energy has been generally good across your recent check-ins.'
    }

    if (average >= 3) {
      return 'Your energy has been moderate across your recent check-ins.'
    }

    return 'Your energy has been lower across your recent check-ins.'
  }

  const getWaterInsight = () => {
    if (waterValues.length === 0) {
      return 'No hydration data has been recorded yet.'
    }

    const average = Number(averageWater)

    if (average >= 8) {
      return 'Your recorded water intake has been consistent recently.'
    }

    if (average >= 5) {
      return 'Your recorded water intake has been moderate recently.'
    }

    return 'Your recorded water intake has been relatively low recently.'
  }

  const getSleepInsight = () => {
    if (sleepValues.length === 0) {
      return 'No sleep data has been recorded yet.'
    }

    const average = Number(averageSleep)

    if (average >= 8) {
      return 'Your recorded sleep duration has been consistent recently.'
    }

    if (average >= 6) {
      return 'Your recorded sleep duration has been moderate recently.'
    }

    return 'Your recorded sleep duration has been relatively low recently.'
  }

  const getMoodInsight = () => {
    if (mostCommonMood === '—') {
      return 'No mood pattern has been recorded yet.'
    }

    return `Your most frequently recorded mood has been ${mostCommonMood}.`
  }

  // ==================================================
  // EMPTY WELLNESS STATE
  // ==================================================

  const hasWellnessData =
    safeWellnessHistory.length > 0

  // ==================================================
  // DASHBOARD
  // ==================================================

  return (
    <section className="wellness-dashboard">

      {/* ==================================================
          HEADER
          ================================================== */}

      <div className="wellness-dashboard-header">

        <div>
          <span className="section-label">
            WELLNESS DASHBOARD
          </span>

          <h2>
            Maternal Wellness Dashboard
          </h2>

          <p>
            A summary of your recorded daily wellness patterns.
          </p>
        </div>

        <button
          type="button"
          className="wellness-dashboard-back"
          onClick={onBack}
        >
          ← Back
        </button>

      </div>


      {/* ==================================================
          PREGNANCY OVERVIEW
          ================================================== */}

      {pregnancyInfo && (
        <div className="dashboard-pregnancy-card">

          <div className="dashboard-pregnancy-header">

            <div>
              <span className="section-label">
                PREGNANCY OVERVIEW
              </span>

              <h3>
                Your Pregnancy Journey
              </h3>

              <p>
                Your wellness information alongside your
                current pregnancy stage.
              </p>
            </div>

            <span className="dashboard-pregnancy-icon">
              🤰
            </span>

          </div>


          <div className="dashboard-pregnancy-content">

            {/* WEEK */}

            <div className="dashboard-pregnancy-item">

              <span>
                🌸 Pregnancy Week
              </span>

              <strong>
                Week {pregnancyInfo.weeks}
              </strong>

              <small>
                {pregnancyInfo.days} day
                {pregnancyInfo.days !== 1 ? 's' : ''}
              </small>

            </div>


            {/* TRIMESTER */}

            <div className="dashboard-pregnancy-item">

              <span>
                🌿 Trimester
              </span>

              <strong>
                {pregnancyInfo.trimester}
              </strong>

            </div>


            {/* DUE DATE */}

            <div className="dashboard-pregnancy-item">

              <span>
                📅 Estimated Due Date
              </span>

              <strong>
                {pregnancyInfo.dueDate}
              </strong>

            </div>


            {/* PROGRESS */}

            <div className="dashboard-pregnancy-item">

              <span>
                📈 Pregnancy Progress
              </span>

              <strong>
                {pregnancyInfo.progress}%
              </strong>

              <div className="dashboard-pregnancy-progress">

                <div
                  style={{
                    width: `${pregnancyInfo.progress}%`,
                  }}
                ></div>

              </div>

              <small>
                {pregnancyInfo.remainingWeeks} weeks remaining
              </small>

            </div>

          </div>

        </div>
      )}


      {/* ==================================================
          NUTRITION OVERVIEW
          ================================================== */}

      <div className="dashboard-nutrition-card">

        <div className="dashboard-nutrition-header">

          <div>

            <span className="section-label">
              NUTRITION OVERVIEW
            </span>

            <h3>
              Your Nutrition Snapshot
            </h3>

            <p>
              A quick view of your saved nutrition preferences,
              cravings, allergies, and latest food suggestions.
            </p>

          </div>

          <span className="dashboard-nutrition-icon">
            🥗
          </span>

        </div>


        <div className="dashboard-nutrition-grid">

          {/* SAVED PLANS */}

          <div className="nutrition-overview-item">

            <span>
              📋 Saved Plans
            </span>

            <strong>
              {safeNutritionHistory.length}
            </strong>

            <small>
              nutrition plan
              {safeNutritionHistory.length !== 1 ? 's' : ''}
            </small>

          </div>


          {/* DIETARY PREFERENCE */}

          <div className="nutrition-overview-item">

            <span>
              🍽️ Dietary Preference
            </span>

            <strong>
              {nutritionPreference}
            </strong>

          </div>


          {/* ALLERGIES */}

          <div className="nutrition-overview-item">

            <span>
              ⚠️ Foods to Avoid
            </span>

            <strong>
              {nutritionAllergies.length > 0
                ? nutritionAllergies.length
                : 'None'}
            </strong>

            {nutritionAllergies.length > 0 && (
              <small>
                {nutritionAllergies.join(', ')}
              </small>
            )}

          </div>


          {/* CRAVINGS */}

          <div className="nutrition-overview-item">

            <span>
              💗 Recent Cravings
            </span>

            <strong>
              {nutritionCravings.length > 0
                ? nutritionCravings.join(', ')
                : 'Not recorded'}
            </strong>

          </div>

        </div>


        {/* LATEST PLAN */}

        {latestNutritionPlan ? (

          <div className="latest-nutrition-plan">

            <div className="latest-nutrition-header">

              <div>

                <span className="section-label">
                  LATEST PLAN
                </span>

                <h4>
                  Your Latest Food Suggestions
                </h4>

              </div>

              <span className="latest-nutrition-date">
                📅 {latestNutritionPlan.date}
              </span>

            </div>


            {nutritionRecommendations.length > 0 ? (

              <div className="dashboard-food-list">

                {nutritionRecommendations
                  .slice(0, 4)
                  .map((food, index) => (

                    <div
                      className="dashboard-food-item"
                      key={`${food.food_name}-${index}`}
                    >

                      <div className="dashboard-food-icon">
                        🍎
                      </div>

                      <div>

                        <strong>
                          {food.food_name}
                        </strong>

                        <span>
                          {food.category ||
                            food.dietary_type ||
                            'Pregnancy-friendly option'}
                        </span>

                      </div>

                    </div>

                  ))}

              </div>

            ) : (

              <div className="dashboard-food-empty">
                No food suggestions were saved in the latest plan.
              </div>

            )}

          </div>

        ) : (

          <div className="dashboard-nutrition-empty">

            <span>
              🥗
            </span>

            <div>

              <strong>
                No Nutrition Plan Saved Yet
              </strong>

              <p>
                Explore Nutrition to create a personalized
                educational food plan based on your pregnancy
                stage, wellness information, cravings, and preferences.
              </p>

            </div>

          </div>

        )}


        {/* ==================================================
            EXPLORE NUTRITION
            ================================================== */}

        {onNutritionClick && (

          <button
            type="button"
            className="dashboard-nutrition-button"
            onClick={onNutritionClick}
          >

            <span className="dashboard-nutrition-button-text">
              🥗 Explore Nutrition
            </span>

            <span className="dashboard-nutrition-button-arrow">
              →
            </span>

          </button>

        )}

      </div>


      {/* ==================================================
          WELLNESS EMPTY STATE
          ================================================== */}

      {!hasWellnessData && (

        <div className="wellness-dashboard-empty">

          <div className="wellness-dashboard-empty-icon">
            🦋
          </div>

          <h3>
            No Wellness Data Yet
          </h3>

          <p>
            Complete a Daily Wellness Check-in to see your
            wellness summary and trends here.
          </p>

        </div>

      )}


      {/* ==================================================
          WELLNESS CONTENT
          ================================================== */}

      {hasWellnessData && (

        <>

          {/* ==================================================
              SUMMARY CARDS
              ================================================== */}

          <div className="wellness-dashboard-grid">

            {/* TOTAL CHECK-INS */}

            <div className="wellness-stat-card">

              <div className="wellness-stat-icon">
                🌸
              </div>

              <div>

                <span>
                  Total Check-ins
                </span>

                <strong>
                  {totalCheckIns}
                </strong>

              </div>

            </div>


            {/* AVERAGE ENERGY */}

            <div className="wellness-stat-card">

              <div className="wellness-stat-icon">
                ⚡
              </div>

              <div>

                <span>
                  Average Energy
                </span>

                <strong>
                  {averageEnergy}
                  {averageEnergy !== '—' && ' / 5'}
                </strong>

              </div>

            </div>


            {/* AVERAGE WATER */}

            <div className="wellness-stat-card">

              <div className="wellness-stat-icon">
                💧
              </div>

              <div>

                <span>
                  Average Water
                </span>

                <strong>
                  {averageWater}
                  {averageWater !== '—' && ' glasses'}
                </strong>

              </div>

            </div>


            {/* AVERAGE SLEEP */}

            <div className="wellness-stat-card">

              <div className="wellness-stat-icon">
                😴
              </div>

              <div>

                <span>
                  Average Sleep
                </span>

                <strong>
                  {averageSleep}
                  {averageSleep !== '—' && ' hrs'}
                </strong>

              </div>

            </div>


            {/* AVERAGE MEDITATION */}

            <div className="wellness-stat-card">

              <div className="wellness-stat-icon">
                🧘
              </div>

              <div>

                <span>
                  Avg. Meditation
                </span>

                <strong>
                  {averageMeditation}
                  {averageMeditation !== '—' && ' min'}
                </strong>

              </div>

            </div>


            {/* COMMON MOOD */}

            <div className="wellness-stat-card">

              <div className="wellness-stat-icon">
                {moodEmoji[mostCommonMood] || '😊'}
              </div>

              <div>

                <span>
                  Most Common Mood
                </span>

                <strong>
                  {mostCommonMood}
                </strong>

              </div>

            </div>

          </div>


          {/* ==================================================
              WELLNESS OVERVIEW
              ================================================== */}

          <div className="wellness-overview-card">

            <div className="wellness-overview-header">

              <div>

                <span className="section-label">
                  OVERVIEW
                </span>

                <h3>
                  Your Wellness at a Glance
                </h3>

              </div>

              <span className="wellness-overview-icon">
                📊
              </span>

            </div>


            <div className="wellness-overview-content">

              <div className="overview-item">

                <span>
                  😊 Mood
                </span>

                <strong>
                  {moodEmoji[mostCommonMood] || ''}
                  {' '}
                  {mostCommonMood}
                </strong>

              </div>


              <div className="overview-item">

                <span>
                  ⚡ Energy
                </span>

                <strong>
                  {averageEnergy}
                  {averageEnergy !== '—' && ' / 5'}
                </strong>

              </div>


              <div className="overview-item">

                <span>
                  💧 Hydration
                </span>

                <strong>
                  {averageWater}
                  {averageWater !== '—' && ' glasses/day'}
                </strong>

              </div>


              <div className="overview-item">

                <span>
                  😴 Sleep
                </span>

                <strong>
                  {averageSleep}
                  {averageSleep !== '—' && ' hrs/night'}
                </strong>

              </div>

            </div>

          </div>


          {/* ==================================================
              WELLNESS TRENDS
              ================================================== */}

          <div className="wellness-trends-card">

            <div className="wellness-trends-header">

              <div>

                <span className="section-label">
                  WELLNESS TRENDS
                </span>

                <h3>
                  Your Recent Wellness Patterns
                </h3>

                <p>
                  Trends from your last {trendData.length} check-in
                  {trendData.length !== 1 ? 's' : ''}.
                </p>

              </div>

              <span className="wellness-trends-icon">
                📈
              </span>

            </div>


            {/* ENERGY TREND */}

            <div className="trend-section">

              <div className="trend-title">

                <span>
                  ⚡ Energy
                </span>

                <span>
                  1–5 scale
                </span>

              </div>


              <div className="trend-values">

                {trendData.map((item, index) => (

                  <div
                    className="trend-column"
                    key={`${item.date}-energy-${index}`}
                  >

                    <div className="trend-bar-area">

                      <div
                        className="trend-bar energy-bar"
                        style={{
                          height: `${Math.max(
                            item.energy * 20,
                            5
                          )}%`,
                        }}
                      >

                        <span>
                          {item.energy}
                        </span>

                      </div>

                    </div>

                    <small>
                      {item.date.split(',')[0]}
                    </small>

                  </div>

                ))}

              </div>

            </div>


            {/* WATER TREND */}

            <div className="trend-section">

              <div className="trend-title">

                <span>
                  💧 Water Intake
                </span>

                <span>
                  glasses
                </span>

              </div>


              <div className="trend-values">

                {trendData.map((item, index) => {

                  const waterHeight =
                    Math.min(
                      item.water * 10,
                      100
                    )

                  return (

                    <div
                      className="trend-column"
                      key={`${item.date}-water-${index}`}
                    >

                      <div className="trend-bar-area">

                        <div
                          className="trend-bar water-bar"
                          style={{
                            height: `${Math.max(
                              waterHeight,
                              5
                            )}%`,
                          }}
                        >

                          <span>
                            {item.water}
                          </span>

                        </div>

                      </div>

                      <small>
                        {item.date.split(',')[0]}
                      </small>

                    </div>

                  )

                })}

              </div>

            </div>


            {/* SLEEP TREND */}

            <div className="trend-section">

              <div className="trend-title">

                <span>
                  😴 Sleep
                </span>

                <span>
                  hours
                </span>

              </div>


              <div className="trend-values">

                {trendData.map((item, index) => {

                  const sleepHeight =
                    Math.min(
                      item.sleep * 10,
                      100
                    )

                  return (

                    <div
                      className="trend-column"
                      key={`${item.date}-sleep-${index}`}
                    >

                      <div className="trend-bar-area">

                        <div
                          className="trend-bar sleep-bar"
                          style={{
                            height: `${Math.max(
                              sleepHeight,
                              5
                            )}%`,
                          }}
                        >

                          <span>
                            {item.sleep.toFixed(1)}
                          </span>

                        </div>

                      </div>

                      <small>
                        {item.date.split(',')[0]}
                      </small>

                    </div>

                  )

                })}

              </div>

            </div>


            {/* MOOD PATTERN */}

            <div className="mood-trend-section">

              <div className="trend-title">

                <span>
                  😊 Mood Pattern
                </span>

              </div>


              <div className="mood-trend-list">

                {trendData.map((item, index) => (

                  <div
                    className="mood-trend-item"
                    key={`${item.date}-mood-${index}`}
                  >

                    <span>
                      {item.date.split(',')[0]}
                    </span>

                    <strong>
                      {moodEmoji[item.mood] || '—'}
                      {' '}
                      {item.mood}
                    </strong>

                  </div>

                ))}

              </div>

            </div>

          </div>


          {/* ==================================================
              WELLNESS INSIGHTS
              ================================================== */}

          <div className="wellness-insights-card">

            <div className="wellness-insights-header">

              <div>

                <span className="section-label">
                  WELLNESS INSIGHTS
                </span>

                <h3>
                  What Your Recent Data Shows
                </h3>

                <p>
                  Simple observations based on your recorded
                  wellness check-ins.
                </p>

              </div>

              <span className="wellness-insights-icon">
                💡
              </span>

            </div>


            <div className="wellness-insights-list">

              <div className="wellness-insight-item">

                <div className="insight-icon">
                  ⚡
                </div>

                <div>

                  <strong>
                    Energy
                  </strong>

                  <p>
                    {getEnergyInsight()}
                  </p>

                </div>

              </div>


              <div className="wellness-insight-item">

                <div className="insight-icon">
                  💧
                </div>

                <div>

                  <strong>
                    Hydration
                  </strong>

                  <p>
                    {getWaterInsight()}
                  </p>

                </div>

              </div>


              <div className="wellness-insight-item">

                <div className="insight-icon">
                  😴
                </div>

                <div>

                  <strong>
                    Sleep
                  </strong>

                  <p>
                    {getSleepInsight()}
                  </p>

                </div>

              </div>


              <div className="wellness-insight-item">

                <div className="insight-icon">
                  😊
                </div>

                <div>

                  <strong>
                    Mood
                  </strong>

                  <p>
                    {getMoodInsight()}
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* ==================================================
              RECENT CHECK-INS
              ================================================== */}

          <div className="wellness-recent-card">

            <div className="wellness-recent-header">

              <div>

                <span className="section-label">
                  RECENT ACTIVITY
                </span>

                <h3>
                  Recent Wellness Check-ins
                </h3>

              </div>

            </div>


            <div className="wellness-recent-list">

              {safeWellnessHistory
                .slice(0, 5)
                .map((item) => (

                  <div
                    className="wellness-recent-item"
                    key={item.id}
                  >

                    <div className="recent-icon">
                      🦋
                    </div>

                    <div className="recent-info">

                      <strong>
                        {item.date}
                      </strong>

                      <span>
                        {item.mood
                          ? `${moodEmoji[item.mood] || ''} ${item.mood}`
                          : 'Mood not entered'}
                      </span>

                    </div>

                    <div className="recent-energy">

                      {item.energy
                        ? `⚡ ${item.energy}/5`
                        : '—'}

                    </div>

                  </div>

                ))}

            </div>

          </div>

        </>

      )}


      {/* ==================================================
          DISCLAIMER
          ================================================== */}

      <div className="wellness-dashboard-note">

        <span>
          ℹ️
        </span>

        <p>
          This dashboard summarizes your recorded wellness
          and nutrition information. It is intended for personal
          monitoring and educational purposes and does not replace
          professional medical advice.
        </p>

      </div>

    </section>
  )
}

export default MaternalWellnessDashboard