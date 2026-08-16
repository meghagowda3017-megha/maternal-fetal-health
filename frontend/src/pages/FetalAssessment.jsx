import { useState } from 'react'
import './FetalAssessment.css'

const CTG_FEATURES = [
  'LB',
  'AC',
  'FM',
  'UC',
  'ASTV',
  'MSTV',
  'ALTV',
  'MLTV',
  'DL',
  'DS',
  'DP',
  'DR',
  'Width',
  'Min',
  'Max',
  'Nmax',
  'Nzeros',
  'Mode',
  'Mean',
  'Median',
  'Variance',
  'Tendency',
]

const initialCtgData = {
  LB: '',
  AC: '',
  FM: '',
  UC: '',
  ASTV: '',
  MSTV: '',
  ALTV: '',
  MLTV: '',
  DL: '',
  DS: '',
  DP: '',
  DR: '',
  Width: '',
  Min: '',
  Max: '',
  Nmax: '',
  Nzeros: '',
  Mode: '',
  Mean: '',
  Median: '',
  Variance: '',
  Tendency: '',
}

function FetalAssessment({ onBack }) {
  const [ctgData, setCtgData] = useState(initialCtgData)
  const [fetalResult, setFetalResult] = useState(null)
  const [loading, setLoading] = useState(false)

  // --------------------------------------------------
  // CTG INPUT
  // --------------------------------------------------

  const handleCtgChange = (event) => {
    const { name, value } = event.target

    setCtgData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  // --------------------------------------------------
  // FETAL PREDICTION
  // --------------------------------------------------

  const handleFetalSubmit = async (event) => {
    event.preventDefault()

    setLoading(true)
    setFetalResult(null)

    try {
      const requestBody = {}

      CTG_FEATURES.forEach((feature) => {
        requestBody[feature] = Number(ctgData[feature])
      })

      const response = await fetch(
        'http://127.0.0.1:8000/predict/fetal-health',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      )

      if (!response.ok) {
        throw new Error('Fetal prediction request failed')
      }

      const data = await response.json()

      setFetalResult(data)
    } catch (error) {
      console.error(error)

      alert(
        'Could not connect to the fetal prediction backend. Make sure FastAPI is running on port 8000.'
      )
    } finally {
      setLoading(false)
    }
  }

  // --------------------------------------------------
  // FETAL CLASS
  // --------------------------------------------------

  const getFetalClass = (health) => {
    const value = String(health).toLowerCase()

    if (value.includes('pathologic')) {
      return 'high'
    }

    if (value.includes('suspect')) {
      return 'medium'
    }

    return 'low'
  }

  // --------------------------------------------------
  // RESET FETAL
  // --------------------------------------------------

  const newFetalAssessment = () => {
    setFetalResult(null)
    setCtgData(initialCtgData)
  }

  return (
    <section className="form-section">

      {/* ========================================
          HEADER
          ======================================== */}

      <div className="form-header">

        <div>

          <span className="section-label">
            FETAL ASSESSMENT
          </span>

          <h2>
            Fetal Health Assessment
          </h2>

          <p>
            Enter the cardiotocography (CTG) measurements below.
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

      <form onSubmit={handleFetalSubmit}>

        <div className="form-card">

          <div className="form-card-header">

            <div>

              <h3>
                CTG Measurements
              </h3>

              <p>
                Enter all 22 measurements required by the
                fetal health prediction model.
              </p>

            </div>

            <span className="required-text">
              * Required
            </span>

          </div>


          {/* ========================================
              CTG INPUT GRID
              ======================================== */}

          <div className="form-grid">

            {CTG_FEATURES.map((feature) => (

              <div
                className="form-group"
                key={feature}
              >

                <label>
                  {feature}
                </label>

                <div className="input-wrapper">

                  <input
                    type="number"
                    step="any"
                    name={feature}
                    value={ctgData[feature]}
                    onChange={handleCtgChange}
                    placeholder={`Enter ${feature}`}
                    required
                  />

                </div>

              </div>

            ))}

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
                  Predict Fetal Health
                  <span>→</span>
                </>
              )}

            </button>

          </div>

        </div>

      </form>


      {/* ========================================
          FETAL RESULT
          ======================================== */}

      {fetalResult && (

        <div
          className={`result-card ${getFetalClass(
            fetalResult.fetal_health
          )}`}
        >

          {/* RESULT HEADER */}

          <div className="result-header">

            <div>

              <span className="section-label">
                ASSESSMENT RESULT
              </span>

              <h2>
                Fetal Health Assessment
              </h2>

            </div>

            <div className="result-check">
              ✓
            </div>

          </div>


          {/* MAIN RESULT */}

          <div className="main-result">

            <div className="risk-icon">

              {getFetalClass(fetalResult.fetal_health) === 'high'
                ? '!'
                : getFetalClass(fetalResult.fetal_health) === 'medium'
                  ? '!'
                  : '✓'}

            </div>

            <div>

              <span className="result-label">
                Predicted Fetal Health
              </span>

              <h3>
                {fetalResult.fetal_health}
              </h3>

              <p>
                Based on the CTG measurements provided,
                the model predicts this fetal health status.
              </p>

            </div>

          </div>


          {/* ========================================
              PROBABILITIES
              ======================================== */}

          {fetalResult.probabilities && (

            <div className="probability-section">

              <h3>
                Prediction Confidence
              </h3>

              {Object.entries(
                fetalResult.probabilities
              ).map(([health, probability]) => (

                <div
                  className="probability-item"
                  key={health}
                >

                  <div className="probability-info">

                    <span>
                      {health}
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
                      className={`progress-bar ${getFetalClass(
                        health
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
              onClick={newFetalAssessment}
            >
              New Assessment
            </button>

          </div>

        </div>

      )}

    </section>
  )
}

export default FetalAssessment