import { useEffect, useState } from 'react'
import './App.css'

import Home from './pages/Home'
import MaternalAssessment from './pages/MaternalAssessment'
import FetalAssessment from './pages/FetalAssessment'
import History from './pages/History'
import PregnancyOverview from './components/PregnancyOverview'
import TrimesterWellness from './components/TrimesterWellness'
import DailyWellness from './components/DailyWellness'

function App() {
  const [showMaternalForm, setShowMaternalForm] = useState(false)
  const [showFetalForm, setShowFetalForm] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showPregnancy, setShowPregnancy] = useState(false)
  const [showWellness, setShowWellness] = useState(false)
  const [showDailyWellness, setShowDailyWellness] = useState(false)

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
// SAVE ASSESSMENT HISTORY
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
  // OPEN MATERNAL ASSESSMENT
  // ==================================================

  const openMaternalForm = () => {
    setShowMaternalForm(true)
    setShowFetalForm(false)
    setShowHistory(false)
    setShowPregnancy(false)
    setShowWellness(false)
    setShowDailyWellness(false)
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
    setWellnessHistory((previous) => [
      checkIn,
      ...previous,
    ])
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
          !showDailyWellness && (

            <Home
              onMaternalClick={openMaternalForm}
              onFetalClick={openFetalForm}
              onHistoryClick={openHistory}
              onPregnancyClick={openPregnancy}
              onWellnessClick={openWellness}
              onDailyWellnessClick={openDailyWellness}
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
            onBack={closeDailyWellness}
            onSaveWellness={addWellnessHistory}
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