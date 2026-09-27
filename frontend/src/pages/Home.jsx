import './Home.css'

function Home({
  onMaternalClick,
  onFetalClick,
  onHistoryClick,
  onPregnancyClick,
  onWellnessClick,
  onDailyWellnessClick,
  onWellnessDashboardClick,
  onNutritionClick,
  onActivityClick
}) {
  return (
    <div className="home-page">

      {/* ==================================================
          WELCOME
          ================================================== */}

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


      {/* ==================================================
          PREGNANCY TRACKING
          ================================================== */}

      <section className="pregnancy-section">

        <div className="pregnancy-card">

          <div className="card-top">

            <div className="card-icon pregnancy-icon">
              🩺
            </div>

            <span className="available-badge">
              Available
            </span>

          </div>

          <h3>
            Pregnancy Tracking
          </h3>

          <p>
            Track your pregnancy week, trimester, estimated due
            date and overall pregnancy progress.
          </p>

          <div className="card-features">

            <span>📅 LMP</span>
            <span>🌸 Trimester</span>
            <span>📈 Progress</span>

          </div>

          <button
            type="button"
            className="primary-button pregnancy-button"
            onClick={onPregnancyClick}
          >
            Track Pregnancy
            <span>→</span>
          </button>

        </div>

      </section>


      {/* ==================================================
          TRIMESTER WELLNESS
          ================================================== */}

      <section className="wellness-section">

        <div className="wellness-home-card">

          <div className="card-top">

            <div className="card-icon wellness-home-icon">
              🪷
            </div>

            <span className="available-badge">
              Available
            </span>

          </div>

          <h3>
            Trimester Wellness
          </h3>

          <p>
            Explore nutrition, wellness and pregnancy-care
            guidance based on each trimester.
          </p>

          <div className="card-features">

            <span>🥗 Nutrition</span>
            <span>🧘 Wellness</span>
            <span>💡 Tips</span>

          </div>

          <button
            type="button"
            className="primary-button wellness-home-button"
            onClick={onWellnessClick}
          >
            Explore Wellness
            <span>→</span>
          </button>

        </div>

      </section>


      {/* ==================================================
          DAILY WELLNESS + DASHBOARD
          ================================================== */}

      <div className="wellness-grid-container">

        {/* DAILY WELLNESS */}

        <section className="checkin-section">

          <div className="checkin-card">

            <div className="card-top">

              <div className="card-icon checkin-icon">
                🌷
              </div>

              <span className="available-badge">
                Available
              </span>

            </div>

            <h3>
              Daily Wellness Check-in
            </h3>

            <p>
              Record your daily mood, energy, sleep, water intake
              and personal wellness notes.
            </p>

            <div className="card-features">

              <span>😊 Mood</span>
              <span>💧 Hydration</span>
              <span>😴 Sleep</span>

            </div>

            <button
              type="button"
              className="primary-button checkin-button"
              onClick={onDailyWellnessClick}
            >
              Daily Check-in
              <span>→</span>
            </button>

          </div>

        </section>


        {/* MATERNAL WELLNESS DASHBOARD */}

        <section className="wellness-dashboard-section">

          <div className="wellness-dashboard-home-card">

            <div className="card-top">

              <div className="card-icon wellness-dashboard-icon">
                📊
              </div>

              <span className="available-badge">
                Available
              </span>

            </div>

            <h3>
              Maternal Wellness Dashboard
            </h3>

            <p>
              View your saved wellness check-ins, daily patterns,
              wellness summary and recent maternal health trends.
            </p>

            <div className="card-features">

              <span>📈 Trends</span>
              <span>🍓 Cravings</span>
              <span>⚡ Energy</span>

            </div>

            <button
              type="button"
              className="primary-button wellness-dashboard-button"
              onClick={onWellnessDashboardClick}
            >
              View Wellness Dashboard
              <span>→</span>
            </button>

          </div>

        </section>

      </div>


{/* ==================================================
    NUTRITION + ACTIVITY & EXERCISE
    ================================================== */}

<div className="nutrition-activity-grid">

  {/* NUTRITION */}

  <section className="nutrition-section">

    <div className="nutrition-home-card">

      <div className="card-top">

        <div className="card-icon nutrition-home-icon">
          🥗
        </div>

        <span className="available-badge">
          Available
        </span>

      </div>

      <h3>
        Nutrition & Pregnancy
      </h3>

      <p>
        Explore pregnancy-friendly nutrition guidance based
        on your pregnancy stage, cravings and food preferences.
      </p>

      <div className="card-features">

        <span>🥑 Nutrition</span>
        <span>🍓 Cravings</span>
        <span>💧 Hydration</span>

      </div>

      <button
        type="button"
        className="primary-button nutrition-home-button"
        onClick={onNutritionClick}
      >
        Explore Nutrition
        <span>→</span>
      </button>

    </div>

  </section>


  {/* ACTIVITY & EXERCISE */}

  <section className="activity-home-section">

    <div className="activity-home-card">

      <div className="card-top">

        <div className="card-icon activity-home-icon">
          🏃‍♀️
        </div>

        <span className="available-badge">
          Available
        </span>

      </div>

      <h3>
        Activity & Exercise
      </h3>

      <p>
        Explore pregnancy-friendly movement, gentle exercises,
        relaxation activities and wellness guidance.
      </p>

      <div className="card-features">

        <span>🚶 Walking</span>
        <span>🧘 Yoga</span>
        <span>🏊 Swimming</span>

      </div>

      <button
        type="button"
        className="primary-button activity-home-button"
        onClick={onActivityClick}
      >
        Explore Activity
        <span>→</span>
      </button>

    </div>

  </section>

</div>



      {/* ==================================================
          MATERNAL + FETAL PREDICTION
          ================================================== */}

      <section className="prediction-grid">

        {/* MATERNAL */}

        <div className="prediction-card maternal-card">

          <div className="card-top">

            <div className="card-icon maternal-icon">
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
            Assess maternal health risk using age, blood pressure,
            blood sugar, body temperature and heart rate.
          </p>

          <div className="card-features">

            <span>♥ Vital Signs</span>
            <span>◉ ML Prediction</span>

          </div>

          <button
            type="button"
            className="primary-button maternal-button"
            onClick={onMaternalClick}
          >
            Start Assessment
            <span>→</span>
          </button>

        </div>


        {/* FETAL */}

        <div className="prediction-card fetal-card">

          <div className="card-top">

            <div className="card-icon fetal-icon">
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
            Analyze cardiotocography (CTG) measurements to predict
            fetal health status.
          </p>

          <div className="card-features">

            <span>⌁ CTG Analysis</span>
            <span>◉ ML Prediction</span>

          </div>

          <button
            type="button"
            className="primary-button fetal-button"
            onClick={onFetalClick}
          >
            Start Assessment
            <span>→</span>
          </button>

        </div>

      </section>


      {/* ==================================================
          HISTORY
          ================================================== */}

      <div className="history-button-wrapper">

        <button
          type="button"
          className="history-button"
          onClick={onHistoryClick}
        >
          View Assessment History →
        </button>

      </div>


      {/* ==================================================
          INFORMATION STRIP
          ================================================== */}

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
              Predictions are designed to support healthcare assessment.
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

    </div>
  )
}

export default Home