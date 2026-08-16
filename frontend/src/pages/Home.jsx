import './Home.css'

function Home({ onMaternalClick, onFetalClick }) {
  return (
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
            onClick={onMaternalClick}
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
            onClick={onFetalClick}
          >
            Start Assessment
            <span>→</span>
          </button>

        </div>

      </section>

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
  )
}

export default Home