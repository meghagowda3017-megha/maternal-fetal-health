import { useState } from 'react'
import './App.css'

import Home from './pages/Home'
import MaternalAssessment from './pages/MaternalAssessment'
import FetalAssessment from './pages/FetalAssessment'

function App() {
  const [showMaternalForm, setShowMaternalForm] = useState(false)
  const [showFetalForm, setShowFetalForm] = useState(false)

  const openMaternalForm = () => {
    setShowMaternalForm(true)
    setShowFetalForm(false)
  }

  const openFetalForm = () => {
    setShowFetalForm(true)
    setShowMaternalForm(false)
  }

  const closeMaternalForm = () => {
    setShowMaternalForm(false)
  }

  const closeFetalForm = () => {
    setShowFetalForm(false)
  }

  return (
    <div className="app">

      {/* HEADER */}
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


      {/* MAIN */}
      <main className="dashboard">

        {/* HOME */}
        {!showMaternalForm && !showFetalForm && (
          <Home
            onMaternalClick={openMaternalForm}
            onFetalClick={openFetalForm}
          />
        )}


        {/* MATERNAL ASSESSMENT */}
        {showMaternalForm && (
          <MaternalAssessment
            onBack={closeMaternalForm}
          />
        )}


        {/* FETAL ASSESSMENT */}
        {showFetalForm && (
          <FetalAssessment
            onBack={closeFetalForm}
          />
        )}

      </main>


      {/* FOOTER */}
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