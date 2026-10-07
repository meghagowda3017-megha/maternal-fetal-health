import { useEffect, useState } from 'react'
import './App.css'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import MaternalAssessment from './pages/MaternalAssessment'
import History from './pages/History'
import DoctorReport from './pages/DoctorReport'

import PregnancyOverview from './components/PregnancyOverview'
import TrimesterWellness from './components/TrimesterWellness'
import DailyWellness from './components/DailyWellness'
import MaternalWellnessDashboard from './components/MaternalWellnessDashboard'
import Nutrition from './components/Nutrition'
import ActivityExercise from './components/ActivityExercise'

function App() {
  // ==================================================
  // AUTHENTICATION
  // ==================================================

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser')

    if (!savedUser) {
      return null
    }

    try {
      return JSON.parse(savedUser)
    } catch (error) {
      console.error(
        'Unable to read saved user:',
        error
      )

      return null
    }
  })

  const [showRegister, setShowRegister] =
    useState(false)

  // ==================================================
  // USER-SPECIFIC STORAGE KEYS
  // ==================================================

  const getUserKey = (key, userId = user?.id) => {
    if (!userId) {
      return null
    }

    return `${key}_${userId}`
  }

  const loadUserData = (key, userId = user?.id) => {
    const storageKey = getUserKey(key, userId)

    if (!storageKey) {
      return []
    }

    const savedData =
      localStorage.getItem(storageKey)

    if (!savedData) {
      return []
    }

    try {
      return JSON.parse(savedData)
    } catch (error) {
      console.error(
        `Unable to read ${key}:`,
        error
      )

      return []
    }
  }

  // ==================================================
  // PAGE STATES
  // ==================================================

  const [showMaternalForm, setShowMaternalForm] =
    useState(false)

  const [showHistory, setShowHistory] =
    useState(false)

  const [showPregnancy, setShowPregnancy] =
    useState(false)

  const [showWellness, setShowWellness] =
    useState(false)

  const [showDailyWellness, setShowDailyWellness] =
    useState(false)

  const [
    showWellnessDashboard,
    setShowWellnessDashboard
  ] = useState(false)

  const [showNutrition, setShowNutrition] =
    useState(false)

  const [showActivity, setShowActivity] =
    useState(false)

  const [showDoctorReport, setShowDoctorReport] =
    useState(false)

  // ==================================================
  // SELECTED TRIMESTER
  // ==================================================

  const [
    selectedWellnessTrimester,
    setSelectedWellnessTrimester
  ] = useState(() => {
    if (!user?.id) {
      return 'First Trimester'
    }

    return (
      localStorage.getItem(
        `selectedWellnessTrimester_${user.id}`
      ) || 'First Trimester'
    )
  })

  // ==================================================
  // USER-SPECIFIC HISTORY
  // ==================================================

  const [history, setHistory] = useState(() => {
    return loadUserData('assessmentHistory')
  })

  const [wellnessHistory, setWellnessHistory] =
    useState(() => {
      return loadUserData('wellnessHistory')
    })

  const [nutritionHistory, setNutritionHistory] =
    useState(() => {
      return loadUserData('nutritionHistory')
    })

  const [activityHistory, setActivityHistory] =
    useState(() => {
      return loadUserData('activityHistory')
    })

  // ==================================================
  // TRACK WHICH USER'S DATA IS CURRENTLY LOADED
  // ==================================================

  const [loadedUserId, setLoadedUserId] =
    useState(() => user?.id || null)

  // ==================================================
  // LOAD USER DATA AFTER LOGIN / USER CHANGE
  // ==================================================

  useEffect(() => {
    if (!user?.id) {
      setHistory([])
      setWellnessHistory([])
      setNutritionHistory([])
      setActivityHistory([])
      setSelectedWellnessTrimester(
        'First Trimester'
      )
      setLoadedUserId(null)

      return
    }

    const userId = user.id

    setHistory(
      loadUserData(
        'assessmentHistory',
        userId
      )
    )

    setWellnessHistory(
      loadUserData(
        'wellnessHistory',
        userId
      )
    )

    setNutritionHistory(
      loadUserData(
        'nutritionHistory',
        userId
      )
    )

    setActivityHistory(
      loadUserData(
        'activityHistory',
        userId
      )
    )

    setSelectedWellnessTrimester(
      localStorage.getItem(
        `selectedWellnessTrimester_${userId}`
      ) || 'First Trimester'
    )

    setLoadedUserId(userId)
  }, [user])

  // ==================================================
  // SAVE USER
  // ==================================================

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        'currentUser',
        JSON.stringify(user)
      )
    } else {
      localStorage.removeItem('currentUser')
    }
  }, [user])

  // ==================================================
  // SAVE MATERNAL ASSESSMENT HISTORY
  // ==================================================

  useEffect(() => {
    if (!user?.id || loadedUserId !== user.id) {
      return
    }

    localStorage.setItem(
      `assessmentHistory_${user.id}`,
      JSON.stringify(history)
    )
  }, [history, user, loadedUserId])

  // ==================================================
  // SAVE WELLNESS HISTORY
  // ==================================================

  useEffect(() => {
    if (!user?.id || loadedUserId !== user.id) {
      return
    }

    localStorage.setItem(
      `wellnessHistory_${user.id}`,
      JSON.stringify(wellnessHistory)
    )
  }, [
    wellnessHistory,
    user,
    loadedUserId
  ])

  // ==================================================
  // SAVE NUTRITION HISTORY
  // ==================================================

  useEffect(() => {
    if (!user?.id || loadedUserId !== user.id) {
      return
    }

    localStorage.setItem(
      `nutritionHistory_${user.id}`,
      JSON.stringify(nutritionHistory)
    )
  }, [
    nutritionHistory,
    user,
    loadedUserId
  ])

  // ==================================================
  // SAVE ACTIVITY HISTORY
  // ==================================================

  useEffect(() => {
    if (!user?.id || loadedUserId !== user.id) {
      return
    }

    localStorage.setItem(
      `activityHistory_${user.id}`,
      JSON.stringify(activityHistory)
    )
  }, [
    activityHistory,
    user,
    loadedUserId
  ])

  // ==================================================
  // LOGIN
  // ==================================================

  const handleLogin = (
    loggedInUser,
    accessToken
  ) => {
    const userId = loggedInUser.id

    setUser(loggedInUser)

    localStorage.setItem(
      'accessToken',
      accessToken
    )

    localStorage.setItem(
      'currentUser',
      JSON.stringify(loggedInUser)
    )

    // Load ONLY this user's data
    setHistory(
      loadUserData(
        'assessmentHistory',
        userId
      )
    )

    setWellnessHistory(
      loadUserData(
        'wellnessHistory',
        userId
      )
    )

    setNutritionHistory(
      loadUserData(
        'nutritionHistory',
        userId
      )
    )

    setActivityHistory(
      loadUserData(
        'activityHistory',
        userId
      )
    )

    setSelectedWellnessTrimester(
      localStorage.getItem(
        `selectedWellnessTrimester_${userId}`
      ) || 'First Trimester'
    )

    setLoadedUserId(userId)

    setShowRegister(false)

    goHome()
  }

  // ==================================================
  // REGISTER
  // ==================================================

  const handleRegisterSuccess = () => {
    setShowRegister(false)
  }

  // ==================================================
  // LOGOUT
  // ==================================================

  const handleLogout = () => {
    localStorage.removeItem(
      'accessToken'
    )

    localStorage.removeItem(
      'currentUser'
    )

    setUser(null)

    // Clear current user's data from memory
    setHistory([])
    setWellnessHistory([])
    setNutritionHistory([])
    setActivityHistory([])

    setLoadedUserId(null)

    setSelectedWellnessTrimester(
      'First Trimester'
    )

    // Reset all pages
    setShowMaternalForm(false)
    setShowHistory(false)
    setShowPregnancy(false)
    setShowWellness(false)
    setShowDailyWellness(false)
    setShowWellnessDashboard(false)
    setShowNutrition(false)
    setShowActivity(false)
    setShowDoctorReport(false)

    setShowRegister(false)
  }

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
    setShowDoctorReport(false)
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
    setShowDoctorReport(false)
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
    setShowDoctorReport(false)
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
    setShowDoctorReport(false)
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
    setShowDoctorReport(false)
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
    setShowDoctorReport(false)
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
    setShowDoctorReport(false)
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
    setShowDoctorReport(false)
  }

  // ==================================================
  // OPEN DOCTOR REPORT
  // ==================================================

  const openDoctorReport = () => {
    setShowMaternalForm(false)
    setShowHistory(false)
    setShowPregnancy(false)
    setShowWellness(false)
    setShowDailyWellness(false)
    setShowWellnessDashboard(false)
    setShowNutrition(false)
    setShowActivity(false)
    setShowDoctorReport(true)
  }

  // ==================================================
  // TRIMESTER CHANGE
  // ==================================================

  const handleTrimesterChange = (trimester) => {
    setSelectedWellnessTrimester(trimester)

    if (user?.id) {
      localStorage.setItem(
        `selectedWellnessTrimester_${user.id}`,
        trimester
      )
    }
  }

  // ==================================================
  // GO HOME
  // ==================================================

  function goHome() {
    setShowMaternalForm(false)
    setShowHistory(false)
    setShowPregnancy(false)
    setShowWellness(false)
    setShowDailyWellness(false)
    setShowWellnessDashboard(false)
    setShowNutrition(false)
    setShowActivity(false)
    setShowDoctorReport(false)
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
  // CLOSE DOCTOR REPORT
  // ==================================================

  const closeDoctorReport = () => {
    setShowDoctorReport(false)
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
      const existingEntry =
        previous.find(
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
      const existingEntry =
        previous.find(
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
      const existingEntry =
        previous.find(
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
    if (!user?.id) {
      return null
    }

    const savedPregnancyInfo =
      localStorage.getItem(
        `pregnancyInfo_${user.id}`
      )

    const savedLmpDate =
      localStorage.getItem(
        `pregnancyLmpDate_${user.id}`
      )

    if (!savedPregnancyInfo) {
      return null
    }

    try {
      const parsedInfo =
        JSON.parse(savedPregnancyInfo)

      return {
        ...parsedInfo,
        lmpDate:
          savedLmpDate || null,
      }
    } catch (error) {
      console.error(
        'Unable to read pregnancy information:',
        error
      )

      return null
    }
  }

  // ==================================================
  // LOGIN PAGE
  // ==================================================

  if (!user) {
    if (showRegister) {
      return (
        <Register
          onRegisterSuccess={
            handleRegisterSuccess
          }
          onBackToLogin={() =>
            setShowRegister(false)
          }
        />
      )
    }

    return (
      <Login
        onLogin={handleLogin}
        onRegister={() =>
          setShowRegister(true)
        }
      />
    )
  }

  // ==================================================
  // MAIN APPLICATION
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

        {/* ==================================================
            USER ACTIONS
            ================================================== */}

        <div className="header-user">

          <button
            type="button"
            className="home-header-button"
            onClick={goHome}
          >
            Home
          </button>

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

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
          !showActivity &&
          !showDoctorReport && (

            <Home
              user={user}
              onMaternalClick={
                openMaternalForm
              }
              onHistoryClick={
                openHistory
              }
              onPregnancyClick={
                openPregnancy
              }
              onWellnessClick={
                openWellness
              }
              onDailyWellnessClick={
                openDailyWellness
              }
              onWellnessDashboardClick={
                openWellnessDashboard
              }
              onNutritionClick={
                openNutrition
              }
              onActivityClick={
                openActivity
              }
              onDoctorReportClick={
                openDoctorReport
              }
            />

          )}

        {/* ==================================================
            MATERNAL ASSESSMENT
            ================================================== */}

        {showMaternalForm && (

          <MaternalAssessment
            user={user}
            onBack={
              closeMaternalForm
            }
            onSaveHistory={
              addHistoryItem
            }
          />

        )}

        {/* ==================================================
            PREGNANCY OVERVIEW
            ================================================== */}

        {showPregnancy && (

          <PregnancyOverview
            user={user}
            onBack={
              closePregnancyOverview
            }
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
            wellnessHistory={
              wellnessHistory
            }
            nutritionHistory={
              nutritionHistory
            }
            activityHistory={
              activityHistory
            }
            onBack={goHome}
            onClear={clearHistory}
            onDelete={
              deleteHistoryItem
            }
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
            wellnessHistory={
              wellnessHistory
            }
            onBack={
              closeDailyWellness
            }
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
            wellnessHistory={
              wellnessHistory
            }
            pregnancyInfo={
              getPregnancyInfo()
            }
            nutritionHistory={
              nutritionHistory
            }
            activityHistory={
              activityHistory
            }
            maternalHistory={
              history
            }
            onBack={
              closeWellnessDashboard
            }
            onNutritionClick={
              openNutrition
            }
            onActivityClick={
              openActivity
            }
          />

        )}

        {/* ==================================================
            NUTRITION
            ================================================== */}

        {showNutrition && (

          <Nutrition
            user={user}
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
            user={user}
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

        {/* ==================================================
            DOCTOR REPORT
            ================================================== */}

        {showDoctorReport && (

          <DoctorReport
            user={user}
            maternalHistory={history}
            wellnessHistory={
              wellnessHistory
            }
            nutritionHistory={
              nutritionHistory
            }
            activityHistory={
              activityHistory
            }
            pregnancyInfo={
              getPregnancyInfo()
            }
            onBack={
              closeDoctorReport
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