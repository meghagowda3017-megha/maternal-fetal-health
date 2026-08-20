import { useState } from 'react'
import './App.css'

import Home from './pages/Home'
import MaternalAssessment from './pages/MaternalAssessment'
import FetalAssessment from './pages/FetalAssessment'
import History from './pages/History'
import PregnancyOverview from './components/PregnancyOverview'
import TrimesterWellness from './components/TrimesterWellness'

function App() {
  const [showMaternalForm, setShowMaternalForm] = useState(false)
  const [showFetalForm, setShowFetalForm] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showPregnancy, setShowPregnancy] = useState(false)
  const [showWellness, setShowWellness] = useState(false)
  const [selectedWellnessTrimester, setSelectedWellnessTrimester] =
  useState(
    localStorage.getItem('selectedWellnessTrimester') ||
    'First Trimester'
  )
  const [history, setHistory] = useState([])

  // --------------------------------------------------
  // OPEN MATERNAL ASSESSMENT
  // --------------------------------------------------
  const openMaternalForm = () => {
    setShowMaternalForm(true)
    setShowFetalForm(false)
    setShowHistory(false)
    setShowPregnancy(false)
  }

  // --------------------------------------------------
  // OPEN FETAL ASSESSMENT
  // --------------------------------------------------
  const openFetalForm = () => {
    setShowFetalForm(true)
    setShowMaternalForm(false)
    setShowHistory(false)
    setShowPregnancy(false)
  }

  // --------------------------------------------------
  // OPEN PREGNANCY OVERVIEW
  // --------------------------------------------------
  const openPregnancy = () => {
    setShowPregnancy(true)
    setShowMaternalForm(false)
    setShowFetalForm(false)
    setShowHistory(false)
  }
   // --------------------------------------------------
  // OPEN wellness
  // --------------------------------------------------
  const openWellness = () => {
    setShowWellness(true)
    setShowMaternalForm(false)
    setShowFetalForm(false)
    setShowHistory(false)
    setShowPregnancy(false)
  }

  // --------------------------------------------------
  // OPEN HISTORY
  // --------------------------------------------------
  const openHistory = () => {
    setShowHistory(true)
    setShowMaternalForm(false)
    setShowFetalForm(false)
    setShowPregnancy(false)
  }
  //----Trimester-----
  //------------------------------
  const handleTrimesterChange = (trimester) => {
  setSelectedWellnessTrimester(trimester)

  localStorage.setItem(
    'selectedWellnessTrimester',
    trimester
  )
}

  // --------------------------------------------------
  // GO HOME / CLOSE ALL
  // --------------------------------------------------
  const goHome = () => {
    setShowMaternalForm(false)
    setShowFetalForm(false)
    setShowHistory(false)
    setShowPregnancy(false)
    setShowWellness(false)
  }

  // --------------------------------------------------
  // CLOSE MATERNAL
  // --------------------------------------------------
  const closeMaternalForm = () => {
    setShowMaternalForm(false)
  }

  // --------------------------------------------------
  // CLOSE FETAL
  // --------------------------------------------------
  const closeFetalForm = () => {
    setShowFetalForm(false)
  }

  // --------------------------------------------------
  // CLOSE PREGNANCY OVERVIEW
  // --------------------------------------------------
  const closePregnancyOverview = () => {
    setShowPregnancy(false)
  }

  // --------------------------------------------------
  // CLEAR HISTORY
  // --------------------------------------------------
  const clearHistory = () => {
    setHistory([])
  }

  // --------------------------------------------------
  // DELETE ONE HISTORY ITEM
  // --------------------------------------------------
  const deleteHistoryItem = (id) => {
    setHistory((previous) =>
      previous.filter((item) => item.id !== id)
    )
  }

  // --------------------------------------------------
  // ADD HISTORY ITEM
  // --------------------------------------------------
  const addHistoryItem = (item) => {
    setHistory((previous) => [
      item,
      ...previous,
    ])
  }

  return (
    <div className="app">

      {/* ========================================
          HEADER
          ======================================== */}
      <header className="header">
        <div className="header-content">
          <div className="brand-icon" onClick={goHome} style={{ cursor: 'pointer' }}>
            ♥
          </div>
          <div>
            <h1 onClick={goHome} style={{ cursor: 'pointer' }}>
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

      {/* ========================================
          MAIN
          ======================================== */}
      <main className="dashboard">

        {/* HOME PANEL */}
        {!showMaternalForm &&
          !showFetalForm &&
          !showHistory &&
          !showPregnancy &&
          !showWellness && (
            <Home
              onMaternalClick={openMaternalForm}
              onFetalClick={openFetalForm}
              onHistoryClick={openHistory}
              onPregnancyClick={openPregnancy}
              onWellnessClick={openWellness}
            />
          )}

        {/* MATERNAL ASSESSMENT */}
        {showMaternalForm && (
          <MaternalAssessment
            onBack={closeMaternalForm}
            onSaveHistory={addHistoryItem}
          />
        )}

        {/* FETAL ASSESSMENT */}
        {showFetalForm && (
          <FetalAssessment
            onBack={closeFetalForm}
            onSaveHistory={addHistoryItem}
          />
        )}

        {/* PREGNANCY OVERVIEW */}
        {showPregnancy && (
          <PregnancyOverview
            onBack={closePregnancyOverview}
            onTrimesterChange={handleTrimesterChange}
          />
        )}

        {/* HISTORY VIEW */}
        {showHistory && (
          <History
            history={history}
            onBack={goHome}
            onClear={clearHistory}
            onDelete={deleteHistoryItem}
          />
        )}
        {/* WELLNESS */}
        {showWellness && (
          <TrimesterWellness
            onBack={goHome}
            initialTrimester={selectedWellnessTrimester}
          />
        )}

      </main>

      {/* ========================================
          FOOTER
          ======================================== */}
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
