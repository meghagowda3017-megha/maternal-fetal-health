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
          !showWellnessDashboard && (

            <Home
              onMaternalClick={openMaternalForm}
              onFetalClick={openFetalForm}
              onHistoryClick={openHistory}
              onPregnancyClick={openPregnancy}
              onWellnessClick={openWellness}
              onDailyWellnessClick={openDailyWellness}
              onWellnessDashboardClick={openWellnessDashboard}
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
            onBack={goHome}
            onClear={clearHistory}
            onDelete={deleteHistoryItem}
            onClearWellness={clearWellnessHistory}
            onDeleteWellness={deleteWellnessHistoryItem}
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