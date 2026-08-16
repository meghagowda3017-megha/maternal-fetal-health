import { useState } from 'react'
import './MaternalAssessment.css'

const initialMaternalData = {
  Age: '',
  SystolicBP: '',
  DiastolicBP: '',
  BS: '',
  BodyTemp: '',
  HeartRate: '',
}

function MaternalAssessment({ onBack }) {
  const [formData, setFormData] = useState(initialMaternalData)
  const [maternalResult, setMaternalResult] = useState(null)
  const [loading, setLoading] = useState(false)

  // --------------------------------------------------
  // MATERNAL INPUT
  // --------------------------------------------------

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  // --------------------------------------------------
  // MATERNAL PREDICTION
  // --------------------------------------------------

  const handleMaternalSubmit = async (event) => {
    event.preventDefault()

    setLoading(true)
    setMaternalResult(null)

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/predict/maternal-risk',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Age: Number(formData.Age),
            SystolicBP: Number(formData.SystolicBP),
            DiastolicBP: Number(formData.DiastolicBP),
            BS: Number(formData.BS),
            BodyTemp: Number(formData.BodyTemp),
            HeartRate: Number(formData.HeartRate),
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Maternal prediction request failed')
      }

      const data = await response.json()

      setMaternalResult(data)
    } catch (error) {
      console.error(error)

      alert(
        'Could not connect to the backend. Make sure FastAPI is running on port 8000.'
      )
    } finally {
      setLoading(false)
    }
  }

  // --------------------------------------------------
  // RISK CLASS
  // --------------------------------------------------

  const getRiskClass = (risk) => {
    const value = String(risk).toLowerCase()

    if (value.includes('high')) {
      return 'high'
    }

    if (
      value.includes('mid') ||
      value.includes('medium')
    ) {
      return 'medium'
    }

    return 'low'
  }

  // --------------------------------------------------
  // RESET MATERNAL
  // --------------------------------------------------

  const newMaternalAssessment = () => {
    setMaternalResult(null)
    setFormData(initialMaternalData)
  }

  return (
    <section className="form-section">

      {/* ========================================
          HEADER
          ======================================== */}

      <div className="form-header">

        <div>

          <span className="section-label">
            MATERNAL ASSESSMENT
          </span>

          <h2>
            Maternal Health Risk Assessment
          </h2>

          <p>
            Enter the maternal health measurements below.
          </p>

        </div>

        <button
          className="back-button"
          onClick={onBack}
        >
          ← Back
        </button>

      </div>


      {/* ========================================
          FORM
          ======================================== */}

      <form onSubmit={handleMaternalSubmit}>

        <div className="form-card">

          <div className="form-card-header">

            <div>

              <h3>
                Patient Measurements
              </h3>

              <p>
                Please enter the current measurements accurately.
              </p>

            </div>

            <span className="required-text">
              * Required
            </span>

          </div>


          <div className="form-grid">

            {/* AGE */}

            <div className="form-group">

              <label>
                Age
              </label>

              <div className="input-wrapper">

                <input
                  type="number"
                  name="Age"
                  value={formData.Age}
                  onChange={handleChange}
                  placeholder="Enter age"
                  min="1"
                  required
                />

                <span>
                  years
                </span>

              </div>

            </div>


            {/* SYSTOLIC */}

            <div className="form-group">

              <label>
                Systolic Blood Pressure
              </label>

              <div className="input-wrapper">

                <input
                  type="number"
                  name="SystolicBP"
                  value={formData.SystolicBP}
                  onChange={handleChange}
                  placeholder="e.g. 120"
                  required
                />

                <span>
                  mmHg
                </span>

              </div>

            </div>


            {/* DIASTOLIC */}

            <div className="form-group">

              <label>
                Diastolic Blood Pressure
              </label>

              <div className="input-wrapper">

                <input
                  type="number"
                  name="DiastolicBP"
                  value={formData.DiastolicBP}
                  onChange={handleChange}
                  placeholder="e.g. 80"
                  required
                />

                <span>
                  mmHg
                </span>

              </div>

            </div>


            {/* BLOOD SUGAR */}

            <div className="form-group">

              <label>
                Blood Sugar
              </label>

              <div className="input-wrapper">

                <input
                  type="number"
                  step="any"
                  name="BS"
                  value={formData.BS}
                  onChange={handleChange}
                  placeholder="e.g. 6.1"
                  required
                />

                <span>
                  mmol/L
                </span>

              </div>

            </div>


            {/* BODY TEMPERATURE */}

            <div className="form-group">

              <label>
                Body Temperature
              </label>

              <div className="input-wrapper">

                <input
                  type="number"
                  step="any"
                  name="BodyTemp"
                  value={formData.BodyTemp}
                  onChange={handleChange}
                  placeholder="e.g. 98.0"
                  required
                />

                <span>
                  °F
                </span>

              </div>

            </div>


            {/* HEART RATE */}

            <div className="form-group">

              <label>
                Heart Rate
              </label>

              <div className="input-wrapper">

                <input
                  type="number"
                  name="HeartRate"
                  value={formData.HeartRate}
                  onChange={handleChange}
                  placeholder="e.g. 80"
                  required
                />

                <span>
                  bpm
                </span>

              </div>

            </div>

          </div>


          {/* ========================================
              ACTIONS
              ======================================== */}

          <div className="form-actions">

            <button
              type="button"
              className="secondary-button"
              onClick={onBack}
            >
              Cancel
            </button>

            <button
              className="predict-button"
              type="submit"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="spinner"></span>
                  Analyzing...
                </>
              ) : (
                <>
                  Predict Maternal Risk
                  <span>→</span>
                </>
              )}

            </button>

          </div>

        </div>

      </form>


      {/* ========================================
          MATERNAL RESULT
          ======================================== */}

      {maternalResult && (

        <div
          className={`result-card ${getRiskClass(
            maternalResult.prediction
          )}`}
        >

          <div className="result-header">

            <div>

              <span className="section-label">
                ASSESSMENT RESULT
              </span>

              <h2>
                Maternal Risk Assessment
              </h2>

            </div>

            <div className="result-check">
              ✓
            </div>

          </div>


          {/* MAIN RESULT */}

          <div className="main-result">

            <div className="risk-icon">

              {getRiskClass(maternalResult.prediction) === 'high'
                ? '!'
                : getRiskClass(maternalResult.prediction) === 'medium'
                  ? '!'
                  : '✓'}

            </div>

            <div>

              <span className="result-label">
                Predicted Risk Level
              </span>

              <h3>
                {maternalResult.prediction}
              </h3>

              <p>
                Based on the measurements provided, the model
                predicts this maternal risk category.
              </p>

            </div>

          </div>


          {/* ========================================
              PROBABILITIES
              ======================================== */}

          {maternalResult.probabilities && (

            <div className="probability-section">

              <h3>
                Prediction Confidence
              </h3>

              {Object.entries(
                maternalResult.probabilities
              ).map(([risk, probability]) => (

                <div
                  className="probability-item"
                  key={risk}
                >

                  <div className="probability-info">

                    <span>
                      {risk}
                    </span>

                    <strong>
                      {Math.round(
                        Number(probability) * 100
                      )}
                      %
                    </strong>

                  </div>

                  <div className="progress-track">

                    <div
                      className={`progress-bar ${getRiskClass(
                        risk
                      )}`}
                      style={{
                        width: `${Number(probability) * 100}%`,
                      }}
                    ></div>

                  </div>

                </div>

              ))}

            </div>

          )}


          {/* ========================================
              RESULT FOOTER
              ======================================== */}

          <div className="result-footer">

            <p>
              ⚕ This prediction is intended as decision support
              and should not replace professional medical advice.
            </p>

            <button
              className="new-assessment-button"
              onClick={newMaternalAssessment}
            >
              New Assessment
            </button>

          </div>

        </div>

      )}

    </section>
  )
}

export default MaternalAssessment