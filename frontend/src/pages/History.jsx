import { useState } from 'react'
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

  // ==================================================
  // DISPLAY VALUE
  // ==================================================

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

  // ==================================================
  // ASSESSMENT DETAILS
  // ==================================================

  const openDetails = (item) => {
    setSelectedItem(item)
  }

  const closeDetails = () => {
    setSelectedItem(null)
  }

  const handleDelete = (id) => {
    setSelectedItem(null)
    onDelete?.(id)
  }

  // ==================================================
  // WELLNESS DETAILS
  // ==================================================

  const openWellnessDetails = (item) => {
    setSelectedWellness(item)
  }

  const closeWellnessDetails = () => {
    setSelectedWellness(null)
  }

  const handleWellnessDelete = (id) => {
    setSelectedWellness(null)
    onDeleteWellness?.(id)
  }

  // ==================================================
  // NUTRITION DETAILS
  // ==================================================

  const openNutritionDetails = (item) => {
    setSelectedNutrition(item)
  }

  const closeNutritionDetails = () => {
    setSelectedNutrition(null)
  }

  const handleNutritionDelete = (id) => {
    setSelectedNutrition(null)
    onDeleteNutrition?.(id)
  }

  // ==================================================
  // ACTIVITY DETAILS
  // ==================================================

  const openActivityDetails = (item) => {
    setSelectedActivity(item)
  }

  const closeActivityDetails = () => {
    setSelectedActivity(null)
  }

  const handleActivityDelete = (id) => {
    setSelectedActivity(null)
    onDeleteActivity?.(id)
  }

  return (
    <section className="history-section">

      {/* ==================================================
          HEADER
          ================================================== */}

      <div className="history-header">

        <div>

          <span className="section-label">
            HISTORY
          </span>

          <h2>
            Your History
          </h2>

          <p>
            View your previous health assessments,
            wellness check-ins, nutrition plans and
            activity plans.
          </p>

        </div>

        <button
          className="history-back-button"
          onClick={onBack}
        >
          ← Back
        </button>

      </div>


      {/* ==================================================
          ASSESSMENT HISTORY
          ================================================== */}

      <div className="history-section-block">

        <div className="history-section-title">

          <div className="history-section-icon">
            🩺
          </div>

          <div>
            <h2>
              Assessment History
            </h2>

            <p>
              Previous maternal health assessments
            </p>
          </div>

        </div>


        {history.length === 0 && (

          <div className="history-empty">

            <div className="history-empty-icon">
              🕘
            </div>

            <h3>
              No Assessment History
            </h3>

            <p>
              Your completed maternal assessments
              will appear here.
            </p>

          </div>

        )}


        {history.length > 0 && (

          <div className="history-container">

            <div className="history-top-bar">

              <div>

                <strong>
                  {history.length} Assessment
                  {history.length !== 1 ? 's' : ''}
                </strong>

                <span>
                  Click an assessment to view details
                </span>

              </div>

              <button
                className="clear-history-button"
                onClick={onClear}
              >
                Clear All History
              </button>

            </div>


            <div className="history-list">

              {history.map((item) => (

                <div
                  className="history-item"
                  key={item.id}
                  onClick={() => openDetails(item)}
                >

                  <div className="history-item-icon">
                    {item.type === 'Maternal'
                      ? '🤰'
                      : '👶'}
                  </div>


                  <div className="history-item-info">

                    <div className="history-item-title">
                      {item.type} Health Assessment
                    </div>

                    <div className="history-item-date">
                      {item.date}
                    </div>

                  </div>


                  <div className="history-item-result">

                    <span
                      className={`history-risk ${item.riskClass}`}
                    >
                      {item.result}
                    </span>

                  </div>


                  <div className="history-item-arrow">
                    →
                  </div>

                </div>

              ))}

            </div>

          </div>

        )}

      </div>


      {/* ==================================================
          WELLNESS HISTORY
          ================================================== */}

      <div className="history-section-block wellness-history-block">

        <div className="history-section-title">

          <div className="history-section-icon wellness-history-icon">
            🌸
          </div>

          <div>

            <h2>
              Wellness History
            </h2>

            <p>
              Your previous daily wellness check-ins
            </p>

          </div>

        </div>


        {wellnessHistory.length === 0 && (

          <div className="history-empty wellness-empty">

            <div className="history-empty-icon">
              🌷
            </div>

            <h3>
              No Wellness Check-ins Yet
            </h3>

            <p>
              Your daily wellness check-ins will appear
              here after you save one.
            </p>

          </div>

        )}


        {wellnessHistory.length > 0 && (

          <div className="history-container wellness-history-container">

            <div className="history-top-bar">

              <div>

                <strong>
                  {wellnessHistory.length} Wellness Check-in
                  {wellnessHistory.length !== 1 ? 's' : ''}
                </strong>

                <span>
                  Click a check-in to view details
                </span>

              </div>

              <button
                className="clear-history-button"
                onClick={onClearWellness}
              >
                Clear Wellness History
              </button>

            </div>


            <div className="history-list">

              {wellnessHistory.map((item) => (

                <div
                  className="history-item wellness-history-item"
                  key={item.id}
                  onClick={() => openWellnessDetails(item)}
                >

                  <div className="history-item-icon wellness-item-icon">
                    🌸
                  </div>


                  <div className="history-item-info">

                    <div className="history-item-title">
                      Daily Wellness Check-in
                    </div>

                    <div className="history-item-date">
                      {item.date}
                    </div>

                  </div>


                  <div className="wellness-summary">

                    {item.mood && (
                      <span>
                        {item.mood === 'Great' && '😊'}
                        {item.mood === 'Good' && '🙂'}
                        {item.mood === 'Okay' && '😐'}
                        {item.mood === 'Low' && '😔'}
                        {' '}
                        {item.mood}
                      </span>
                    )}

                    {item.energy && (
                      <span>
                        ⚡ {item.energy}/5
                      </span>
                    )}

                  </div>


                  <div className="history-item-arrow">
                    →
                  </div>

                </div>

              ))}

            </div>

          </div>

        )}

      </div>


      {/* ==================================================
          NUTRITION HISTORY
          ================================================== */}

      <div className="history-section-block">

        <div className="history-section-title">

          <div className="history-section-icon">
            🥗
          </div>

          <div>

            <h2>
              Nutrition History
            </h2>

            <p>
              Your saved pregnancy nutrition plans
            </p>

          </div>

        </div>


        {nutritionHistory.length === 0 && (

          <div className="history-empty">

            <div className="history-empty-icon">
              🥗
            </div>

            <h3>
              No Nutrition Plans Yet
            </h3>

            <p>
              Your saved nutrition plans will appear here.
            </p>

          </div>

        )}


        {nutritionHistory.length > 0 && (

          <div className="history-container">

            <div className="history-top-bar">

              <div>

                <strong>
                  {nutritionHistory.length} Nutrition Plan
                  {nutritionHistory.length !== 1 ? 's' : ''}
                </strong>

                <span>
                  Click a plan to view details
                </span>

              </div>

              <button
                className="clear-history-button"
                onClick={onClearNutrition}
              >
                Clear Nutrition History
              </button>

            </div>


            <div className="history-list">

              {nutritionHistory.map((item) => (

                <div
                  className="history-item"
                  key={item.id}
                  onClick={() => openNutritionDetails(item)}
                >

                  <div className="history-item-icon">
                    🥗
                  </div>


                  <div className="history-item-info">

                    <div className="history-item-title">
                      Daily Nutrition Plan
                    </div>

                    <div className="history-item-date">
                      {item.date || item.selectedDate}
                    </div>

                  </div>


                  <div className="wellness-summary">

                    {item.dietaryPreference && (
                      <span>
                        🥑 {item.dietaryPreference}
                      </span>
                    )}

                    {item.recommendations && (
                      <span>
                        🍽️ {item.recommendations.length}
                      </span>
                    )}

                  </div>


                  <div className="history-item-arrow">
                    →
                  </div>

                </div>

              ))}

            </div>

          </div>

        )}

      </div>


      {/* ==================================================
          ACTIVITY HISTORY
          ================================================== */}

      <div className="history-section-block">

        <div className="history-section-title">

          <div className="history-section-icon">
            🏃
          </div>

          <div>

            <h2>
              Activity History
            </h2>

            <p>
              Your saved pregnancy activity plans and
              recommendations
            </p>

          </div>

        </div>


        {activityHistory.length === 0 && (

          <div className="history-empty">

            <div className="history-empty-icon">
              🏃
            </div>

            <h3>
              No Activity Plans Yet
            </h3>

            <p>
              Your saved activity plans will appear here
              after you save one.
            </p>

          </div>

        )}


        {activityHistory.length > 0 && (

          <div className="history-container">

            <div className="history-top-bar">

              <div>

                <strong>
                  {activityHistory.length} Activity Plan
                  {activityHistory.length !== 1 ? 's' : ''}
                </strong>

                <span>
                  Click a plan to view details
                </span>

              </div>

              <button
                className="clear-history-button"
                onClick={onClearActivity}
              >
                Clear Activity History
              </button>

            </div>


            <div className="history-list">

              {activityHistory.map((item) => (

                <div
                  className="history-item"
                  key={item.id}
                  onClick={() => openActivityDetails(item)}
                >

                  <div className="history-item-icon">
                    🏃
                  </div>


                  <div className="history-item-info">

                    <div className="history-item-title">
                      Daily Activity Plan
                    </div>

                    <div className="history-item-date">
                      {item.date || item.selectedDate}
                    </div>

                  </div>


                  <div className="wellness-summary">

                    {item.pregnancyInfo?.weeks && (
                      <span>
                        🤰 Week {item.pregnancyInfo.weeks}
                      </span>
                    )}

                    {item.recommendations && (
                      <span>
                        🏃 {item.recommendations.length}
                      </span>
                    )}

                  </div>


                  <div className="history-item-arrow">
                    →
                  </div>

                </div>

              ))}

            </div>

          </div>

        )}

      </div>


      {/* ==================================================
          ASSESSMENT DETAILS MODAL
          ================================================== */}

      {selectedItem && (

        <div className="history-modal-overlay">

          <div className="history-modal">

            <div className="history-modal-header">

              <div>

                <span className="section-label">
                  ASSESSMENT DETAILS
                </span>

                <h2>
                  {selectedItem.type} Health Assessment
                </h2>

              </div>

              <button
                className="modal-close-button"
                onClick={closeDetails}
              >
                ×
              </button>

            </div>


            <div className="history-detail-result">

              <span>
                Prediction Result
              </span>

              <strong className={selectedItem.riskClass}>
                {selectedItem.result}
              </strong>

            </div>


            <div className="history-detail-date">

              <strong>
                Date & Time
              </strong>

              <span>
                {selectedItem.date}
              </span>

            </div>


            <div className="history-data-section">

              <h3>
                Assessment Data
              </h3>

              <div className="history-data-grid">

                {Object.entries(
                  selectedItem.data || {}
                ).map(([key, value]) => (

                  <div
                    className="history-data-item"
                    key={key}
                  >

                    <span>
                      {key}
                    </span>

                    <strong>
                      {displayValue(value)}
                    </strong>

                  </div>

                ))}

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
                  ).map(([key, value]) => (

                    <div
                      className="history-probability"
                      key={key}
                    >

                      <span>
                        {key}
                      </span>

                      <strong>
                        {Math.round(
                          Number(value) * 100
                        )}%
                      </strong>

                    </div>

                  ))}

                </div>

              </div>

            )}


            <div className="history-modal-actions">

              <button
                className="modal-delete-button"
                onClick={() =>
                  handleDelete(selectedItem.id)
                }
              >
                Delete This Assessment
              </button>

              <button
                className="modal-done-button"
                onClick={closeDetails}
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}


      {/* ==================================================
          WELLNESS DETAILS MODAL
          ================================================== */}

      {selectedWellness && (

        <div className="history-modal-overlay">

          <div className="history-modal wellness-modal">

            <div className="history-modal-header">

              <div>

                <span className="section-label">
                  DAILY WELLNESS
                </span>

                <h2>
                  🌸 Wellness Check-in
                </h2>

              </div>

              <button
                className="modal-close-button"
                onClick={closeWellnessDetails}
              >
                ×
              </button>

            </div>


            <div className="history-detail-date">

              <strong>
                📅 Date & Time
              </strong>

              <span>
                {selectedWellness.date}
              </span>

            </div>


            <div className="history-data-section">

              <h3>
                🌷 Today's Wellness
              </h3>

              <div className="history-data-grid">

                <div className="history-data-item">
                  <span>😊 Mood</span>
                  <strong>
                    {displayValue(selectedWellness.mood)}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>⚡ Energy</span>
                  <strong>
                    {displayValue(selectedWellness.energy)}
                    {selectedWellness.energy && ' / 5'}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>💭 Feelings</span>
                  <strong>
                    {displayValue(selectedWellness.feelings)}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>🩹 Pain</span>
                  <strong>
                    {displayValue(selectedWellness.pain)}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>😴 Sleep Quality</span>
                  <strong>
                    {displayValue(
                      selectedWellness.sleepQuality
                    )}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>🕐 Sleep Duration</span>
                  <strong>
                    {selectedWellness.sleepHours ||
                    selectedWellness.sleepMinutes
                      ? `${selectedWellness.sleepHours || 0}h ${
                          selectedWellness.sleepMinutes || 0
                        }m`
                      : 'Not entered'}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>💧 Water</span>
                  <strong>
                    {selectedWellness.water
                      ? `${selectedWellness.water} glasses`
                      : 'Not entered'}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>🍓 Cravings</span>
                  <strong>
                    {displayValue(
                      selectedWellness.cravings
                    )}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>💧 Discharge</span>
                  <strong>
                    {displayValue(
                      selectedWellness.discharge
                    )}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>✨ Skin</span>
                  <strong>
                    {displayValue(
                      selectedWellness.skin
                    )}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>💇‍♀️ Hair</span>
                  <strong>
                    {displayValue(
                      selectedWellness.hair
                    )}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>⚖️ Weight</span>
                  <strong>
                    {selectedWellness.weight
                      ? `${selectedWellness.weight} kg`
                      : 'Not entered'}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>🍽️ Digestion</span>
                  <strong>
                    {displayValue(
                      selectedWellness.digestion
                    )}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>🚽 Stool</span>
                  <strong>
                    {displayValue(
                      selectedWellness.stool
                    )}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>🧘 Meditation</span>
                  <strong>
                    {selectedWellness.meditationMinutes
                      ? `${selectedWellness.meditationMinutes} minutes`
                      : 'Not entered'}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>🧘 Self-care</span>
                  <strong>
                    {displayValue(
                      selectedWellness.selfCare
                    )}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>🤒 Ailments</span>
                  <strong>
                    {displayValue(
                      selectedWellness.ailments
                    )}
                  </strong>
                </div>

              </div>

            </div>


            <div className="history-data-section">

              <h3>
                📝 Notes
              </h3>

              <div className="wellness-history-notes">

                {selectedWellness.notes ||
                  'No notes were added for this check-in.'}

              </div>

            </div>


            <div className="history-modal-actions">

              <button
                className="modal-delete-button"
                onClick={() =>
                  handleWellnessDelete(
                    selectedWellness.id
                  )
                }
              >
                Delete This Check-in
              </button>

              <button
                className="modal-done-button"
                onClick={closeWellnessDetails}
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}


      {/* ==================================================
          NUTRITION DETAILS MODAL
          ================================================== */}

      {selectedNutrition && (

        <div className="history-modal-overlay">

          <div className="history-modal">

            <div className="history-modal-header">

              <div>

                <span className="section-label">
                  NUTRITION DETAILS
                </span>

                <h2>
                  🥗 Daily Nutrition Plan
                </h2>

              </div>

              <button
                className="modal-close-button"
                onClick={closeNutritionDetails}
              >
                ×
              </button>

            </div>


            <div className="history-detail-date">

              <strong>
                📅 Date
              </strong>

              <span>
                {selectedNutrition.date ||
                  selectedNutrition.selectedDate}
              </span>

            </div>


            {selectedNutrition.pregnancyInfo && (

              <div className="history-data-section">

                <h3>
                  🤰 Pregnancy Context
                </h3>

                <div className="history-data-grid">

                  <div className="history-data-item">
                    <span>Pregnancy Week</span>
                    <strong>
                      {displayValue(
                        selectedNutrition
                          .pregnancyInfo
                          .weeks
                      )}
                    </strong>
                  </div>

                  <div className="history-data-item">
                    <span>Trimester</span>
                    <strong>
                      {displayValue(
                        selectedNutrition
                          .pregnancyInfo
                          .trimester
                      )}
                    </strong>
                  </div>

                  <div className="history-data-item">
                    <span>Due Date</span>
                    <strong>
                      {displayValue(
                        selectedNutrition
                          .pregnancyInfo
                          .dueDate
                      )}
                    </strong>
                  </div>

                </div>

              </div>

            )}


            <div className="history-data-section">

              <h3>
                🥑 Food Preferences
              </h3>

              <div className="history-data-grid">

                <div className="history-data-item">
                  <span>Dietary Preference</span>
                  <strong>
                    {displayValue(
                      selectedNutrition
                        .dietaryPreference
                    )}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>Food Allergies</span>
                  <strong>
                    {displayValue(
                      selectedNutrition
                        .foodAllergies
                    )}
                  </strong>
                </div>

              </div>

            </div>


            {selectedNutrition.wellness && (

              <div className="history-data-section">

                <h3>
                  🌸 Wellness Context
                </h3>

                <div className="history-data-grid">

                  <div className="history-data-item">
                    <span>😊 Mood</span>
                    <strong>
                      {displayValue(
                        selectedNutrition
                          .wellness.mood
                      )}
                    </strong>
                  </div>

                  <div className="history-data-item">
                    <span>⚡ Energy</span>
                    <strong>
                      {displayValue(
                        selectedNutrition
                          .wellness.energy
                      )}
                    </strong>
                  </div>

                  <div className="history-data-item">
                    <span>💧 Water</span>
                    <strong>
                      {displayValue(
                        selectedNutrition
                          .wellness.water
                      )}
                    </strong>
                  </div>

                  <div className="history-data-item">
                    <span>🍓 Cravings</span>
                    <strong>
                      {displayValue(
                        selectedNutrition
                          .wellness.cravings
                      )}
                    </strong>
                  </div>

                  <div className="history-data-item">
                    <span>🍽️ Digestion</span>
                    <strong>
                      {displayValue(
                        selectedNutrition
                          .wellness.digestion
                      )}
                    </strong>
                  </div>

                  <div className="history-data-item">
                    <span>💭 Feelings</span>
                    <strong>
                      {displayValue(
                        selectedNutrition
                          .wellness.feelings
                      )}
                    </strong>
                  </div>

                </div>

              </div>

            )}


            <div className="history-data-section">

              <h3>
                🍽️ Recommendations
              </h3>

              {selectedNutrition.recommendations?.length > 0 ? (

                <div className="history-recommendation-list">

                  {selectedNutrition.recommendations.map(
                    (recommendation, index) => (

                      <div
                        className="history-recommendation-item"
                        key={
                          recommendation.food_id ||
                          recommendation.id ||
                          index
                        }
                      >

                        <strong>
                          {recommendation.food_name ||
                            recommendation.name ||
                            'Recommended food'}
                        </strong>

                        {recommendation.category && (
                          <span>
                            {recommendation.category}
                          </span>
                        )}

                        {recommendation.reason && (
                          <p>
                            {recommendation.reason}
                          </p>
                        )}

                      </div>

                    )
                  )}

                </div>

              ) : (

                <p>
                  No recommendations were saved.
                </p>

              )}

            </div>


            {selectedNutrition.safety && (

              <div className="history-data-section">

                <h3>
                  🛡️ Safety Information
                </h3>

                <div className="history-data-grid">

                  {Object.entries(
                    selectedNutrition.safety
                  ).map(([key, value]) => (

                    <div
                      className="history-data-item"
                      key={key}
                    >

                      <span>
                        {key}
                      </span>

                      <strong>
                        {displayValue(value)}
                      </strong>

                    </div>

                  ))}

                </div>

              </div>

            )}


            <div className="history-modal-actions">

              <button
                className="modal-delete-button"
                onClick={() =>
                  handleNutritionDelete(
                    selectedNutrition.id
                  )
                }
              >
                Delete This Nutrition Plan
              </button>

              <button
                className="modal-done-button"
                onClick={closeNutritionDetails}
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}


      {/* ==================================================
          ACTIVITY DETAILS MODAL
          ================================================== */}

      {selectedActivity && (

        <div className="history-modal-overlay">

          <div className="history-modal">

            <div className="history-modal-header">

              <div>

                <span className="section-label">
                  ACTIVITY DETAILS
                </span>

                <h2>
                  🏃 Daily Activity Plan
                </h2>

              </div>

              <button
                className="modal-close-button"
                onClick={closeActivityDetails}
              >
                ×
              </button>

            </div>


            {/* DATE */}

            <div className="history-detail-date">

              <strong>
                📅 Date
              </strong>

              <span>
                {selectedActivity.date ||
                  selectedActivity.selectedDate}
              </span>

            </div>


            {/* PREGNANCY CONTEXT */}

            {selectedActivity.pregnancyInfo && (

              <div className="history-data-section">

                <h3>
                  🤰 Pregnancy Context
                </h3>

                <div className="history-data-grid">

                  <div className="history-data-item">
                    <span>Pregnancy Week</span>
                    <strong>
                      {displayValue(
                        selectedActivity
                          .pregnancyInfo
                          .weeks
                      )}
                    </strong>
                  </div>

                  <div className="history-data-item">
                    <span>Trimester</span>
                    <strong>
                      {displayValue(
                        selectedActivity
                          .pregnancyInfo
                          .trimester
                      )}
                    </strong>
                  </div>

                  <div className="history-data-item">
                    <span>Due Date</span>
                    <strong>
                      {displayValue(
                        selectedActivity
                          .pregnancyInfo
                          .dueDate
                      )}
                    </strong>
                  </div>

                </div>

              </div>

            )}


            {/* WELLNESS CONTEXT */}

            {selectedActivity.wellness && (

              <div className="history-data-section">

                <h3>
                  🌸 Wellness Context
                </h3>

                <div className="history-data-grid">

                  <div className="history-data-item">
                    <span>⚡ Energy</span>
                    <strong>
                      {displayValue(
                        selectedActivity
                          .wellness.energy
                      )}
                    </strong>
                  </div>

                  <div className="history-data-item">
                    <span>😊 Mood</span>
                    <strong>
                      {displayValue(
                        selectedActivity
                          .wellness.mood
                      )}
                    </strong>
                  </div>

                  <div className="history-data-item">
                    <span>💭 Feelings</span>
                    <strong>
                      {displayValue(
                        selectedActivity
                          .wellness.feelings
                      )}
                    </strong>
                  </div>

                  <div className="history-data-item">
                    <span>🩹 Pain</span>
                    <strong>
                      {displayValue(
                        selectedActivity
                          .wellness.pain
                      )}
                    </strong>
                  </div>

                  <div className="history-data-item">
                    <span>😴 Sleep Quality</span>
                    <strong>
                      {displayValue(
                        selectedActivity
                          .wellness.sleepQuality
                      )}
                    </strong>
                  </div>

                  <div className="history-data-item">
                    <span>🕐 Sleep Duration</span>
                    <strong>
                      {selectedActivity.wellness
                        .sleepHours ||
                      selectedActivity.wellness
                        .sleepMinutes
                        ? `${
                            selectedActivity.wellness
                              .sleepHours || 0
                          }h ${
                            selectedActivity.wellness
                              .sleepMinutes || 0
                          }m`
                        : displayValue(
                            selectedActivity
                              .wellness
                              .sleepDuration
                          )}
                    </strong>
                  </div>

                  <div className="history-data-item">
                    <span>💧 Water</span>
                    <strong>
                      {displayValue(
                        selectedActivity
                          .wellness.water
                      )}
                    </strong>
                  </div>

                </div>

              </div>

            )}


            {/* STATUS */}

            <div className="history-data-section">

              <h3>
                🛡️ Plan Status
              </h3>

              <div className="history-detail-result">

                <span>
                  Recommendation Status
                </span>

                <strong>
                  {selectedActivity.status ===
                  'medical_advice'
                    ? 'Medical Advice'
                    : selectedActivity.status ===
                      'no_recommendations'
                    ? 'No Recommendations'
                    : 'Recommendations Available'}
                </strong>

              </div>

            </div>


            {/* MESSAGES */}

            {selectedActivity.messages?.length > 0 && (

              <div className="history-data-section">

                <h3>
                  ℹ️ Messages
                </h3>

                <div className="wellness-history-notes">

                  {selectedActivity.messages.map(
                    (message, index) => (
                      <p key={index}>
                        {message}
                      </p>
                    )
                  )}

                </div>

              </div>

            )}


            {/* RECOMMENDATIONS */}

            <div className="history-data-section">

              <h3>
                🏃 Recommended Activities
              </h3>

              {selectedActivity.recommendations?.length > 0 ? (

                <div className="history-recommendation-list">

                  {selectedActivity.recommendations.map(
                    (recommendation, index) => (

                      <div
                        className="history-recommendation-item"
                        key={
                          recommendation.exercise_id ||
                          index
                        }
                      >

                        <strong>
                          {recommendation.exercise_name ||
                            'Activity'}
                        </strong>

                        {recommendation.category && (
                          <span>
                            🌿 {recommendation.category}
                          </span>
                        )}

                        {recommendation.intensity && (
                          <span>
                            ⚡ {recommendation.intensity}
                          </span>
                        )}

                        {recommendation.description && (
                          <p>
                            {recommendation.description}
                          </p>
                        )}

                        {recommendation.benefits && (
                          <p>
                            <strong>
                              Benefits:
                            </strong>{' '}
                            {recommendation.benefits}
                          </p>
                        )}

                        {recommendation.reason && (
                          <p>
                            <strong>
                              Why it was suggested:
                            </strong>{' '}
                            {recommendation.reason}
                          </p>
                        )}

                        {recommendation.modification && (
                          <p>
                            <strong>
                              Modification:
                            </strong>{' '}
                            {recommendation.modification}
                          </p>
                        )}

                        {recommendation.modification_notes && (
                          <p>
                            <strong>
                              Safety note:
                            </strong>{' '}
                            {recommendation.modification_notes}
                          </p>
                        )}

                        {recommendation.safety_status && (
                          <p>
                            <strong>
                              Safety status:
                            </strong>{' '}
                            {recommendation.safety_status}
                          </p>
                        )}

                        {recommendation.safety_messages
                          ?.length > 0 && (

                          <div>
                            {recommendation.safety_messages.map(
                              (message, messageIndex) => (
                                <p
                                  key={messageIndex}
                                >
                                  ⚠️ {message}
                                </p>
                              )
                            )}
                          </div>

                        )}

                        {recommendation.source && (
                          <p>
                            <strong>
                              Source:
                            </strong>{' '}
                            {recommendation.source}
                          </p>
                        )}

                      </div>

                    )
                  )}

                </div>

              ) : (

                <p>
                  No activity recommendations were saved
                  for this plan.
                </p>

              )}

            </div>


            {/* ACTIONS */}

            <div className="history-modal-actions">

              <button
                className="modal-delete-button"
                onClick={() =>
                  handleActivityDelete(
                    selectedActivity.id
                  )
                }
              >
                Delete This Activity Plan
              </button>

              <button
                className="modal-done-button"
                onClick={closeActivityDetails}
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </section>
  )
}

export default History