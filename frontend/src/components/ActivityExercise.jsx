import { useEffect, useState } from 'react'
import './ActivityExercise.css'

function ActivityExercise({
  user,
  activityHistory,
  onSaveActivity,
  onBack,
}) {

  // =========================================================
  // 8.2 — PREGNANCY INFORMATION
  // =========================================================

  const pregnancyInfo = (() => {
    const savedPregnancyInfo =
      user?.id
        ? localStorage.getItem(
            `pregnancyInfo_${user.id}`
          )
        : null

    if (!savedPregnancyInfo) {
      return null
    }

    try {
      return JSON.parse(savedPregnancyInfo)
    } catch (error) {
      console.error(
        'Unable to read pregnancy information:',
        error
      )

      return null
    }
  })()


  // =========================================================
  // 8.3 — TODAY'S DAILY WELLNESS DATA
  // =========================================================

  const todayWellness = (() => {
    const savedWellness =
      user?.id
        ? localStorage.getItem(
            `wellnessHistory_${user.id}`
          )
        : null

    if (!savedWellness) {
      return null
    }

    try {
      const wellnessHistory =
        JSON.parse(savedWellness)

      const today =
        new Date().toISOString().split('T')[0]

      return (
        wellnessHistory.find(
          (entry) =>
            entry.selectedDate === today
        ) || null
      )

    } catch (error) {
      console.error(
        'Unable to read wellness history:',
        error
      )

      return null
    }
  })()


  // =========================================================
  // 8.8 — ACTIVITY HISTORY
  // =========================================================

  const today =
    new Date().toISOString().split('T')[0]

  const todayActivityPlan =
    activityHistory?.find(
      (entry) =>
        entry.selectedDate === today
    ) || null


  // =========================================================
  // 8.4 — ACTIVITY CATEGORIES
  // =========================================================

  const activities = [
    {
      icon: '🚶',
      title: 'Walking',
      category: 'Low-impact movement',
      backendCategories: [
        'Low-impact movement',
      ],
      description:
        'A simple low-impact activity that can support everyday movement and general fitness during pregnancy.',
    },

    {
      icon: '🧘',
      title: 'Prenatal Yoga',
      category: 'Flexibility & mobility',
      backendCategories: [
        'Prenatal yoga',
      ],
      description:
        'Gentle pregnancy-friendly yoga can support flexibility, relaxation and mindful movement.',
    },

    {
      icon: '🤸',
      title: 'Stretching',
      category: 'Flexibility & mobility',
      backendCategories: [
        'Stretching / mobility',
      ],
      description:
        'Gentle stretching can help you stay flexible and comfortable throughout the day.',
    },

    {
      icon: '🪢',
      title: 'Pelvic Floor Exercises',
      category: 'Pelvic floor',
      backendCategories: [
        'Pelvic floor',
      ],
      description:
        'Gentle pelvic floor exercises can help support the muscles that support the bladder, bowel and pelvic organs during pregnancy.',
    },

    {
      icon: '💪',
      title: 'Light Strength',
      category: 'Strength & endurance',
      backendCategories: [
        'Light strength',
      ],
      description:
        'Light strengthening exercises can support muscle endurance when performed appropriately.',
    },

    {
      icon: '🫁',
      title: 'Breathing & Relaxation',
      category: 'Relaxation',
      backendCategories: [
        'Breathing & relaxation',
      ],
      description:
        'Breathing and relaxation activities can encourage calmness and mindful rest.',
    },
  ]


  // =========================================================
  // EXERCISE DATASET STATE
  // =========================================================

  const [
    exerciseDataset,
    setExerciseDataset,
  ] = useState([])

  const [
    exerciseDatasetLoading,
    setExerciseDatasetLoading,
  ] = useState(false)

  const [
    exerciseDatasetError,
    setExerciseDatasetError,
  ] = useState('')


  // =========================================================
  // OPEN CATEGORY STATE
  // =========================================================

  const [
    selectedActivity,
    setSelectedActivity,
  ] = useState(null)


  // =========================================================
  // 8.7 — RECOMMENDATION ENGINE STATE
  // =========================================================

  const [
    recommendations,
    setRecommendations,
  ] = useState([])

  const [
    recommendationStatus,
    setRecommendationStatus,
  ] = useState('')

  const [
    recommendationMessages,
    setRecommendationMessages,
  ] = useState([])

  const [
    loadingRecommendations,
    setLoadingRecommendations,
  ] = useState(false)

  const [
    recommendationError,
    setRecommendationError,
  ] = useState('')

  const [
    activitySaved,
    setActivitySaved,
  ] = useState(Boolean(todayActivityPlan))

  const [
    saveMessage,
    setSaveMessage,
  ] = useState('')


  // =========================================================
  // WELLNESS DISPLAY HELPERS
  // =========================================================

  const getSleepText = () => {

    if (!todayWellness) {
      return 'Not recorded'
    }

    const hours =
      Number(todayWellness.sleepHours) || 0

    const minutes =
      Number(todayWellness.sleepMinutes) || 0

    if (
      hours === 0 &&
      minutes === 0
    ) {
      return 'Not recorded'
    }

    return `${hours}h ${minutes}m`
  }


  const getWaterText = () => {

    if (
      !todayWellness ||
      todayWellness.water === '' ||
      todayWellness.water === null ||
      todayWellness.water === undefined
    ) {
      return 'Not recorded'
    }

    return `${todayWellness.water} glasses`
  }


  const getMoodText = () => {

    if (
      !todayWellness ||
      !todayWellness.mood
    ) {
      return 'Not recorded'
    }

    return todayWellness.mood
  }


  const getEnergyText = () => {

    if (
      !todayWellness ||
      todayWellness.energy === '' ||
      todayWellness.energy === null ||
      todayWellness.energy === undefined
    ) {
      return 'Not recorded'
    }

    return `${todayWellness.energy} / 5`
  }


  const getPainText = () => {

    if (
      !todayWellness ||
      !todayWellness.pain ||
      todayWellness.pain.length === 0
    ) {
      return 'Not recorded'
    }

    if (Array.isArray(todayWellness.pain)) {
      return todayWellness.pain.join(', ')
    }

    return todayWellness.pain
  }


  const getFeelingsText = () => {

    if (
      !todayWellness ||
      !todayWellness.feelings ||
      todayWellness.feelings.length === 0
    ) {
      return 'Not recorded'
    }

    if (
      Array.isArray(
        todayWellness.feelings
      )
    ) {
      return todayWellness.feelings.join(', ')
    }

    return todayWellness.feelings
  }


  const getSelfCareText = () => {

    if (
      !todayWellness ||
      !todayWellness.selfCare ||
      todayWellness.selfCare.length === 0
    ) {
      return 'Not recorded'
    }

    if (
      Array.isArray(
        todayWellness.selfCare
      )
    ) {
      return todayWellness.selfCare.join(', ')
    }

    return todayWellness.selfCare
  }


  // =========================================================
  // LOAD ALL EXERCISES FROM BACKEND
  // =========================================================

  const loadExerciseDataset = async () => {

    setExerciseDatasetLoading(true)

    setExerciseDatasetError('')

    try {

      const response = await fetch(
        'http://127.0.0.1:8000/activity/exercises'
      )

      if (!response.ok) {
        throw new Error(
          `Request failed with status ${response.status}`
        )
      }

      const data =
        await response.json()

      const exercises =
        Array.isArray(data.exercises)
          ? data.exercises
          : []

      setExerciseDataset(
        exercises
      )

    } catch (error) {

      console.error(
        'Unable to load exercise dataset:',
        error
      )

      setExerciseDatasetError(
        'Unable to load the exercise library right now. Please make sure the backend is running.'
      )

    } finally {

      setExerciseDatasetLoading(false)

    }
  }


  // =========================================================
  // OPEN CATEGORY
  // =========================================================

  const handleOpenActivity = (
    activity
  ) => {

    setSelectedActivity(
      activity
    )

  }


  // =========================================================
  // CLOSE CATEGORY
  // =========================================================

  const handleCloseActivity = () => {

    setSelectedActivity(null)

  }


  // =========================================================
  // FILTER EXERCISES FOR SELECTED CATEGORY
  // =========================================================

  const getExercisesForCategory = (
    activity
  ) => {

    if (!activity) {
      return []
    }

    const allowedCategories =
      activity.backendCategories || []

    return exerciseDataset.filter(
      (exercise) => {

        const exerciseCategory =
          String(
            exercise.Category ||
            exercise.category ||
            ''
          )
            .trim()
            .toLowerCase()

        return allowedCategories.some(
          (category) =>
            exerciseCategory ===
            String(category)
              .trim()
              .toLowerCase()
        )

      }
    )

  }


  // =========================================================
  // GENERATE ACTIVITY RECOMMENDATIONS
  // =========================================================

  const generateRecommendations = async () => {

    setLoadingRecommendations(true)

    setRecommendationError('')

    setRecommendationMessages([])

    try {

      const response = await fetch(
        'http://127.0.0.1:8000/activity/recommendations',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({

            pregnancy_info:
              pregnancyInfo || {},

            wellness:
              todayWellness || {},

          }),
        }
      )


      if (!response.ok) {

        throw new Error(
          `Request failed with status ${response.status}`
        )

      }


      const data =
        await response.json()


      setRecommendationStatus(
        data.status || ''
      )


      setRecommendations(
        Array.isArray(
          data.recommendations
        )
          ? data.recommendations
          : []
      )


      setRecommendationMessages(
        Array.isArray(
          data.messages
        )
          ? data.messages
          : []
      )

    } catch (error) {

      console.error(
        'Unable to generate activity recommendations:',
        error
      )

      setRecommendationError(
        'Unable to generate activity recommendations right now. Please make sure the backend is running.'
      )

    } finally {

      setLoadingRecommendations(false)

    }

  }


  // =========================================================
  // PAGE LOAD
  // =========================================================

  useEffect(() => {

    loadExerciseDataset()

    generateRecommendations()

  }, [])


  // =========================================================
  // SAVE ACTIVITY PLAN
  // =========================================================

  const handleSaveActivity = () => {

    if (!onSaveActivity) {
      return
    }


    const entry = {

      id:
        todayActivityPlan?.id ||
        Date.now(),

      selectedDate:
        today,

      date:
        today,

      pregnancyInfo:
        pregnancyInfo
          ? {
              weeks:
                pregnancyInfo.weeks,

              trimester:
                pregnancyInfo.trimester,

              dueDate:
                pregnancyInfo.dueDate,
            }
          : null,

      wellness:
        todayWellness
          ? {

              energy:
                todayWellness.energy ?? '',

              sleepQuality:
                todayWellness.sleepQuality ?? '',

              sleepDuration:
                todayWellness.sleepDuration ?? '',

              sleepHours:
                todayWellness.sleepHours ?? '',

              sleepMinutes:
                todayWellness.sleepMinutes ?? '',

              mood:
                todayWellness.mood ?? '',

              feelings:
                todayWellness.feelings ?? '',

              pain:
                todayWellness.pain ?? '',

              water:
                todayWellness.water ?? '',

              selfCare:
                todayWellness.selfCare ?? [],

            }
          : {},

      recommendations,

      status:
        recommendationStatus ||
        'recommendations_available',

      messages:
        recommendationMessages,

    }


    onSaveActivity(entry)

    setActivitySaved(true)


    setSaveMessage(
      todayActivityPlan
        ? '✓ Today’s activity plan has been updated.'
        : '✓ Today’s activity plan has been saved.'
    )

  }


  // =========================================================
  // RECOMMENDATION STATUS TEXT
  // =========================================================

  const getRecommendationStatusText = () => {

    if (
      recommendationStatus ===
      'medical_advice'
    ) {
      return 'Medical advice recommended'
    }

    if (
      recommendationStatus ===
      'rest_day'
    ) {
      return 'Today is a rest day'
    }

    if (
      recommendationStatus ===
      'wellness_context_missing'
    ) {
      return 'Wellness check-in needed'
    }

    if (
      recommendationStatus ===
      'activity_preference_missing'
    ) {
      return 'Choose today’s activity'
    }

    if (
      recommendationStatus ===
      'recommendations_available'
    ) {
      return 'Personalized activity suggestions'
    }

    return 'Activity guidance'

  }


  // =========================================================
  // SELECTED CATEGORY EXERCISES
  // =========================================================

  const selectedExercises =
    getExercisesForCategory(
      selectedActivity
    )


  // =========================================================
  // RENDER
  // =========================================================

  return (

    <div className="activity-page">


      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="activity-header">

        <div>

          <span className="activity-label">
            🏃 MATERNAL WELLNESS
          </span>

          <h2>
            Activity & Exercise
          </h2>

          <p>
            Explore gentle, pregnancy-friendly ways to stay
            active, relaxed and comfortable.
          </p>

        </div>

        <div className="activity-header-icon">
          🏃‍♀️
        </div>

      </div>


      {/* =====================================================
          PREGNANCY CONTEXT
          ===================================================== */}

      {pregnancyInfo ? (

        <section className="activity-pregnancy-card">

          <div className="activity-pregnancy-header">

            <div className="activity-pregnancy-title">

              <span className="activity-pregnancy-small">
                YOUR PREGNANCY
              </span>

              <h3>
                🤰 Your Pregnancy Context
              </h3>

            </div>

            <span className="activity-pregnancy-icon">
              🌷
            </span>

          </div>


          <div className="activity-pregnancy-details">

            <div className="activity-pregnancy-item">

              <span>
                🌸
              </span>

              <div>

                <strong>
                  Pregnancy Week
                </strong>

                <p>
                  Week {pregnancyInfo.weeks}
                </p>

              </div>

            </div>


            <div className="activity-pregnancy-item">

              <span>
                🌿
              </span>

              <div>

                <strong>
                  Trimester
                </strong>

                <p>
                  {pregnancyInfo.trimester}
                </p>

              </div>

            </div>


            <div className="activity-pregnancy-item">

              <span>
                📅
              </span>

              <div>

                <strong>
                  Due Date
                </strong>

                <p>
                  {pregnancyInfo.dueDate}
                </p>

              </div>

            </div>

          </div>

        </section>

      ) : (

        <section className="activity-no-pregnancy">

          <span>
            🤰
          </span>

          <div>

            <h3>
              Pregnancy information not available
            </h3>

            <p>
              Add your pregnancy information in Pregnancy
              Overview to connect it with activity guidance.
            </p>

          </div>

        </section>

      )}


      {/* =====================================================
          DAILY WELLNESS CONNECTION
          ===================================================== */}

      <section className="activity-wellness-card">

        <div className="activity-wellness-header">

          <div>

            <span className="activity-section-label">
              DAILY WELLNESS
            </span>

            <h3>
              🌷 Today's Wellness Check-in
            </h3>

            <p>
              Your latest Daily Wellness information is shown
              here as context for your activity journey.
            </p>

          </div>

          <div className="activity-wellness-icon">
            💗
          </div>

        </div>


        {todayWellness ? (

          <>

            <div className="activity-wellness-grid">

              <div className="activity-wellness-item">

                <span>
                  ⚡
                </span>

                <div>

                  <small>
                    Energy
                  </small>

                  <strong>
                    {getEnergyText()}
                  </strong>

                </div>

              </div>


              <div className="activity-wellness-item">

                <span>
                  😴
                </span>

                <div>

                  <small>
                    Sleep
                  </small>

                  <strong>
                    {getSleepText()}
                  </strong>

                </div>

              </div>


              <div className="activity-wellness-item">

                <span>
                  💧
                </span>

                <div>

                  <small>
                    Water
                  </small>

                  <strong>
                    {getWaterText()}
                  </strong>

                </div>

              </div>


              <div className="activity-wellness-item">

                <span>
                  😊
                </span>

                <div>

                  <small>
                    Mood
                  </small>

                  <strong>
                    {getMoodText()}
                  </strong>

                </div>

              </div>


              <div className="activity-wellness-item">

                <span>
                  💭
                </span>

                <div>

                  <small>
                    Feelings
                  </small>

                  <strong>
                    {getFeelingsText()}
                  </strong>

                </div>

              </div>


              <div className="activity-wellness-item">

                <span>
                  🩹
                </span>

                <div>

                  <small>
                    Pain & Body Comfort
                  </small>

                  <strong>
                    {getPainText()}
                  </strong>

                </div>

              </div>


              <div className="activity-wellness-item">

                <span>
                  🧘
                </span>

                <div>

                  <small>
                    Self-care
                  </small>

                  <strong>
                    {getSelfCareText()}
                  </strong>

                </div>

              </div>

            </div>


            <div className="activity-wellness-note">

              <span>
                ℹ️
              </span>

              <p>
                Your feelings, pain/body comfort and self-care
                choices are used as context for activity
                guidance. Safety conditions take priority.
              </p>

            </div>

          </>

        ) : (

          <div className="activity-wellness-empty">

            <div className="activity-wellness-empty-icon">
              🌸
            </div>

            <div>

              <h4>
                No wellness check-in recorded today
              </h4>

              <p>
                Complete your Daily Wellness check-in to keep
                your activity page connected with your latest
                wellness information.
              </p>

            </div>

          </div>

        )}

      </section>


      {/* =====================================================
          PERSONALIZED RECOMMENDATIONS
          ===================================================== */}

      <section className="activity-recommendations-card">

        <div className="activity-recommendations-header">

          <div>

            <span className="activity-section-label">
              PERSONALIZED GUIDANCE
            </span>

            <h3>
              ✨ Recommended Activities
            </h3>

            <p>
              Suggestions are generated using your pregnancy
              context, today's wellness information and the
              activity safety rules in the system.
            </p>

          </div>

          <div className="activity-recommendations-icon">
            🌿
          </div>

        </div>


        {/* LOADING */}

        {loadingRecommendations && (

          <div className="activity-recommendations-loading">

            <span>
              🌸
            </span>

            <p>
              Preparing your activity suggestions...
            </p>

          </div>

        )}


        {/* ERROR */}

        {recommendationError && (

          <div className="activity-recommendation-error">

            <span>
              ⚠️
            </span>

            <p>
              {recommendationError}
            </p>

            <button
              type="button"
              onClick={generateRecommendations}
            >
              Try Again
            </button>

          </div>

        )}


        {/* MEDICAL ADVICE */}

        {!loadingRecommendations &&
          !recommendationError &&
          recommendationStatus ===
            'medical_advice' && (

          <div className="activity-medical-advice">

            <div className="activity-medical-advice-icon">
              ⚠️
            </div>

            <div>

              <h4>
                Medical advice is recommended
              </h4>

              {recommendationMessages.map(
                (message, index) => (

                  <p key={index}>
                    {message}
                  </p>

                )
              )}

              <p className="activity-medical-advice-note">
                No activity recommendations are shown
                while this safety condition is active.
              </p>

            </div>

          </div>

        )}


        {/* REST DAY */}

        {!loadingRecommendations &&
          !recommendationError &&
          recommendationStatus ===
            'rest_day' && (

          <div className="activity-rest-day-card">

            <div className="activity-rest-day-icon">
              🛌
            </div>

            <div>

              <h4>
                Today is a Rest Day
              </h4>

              <p>
                Give your body some time to rest and recover
                today. Take care of yourself, stay comfortable
                and listen to what your body needs. 🌷
              </p>

              {recommendationMessages.map(
                (message, index) => (

                  <p key={index}>
                    {message}
                  </p>

                )
              )}

            </div>

          </div>

        )}


        {/* WELLNESS CONTEXT MISSING */}

        {!loadingRecommendations &&
          !recommendationError &&
          recommendationStatus ===
            'wellness_context_missing' && (

          <div className="activity-no-recommendations">

            <span>
              🌷
            </span>

            <div>

              <h4>
                Complete today's Wellness Check-in
              </h4>

              <p>
                Your activity guidance is connected to
                today's Feelings and Pain & Body Comfort
                information. Complete your check-in before
                receiving activity suggestions.
              </p>

            </div>

          </div>

        )}


        {/* ACTIVITY PREFERENCE MISSING */}

        {!loadingRecommendations &&
          !recommendationError &&
          recommendationStatus ===
            'activity_preference_missing' && (

          <div className="activity-no-recommendations">

            <span>
              🧘
            </span>

            <div>

              <h4>
                Choose today's activity preference
              </h4>

              <p>
                Go to your Daily Wellness check-in and
                choose what you would like to do today,
                such as Walking, Prenatal Yoga, Stretching,
                Pelvic Floor Exercises, Light Strength or
                Breathing & Relaxation.
              </p>

            </div>

          </div>

        )}


        {/* NORMAL RECOMMENDATIONS */}

        {!loadingRecommendations &&
          !recommendationError &&
          recommendationStatus !==
            'medical_advice' &&
          recommendationStatus !==
            'rest_day' &&
          recommendationStatus !==
            'wellness_context_missing' &&
          recommendationStatus !==
            'activity_preference_missing' &&
          recommendations.length > 0 && (

          <>

            <div className="activity-recommendation-status">

              <span>
                🌸
              </span>

              <strong>
                {getRecommendationStatusText()}
              </strong>

            </div>


            <div className="activity-recommendations-list">

              {recommendations.map(
                (
                  recommendation,
                  index
                ) => (

                  <div
                    className="activity-recommendation-item"
                    key={
                      recommendation.exercise_id ||
                      recommendation.id ||
                      `${recommendation.exercise_name}-${index}`
                    }
                  >

                    <div className="activity-recommendation-icon">
                      {recommendation.icon ||
                        '🌿'}
                    </div>

                    <div className="activity-recommendation-content">

                      <div className="activity-recommendation-top">

                        <h4>
                          {recommendation.exercise_name ||
                            recommendation.name}
                        </h4>

                        {recommendation.intensity && (

                          <span>
                            {recommendation.intensity}
                          </span>

                        )}

                      </div>


                      {recommendation.category && (

                        <small>
                          {recommendation.category}
                        </small>

                      )}


                      {recommendation.description && (

                        <p>
                          {recommendation.description}
                        </p>

                      )}


                      {recommendation.reason && (

                        <p className="activity-recommendation-reason">
                          🌸 {recommendation.reason}
                        </p>

                      )}


                      {recommendation.modifications && (

                        <p className="activity-recommendation-modification">
                          🔄 {recommendation.modifications}
                        </p>

                      )}


                      {recommendation.safety && (

                        <span className="activity-recommendation-safety">
                          Safety: {recommendation.safety}
                        </span>

                      )}

                    </div>

                  </div>

                )
              )}

            </div>

          </>

        )}


        {/* NO RECOMMENDATIONS */}

        {!loadingRecommendations &&
          !recommendationError &&
          recommendationStatus !==
            'medical_advice' &&
          recommendationStatus !==
            'rest_day' &&
          recommendationStatus !==
            'wellness_context_missing' &&
          recommendationStatus !==
            'activity_preference_missing' &&
          recommendations.length === 0 && (

          <div className="activity-no-recommendations">

            <span>
              🌿
            </span>

            <p>
              No activity recommendations are currently
              available for the provided context.
            </p>

          </div>

        )}

      </section>


      {/* =====================================================
          SAVE ACTIVITY PLAN
          ===================================================== */}

      {recommendationStatus !==
          'medical_advice' &&
        recommendationStatus !==
          'wellness_context_missing' &&
        recommendationStatus !==
          'activity_preference_missing' &&
        (recommendations.length > 0 ||
          recommendationStatus ===
            'rest_day') && (

        <section className="activity-save-card">

          <div>

            <span className="activity-section-label">
              ACTIVITY HISTORY
            </span>

            <h3>
              💾 Save Today's Activity Plan
            </h3>

            <p>
              Save today's activity guidance and wellness
              context so you can review it later in History.
            </p>

          </div>


          <button
            type="button"
            className="activity-save-button"
            onClick={handleSaveActivity}
          >
            {activitySaved
              ? '✓ Update Saved Plan'
              : '💾 Save Activity Plan'}
          </button>


          {saveMessage && (

            <div className="activity-save-message">
              {saveMessage}
            </div>

          )}

        </section>

      )}


      {/* =====================================================
          ACTIVITY CATEGORIES
          ===================================================== */}

      <section className="activity-section">

        <div className="section-heading">

          <span>
            ✨
          </span>

          <div>

            <h3>
              Activity Categories
            </h3>

            <p>
              Explore the exercises available in each
              activity category.
            </p>

          </div>

        </div>


        {exerciseDatasetLoading && (

          <div className="activity-dataset-loading">

            <span>
              🌸
            </span>

            <p>
              Loading the exercise library...
            </p>

          </div>

        )}


        {exerciseDatasetError && (

          <div className="activity-dataset-error">

            <span>
              ⚠️
            </span>

            <p>
              {exerciseDatasetError}
            </p>

            <button
              type="button"
              onClick={loadExerciseDataset}
            >
              Try Again
            </button>

          </div>

        )}


        <div className="activity-grid">

          {activities.map(
            (activity) => {

              return (

                <button
                  type="button"
                  className="activity-card"
                  key={activity.title}
                  onClick={() =>
                    handleOpenActivity(
                      activity
                    )
                  }
                >

                  <div className="activity-card-icon">
                    {activity.icon}
                  </div>


                  <span className="activity-category">
                    {activity.category}
                  </span>


                  <h4>
                    {activity.title}
                  </h4>


                  <p>
                    {activity.description}
                  </p>


                  <div className="activity-card-footer">
                    <span className="activity-status">
                      🌿 Gentle activity option
                    </span>
                  </div>

                </button>

              )

            }
          )}

        </div>

      </section>


      {/* =====================================================
          EXERCISE CATEGORY MODAL
          ===================================================== */}

      {selectedActivity && (

        <div
          className="activity-modal-overlay"
          onClick={handleCloseActivity}
        >

          <div
            className="activity-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* =================================================
                MODAL HEADER
                ================================================= */}

            <div className="activity-modal-header">

              <div className="activity-modal-heading">

                <span className="activity-modal-label">
                  EXERCISE LIBRARY
                </span>

                <h3>
                  {selectedActivity.icon}{' '}
                  {selectedActivity.title}
                </h3>

                <p>
                  {selectedExercises.length}{' '}
                  exercises available in this category
                </p>

              </div>

              <button
                type="button"
                className="activity-modal-close"
                onClick={handleCloseActivity}
                aria-label="Close exercise library"
              >
                ×
              </button>

            </div>


            {/* =================================================
                MODAL BODY
                ================================================= */}

            <div className="activity-modal-body">

              {selectedExercises.length === 0 ? (

                <div className="activity-modal-empty">

                  <span className="activity-modal-empty-icon">
                    🌱
                  </span>

                  <h4>
                    No exercises found
                  </h4>

                  <p>
                    There are currently no exercises mapped
                    to this category in the dataset.
                  </p>

                </div>

              ) : (

                <div className="exercise-library-list">

                  {selectedExercises.map(
                    (
                      exercise,
                      index
                    ) => {

                      const name =
                        exercise.ExerciseName ||
                        exercise.exercise_name ||
                        exercise.Exercise_Name ||
                        exercise.name ||
                        'Exercise'


                      const description =
                        exercise.Description ||
                        exercise.description ||
                        ''


                      const benefits =
                        exercise.Benefits ||
                        exercise.benefits ||
                        ''


                      const intensity =
                        exercise.Intensity ||
                        exercise.intensity ||
                        ''


                      const difficulty =
                        exercise.Difficulty ||
                        exercise.difficulty ||
                        ''


                      const position =
                        exercise.Position ||
                        exercise.position ||
                        ''


                      const equipment =
                        exercise.Equipment ||
                        exercise.equipment ||
                        ''


                      const instructions =
                        exercise.Instructions ||
                        exercise.instructions ||
                        ''


                      const source =
                        exercise.Source ||
                        exercise.source ||
                        ''


                      const sourceUrl =
                        exercise.Source_URL ||
                        exercise.source_url ||
                        ''


                      const suitableT1 =
                        exercise.Suitable_T1 ||
                        exercise.suitable_t1 ||
                        ''


                      const suitableT2 =
                        exercise.Suitable_T2 ||
                        exercise.suitable_t2 ||
                        ''


                      const suitableT3 =
                        exercise.Suitable_T3 ||
                        exercise.suitable_t3 ||
                        ''


                      const modificationT1 =
                        exercise.Modification_T1 ||
                        exercise.modification_t1 ||
                        ''


                      const modificationT2 =
                        exercise.Modification_T2 ||
                        exercise.modification_t2 ||
                        ''


                      const modificationT3 =
                        exercise.Modification_T3 ||
                        exercise.modification_t3 ||
                        ''


                      const modificationNotes =
                        exercise.Modification_Notes ||
                        exercise.modification_notes ||
                        ''


                      const wellnessConsiderations =
                        exercise.Wellness_Considerations ||
                        exercise.wellness_considerations ||
                        ''


                      return (

                        <article
                          className="exercise-library-card"
                          key={
                            exercise.Exercise_ID ||
                            exercise.exercise_id ||
                            `${name}-${index}`
                          }
                        >

                          {/* =====================================
                              EXERCISE CARD HEADER
                              ===================================== */}

                          <div className="exercise-library-card-header">

                            <div className="exercise-number-badge">
                              {String(index + 1).padStart(2, '0')}
                            </div>

                            <div className="exercise-library-title">

                              <span className="exercise-number-label">
                                EXERCISE {index + 1}
                              </span>

                              <h4>
                                {name}
                              </h4>

                              <span className="exercise-library-category">
                                {selectedActivity.icon}{' '}
                                {selectedActivity.title}
                              </span>

                            </div>

                          </div>


                          {/* =====================================
                              DESCRIPTION
                              ===================================== */}

                          {description && (

                            <div className="exercise-library-section exercise-description-section">

                              <h5>
                                📝 Description
                              </h5>

                              <p>
                                {description}
                              </p>

                            </div>

                          )}


                          {/* =====================================
                              QUICK INFORMATION
                              ===================================== */}

                          {(intensity ||
                            difficulty ||
                            position ||
                            equipment) && (

                            <div className="exercise-library-section">

                              <h5>
                                🌿 Exercise details
                              </h5>

                              <div className="exercise-detail-grid">

                                {intensity && (

                                  <div className="exercise-detail">

                                    <span className="exercise-detail-icon">
                                      ⚡
                                    </span>

                                    <div>

                                      <small>
                                        Intensity
                                      </small>

                                      <strong>
                                        {intensity}
                                      </strong>

                                    </div>

                                  </div>

                                )}


                                {difficulty && (

                                  <div className="exercise-detail">

                                    <span className="exercise-detail-icon">
                                      🌱
                                    </span>

                                    <div>

                                      <small>
                                        Difficulty
                                      </small>

                                      <strong>
                                        {difficulty}
                                      </strong>

                                    </div>

                                  </div>

                                )}


                                {position && (

                                  <div className="exercise-detail">

                                    <span className="exercise-detail-icon">
                                      🧘
                                    </span>

                                    <div>

                                      <small>
                                        Position
                                      </small>

                                      <strong>
                                        {position}
                                      </strong>

                                    </div>

                                  </div>

                                )}


                                {equipment && (

                                  <div className="exercise-detail">

                                    <span className="exercise-detail-icon">
                                      🧰
                                    </span>

                                    <div>

                                      <small>
                                        Equipment
                                      </small>

                                      <strong>
                                        {equipment}
                                      </strong>

                                    </div>

                                  </div>

                                )}

                              </div>

                            </div>

                          )}


                          {/* =====================================
                              BENEFITS
                              ===================================== */}

                          {benefits && (

                            <div className="exercise-library-section">

                              <h5>
                                🌸 Benefits
                              </h5>

                              <p>
                                {benefits}
                              </p>

                            </div>

                          )}


                          {/* =====================================
                              INSTRUCTIONS
                              ===================================== */}

                          {instructions && (

                            <div className="exercise-library-section">

                              <h5>
                                📋 Instructions
                              </h5>

                              <div className="exercise-instructions-box">

                                <p>
                                  {instructions}
                                </p>

                              </div>

                            </div>

                          )}


                          {/* =====================================
                              TRIMESTER SUITABILITY
                              ===================================== */}

                          {(suitableT1 ||
                            suitableT2 ||
                            suitableT3) && (

                            <div className="exercise-library-section">

                              <h5>
                                🤰 Trimester suitability
                              </h5>

                              <div className="trimester-tags">

                                {suitableT1 && (

                                  <div className="trimester-tag">

                                    <span>
                                      T1
                                    </span>

                                    <strong>
                                      {suitableT1}
                                    </strong>

                                  </div>

                                )}


                                {suitableT2 && (

                                  <div className="trimester-tag">

                                    <span>
                                      T2
                                    </span>

                                    <strong>
                                      {suitableT2}
                                    </strong>

                                  </div>

                                )}


                                {suitableT3 && (

                                  <div className="trimester-tag">

                                    <span>
                                      T3
                                    </span>

                                    <strong>
                                      {suitableT3}
                                    </strong>

                                  </div>

                                )}

                              </div>

                            </div>

                          )}


                          {/* =====================================
                              MODIFICATIONS
                              ===================================== */}

                          {(modificationT1 ||
                            modificationT2 ||
                            modificationT3 ||
                            modificationNotes) && (

                            <div className="exercise-library-section exercise-modification-section">

                              <h5>
                                🔄 Pregnancy modifications
                              </h5>


                              {modificationT1 && (

                                <div className="modification-row">

                                  <strong>
                                    First trimester
                                  </strong>

                                  <p>
                                    {modificationT1}
                                  </p>

                                </div>

                              )}


                              {modificationT2 && (

                                <div className="modification-row">

                                  <strong>
                                    Second trimester
                                  </strong>

                                  <p>
                                    {modificationT2}
                                  </p>

                                </div>

                              )}


                              {modificationT3 && (

                                <div className="modification-row">

                                  <strong>
                                    Third trimester
                                  </strong>

                                  <p>
                                    {modificationT3}
                                  </p>

                                </div>

                              )}


                              {modificationNotes && (

                                <div className="modification-row">

                                  <strong>
                                    Notes
                                  </strong>

                                  <p>
                                    {modificationNotes}
                                  </p>

                                </div>

                              )}

                            </div>

                          )}


                          {/* =====================================
                              WELLNESS CONSIDERATIONS
                              ===================================== */}

                          {wellnessConsiderations && (

                            <div className="exercise-library-section exercise-wellness-section">

                              <h5>
                                💗 Wellness considerations
                              </h5>

                              <p>
                                {wellnessConsiderations}
                              </p>

                            </div>

                          )}


                          {/* =====================================
                              SOURCE
                              ===================================== */}

                          {source && (

                            <div className="exercise-library-source">

                              <span className="source-icon">
                                📚
                              </span>

                              <div>

                                <small>
                                  Source
                                </small>

                                {sourceUrl ? (

                                  <a
                                    href={sourceUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    {source}
                                  </a>

                                ) : (

                                  <strong>
                                    {source}
                                  </strong>

                                )}

                              </div>

                            </div>

                          )}

                        </article>

                      )

                    }
                  )}

                </div>

              )}

            </div>


            {/* =================================================
                MODAL FOOTER
                ================================================= */}

            <div className="activity-modal-footer">

              <div className="activity-modal-footer-note">

                <span>
                  🌷
                </span>

                <p>
                  Exercise information is provided for general
                  educational and wellness guidance.
                </p>

              </div>

              <button
                type="button"
                className="activity-modal-footer-button"
                onClick={handleCloseActivity}
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          SAFETY GUIDANCE
          ===================================================== */}

      <section className="activity-safety-card">

        <div className="safety-icon">
          ⚠️
        </div>

        <div>

          <h3>
            Listen to Your Body
          </h3>

          <p>
            Exercise during pregnancy should be comfortable
            and appropriate for your individual situation.
            Stop if you feel unwell and seek professional
            medical advice when needed.
          </p>

        </div>

      </section>


      {/* =====================================================
          NAVIGATION
          ===================================================== */}

      <div className="activity-footer-actions">

        <button
          type="button"
          className="activity-back-button"
          onClick={onBack}
        >
          ← Back
        </button>

      </div>


      {/* =====================================================
          DISCLAIMER
          ===================================================== */}

      <p className="activity-disclaimer">

        For general educational and wellness guidance only.
        This page does not replace advice from a qualified
        healthcare professional.

      </p>

    </div>

  )
}

export default ActivityExercise