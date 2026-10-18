import { useEffect, useState } from 'react'
import '../styles/PregnancyOverview.css'

function PregnancyOverview({
  user,
  onBack,
  onTrimesterChange,
}) {
  const [lmpDate, setLmpDate] = useState('')
  const [pregnancyInfo, setPregnancyInfo] = useState(null)

  useEffect(() => {
    if (!user?.id) {
      setLmpDate('')
      setPregnancyInfo(null)
      return
    }

    const savedLmpDate = localStorage.getItem(
      `pregnancyLmpDate_${user.id}`
    )

    const savedPregnancyInfo = localStorage.getItem(
      `pregnancyInfo_${user.id}`
    )

    if (savedLmpDate) {
      setLmpDate(savedLmpDate)
    } else {
      setLmpDate('')
    }

    if (savedPregnancyInfo) {
      try {
        setPregnancyInfo(
          JSON.parse(savedPregnancyInfo)
        )
      } catch (error) {
        console.error(
          'Unable to read pregnancy information:',
          error
        )
        setPregnancyInfo(null)
      }
    } else {
      setPregnancyInfo(null)
    }
  }, [user])

  const calculatePregnancy = () => {
    if (!lmpDate || !user?.id) {
      return
    }

    // Force date matching using local timezone parameters
    // to prevent calendar shifting
    const [year, month, day] = lmpDate.split('-')

    const lmp = new Date(
      year,
      month - 1,
      day
    )

    const today = new Date()

    // Reset time on today's date for exact day boundaries
    today.setHours(0, 0, 0, 0)

    const differenceInDays = Math.floor(
      (today - lmp) /
        (1000 * 60 * 60 * 24)
    )

    const pregnancyDays = Math.max(
      differenceInDays,
      0
    )

    const weeks = Math.floor(
      pregnancyDays / 7
    )

    const days = pregnancyDays % 7

    const dueDate = new Date(lmp)

    dueDate.setDate(
      dueDate.getDate() + 280
    )

    let trimester = ''

    if (weeks < 14) {
      trimester = 'First Trimester'
    } else if (weeks < 28) {
      trimester = 'Second Trimester'
    } else {
      trimester = 'Third Trimester'
    }

    if (onTrimesterChange) {
      onTrimesterChange(trimester)
    }

    const progress = Math.min(
      Math.round(
        (pregnancyDays / 280) * 100
      ),
      100
    )

    const remainingWeeks = Math.max(
      Math.ceil(
        (280 - pregnancyDays) / 7
      ),
      0
    )

    const calculatedInfo = {
      weeks,
      days,
      dueDate:
        dueDate.toLocaleDateString(
          'en-IN',
          {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }
        ),
      trimester,
      progress,
      remainingWeeks,
    }

    setPregnancyInfo(
      calculatedInfo
    )

    // Save pregnancy information
    // separately for the logged-in user
    localStorage.setItem(
      `pregnancyLmpDate_${user.id}`,
      lmpDate
    )

    localStorage.setItem(
      `pregnancyInfo_${user.id}`,
      JSON.stringify(
        calculatedInfo
      )
    )
  }

  return (
    <section className="pregnancy-page">

      {/* ========================================
          HEADER
          ======================================== */}
      <div className="pregnancy-page-header">
        <div>
          <span className="section-label">
            PREGNANCY TRACKING
          </span>

          <h2>
            Pregnancy Overview
          </h2>

          <p>
            Track your pregnancy progress, trimester and
            estimated due date using your last menstrual period.
          </p>
        </div>

        <button
          className="pregnancy-back-button"
          onClick={onBack}
        >
          ← Back to Home
        </button>
      </div>

      {/* ========================================
          MAIN CARD
          ======================================== */}
      <div className="pregnancy-main-card">

        <div className="pregnancy-card-heading">
          <div>
            <span className="pregnancy-label">
              PREGNANCY OVERVIEW
            </span>

            <h3>
              Track Your Pregnancy
            </h3>

            <p>
              Enter your last menstrual period to calculate
              your pregnancy progress.
            </p>
          </div>

          <div className="pregnancy-large-icon">
            🩺
          </div>
        </div>

        {/* ========================================
            LMP INPUT
            ======================================== */}
        <div className="pregnancy-input-section">

          <label htmlFor="lmp-date">
            Last Menstrual Period
          </label>

          <div className="pregnancy-input-row">

            <input
              id="lmp-date"
              type="date"
              value={lmpDate}
              onChange={(event) =>
                setLmpDate(
                  event.target.value
                )
              }
            />

            <button
              type="button"
              className="pregnancy-calculate-button"
              onClick={calculatePregnancy}
              disabled={!lmpDate}
            >
              Calculate
              <span>→</span>
            </button>

          </div>
        </div>

        {/* ========================================
            RESULTS
            ======================================== */}
        {pregnancyInfo && (
          <>

            <div className="pregnancy-results">

              {/* DUE DATE */}
              <div className="pregnancy-result-card due-date-card">

                <div className="result-card-icon">
                  📅
                </div>

                <span>
                  Estimated Due Date
                </span>

                <strong>
                  {pregnancyInfo.dueDate}
                </strong>

              </div>

              {/* WEEK */}
              <div className="pregnancy-result-card">

                <div className="result-card-icon">
                  🌸
                </div>

                <span>
                  Pregnancy Week
                </span>

                <strong>
                  Week {pregnancyInfo.weeks}
                </strong>

                <small>
                  {pregnancyInfo.days} day
                  {pregnancyInfo.days !== 1
                    ? 's'
                    : ''}
                </small>

              </div>

              {/* TRIMESTER */}
              <div className="pregnancy-result-card">

                <div className="result-card-icon">
                  🦭
                </div>

                <span>
                  Current Trimester
                </span>

                <strong>
                  {pregnancyInfo.trimester}
                </strong>

              </div>

            </div>

            {/* ========================================
                PROGRESS
                ======================================== */}
            <div className="pregnancy-progress-card">

              <div className="progress-header">

                <div>
                  <span>
                    PREGNANCY PROGRESS
                  </span>

                  <h3>
                    Week {pregnancyInfo.weeks} of 40
                  </h3>
                </div>

                <strong>
                  {pregnancyInfo.progress}%
                </strong>

              </div>

              <div className="progress-track">

                <div
                  className="progress-fill"
                  style={{
                    width: `${pregnancyInfo.progress}%`,
                  }}
                ></div>

              </div>

              <div className="progress-footer">

                <span>
                  Start
                </span>

                <strong>
                  {pregnancyInfo.remainingWeeks}{' '}
                  weeks remaining
                </strong>

                <span>
                  40 weeks
                </span>

              </div>

            </div>

            {/* ========================================
                INFORMATION
                ======================================== */}
            <div className="pregnancy-info-strip">

              <div>

                <span className="pregnancy-info-icon">
                  📅
                </span>

                <div>

                  <strong>
                    Due Date
                  </strong>

                  <p>
                    Your estimated delivery date is based
                    on a 280-day pregnancy period.
                  </p>

                </div>

              </div>

              <div>

                <span className="pregnancy-info-icon">
                  🌸
                </span>

                <div>

                  <strong>
                    Trimester
                  </strong>

                  <p>
                    Your trimester is calculated from your
                    current pregnancy week.
                  </p>

                </div>

              </div>

              <div>

                <span className="pregnancy-info-icon">
                  📈
                </span>

                <div>

                  <strong>
                    Progress
                  </strong>

                  <p>
                    Track how far along your pregnancy is
                    toward 40 weeks.
                  </p>

                </div>

              </div>

            </div>

          </>
        )}

      </div>

      {/* ========================================
          DISCLAIMER
          ======================================== */}
      <div className="pregnancy-disclaimer">

        <span>⚕</span>

        <p>
          Pregnancy dates and progress shown here are
          estimates for educational and monitoring purposes.
        </p>

      </div>

    </section>
  )
}

export default PregnancyOverview