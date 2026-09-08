import { useEffect, useState } from 'react'
import './App.css'

import Home from './pages/Home'
import MaternalAssessment from './pages/MaternalAssessment'
import FetalAssessment from './pages/FetalAssessment'
import History from './pages/History'
import PregnancyOverview from './components/PregnancyOverview'
import TrimesterWellness from './components/TrimesterWellness'
import DailyWellness from './components/DailyWellness'
import MaternalWellnessDashboard from './components/MaternalWellnessDashboard'
import Nutrition from './components/Nutrition'

function App() {
  // ==================================================
  // PAGE STATES
  // ==================================================

  const [showMaternalForm, setShowMaternalForm] = useState(false)
  const [showFetalForm, setShowFetalForm] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showPregnancy, setShowPregnancy] = useState(false)
  const [showWellness, setShowWellness] = useState(false)
  const [showDailyWellness, setShowDailyWellness] = useState(false)
  const [showWellnessDashboard, setShowWellnessDashboard] = useState(false)
  const [showNutrition, setShowNutrition] = useState(false)

  // ==================================================
  // SELECTED TRIMESTER
  // ==================================================

  const [selectedWellnessTrimester, setSelectedWellnessTrimester] =
    useState(
      localStorage.getItem('selectedWellnessTrimester') ||
      'First Trimester'
    )

  // ==================================================
  // ASSESSMENT HISTORY
  // ==================================================

  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem('assessmentHistory')

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
  // SAVE ASSESSMENT HISTORY TO LOCAL STORAGE
  // ==================================================

  useEffect(() => {
    localStorage.setItem(
      'assessmentHistory',
      JSON.stringify(history)
    )
  }, [history])

  // ==================================================
  // SAVE WELLNESS HISTORY TO LOCAL STORAGE
  // ==================================================

  useEffect(() => {
    localStorage.setItem(
      'wellnessHistory',
      JSON.stringify(wellnessHistory)
    )
  }, [wellnessHistory])

  // ==================================================
  // SAVE NUTRITION HISTORY TO LOCAL STORAGE
  // ==================================================

  useEffect(() => {
    localStorage.setItem(
      'nutritionHistory',
      JSON.stringify(nutritionHistory)
    )
  }, [nutritionHistory])

  // ==================================================
  // OPEN MATERNAL ASSESSMENT
  // ==================================================

  const openMaternalForm = () => {
    setShowMaternalForm(true)
    setShowFetalForm(false)
    setShowHistory(false)
    setShowPregnancy(false)
    setShowWellness(false)
    setShowDailyWellness(false)
    setShowWellnessDashboard(false)
    setShowNutrition(false)
  }

  // ==================================================
  // OPEN FETAL ASSESSMENT
  // ==================================================

  const openFetalForm = () => {
    setShowMaternalForm(false)
    setShowFetalForm(true)
    setShowHistory(false)
    setShowPregnancy(false)
    setShowWellness(false)
    setShowDailyWellness(false)
    setShowWellnessDashboard(false)
    setShowNutrition(false)
  }

  // ==================================================
  // OPEN PREGNANCY OVERVIEW
  // ==================================================

  const openPregnancy = () => {
    setShowMaternalForm(false)
    setShowFetalForm(false)
    setShowHistory(false)
    setShowPregnancy(true)
    setShowWellness(false)
    setShowDailyWellness(false)
    setShowWellnessDashboard(false)
    setShowNutrition(false)
  }

  // ==================================================
  // OPEN TRIMESTER WELLNESS
  // ==================================================

  const openWellness = () => {
    setShowMaternalForm(false)
    setShowFetalForm(false)
    setShowHistory(false)
    setShowPregnancy(false)
    setShowWellness(true)
    setShowDailyWellness(false)
    setShowWellnessDashboard(false)
    setShowNutrition(false)
  }

  // ==================================================
  // OPEN DAILY WELLNESS
  // ==================================================

  const openDailyWellness = () => {
    setShowMaternalForm(false)
    setShowFetalForm(false)
    setShowHistory(false)
    setShowPregnancy(false)
    setShowWellness(false)
    setShowDailyWellness(true)
    setShowWellnessDashboard(false)
    setShowNutrition(false)
  }

  // ==================================================
  // OPEN WELLNESS DASHBOARD
  // ==================================================

  const openWellnessDashboard = () => {
    setShowMaternalForm(false)
    setShowFetalForm(false)
    setShowHistory(false)
    setShowPregnancy(false)
    setShowWellness(false)
    setShowDailyWellness(false)
    setShowWellnessDashboard(true)
    setShowNutrition(false)
  }

  // ==================================================
  // OPEN HISTORY
  // ==================================================

  const openHistory = () => {
    setShowMaternalForm(false)
    setShowFetalForm(false)
    setShowHistory(true)
    setShowPregnancy(false)
    setShowWellness(false)
    setShowDailyWellness(false)
    setShowWellnessDashboard(false)
    setShowNutrition(false)
  }

  // ==================================================
  // OPEN NUTRITION
  // ==================================================

  const openNutrition = () => {
    setShowMaternalForm(false)
    setShowFetalForm(false)
    setShowHistory(false)
    setShowPregnancy(false)
    setShowWellness(false)
    setShowDailyWellness(false)
    setShowWellnessDashboard(false)
    setShowNutrition(true)
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
    setShowFetalForm(false)
    setShowHistory(false)
    setShowPregnancy(false)
    setShowWellness(false)
    setShowDailyWellness(false)
    setShowWellnessDashboard(false)
    setShowNutrition(false)
  }

  // ==================================================
  // CLOSE MATERNAL
  // ==================================================

  const closeMaternalForm = () => {
    setShowMaternalForm(false)
  }

  // ==================================================
  // CLOSE FETAL
  // ==================================================

  const closeFetalForm = () => {
    setShowFetalForm(false)
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
  // ASSESSMENT HISTORY FUNCTIONS
  // ==================================================

  const clearHistory = () => {
    setHistory([])
  }

  const deleteHistoryItem = (id) => {
    setHistory((previous) =>
      previous.filter((item) => item.id !== id)
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

      // Check whether this date already has a wellness entry
      const existingEntry = previous.find(
        (item) => item.selectedDate === checkIn.selectedDate
      )

      // If this is a new date, create a new entry
      if (!existingEntry) {
        return [
          checkIn,
          ...previous,
        ]
      }

      // Same date already exists:
      // replace the old entry instead of creating another one.
      // Keep the original ID so it remains the same record.
      const updatedEntry = {
        ...checkIn,
        id: existingEntry.id,
      }

      return [
        updatedEntry,
        ...previous.filter(
          (item) => item.selectedDate !== checkIn.selectedDate
        ),
      ]
    })
  }

  const clearWellnessHistory = () => {
    setWellnessHistory([])
  }

  const deleteWellnessHistoryItem = (id) => {
    setWellnessHistory((previous) =>
      previous.filter((item) => item.id !== id)
    )
  }

  // ==================================================
  // NUTRITION HISTORY FUNCTIONS
  // ==================================================

  const addNutritionHistory = (entry) => {
    setNutritionHistory((previous) => {

      // Check whether nutrition history already exists
      // for this date.
      const existingEntry = previous.find(
        (item) => item.selectedDate === entry.selectedDate
      )

      // New date → create a new nutrition history entry
      if (!existingEntry) {
        return [
          entry,
          ...previous,
        ]
      }

      // Same date → update the existing entry
      // instead of creating a duplicate.
      const updatedEntry = {
        ...entry,
        id: existingEntry.id,
      }

      return [
        updatedEntry,
        ...previous.filter(
          (item) => item.selectedDate !== entry.selectedDate
        ),
      ]
    })
  }

  const clearNutritionHistory = () => {
    setNutritionHistory([])
  }

  const deleteNutritionHistoryItem = (id) => {
    setNutritionHistory((previous) =>
      previous.filter((item) => item.id !== id)
    )
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


      {/* ==================================================
          MAIN
          ================================================== */}

      <main className="dashboard">

        {/* ==================================================
            HOME
            ================================================== */}

        {!showMaternalForm &&
          !showFetalForm &&
          !showHistory &&
          !showPregnancy &&
          !showWellness &&
          !showDailyWellness &&
          !showWellnessDashboard &&
          !showNutrition && (

            <Home
              onMaternalClick={openMaternalForm}
              onFetalClick={openFetalForm}
              onHistoryClick={openHistory}
              onPregnancyClick={openPregnancy}
              onWellnessClick={openWellness}
              onDailyWellnessClick={openDailyWellness}
              onWellnessDashboardClick={openWellnessDashboard}
              onNutritionClick={openNutrition}
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
            FETAL ASSESSMENT
            ================================================== */}

        {showFetalForm && (

          <FetalAssessment
            onBack={closeFetalForm}
            onSaveHistory={addHistoryItem}
          />

        )}


        {/* ==================================================
            PREGNANCY OVERVIEW
            ================================================== */}

        {showPregnancy && (

          <PregnancyOverview
            onBack={closePregnancyOverview}
            onTrimesterChange={handleTrimesterChange}
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
            onBack={goHome}
            onClear={clearHistory}
            onDelete={deleteHistoryItem}
            onClearWellness={clearWellnessHistory}
            onDeleteWellness={deleteWellnessHistoryItem}
            onClearNutrition={clearNutritionHistory}
            onDeleteNutrition={deleteNutritionHistoryItem}
          />

        )}


        {/* ==================================================
            TRIMESTER WELLNESS
            ================================================== */}

        {showWellness && (

          <TrimesterWellness
            onBack={closeWellness}
            initialTrimester={selectedWellnessTrimester}
          />

        )}


        {/* ==================================================
            DAILY WELLNESS
            ================================================== */}

        {showDailyWellness && (

          <DailyWellness
            wellnessHistory={wellnessHistory}
            onBack={closeDailyWellness}
            onSaveWellness={addWellnessHistory}
          />

        )}


        {/* ==================================================
            MATERNAL WELLNESS DASHBOARD
            ================================================== */}

        {showWellnessDashboard && (

          <MaternalWellnessDashboard
            wellnessHistory={wellnessHistory}
            onBack={closeWellnessDashboard}
          />

        )}


        {/* ==================================================
            NUTRITION
            ================================================== */}

        {showNutrition && (

          <Nutrition
            nutritionHistory={nutritionHistory}
            onSaveNutrition={addNutritionHistory}
            onBack={closeNutrition}
          />

        )}

      </main>


      {/* ==================================================
          FOOTER
          ================================================== */}

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