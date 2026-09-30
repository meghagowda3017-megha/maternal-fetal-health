import { useEffect, useState } from 'react'
import './App.css'

import Home from './pages/Home'
import MaternalAssessment from './pages/MaternalAssessment'
import History from './pages/History'
import PregnancyOverview from './components/PregnancyOverview'
import TrimesterWellness from './components/TrimesterWellness'
import DailyWellness from './components/DailyWellness'
import MaternalWellnessDashboard from './components/MaternalWellnessDashboard'
import Nutrition from './components/Nutrition'
import ActivityExercise from './components/ActivityExercise'

function App() {
  // ==================================================
  // PAGE STATES
  // ==================================================

  const [showMaternalForm, setShowMaternalForm] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showPregnancy, setShowPregnancy] = useState(false)
  const [showWellness, setShowWellness] = useState(false)
  const [showDailyWellness, setShowDailyWellness] = useState(false)
  const [showWellnessDashboard, setShowWellnessDashboard] =
    useState(false)
  const [showNutrition, setShowNutrition] = useState(false)
  const [showActivity, setShowActivity] = useState(false)

  // ==================================================
  // SELECTED TRIMESTER
  // ==================================================

  const [selectedWellnessTrimester, setSelectedWellnessTrimester] =
    useState(
      localStorage.getItem('selectedWellnessTrimester') ||
        'First Trimester'
    )

  // ==================================================
  // MATERNAL ASSESSMENT HISTORY
  // ==================================================

  const [history, setHistory] = useState(() => {
    const savedHistory =
      localStorage.getItem('assessmentHistory')

    return savedHistory
      ? JSON.parse(savedHistory)
      : []
  })

  // ==================================================
  // WELLNESS HISTORY
  // ==================================================

  const [wellnessHistory, setWellnessHistory] = useState(() => {
    const savedWellnessHistory =
      localStorage.getItem('wellnessHistory')

    return savedWellnessHistory
      ? JSON.parse(savedWellnessHistory)
      : []
  })

  // ==================================================
  // NUTRITION HISTORY
  // ==================================================

  const [nutritionHistory, setNutritionHistory] = useState(() => {
    const savedNutritionHistory =
      localStorage.getItem('nutritionHistory')

    return savedNutritionHistory
      ? JSON.parse(savedNutritionHistory)
      : []
  })

  // ==================================================
  // ACTIVITY HISTORY
  // ==================================================

  const [activityHistory, setActivityHistory] = useState(() => {
    const savedActivityHistory =
      localStorage.getItem('activityHistory')

    return savedActivityHistory
      ? JSON.parse(savedActivityHistory)
      : []
  })

  // ==================================================
  // SAVE MATERNAL ASSESSMENT HISTORY
  // ==================================================

  useEffect(() => {
    localStorage.setItem(
      'assessmentHistory',
      JSON.stringify(history)
    )
  }, [history])

  // ==================================================
  // SAVE WELLNESS HISTORY
  // ==================================================

  useEffect(() => {
    localStorage.setItem(
      'wellnessHistory',
      JSON.stringify(wellnessHistory)
    )
  }, [wellnessHistory])

  // ==================================================
  // SAVE NUTRITION HISTORY
  // ==================================================

  useEffect(() => {
    localStorage.setItem(
      'nutritionHistory',
      JSON.stringify(nutritionHistory)
    )
  }, [nutritionHistory])

  // ==================================================
  // SAVE ACTIVITY HISTORY
  // ==================================================

  useEffect(() => {
    localStorage.setItem(
      'activityHistory',
      JSON.stringify(activityHistory)
    )
  }, [activityHistory])

  // ==================================================
  // OPEN MATERNAL ASSESSMENT
  // ==================================================

  const openMaternalForm = () => {
    setShowMaternalForm(true)
    setShowHistory(false)
    setShowPregnancy(false)
    setShowWellness(false)
    setShowDailyWellness(false)
    setShowWellnessDashboard(false)
    setShowNutrition(false)
    setShowActivity(false)
  }

  // ==================================================
  // OPEN PREGNANCY OVERVIEW
  // ==================================================

  const openPregnancy = () => {
    setShowMaternalForm(false)
    setShowHistory(false)
    setShowPregnancy(true)
    setShowWellness(false)
    setShowDailyWellness(false)
    setShowWellnessDashboard(false)
    setShowNutrition(false)
    setShowActivity(false)
  }

  // ==================================================
  // OPEN TRIMESTER WELLNESS
  // ==================================================

  const openWellness = () => {
    setShowMaternalForm(false)
    setShowHistory(false)
    setShowPregnancy(false)
    setShowWellness(true)
    setShowDailyWellness(false)
    setShowWellnessDashboard(false)
    setShowNutrition(false)
    setShowActivity(false)
  }

  // ==================================================
  // OPEN DAILY WELLNESS
  // ==================================================

  const openDailyWellness = () => {
    setShowMaternalForm(false)
    setShowHistory(false)
    setShowPregnancy(false)
    setShowWellness(false)
    setShowDailyWellness(true)
    setShowWellnessDashboard(false)
    setShowNutrition(false)
    setShowActivity(false)
  }

  // ==================================================
  // OPEN WELLNESS DASHBOARD
  // ==================================================

  const openWellnessDashboard = () => {
    setShowMaternalForm(false)
    setShowHistory(false)
    setShowPregnancy(false)
    setShowWellness(false)
    setShowDailyWellness(false)
    setShowWellnessDashboard(true)
    setShowNutrition(false)
    setShowActivity(false)
  }

  // ==================================================
  // OPEN HISTORY
  // ==================================================

  const openHistory = () => {
    setShowMaternalForm(false)
    setShowHistory(true)
    setShowPregnancy(false)
    setShowWellness(false)
    setShowDailyWellness(false)
    setShowWellnessDashboard(false)
    setShowNutrition(false)
    setShowActivity(false)
  }

  // ==================================================
  // OPEN NUTRITION
  // ==================================================

  const openNutrition = () => {
    setShowMaternalForm(false)
    setShowHistory(false)
    setShowPregnancy(false)
    setShowWellness(false)
    setShowDailyWellness(false)
    setShowWellnessDashboard(false)
    setShowNutrition(true)
    setShowActivity(false)
  }

  // ==================================================
  // OPEN ACTIVITY & EXERCISE
  // ==================================================

  const openActivity = () => {
    setShowMaternalForm(false)
    setShowHistory(false)
    setShowPregnancy(false)
    setShowWellness(false)
    setShowDailyWellness(false)
    setShowWellnessDashboard(false)
    setShowNutrition(false)
    setShowActivity(true)
  }

  // ==================================================
  // TRIMESTER CHANGE
  // ==================================================

  const handleTrimesterChange = (trimester) => {
    setSelectedWellnessTrimester(trimester)

    localStorage.setItem(
      'selectedWellnessTrimester',
      trimester
    )
  }

  // ==================================================
  // GO HOME
  // ==================================================

  const goHome = () => {
    setShowMaternalForm(false)
    setShowHistory(false)
    setShowPregnancy(false)
    setShowWellness(false)
    setShowDailyWellness(false)
    setShowWellnessDashboard(false)
    setShowNutrition(false)
    setShowActivity(false)
  }

  // ==================================================
  // CLOSE MATERNAL
  // ==================================================

  const closeMaternalForm = () => {
    setShowMaternalForm(false)
  }

  // ==================================================
  // CLOSE PREGNANCY
  // ==================================================

  const closePregnancyOverview = () => {
    setShowPregnancy(false)
  }

  // ==================================================
  // CLOSE DAILY WELLNESS
  // ==================================================

  const closeDailyWellness = () => {
    setShowDailyWellness(false)
  }

  // ==================================================
  // CLOSE TRIMESTER WELLNESS
  // ==================================================

  const closeWellness = () => {
    setShowWellness(false)
  }

  // ==================================================
  // CLOSE WELLNESS DASHBOARD
  // ==================================================

  const closeWellnessDashboard = () => {
    setShowWellnessDashboard(false)
  }

  // ==================================================
  // CLOSE NUTRITION
  // ==================================================

  const closeNutrition = () => {
    setShowNutrition(false)
  }

  // ==================================================
  // CLOSE ACTIVITY & EXERCISE
  // ==================================================

  const closeActivity = () => {
    setShowActivity(false)
  }

  // ==================================================
  // MATERNAL ASSESSMENT HISTORY FUNCTIONS
  // ==================================================

  const clearHistory = () => {
    setHistory([])
  }

  const deleteHistoryItem = (id) => {
    setHistory((previous) =>
      previous.filter(
        (item) => item.id !== id
      )
    )
  }

  const addHistoryItem = (item) => {
    setHistory((previous) => [
      item,
      ...previous,
    ])
  }

  // ==================================================
  // WELLNESS HISTORY FUNCTIONS
  // ==================================================

  const addWellnessHistory = (checkIn) => {
    setWellnessHistory((previous) => {
      const existingEntry = previous.find(
        (item) =>
          item.selectedDate ===
          checkIn.selectedDate
      )

      if (!existingEntry) {
        return [
          checkIn,
          ...previous,
        ]
      }

      const updatedEntry = {
        ...checkIn,
        id: existingEntry.id,
      }

      return [
        updatedEntry,
        ...previous.filter(
          (item) =>
            item.selectedDate !==
            checkIn.selectedDate
        ),
      ]
    })
  }

  const clearWellnessHistory = () => {
    setWellnessHistory([])
  }

  const deleteWellnessHistoryItem = (id) => {
    setWellnessHistory((previous) =>
      previous.filter(
        (item) => item.id !== id
      )
    )
  }

  // ==================================================
  // NUTRITION HISTORY FUNCTIONS
  // ==================================================

  const addNutritionHistory = (entry) => {
    setNutritionHistory((previous) => {
      const existingEntry = previous.find(
        (item) =>
          item.selectedDate ===
          entry.selectedDate
      )

      if (!existingEntry) {
        return [
          entry,
          ...previous,
        ]
      }

      const updatedEntry = {
        ...entry,
        id: existingEntry.id,
      }

      return [
        updatedEntry,
        ...previous.filter(
          (item) =>
            item.selectedDate !==
            entry.selectedDate
        ),
      ]
    })
  }

  const clearNutritionHistory = () => {
    setNutritionHistory([])
  }

  const deleteNutritionHistoryItem = (id) => {
    setNutritionHistory((previous) =>
      previous.filter(
        (item) => item.id !== id
      )
    )
  }

  // ==================================================
  // ACTIVITY HISTORY FUNCTIONS
  // ==================================================

  const addActivityHistory = (entry) => {
    setActivityHistory((previous) => {
      const existingEntry = previous.find(
        (item) =>
          item.selectedDate ===
          entry.selectedDate
      )

      if (!existingEntry) {
        return [
          entry,
          ...previous,
        ]
      }

      const updatedEntry = {
        ...entry,
        id: existingEntry.id,
      }

      return [
        updatedEntry,
        ...previous.filter(
          (item) =>
            item.selectedDate !==
            entry.selectedDate
        ),
      ]
    })
  }

  const clearActivityHistory = () => {
    setActivityHistory([])
  }

  const deleteActivityHistoryItem = (id) => {
    setActivityHistory((previous) =>
      previous.filter(
        (item) => item.id !== id
      )
    )
  }

  // ==================================================
  // PREGNANCY INFORMATION
  // ==================================================

  const getPregnancyInfo = () => {
    const savedPregnancyInfo =
      localStorage.getItem('pregnancyInfo')

    if (!savedPregnancyInfo) {
      return null
    }

    try {
      return JSON.parse(savedPregnancyInfo)
    } catch (error) {
      console.error(
        'Unable to read pregnancy information:',
        error
      )

      return null
    }
  }

  // ==================================================
  // RETURN
  // ==================================================

  return (
    <div className="app">

      {/* ==================================================
          HEADER
          ================================================== */}

      <header className="header">

        <div className="header-content">

          <div
            className="brand-icon"
            onClick={goHome}
            style={{ cursor: 'pointer' }}
          >
            ♥
          </div>

          <div>

            <h1
              onClick={goHome}
              style={{ cursor: 'pointer' }}
            >
              Maternal Health and Wellness
            </h1>

            <p>
              Pregnancy Health &amp; Wellness System
            </p>

          </div>

        </div>

        <div className="system-status">

          <span className="status-dot"></span>

          System Ready

        </div>

      </header>

      {/* ==================================================
          MAIN
          ================================================== */}

      <main className="dashboard">

        {/* ==================================================
            HOME
            ================================================== */}

        {!showMaternalForm &&
          !showHistory &&
          !showPregnancy &&
          !showWellness &&
          !showDailyWellness &&
          !showWellnessDashboard &&
          !showNutrition &&
          !showActivity && (

            <Home
              onMaternalClick={openMaternalForm}
              onHistoryClick={openHistory}
              onPregnancyClick={openPregnancy}
              onWellnessClick={openWellness}
              onDailyWellnessClick={
                openDailyWellness
              }
              onWellnessDashboardClick={
                openWellnessDashboard
              }
              onNutritionClick={openNutrition}
              onActivityClick={openActivity}
            />

          )}

        {/* ==================================================
            MATERNAL ASSESSMENT
            ================================================== */}

        {showMaternalForm && (

          <MaternalAssessment
            onBack={closeMaternalForm}
            onSaveHistory={addHistoryItem}
          />

        )}

        {/* ==================================================
            PREGNANCY OVERVIEW
            ================================================== */}

        {showPregnancy && (

          <PregnancyOverview
            onBack={closePregnancyOverview}
            onTrimesterChange={
              handleTrimesterChange
            }
          />

        )}

        {/* ==================================================
            HISTORY
            ================================================== */}

        {showHistory && (

          <History
            history={history}
            wellnessHistory={wellnessHistory}
            nutritionHistory={nutritionHistory}
            activityHistory={activityHistory}
            onBack={goHome}
            onClear={clearHistory}
            onDelete={deleteHistoryItem}
            onClearWellness={
              clearWellnessHistory
            }
            onDeleteWellness={
              deleteWellnessHistoryItem
            }
            onClearNutrition={
              clearNutritionHistory
            }
            onDeleteNutrition={
              deleteNutritionHistoryItem
            }
            onClearActivity={
              clearActivityHistory
            }
            onDeleteActivity={
              deleteActivityHistoryItem
            }
          />

        )}

        {/* ==================================================
            TRIMESTER WELLNESS
            ================================================== */}

        {showWellness && (

          <TrimesterWellness
            onBack={closeWellness}
            initialTrimester={
              selectedWellnessTrimester
            }
          />

        )}

        {/* ==================================================
            DAILY WELLNESS
            ================================================== */}

        {showDailyWellness && (

          <DailyWellness
            wellnessHistory={wellnessHistory}
            onBack={closeDailyWellness}
            onSaveWellness={
              addWellnessHistory
            }
          />

        )}

        {/* ==================================================
            MATERNAL WELLNESS DASHBOARD
            ================================================== */}

        {showWellnessDashboard && (

          <MaternalWellnessDashboard
              wellnessHistory={wellnessHistory}
              pregnancyInfo={getPregnancyInfo()}
              nutritionHistory={nutritionHistory}
              activityHistory={activityHistory}
              maternalHistory={history}
              onBack={closeWellnessDashboard}
              onNutritionClick={openNutrition}
              onActivityClick={openActivity}
            />
        )}

        {/* ==================================================
            NUTRITION
            ================================================== */}

        {showNutrition && (

          <Nutrition
              nutritionHistory={
                nutritionHistory
              }
              maternalHistory={
                history
              }
              wellnessHistory={
                wellnessHistory
              }
              onSaveNutrition={
                addNutritionHistory
              }
              onBack={
                closeNutrition
              }
            />

        )}

        {/* ==================================================
            ACTIVITY & EXERCISE
            ================================================== */}

        {showActivity && (

          <ActivityExercise
            activityHistory={
              activityHistory
            }
            onSaveActivity={
              addActivityHistory
            }
            onBack={
              closeActivity
            }
          />

        )}

      </main>

      {/* ==================================================
          FOOTER
          ================================================== */}

      <footer className="footer">

        <p>
          Maternal Health and Wellness System
        </p>

        <span>
          For educational and decision-support
          purposes only.
        </span>

      </footer>

    </div>
  )
}

export default App