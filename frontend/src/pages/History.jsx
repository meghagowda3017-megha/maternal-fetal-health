import { useState } from 'react'
import './History.css'

function History({
  history,
  wellnessHistory,
  nutritionHistory,
  onBack,
  onClear,
  onDelete,
  onClearWellness,
  onDeleteWellness,
  onClearNutrition,
  onDeleteNutrition,
}) {
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedWellness, setSelectedWellness] = useState(null)
  const [selectedNutrition, setSelectedNutrition] = useState(null)

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
    onDelete(id)
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
    onDeleteWellness(id)
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
    onDeleteNutrition(id)
  }

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
            View your previous health assessments, daily wellness
            check-ins, and nutrition plans.
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
              Previous maternal and fetal health assessments
            </p>

          </div>

        </div>


        {/* EMPTY ASSESSMENT HISTORY */}

        {history.length === 0 && (

          <div className="history-empty">

            <div className="history-empty-icon">
              🕘
            </div>

            <h3>
              No Assessment History
            </h3>

            <p>
              Your completed maternal and fetal assessments will appear here.
            </p>

          </div>

        )}


        {/* ASSESSMENT HISTORY LIST */}

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
                    {item.type === 'Maternal' ? '🤰' : '👶'}
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


        {/* EMPTY WELLNESS HISTORY */}

        {wellnessHistory.length === 0 && (

          <div className="history-empty wellness-empty">

            <div className="history-empty-icon">
              🌷
            </div>

            <h3>
              No Wellness Check-ins Yet
            </h3>

            <p>
              Your daily wellness check-ins will appear here after you save one.
            </p>

          </div>

        )}


        {/* WELLNESS HISTORY LIST */}

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

      <div className="history-section-block nutrition-history-block">

        <div className="history-section-title">

          <div className="history-section-icon nutrition-history-icon">
            🥗
          </div>

          <div>

            <h2>
              Nutrition History
            </h2>

            <p>
              Your saved personalized nutrition plans
            </p>

          </div>

        </div>


        {/* EMPTY NUTRITION HISTORY */}

        {nutritionHistory.length === 0 && (

          <div className="history-empty nutrition-empty">

            <div className="history-empty-icon">
              🥗
            </div>

            <h3>
              No Nutrition Plans Yet
            </h3>

            <p>
              Your saved nutrition plans will appear here after you save one.
            </p>

          </div>

        )}


        {/* NUTRITION HISTORY LIST */}

        {nutritionHistory.length > 0 && (

          <div className="history-container nutrition-history-container">

            <div className="history-top-bar">

              <div>

                <strong>
                  {nutritionHistory.length} Nutrition Plan
                  {nutritionHistory.length !== 1 ? 's' : ''}
                </strong>

                <span>
                  Click a nutrition plan to view details
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
                  className="history-item nutrition-history-item"
                  key={item.id}
                  onClick={() => openNutritionDetails(item)}
                >

                  <div className="history-item-icon nutrition-item-icon">
                    🥗
                  </div>


                  <div className="history-item-info">

                    <div className="history-item-title">
                      Personalized Nutrition Plan
                    </div>

                    <div className="history-item-date">
                      {item.date || item.selectedDate}
                    </div>

                  </div>


                  <div className="wellness-summary">

                    {item.pregnancyInfo?.trimester && (
                      <span>
                        🤰 {item.pregnancyInfo.trimester}
                      </span>
                    )}

                    {item.recommendations && (
                      <span>
                        🍎 {item.recommendations.length} foods
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

                {Object.entries(selectedItem.data || {}).map(
                  ([key, value]) => (

                    <div
                      className="history-data-item"
                      key={key}
                    >

                      <span>
                        {key}
                      </span>

                      <strong>
                        {value}
                      </strong>

                    </div>

                  )
                )}

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
                        {Math.round(Number(value) * 100)}%
                      </strong>

                    </div>

                  ))}

                </div>

              </div>

            )}


            <div className="history-modal-actions">

              <button
                className="modal-delete-button"
                onClick={() => handleDelete(selectedItem.id)}
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


            {/* DATE */}

            <div className="history-detail-date">

              <strong>
                📅 Date & Time
              </strong>

              <span>
                {selectedWellness.date}
              </span>

            </div>


            {/* WELLNESS DATA */}

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
                    {displayValue(selectedWellness.sleepQuality)}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>🕐 Sleep Duration</span>
                  <strong>
                    {selectedWellness.sleepHours ||
                    selectedWellness.sleepMinutes
                      ? `${selectedWellness.sleepHours || 0}h ${selectedWellness.sleepMinutes || 0}m`
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
                    {displayValue(selectedWellness.cravings)}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>💧 Discharge</span>
                  <strong>
                    {displayValue(selectedWellness.discharge)}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>✨ Skin</span>
                  <strong>
                    {displayValue(selectedWellness.skin)}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>💇‍♀️ Hair</span>
                  <strong>
                    {displayValue(selectedWellness.hair)}
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
                    {displayValue(selectedWellness.digestion)}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>🚽 Stool</span>
                  <strong>
                    {displayValue(selectedWellness.stool)}
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
                    {displayValue(selectedWellness.selfCare)}
                  </strong>
                </div>

                <div className="history-data-item">
                  <span>🤒 Ailments</span>
                  <strong>
                    {displayValue(selectedWellness.ailments)}
                  </strong>
                </div>

              </div>

            </div>


            {/* NOTES */}

            <div className="history-data-section">

              <h3>
                📝 Notes
              </h3>

              <div className="wellness-history-notes">

                {selectedWellness.notes
                  ? selectedWellness.notes
                  : 'No notes were added for this check-in.'}

              </div>

            </div>


            {/* ACTIONS */}

            <div className="history-modal-actions">

              <button
                className="modal-delete-button"
                onClick={() =>
                  handleWellnessDelete(selectedWellness.id)
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

          <div className="history-modal nutrition-modal">

            <div className="history-modal-header">

              <div>

                <span className="section-label">
                  NUTRITION PLAN
                </span>

                <h2>
                  🥗 Personalized Nutrition Plan
                </h2>

              </div>

              <button
                className="modal-close-button"
                onClick={closeNutritionDetails}
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
                {selectedNutrition.date ||
                  selectedNutrition.selectedDate ||
                  'Not entered'}
              </span>

            </div>


            {/* PREGNANCY CONTEXT */}

            <div className="history-data-section">

              <h3>
                🤰 Pregnancy Context
              </h3>

              <div className="history-data-grid">

                <div className="history-data-item">

                  <span>
                    Pregnancy Week
                  </span>

                  <strong>
                    {displayValue(
                      selectedNutrition.pregnancyInfo?.weeks
                    )}
                  </strong>

                </div>

                <div className="history-data-item">

                  <span>
                    Trimester
                  </span>

                  <strong>
                    {displayValue(
                      selectedNutrition.pregnancyInfo?.trimester
                    )}
                  </strong>

                </div>

                <div className="history-data-item">

                  <span>
                    Due Date
                  </span>

                  <strong>
                    {displayValue(
                      selectedNutrition.pregnancyInfo?.dueDate
                    )}
                  </strong>

                </div>

              </div>

            </div>


            {/* FOOD PREFERENCES */}

            <div className="history-data-section">

              <h3>
                🥑 Food Preferences
              </h3>

              <div className="history-data-grid">

                <div className="history-data-item">

                  <span>
                    Dietary Preference
                  </span>

                  <strong>
                    {displayValue(
                      selectedNutrition.dietaryPreference
                    )}
                  </strong>

                </div>

                <div className="history-data-item">

                  <span>
                    Food Allergies
                  </span>

                  <strong>
                    {displayValue(
                      selectedNutrition.foodAllergies
                    )}
                  </strong>

                </div>

              </div>

            </div>


            {/* WELLNESS CONTEXT */}

            <div className="history-data-section">

              <h3>
                🌸 Wellness Context
              </h3>

              <div className="history-data-grid">

                <div className="history-data-item">

                  <span>
                    😊 Mood
                  </span>

                  <strong>
                    {displayValue(
                      selectedNutrition.wellness?.mood
                    )}
                  </strong>

                </div>

                <div className="history-data-item">

                  <span>
                    ⚡ Energy
                  </span>

                  <strong>
                    {displayValue(
                      selectedNutrition.wellness?.energy
                    )}
                  </strong>

                </div>

                <div className="history-data-item">

                  <span>
                    💧 Water
                  </span>

                  <strong>
                    {displayValue(
                      selectedNutrition.wellness?.water
                    )}
                  </strong>

                </div>

                <div className="history-data-item">

                  <span>
                    🍓 Cravings
                  </span>

                  <strong>
                    {displayValue(
                      selectedNutrition.wellness?.cravings
                    )}
                  </strong>

                </div>

                <div className="history-data-item">

                  <span>
                    🍽️ Digestion
                  </span>

                  <strong>
                    {displayValue(
                      selectedNutrition.wellness?.digestion
                    )}
                  </strong>

                </div>

                <div className="history-data-item">

                  <span>
                    💭 Feelings
                  </span>

                  <strong>
                    {displayValue(
                      selectedNutrition.wellness?.feelings
                    )}
                  </strong>

                </div>

              </div>

            </div>


            {/* RECOMMENDATIONS */}

            <div className="history-data-section">

              <h3>
                🍎 Recommended Foods
              </h3>

              {selectedNutrition.recommendations?.length > 0 ? (

                <div className="history-data-grid">

                  {selectedNutrition.recommendations.map(
                    (food, index) => (

                      <div
                        className="history-data-item"
                        key={food.food_name || index}
                      >

                        <span>
                          {food.category || 'Food'}
                        </span>

                        <strong>
                          {food.food_name ||
                            food.Food_Name ||
                            'Food'}
                        </strong>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <p>
                  No recommendations were saved for this plan.
                </p>

              )}

            </div>


            {/* SAFETY */}

            {selectedNutrition.safety && (

              <div className="history-data-section">

                <h3>
                  🛡️ Food Safety
                </h3>

                <div className="wellness-history-notes">

                  {selectedNutrition.safety.disclaimer ||
                    'Nutrition guidance is educational and not a substitute for prenatal medical care.'}

                </div>

              </div>

            )}


            {/* ACTIONS */}

            <div className="history-modal-actions">

              <button
                className="modal-delete-button"
                onClick={() =>
                  handleNutritionDelete(selectedNutrition.id)
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

    </section>
  )
}

export default History