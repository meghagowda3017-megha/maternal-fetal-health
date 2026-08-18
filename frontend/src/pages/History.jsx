import { useState } from 'react'
import './History.css'

function History({ history, onBack, onClear, onDelete }) {
  const [selectedItem, setSelectedItem] = useState(null)

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

  return (
    <section className="history-section">

      {/* HEADER */}

      <div className="history-header">

        <div>
          <span className="section-label">
            ASSESSMENT HISTORY
          </span>

          <h2>
            Previous Assessments
          </h2>

          <p>
            View and manage your previous maternal and fetal health assessments.
          </p>
        </div>

        <button
          className="history-back-button"
          onClick={onBack}
        >
          ← Back
        </button>

      </div>


      {/* EMPTY STATE */}

      {history.length === 0 && (
        <div className="history-empty">

          <div className="history-empty-icon">
            🕘
          </div>

          <h3>
            No Assessment History
          </h3>

          <p>
            Your completed assessments will appear here.
          </p>

        </div>
      )}


      {/* HISTORY LIST */}

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


      {/* DETAILS MODAL */}

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

    </section>
  )
}

export default History