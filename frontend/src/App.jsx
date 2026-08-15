import { useState } from 'react'
import './App.css'

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

const initialMaternalData = {
  Age: '',
  SystolicBP: '',
  DiastolicBP: '',
  BS: '',
  BodyTemp: '',
  HeartRate: '',
}

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

function App() {
  const [showMaternalForm, setShowMaternalForm] = useState(false)
  const [showFetalForm, setShowFetalForm] = useState(false)

  const [maternalResult, setMaternalResult] = useState(null)
  const [fetalResult, setFetalResult] = useState(null)

  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState(initialMaternalData)
  const [ctgData, setCtgData] = useState(initialCtgData)

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
  // NAVIGATION
  // --------------------------------------------------

  const closeMaternalForm = () => {
    setShowMaternalForm(false)
    setMaternalResult(null)
  }

  const closeFetalForm = () => {
    setShowFetalForm(false)
    setFetalResult(null)
  }

  const openMaternalForm = () => {
    setShowMaternalForm(true)
    setShowFetalForm(false)
    setMaternalResult(null)
  }

  const openFetalForm = () => {
    setShowFetalForm(true)
    setShowMaternalForm(false)
    setFetalResult(null)
  }

  const goHome = () => {
    setShowMaternalForm(false)
    setShowFetalForm(false)
    setMaternalResult(null)
    setFetalResult(null)
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
  // RESET MATERNAL
  // --------------------------------------------------

  const newMaternalAssessment = () => {
    setMaternalResult(null)
    setFormData(initialMaternalData)
  }

  // --------------------------------------------------
  // RESET FETAL
  // --------------------------------------------------

  const newFetalAssessment = () => {
    setFetalResult(null)
    setCtgData(initialCtgData)
  }

  return (
    <div className="app">

      {/* ==========================================
          HEADER
          ========================================== */}

      <header className="header">

        <div className="header-content">

          <div className="brand-icon">
            ♥
          </div>

          <div>
            <h1>
              Maternal-Fetal Health
            </h1>

            <p>
              Prediction &amp; Monitoring System
            </p>
          </div>

        </div>

        <div className="system-status">
          <span className="status-dot"></span>
          System Ready
        </div>

      </header>

      {/* ==========================================
          MAIN
          ========================================== */}

      <main className="dashboard">

        {/* ========================================
            HOME PAGE
            ======================================== */}

        {!showMaternalForm && !showFetalForm && (
          <>

            <section className="welcome">

              <span className="welcome-label">
                HEALTH ASSESSMENT
              </span>

              <h2>
                Welcome to Maternal-Fetal
                <span> Health Monitoring</span>
              </h2>

              <p>
                Use our prediction models to assess maternal health
                risk and fetal health status.
              </p>

            </section>

            {/* ======================================
                PREDICTION CARDS
                ====================================== */}

            <section className="prediction-grid">

              {/* MATERNAL CARD */}

              <div className="prediction-card maternal-card">

                <div className="card-top">

                  <div className="card-icon">
                    🤰
                  </div>

                  <span className="available-badge">
                    Available
                  </span>

                </div>

                <h3>
                  Maternal Health Risk
                </h3>

                <p>
                  Assess maternal health risk using age,
                  blood pressure, blood sugar, body temperature
                  and heart rate.
                </p>

                <div className="card-features">

                  <span>
                    ♥ Vital Signs
                  </span>

                  <span>
                    ◉ ML Prediction
                  </span>

                </div>

                <button
                  className="primary-button"
                  onClick={openMaternalForm}
                >
                  Start Assessment
                  <span>→</span>
                </button>

              </div>

              {/* FETAL CARD */}

              <div className="prediction-card fetal-card">

                <div className="card-top">

                  <div className="card-icon">
                    👶
                  </div>

                  <span className="available-badge">
                    Available
                  </span>

                </div>

                <h3>
                  Fetal Health
                </h3>

                <p>
                  Analyze cardiotocography (CTG) measurements
                  to predict fetal health status.
                </p>

                <div className="card-features">

                  <span>
                    ⌁ CTG Analysis
                  </span>

                  <span>
                    ◉ ML Prediction
                  </span>

                </div>

                <button
                  className="primary-button"
                  onClick={openFetalForm}
                >
                  Start Assessment
                  <span>→</span>
                </button>

              </div>

            </section>

            {/* ======================================
                INFORMATION STRIP
                ====================================== */}

            <section className="info-strip">

              <div>

                <span className="info-icon">
                  🔒
                </span>

                <div>

                  <strong>
                    Secure Assessment
                  </strong>

                  <p>
                    Your information is processed securely.
                  </p>

                </div>

              </div>

              <div>

                <span className="info-icon">
                  ⚕
                </span>

                <div>

                  <strong>
                    Decision Support
                  </strong>

                  <p>
                    Predictions are designed to support
                    healthcare assessment.
                  </p>

                </div>

              </div>

              <div>

                <span className="info-icon">
                  ✓
                </span>

                <div>

                  <strong>
                    Machine Learning
                  </strong>

                  <p>
                    Powered by trained prediction models.
                  </p>

                </div>

              </div>

            </section>

          </>
        )}

        {/* ========================================
            MATERNAL ASSESSMENT
            ======================================== */}

        {showMaternalForm && (

          <section className="form-section">

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
                onClick={closeMaternalForm}
              >
                ← Back
              </button>

            </div>

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

                {/* ACTIONS */}

                <div className="form-actions">

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={closeMaternalForm}
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

            {/* MATERNAL RESULT */}

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

                {/* PROBABILITIES */}

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

        )}

        {/* ========================================
            FETAL ASSESSMENT
            ======================================== */}

        {showFetalForm && (

          <section className="form-section">

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
                onClick={closeFetalForm}
              >
                ← Back
              </button>

            </div>

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

                <div className="form-actions">

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={closeFetalForm}
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

            {/* FETAL RESULT */}

            {fetalResult && (

              <div
                className={`result-card ${getFetalClass(
                  fetalResult.fetal_health
                )}`}
              >

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

                {/* FETAL PROBABILITIES */}

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

        )}

      </main>

      {/* ==========================================
          FOOTER
          ========================================== */}

      <footer className="footer">

        <p>
          Maternal-Fetal Health Prediction &amp; Monitoring System
        </p>

        <span>
          For educational and decision-support purposes only.
        </span>

      </footer>

    </div>
  )
}

export default App