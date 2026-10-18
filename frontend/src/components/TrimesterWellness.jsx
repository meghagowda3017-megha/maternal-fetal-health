import { useState } from 'react'
import '../styles/TrimesterWellness.css'

function TrimesterWellness({
  onBack,
  initialTrimester,
}) {
  const [selectedTrimester, setSelectedTrimester] =
    useState(initialTrimester || 'First Trimester')

  const wellnessData = {
    'First Trimester': {
      icon: '🌸',
      weeks: 'Weeks 1–13',
      description:
        'Focus on gentle wellness habits, balanced nutrition and adequate rest during the early stages of pregnancy.',

      nutrition: [
        'Eat small, balanced meals throughout the day.',
        'Include fruits, vegetables and whole grains.',
        'Choose protein-rich foods such as eggs, beans and lentils.',
        'Stay hydrated throughout the day.',
      ],

      wellness: [
        'Take adequate rest when you feel tired.',
        'Try gentle activities such as walking.',
        'Maintain a regular sleep routine.',
        'Avoid activities that feel physically uncomfortable.',
      ],

      tips: [
        'Keep regular prenatal appointments.',
        'Take only supplements recommended by your healthcare professional.',
        'Listen to your body and rest when needed.',
      ],
    },

    'Second Trimester': {
      icon: '🌿',
      weeks: 'Weeks 14–27',
      description:
        'The second trimester is a good time to maintain balanced nutrition, gentle activity and healthy daily routines.',

      nutrition: [
        'Include a variety of vegetables and fruits.',
        'Choose protein-rich foods with regular meals.',
        'Include calcium-rich foods in your diet.',
        'Continue drinking enough water throughout the day.',
      ],

      wellness: [
        'Continue gentle physical activity if appropriate.',
        'Take regular breaks and avoid overexertion.',
        'Practice comfortable stretching or pregnancy-friendly movement.',
        'Maintain a consistent sleep schedule.',
      ],

      tips: [
        'Continue attending prenatal check-ups.',
        'Discuss any new symptoms or concerns with your healthcare professional.',
        'Adjust activities according to your comfort level.',
      ],
    },

    'Third Trimester': {
      icon: '🌼',
      weeks: 'Weeks 28–40',
      description:
        'During the third trimester, focus on comfort, rest, nutrition and preparing for the final stages of pregnancy.',

      nutrition: [
        'Continue eating balanced meals with protein and vegetables.',
        'Include iron-rich foods as recommended.',
        'Choose nutritious snacks when needed.',
        'Maintain good hydration.',
      ],

      wellness: [
        'Prioritize adequate rest and comfortable sleep.',
        'Continue gentle activity when appropriate.',
        'Avoid overexertion and listen to your body.',
        'Use comfortable positions during daily activities.',
      ],

      tips: [
        'Keep your prenatal appointments.',
        'Discuss delivery preparation with your healthcare professional.',
        'Ask your healthcare professional about any concerning symptoms.',
      ],
    },
  }

  const currentData = wellnessData[selectedTrimester]

  return (
    <section className="trimester-wellness">
        <button
            className="wellness-back-button"
            onClick={onBack}
            >
            ← Back to Home
        </button>

      {/* HEADER */}

      <div className="wellness-header">

        <div>

          <span className="section-label">
            WELLNESS GUIDANCE
          </span>

          <h2>
            Trimester Wellness
          </h2>

          <p>
            Explore general nutrition, wellness and pregnancy-care
            suggestions for each stage of pregnancy.
          </p>

        </div>

        <div className="wellness-header-icon">
          🌷
        </div>

      </div>


      {/* TRIMESTER SELECTOR */}

      <div className="trimester-selector">

        {Object.keys(wellnessData).map((trimester) => (

          <button
            key={trimester}
            className={
              selectedTrimester === trimester
                ? 'trimester-tab active'
                : 'trimester-tab'
            }
            onClick={() => setSelectedTrimester(trimester)}
          >
            {wellnessData[trimester].icon}

            <span>
              {trimester}
            </span>
          </button>

        ))}

      </div>


      {/* CURRENT TRIMESTER */}

      <div className="wellness-main-card">

        <div className="wellness-main-header">

          <div className="wellness-stage-icon">
            {currentData.icon}
          </div>

          <div>

            <span>
              CURRENT STAGE
            </span>

            <h3>
              {selectedTrimester}
            </h3>

            <strong>
              {currentData.weeks}
            </strong>

          </div>

        </div>

        <p className="wellness-description">
          {currentData.description}
        </p>


        {/* WELLNESS COLUMNS */}

        <div className="wellness-grid">

          {/* NUTRITION */}

          <div className="wellness-card nutrition-card">

            <div className="wellness-card-title">

              <div className="wellness-card-icon">
                🥗
              </div>

              <div>

                <h3>
                  Nutrition
                </h3>

                <span>
                  Healthy eating guidance
                </span>

              </div>

            </div>

            <ul>

              {currentData.nutrition.map((item, index) => (

                <li key={index}>
                  <span>✓</span>
                  {item}
                </li>

              ))}

            </ul>

          </div>


          {/* WELLNESS */}

          <div className="wellness-card activity-card">

            <div className="wellness-card-title">

              <div className="wellness-card-icon">
                🧘
              </div>

              <div>

                <h3>
                  Wellness
                </h3>

                <span>
                  Daily wellness habits
                </span>

              </div>

            </div>

            <ul>

              {currentData.wellness.map((item, index) => (

                <li key={index}>
                  <span>✓</span>
                  {item}
                </li>

              ))}

            </ul>

          </div>

        </div>


        {/* TIPS */}

        <div className="wellness-tips">

          <div className="tips-icon">
            💡
          </div>

          <div>

            <h3>
              Helpful Tips
            </h3>

            <ul>

              {currentData.tips.map((tip, index) => (

                <li key={index}>
                  {tip}
                </li>

              ))}

            </ul>

          </div>

        </div>

      </div>


      {/* DISCLAIMER */}

      <div className="wellness-disclaimer">

        <span>
          ⚕
        </span>

        <p>
          These suggestions are general educational information and
          are not a substitute for personalized medical advice.
          Always follow guidance from your healthcare professional.
        </p>

      </div>

    </section>
  )
}

export default TrimesterWellness