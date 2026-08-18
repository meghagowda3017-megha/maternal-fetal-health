import { useState } from 'react'
import './App.css'

import Home from './pages/Home'
import MaternalAssessment from './pages/MaternalAssessment'
import FetalAssessment from './pages/FetalAssessment'
import History from './pages/History'

function App() {
  // --------------------------------------------------
  // PAGE STATES
  // --------------------------------------------------

  const [showMaternalForm, setShowMaternalForm] = useState(false)
  const [showFetalForm, setShowFetalForm] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  // --------------------------------------------------
  // RESULT STATES
  // --------------------------------------------------

  const [maternalResult, setMaternalResult] = useState(null)
  const [fetalResult, setFetalResult] = useState(null)

  // --------------------------------------------------
  // HISTORY
  // --------------------------------------------------

  const [history, setHistory] = useState([])

  // --------------------------------------------------
  // OPEN MATERNAL
  // --------------------------------------------------

  const openMaternalForm = () => {
    setShowMaternalForm(true)
    setShowFetalForm(false)
    setShowHistory(false)
    setMaternalResult(null)
  }

  // --------------------------------------------------
  // OPEN FETAL
  // --------------------------------------------------

  const openFetalForm = () => {
    setShowFetalForm(true)
    setShowMaternalForm(false)
    setShowHistory(false)
    setFetalResult(null)
  }

  // --------------------------------------------------
  // CLOSE MATERNAL
  // --------------------------------------------------

  const closeMaternalForm = () => {
    setShowMaternalForm(false)
    setMaternalResult(null)
  }

  // --------------------------------------------------
  // CLOSE FETAL
  // --------------------------------------------------

  const closeFetalForm = () => {
    setShowFetalForm(false)
    setFetalResult(null)
  }

  // --------------------------------------------------
  // HOME
  // --------------------------------------------------

  const goHome = () => {
    setShowMaternalForm(false)
    setShowFetalForm(false)
    setShowHistory(false)
    setMaternalResult(null)
    setFetalResult(null)
  }

  // --------------------------------------------------
  // HISTORY
  // --------------------------------------------------

  const openHistory = () => {
  setShowHistory(true)
  setShowMaternalForm(false)
  setShowFetalForm(false)
}

const clearHistory = () => {
  setHistory([])
}

const deleteHistoryItem = (id) => {
  setHistory((previous) =>
    previous.filter((item) => item.id !== id)
  )
}

  // --------------------------------------------------
  // ADD HISTORY ENTRY
  // --------------------------------------------------

  const addToHistory = (entry) => {
    setHistory((previous) => [
      entry,
      ...previous,
    ])
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="app">

      {/* ==========================================
          HEADER
          ========================================== */}

      <header className="header">

        <div className="header-content">

          <div className="brand-icon">
            ♥
          </div>

          <div>

            <h1>
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


      {/* ==========================================
          MAIN
          ========================================== */}

      <main className="dashboard">

        {/* HOME */}

        {!showMaternalForm &&
          !showFetalForm &&
          !showHistory && (

          <Home
            onMaternalClick={openMaternalForm}
            onFetalClick={openFetalForm}
            onHistoryClick={openHistory}
          />

        )}


        {/* MATERNAL ASSESSMENT */}

        {showMaternalForm && (
          <MaternalAssessment
            onBack={closeMaternalForm}
            onSaveHistory={(entry) =>
              setHistory((previous) => [entry, ...previous])
            }
          />
        )}


        {/* FETAL ASSESSMENT */}

        {showFetalForm && (
          <FetalAssessment
            onBack={closeFetalForm}
            onSaveHistory={(entry) =>
              setHistory((previous) => [entry, ...previous])
            }
          />
        )}


        {/* HISTORY */}

        {showHistory && (
        <History
          history={history}
          onBack={goHome}
          onClear={clearHistory}
          onDelete={deleteHistoryItem}
        />
      )}
    </main>


      {/* ==========================================
          FOOTER
          ========================================== */}

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
