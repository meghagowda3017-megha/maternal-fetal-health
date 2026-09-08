import { useEffect, useState } from 'react'
import './Nutrition.css'

function Nutrition({
  nutritionHistory,
  onSaveNutrition,
  onBack,
}) {
  // ==================================================
  // FOOD CATEGORY ICON
  // ==================================================

  const getFoodIcon = (category) => {
    const value = (category || '').toLowerCase()

    if (value.includes('fruit')) return '🍎'
    if (value.includes('vegetable')) return '🥦'
    if (value.includes('grain')) return '🌾'
    if (value.includes('legume')) return '🫘'
    if (value.includes('dairy')) return '🥛'
    if (value.includes('egg')) return '🥚'
    if (value.includes('fish') || value.includes('seafood')) return '🐟'
    if (value.includes('protein')) return '🍗'
    if (value.includes('nut') || value.includes('seed')) return '🌰'

    return '🥗'
  }


  // ==================================================
  // TODAY'S DATE
  // ==================================================

  const getTodayDate = () => {
    const now = new Date()

    return (
      `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, '0')}-${String(
        now.getDate()
      ).padStart(2, '0')}`
    )
  }

  const todayDate = getTodayDate()


  // ==================================================
  // LOAD SAVED PREGNANCY INFORMATION
  // ==================================================

  const [pregnancyInfo] = useState(() => {
    const savedPregnancyInfo =
      localStorage.getItem('pregnancyInfo')

    return savedPregnancyInfo
      ? JSON.parse(savedPregnancyInfo)
      : null
  })


  // ==================================================
  // LOAD TODAY'S DAILY WELLNESS ENTRY
  // ==================================================

  const [todayWellness] = useState(() => {
    const savedWellness =
      localStorage.getItem('wellnessHistory')

    if (!savedWellness) {
      return null
    }

    const wellnessHistory = JSON.parse(savedWellness)

    const now = new Date()

    const today =
      `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, '0')}-${String(
        now.getDate()
      ).padStart(2, '0')}`

    const todayEntry = wellnessHistory.find(
      (entry) => entry.selectedDate === today
    )

    return todayEntry || null
  })


  // ==================================================
  // FOOD PREFERENCES
  // ==================================================

  const [dietaryPreference, setDietaryPreference] =
    useState(() => {
      return (
        localStorage.getItem('dietaryPreference') ||
        'No specific preference'
      )
    })


  const [foodAllergies, setFoodAllergies] =
    useState(() => {
      const savedAllergies =
        localStorage.getItem('foodAllergies')

      return savedAllergies
        ? JSON.parse(savedAllergies)
        : []
    })


  // ==================================================
  // PERSONALIZED NUTRITION RECOMMENDATIONS
  // ==================================================

  const [recommendations, setRecommendations] =
    useState([])

  const [safety, setSafety] =
    useState(null)

  const [loadingRecommendations, setLoadingRecommendations] =
    useState(false)

  const [recommendationError, setRecommendationError] =
    useState('')


  // ==================================================
  // SAVE STATE
  // ==================================================

  const [nutritionSaved, setNutritionSaved] =
    useState(false)

  const [saveMessage, setSaveMessage] =
    useState('')


  // ==================================================
  // CHECK WHETHER TODAY'S PLAN IS ALREADY SAVED
  // ==================================================

  useEffect(() => {
    const existingEntry =
      nutritionHistory?.find(
        (entry) =>
          entry.selectedDate === todayDate
      )

    setNutritionSaved(Boolean(existingEntry))
  }, [nutritionHistory, todayDate])


  // ==================================================
  // DIETARY OPTIONS
  // ==================================================

  const dietaryOptions = [
    'No specific preference',
    'Vegetarian',
    'Vegan',
    'Eggetarian',
    'Pescatarian',
    'Non-vegetarian',
  ]


  // ==================================================
  // FOOD ALLERGY / AVOIDANCE OPTIONS
  // ==================================================

  const allergyOptions = [
    'Milk / Dairy',
    'Egg',
    'Fish',
    'Shellfish',
    'Peanuts',
    'Tree nuts',
    'Wheat',
    'Soy',
    'Sesame',
    'Other',
  ]


  // ==================================================
  // FETCH PERSONALIZED RECOMMENDATIONS
  // ==================================================

  const fetchRecommendations = async () => {
    setLoadingRecommendations(true)
    setRecommendationError('')

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/nutrition/recommendations',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            pregnancy_info: pregnancyInfo || {},
            wellness: todayWellness || {},
            dietary_preference:
              dietaryPreference || '',
            food_allergies:
              foodAllergies || [],
            limit: 8,
          }),
        }
      )

      if (!response.ok) {
        throw new Error(
          `Server error: ${response.status}`
        )
      }

      const data = await response.json()

      setRecommendations(
        data.recommendations || []
      )

      setSafety(
        data.safety || null
      )

    } catch (error) {
      console.error(
        'Nutrition recommendation error:',
        error
      )

      setRecommendationError(
        'Unable to load nutrition suggestions. Please make sure the backend server is running.'
      )

    } finally {
      setLoadingRecommendations(false)
    }
  }


  // ==================================================
  // LOAD RECOMMENDATIONS WHEN PAGE OPENS
  // ==================================================

  useEffect(() => {
    fetchRecommendations()
  }, [])


  // ==================================================
  // SAVE NUTRITION PREFERENCES
  // ==================================================

  const saveNutritionPreferences = async () => {
    localStorage.setItem(
      'dietaryPreference',
      dietaryPreference
    )

    localStorage.setItem(
      'foodAllergies',
      JSON.stringify(foodAllergies)
    )

    await fetchRecommendations()

    setSaveMessage(
      'Your nutrition preferences have been saved successfully.'
    )

    setTimeout(() => {
      setSaveMessage('')
    }, 3000)
  }


  // ==================================================
  // SAVE TODAY'S NUTRITION PLAN
  // ==================================================

  const saveTodayNutritionPlan = () => {

    if (recommendations.length === 0) {
      setSaveMessage(
        'Please load nutrition suggestions before saving today’s plan.'
      )

      setTimeout(() => {
        setSaveMessage('')
      }, 3000)

      return
    }


    const nutritionEntry = {
      id: Date.now(),

      selectedDate: todayDate,

      date: new Date().toLocaleString(),

      pregnancyInfo: pregnancyInfo || {},

      wellness: todayWellness || {},

      dietaryPreference:
        dietaryPreference || '',

      foodAllergies:
        foodAllergies || [],

      recommendations:
        recommendations || [],

      safety:
        safety || {},
    }


    if (onSaveNutrition) {
      onSaveNutrition(nutritionEntry)
    }


    setNutritionSaved(true)

    setSaveMessage(
      'Today’s nutrition plan has been saved successfully.'
    )


    setTimeout(() => {
      setSaveMessage('')
    }, 3000)
  }


  // ==================================================
  // TOGGLE ALLERGY
  // ==================================================

  const toggleAllergy = (allergy) => {
    setFoodAllergies((previous) => {

      if (previous.includes(allergy)) {
        return previous.filter(
          (item) => item !== allergy
        )
      }

      return [...previous, allergy]
    })
  }


  // ==================================================
  // RENDER
  // ==================================================

  return (
    <section className="nutrition-page">


      {/* ==================================================
          HEADER
          ================================================== */}

      <div className="nutrition-header">

        <div>

          <span className="section-label">
            NUTRITION
          </span>

          <h2>
            🥗 Nutrition & Pregnancy
          </h2>

          <p>
            Explore simple, educational nutrition guidance
            for your pregnancy journey.
          </p>

        </div>


        <div className="nutrition-header-icon">
          🥑
        </div>

      </div>



      {/* ==================================================
          PREGNANCY CONTEXT
          ================================================== */}

      {pregnancyInfo ? (

        <div className="nutrition-pregnancy-card">

          <div className="nutrition-pregnancy-header">

            <div>

              <span className="section-label">
                YOUR PREGNANCY
              </span>

              <h3>
                🤰 Your Pregnancy Context
              </h3>

              <p>
                Nutrition guidance can be connected to your
                current pregnancy stage.
              </p>

            </div>


            <span className="nutrition-pregnancy-icon">
              🌷
            </span>

          </div>


          <div className="nutrition-pregnancy-details">


            {/* PREGNANCY WEEK */}

            <div className="nutrition-pregnancy-item">

              <span>📅</span>

              <strong>
                Pregnancy Week
              </strong>

              <p>
                Week {pregnancyInfo.weeks}
              </p>

            </div>


            {/* TRIMESTER */}

            <div className="nutrition-pregnancy-item">

              <span>🌸</span>

              <strong>
                Trimester
              </strong>

              <p>
                {pregnancyInfo.trimester}
              </p>

            </div>


            {/* DUE DATE */}

            <div className="nutrition-pregnancy-item">

              <span>👶</span>

              <strong>
                Estimated Due Date
              </strong>

              <p>
                {pregnancyInfo.dueDate}
              </p>

            </div>


            {/* PROGRESS */}

            <div className="nutrition-pregnancy-item">

              <span>📈</span>

              <strong>
                Pregnancy Progress
              </strong>

              <p>
                {pregnancyInfo.progress}%
              </p>

            </div>


          </div>

        </div>

      ) : (

        <div className="nutrition-no-pregnancy">

          <span>🤰</span>

          <div>

            <h3>
              Pregnancy information not available
            </h3>

            <p>
              Add your pregnancy information in Pregnancy
              Overview to personalize this section.
            </p>

          </div>

        </div>

      )}



      {/* ==================================================
          TODAY'S WELLNESS
          ================================================== */}

      <div className="nutrition-wellness-card">

        <div className="nutrition-wellness-header">

          <div>

            <span className="section-label">
              TODAY'S WELLNESS
            </span>

            <h3>
              🌷 How You're Feeling Today
            </h3>

            <p>
              Your nutrition section can use information
              recorded in your Daily Wellness check-in.
            </p>

          </div>


          <span className="nutrition-wellness-icon">
            💗
          </span>

        </div>


        {todayWellness ? (

          <div className="nutrition-wellness-details">


            {/* MOOD */}

            <div className="nutrition-wellness-item">

              <span>😊</span>

              <strong>
                Mood
              </strong>

              <p>
                {todayWellness.mood || 'Not recorded'}
              </p>

            </div>


            {/* ENERGY */}

            <div className="nutrition-wellness-item">

              <span>⚡</span>

              <strong>
                Energy
              </strong>

              <p>
                {todayWellness.energy
                  ? `${todayWellness.energy}/5`
                  : 'Not recorded'}
              </p>

            </div>


            {/* WATER */}

            <div className="nutrition-wellness-item">

              <span>💧</span>

              <strong>
                Water Intake
              </strong>

              <p>
                {todayWellness.water
                  ? `${todayWellness.water} glasses`
                  : 'Not recorded'}
              </p>

            </div>


            {/* TODAY'S CRAVINGS */}

            <div className="nutrition-cravings-section">

              <div className="nutrition-cravings-header">

                <div>

                  <span className="section-label">
                    TODAY'S CRAVINGS
                  </span>

                  <h3>
                    🍓 What You're Craving
                  </h3>

                  <p>
                    Your recorded cravings can help personalize
                    nutrition suggestions.
                  </p>

                </div>


                <span className="nutrition-cravings-icon">
                  🍓
                </span>

              </div>


              {todayWellness.cravings &&
              todayWellness.cravings.length > 0 ? (

                <div className="nutrition-cravings-list">

                  {todayWellness.cravings.map(
                    (craving) => (
                      <span
                        key={craving}
                        className="nutrition-craving-tag"
                      >
                        {craving}
                      </span>
                    )
                  )}

                </div>

              ) : (

                <div className="nutrition-no-cravings">

                  <span>🍽️</span>

                  <p>
                    No cravings recorded today.
                  </p>

                </div>

              )}

            </div>


            {/* DIGESTION */}

            <div className="nutrition-wellness-item">

              <span>🌿</span>

              <strong>
                Digestion
              </strong>

              <p>
                {Array.isArray(todayWellness.digestion)
                  ? todayWellness.digestion.join(', ')
                  : todayWellness.digestion ||
                    'Not recorded'}
              </p>

            </div>


            {/* FEELINGS */}

            <div className="nutrition-wellness-item">

              <span>💗</span>

              <strong>
                Feelings
              </strong>

              <p>
                {todayWellness.feelings &&
                todayWellness.feelings.length > 0
                  ? Array.isArray(todayWellness.feelings)
                    ? todayWellness.feelings.join(', ')
                    : todayWellness.feelings
                  : 'Not recorded'}
              </p>

            </div>


          </div>

        ) : (

          <div className="nutrition-no-wellness">

            <span>📝</span>

            <div>

              <strong>
                No wellness check-in recorded today
              </strong>

              <p>
                Complete today's Daily Wellness check-in
                to connect your current wellness information
                with Nutrition.
              </p>

            </div>

          </div>

        )}

      </div>



      {/* ==================================================
          FOOD PREFERENCES & ALLERGIES
          ================================================== */}

      <div className="nutrition-preferences-section">


        {/* HEADER */}

        <div className="nutrition-preferences-header">

          <div>

            <span className="section-label">
              FOOD PREFERENCES
            </span>

            <h3>
              🍽️ Your Food Preferences
            </h3>

            <p>
              Tell us about your dietary preferences and
              foods you need to avoid.
            </p>

          </div>


          <span className="nutrition-preferences-icon">
            🥗
          </span>

        </div>



        {/* DIETARY PREFERENCE */}

        <div className="nutrition-preference-group">

          <h4>
            🥗 Dietary Preference
          </h4>


          <div className="nutrition-preference-options">

            {dietaryOptions.map((option) => (

              <button
                key={option}
                type="button"
                className={
                  dietaryPreference === option
                    ? 'nutrition-preference-option selected'
                    : 'nutrition-preference-option'
                }
                onClick={() =>
                  setDietaryPreference(option)
                }
              >
                {option}
              </button>

            ))}

          </div>

        </div>



        {/* ALLERGIES / FOODS TO AVOID */}

        <div className="nutrition-preference-group">

          <h4>
            ⚠️ Foods to Avoid / Allergies
          </h4>

          <p className="nutrition-preference-help">
            Select any foods you need to avoid.
          </p>


          <div className="nutrition-preference-options">

            {allergyOptions.map((option) => (

              <button
                key={option}
                type="button"
                className={
                  foodAllergies.includes(option)
                    ? 'nutrition-preference-option selected allergy-selected'
                    : 'nutrition-preference-option'
                }
                onClick={() =>
                  toggleAllergy(option)
                }
              >
                {option}
              </button>

            ))}

          </div>

        </div>



        {/* SAVE PREFERENCES */}

        <button
          type="button"
          className="nutrition-save-preferences"
          onClick={saveNutritionPreferences}
        >
          💾 Save Preferences
        </button>


      </div>



      {/* ==================================================
          INTRO CARD
          ================================================== */}

      <div className="nutrition-intro-card">

        <div className="nutrition-intro-icon">
          🌷
        </div>

        <div>

          <h3>
            Healthy Nutrition During Pregnancy
          </h3>

          <p>
            Your nutritional needs can change throughout
            pregnancy. This section provides general wellness
            information based on your pregnancy stage,
            food preferences, and cravings.
          </p>

        </div>

      </div>



      {/* ==================================================
          PERSONALIZED GUIDANCE
          ================================================== */}

      <div className="nutrition-section">

        <div className="nutrition-section-header">

          <div>

            <span className="section-label">
              PERSONALIZED GUIDANCE
            </span>

            <h3>
              💡 Food Suggestions For You
            </h3>

            <p>
              These educational food suggestions are based
              on your pregnancy stage, today's wellness,
              cravings, food preferences, and selected
              food allergies.
            </p>

          </div>


          <span className="nutrition-section-icon">
            🥗
          </span>

        </div>



        {/* LOADING */}

        {loadingRecommendations && (

          <div className="nutrition-loading">

            <span>🥗</span>

            <p>
              Preparing your personalized food suggestions...
            </p>

          </div>

        )}



        {/* ERROR */}

        {!loadingRecommendations &&
        recommendationError && (

          <div className="nutrition-error">

            <span>⚠️</span>

            <p>
              {recommendationError}
            </p>

            <button
              type="button"
              onClick={fetchRecommendations}
              className="nutrition-retry-button"
            >
              Try Again
            </button>

          </div>

        )}



        {/* RECOMMENDATIONS */}

        {!loadingRecommendations &&
        !recommendationError &&
        recommendations.length > 0 && (

          <div className="nutrition-recommendation-grid">

            {recommendations.map(
              (food, index) => (

                <div
                  key={`${food.food_name}-${index}`}
                  className="nutrition-recommendation-card"
                >

                  <div className="nutrition-recommendation-top">

                    <div className="nutrition-food-icon">
                      {getFoodIcon(food.category)}
                    </div>

                    <span className="nutrition-score">
                      ⭐ {food.score}
                    </span>

                  </div>


                  <h4>
                    {food.food_name}
                  </h4>


                  <p className="nutrition-food-category">
                    {food.category}
                  </p>



                  {/* KEY NUTRIENTS */}

                  <div className="nutrition-food-detail">

                    <strong>
                      🌿 Key nutrients
                    </strong>

                    <p>
                      {food.key_nutrients ||
                        'Not specified'}
                    </p>

                  </div>



                  {/* MEAL TYPES */}

                  <div className="nutrition-food-detail">

                    <strong>
                      🍽️ Good for
                    </strong>

                    <p>
                      {food.meal_types ||
                        'Flexible'}
                    </p>

                  </div>



                  {/* REASONS */}

                  {food.reasons &&
                  food.reasons.length > 0 && (

                    <div className="nutrition-food-reasons">

                      <strong>
                        💗 Why it was suggested
                      </strong>

                      <ul>

                        {food.reasons.map(
                          (reason, reasonIndex) => (

                            <li key={reasonIndex}>
                              {reason}
                            </li>

                          )
                        )}

                      </ul>

                    </div>

                  )}



                  {/* PREPARATION SAFETY */}

                  {food.preparation_safety && (

                    <div className="nutrition-food-safety">

                      <strong>
                        🛡️ Preparation
                      </strong>

                      <p>
                        {food.preparation_safety}
                      </p>

                    </div>

                  )}

                </div>

              )
            )}

          </div>

        )}



        {/* SAVE TODAY'S NUTRITION PLAN */}

        {!loadingRecommendations &&
        !recommendationError &&
        recommendations.length > 0 && (

          <div className="nutrition-save-plan-section">

            <div className="nutrition-save-plan-info">

              <span>💾</span>

              <div>

                <h4>
                  Save Today's Nutrition Plan
                </h4>

                <p>
                  Save these personalized suggestions with
                  your pregnancy and wellness information so
                  you can review them later in History.
                </p>

              </div>

            </div>


            <button
              type="button"
              className={
                nutritionSaved
                  ? 'nutrition-save-plan-button saved'
                  : 'nutrition-save-plan-button'
              }
              onClick={saveTodayNutritionPlan}
            >
              {nutritionSaved
                ? '✓ Update Saved Plan'
                : '💾 Save Today’s Nutrition Plan'}
            </button>

          </div>

        )}



        {/* NO RECOMMENDATIONS */}

        {!loadingRecommendations &&
        !recommendationError &&
        recommendations.length === 0 && (

          <div className="nutrition-no-recommendations">

            <span>🍽️</span>

            <div>

              <h4>
                No personalized suggestions available
              </h4>

              <p>
                Try recording today's wellness information
                or updating your food preferences to receive
                more relevant suggestions.
              </p>

            </div>

          </div>

        )}



        {/* REFRESH BUTTON */}

        {!loadingRecommendations && (

          <button
            type="button"
            className="nutrition-refresh-button"
            onClick={fetchRecommendations}
          >
            🔄 Refresh Suggestions
          </button>

        )}



        {/* SAFETY / RED FLAGS */}

        {safety &&
        safety.has_red_flags &&
        safety.red_flags &&
        safety.red_flags.length > 0 && (

          <div className="nutrition-red-flags">

            <div className="nutrition-red-flags-header">

              <span>⚠️</span>

              <div>

                <h4>
                  Wellness Safety Notice
                </h4>

                <p>
                  Please review these notices based on
                  today's recorded wellness information.
                </p>

              </div>

            </div>


            <div className="nutrition-red-flags-list">

              {safety.red_flags.map(
                (flag, index) => (

                  <div
                    key={index}
                    className="nutrition-red-flag"
                  >

                    <strong>
                      {flag.condition}
                    </strong>

                    <p>
                      {flag.message}
                    </p>

                  </div>

                )
              )}

            </div>

          </div>

        )}

      </div>



      {/* SAVE MESSAGE */}

      {saveMessage && (

        <div className="nutrition-save-message">
          <span>✓</span>
          <p>{saveMessage}</p>
        </div>

      )}



      {/* ==================================================
          BACK BUTTON
          ================================================== */}

      <div className="nutrition-actions">

        <button
          type="button"
          className="nutrition-back-button"
          onClick={onBack}
        >
          ← Back
        </button>

      </div>



      {/* ==================================================
          DISCLAIMER
          ================================================== */}

      <div className="nutrition-disclaimer">

        <span>⚕</span>

        <p>
          This nutrition section provides general educational
          information for wellness tracking. It does not
          provide medical or dietary diagnosis and does not
          replace advice from a qualified healthcare
          professional.
        </p>

      </div>


    </section>
  )
}

export default Nutrition