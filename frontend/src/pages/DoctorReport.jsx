import { useState } from 'react'
import '../styles/DoctorReport.css'

function DoctorReport({
  user,
  pregnancyInfo,
  maternalHistory,
  wellnessHistory,
  nutritionHistory,
  activityHistory,
  onBack,
}) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerateReport = async () => {
    setError('')

    if (!startDate || !endDate) {
      setError('Please select both start date and end date.')
      return
    }

    if (startDate > endDate) {
      setError('Start date cannot be after end date.')
      return
    }

    try {
      setLoading(true)

      const response = await fetch(
        'http://127.0.0.1:8000/doctor-report/pdf',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
          patient_name: user?.name || 'Patient',

          start_date: startDate,
          end_date: endDate,

          pregnancy_info:
            pregnancyInfo || {},

          maternal_history:
            maternalHistory || [],

          wellness_history:
            wellnessHistory || [],

          nutrition_history:
            nutritionHistory || [],

          activity_history:
            activityHistory || [],
        }),
        }
      )

      if (!response.ok) {
        throw new Error(
          'Unable to generate the doctor report.'
        )
      }

      const blob = await response.blob()

      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')

      link.href = url

      link.download =
        `doctor_visit_report_${startDate}_${endDate}.pdf`

      document.body.appendChild(link)

      link.click()

      link.remove()

      window.URL.revokeObjectURL(url)

    } catch (error) {
      console.error(
        'Doctor report error:',
        error
      )

      setError(
        'Unable to generate the report. Please make sure the backend is running.'
      )

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="doctor-report-page">

      <div className="doctor-report-container">

        <button
          className="doctor-report-back"
          onClick={onBack}
        >
          ← Back
        </button>

        <div className="doctor-report-header">

          <div className="doctor-report-icon">
            🩺
          </div>

          <h1>
            Doctor Visit Report
          </h1>

          <p>
            Generate a summary of your maternal
            health and wellness information for
            a selected period.
          </p>

        </div>

        <div className="doctor-report-form">

          <h2>
            Select Report Period
          </h2>

          <p className="doctor-report-help">
            Choose the dates you want to include
            in the report.
          </p>

          <div className="doctor-report-dates">

            <div className="doctor-report-field">

              <label>
                Start Date
              </label>

              <input
                type="date"
                value={startDate}
                onChange={(event) =>
                  setStartDate(
                    event.target.value
                  )
                }
              />

            </div>

            <div className="doctor-report-field">

              <label>
                End Date
              </label>

              <input
                type="date"
                value={endDate}
                onChange={(event) =>
                  setEndDate(
                    event.target.value
                  )
                }
              />

            </div>

          </div>

          {error && (
            <div className="doctor-report-error">
              {error}
            </div>
          )}

          <div className="doctor-report-data">

            <h3>
              Information Included
            </h3>

            <div className="doctor-report-data-list">

              <span>
                ✓ Pregnancy information
              </span>

              <span>
                ✓ Maternal health assessments
              </span>

              <span>
                ✓ Daily wellness check-ins
              </span>

              <span>
                ✓ Nutrition records
              </span>

              <span>
                ✓ Activity records
              </span>

            </div>

          </div>

          <button
            className="doctor-report-generate"
            onClick={handleGenerateReport}
            disabled={loading}
          >
            {loading
              ? 'Generating Report...'
              : 'Generate & Download PDF →'}
          </button>

        </div>

        <p className="doctor-report-note">
          This report summarizes information
          entered into the Maternal Health and
          Wellness system. It is intended to
          support discussion with a healthcare
          professional and does not replace
          medical evaluation.
        </p>

      </div>

    </div>
  )
}

export default DoctorReport