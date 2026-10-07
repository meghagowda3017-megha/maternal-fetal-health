import './Home.css'

function Home({
  user,
  onMaternalClick,
  onHistoryClick,
  onPregnancyClick,
  onWellnessClick,
  onDailyWellnessClick,
  onWellnessDashboardClick,
  onNutritionClick,
  onActivityClick,
  onDoctorReportClick
}) {
  return (
    <div className="home-page">

      {/* ==================================================
          WELCOME
          ================================================== */}

      <section className="welcome">

        <span className="welcome-label">
          MATERNAL HEALTH &amp; WELLNESS
        </span>

        <h2>
          Welcome, {user?.name}!
        </h2>

        <p>
          Support your pregnancy journey with maternal health
          assessment, daily wellness tracking, nutrition,
          activity guidance and personalized pregnancy care.
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
              Nutrition &amp; Pregnancy
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
              Activity &amp; Exercise
            </h3>

            <p>
              Explore pregnancy-friendly movement, gentle exercises,
              relaxation activities and wellness guidance.
            </p>

            <div className="card-features">

              <span>🚶 Walking</span>
              <span>🧘 Yoga</span>
              <span>🤸 Stretching</span>

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
          MATERNAL HEALTH ASSESSMENT
          ================================================== */}

      <section className="prediction-grid">

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
          View Health &amp; Wellness History →
        </button>

        <button
          type="button"
          className="doctor-report-button"
          onClick={onDoctorReportClick}
        >
          🩺 Generate Doctor Visit Report →
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
              Secure Information
            </strong>

            <p>
              Your wellness information is stored locally.
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
              Guidance is designed to support maternal health monitoring.
            </p>

          </div>

        </div>


        <div>

          <span className="info-icon">
            ✓
          </span>

          <div>

            <strong>
              Personalized Wellness
            </strong>

            <p>
              Wellness guidance adapts to your pregnancy journey.
            </p>

          </div>

        </div>

      </section>

    </div>
  )
}

export default Home