import { useState } from 'react'
import './DailyWellness.css'

function DailyWellness({ onBack, onSaveWellness }) {

  // BASIC WELLNESS
  const [mood, setMood] = useState('')
  const [energy, setEnergy] = useState(3)
  const [water, setWater] = useState('')

  // FEELINGS & PAIN (Updated to Arrays)
  const [feelings, setFeelings] = useState([])
  const [pain, setPain] = useState([])

  // SLEEP
  const [sleepQuality, setSleepQuality] = useState('')
  const [sleepHours, setSleepHours] = useState('')
  const [sleepMinutes, setSleepMinutes] = useState('')

  // CRAVINGS & DISCHARGE
  const [cravings, setCravings] = useState([])
  const [discharge, setDischarge] = useState('')

  // BODY (Updated skin & hair to Arrays)
  const [skin, setSkin] = useState([])
  const [hair, setHair] = useState([])
  const [weight, setWeight] = useState('')

  // DIGESTION & STOOL (Updated digestion to Array)
  const [digestion, setDigestion] = useState([])
  const [stool, setStool] = useState('')

  // MEDITATION & LIFESTYLE
  const [meditationMinutes, setMeditationMinutes] = useState('')
  const [selfCare, setSelfCare] = useState([])
  const [ailments, setAilments] = useState([])
  const [notes, setNotes] = useState('')

  // MULTI SELECT HANDLER (Supports optional max limit, defaults to allowing multi-select)
  const toggleSelection = (value, selected, setSelected, max = null) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((item) => item !== value))
    } else {
      if (max && selected.length >= max) {
        alert(`You can select a maximum of ${max} options for this section.`)
        return
      }
      setSelected([...selected, value])
    }
  }

  // SAVE CHECK-IN
  const handleSubmit = (event) => {
    event.preventDefault()

    const checkIn = {
      id: Date.now(),
      date: new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      mood,
      energy,
      feelings,
      pain,
      sleepQuality,
      sleepHours,
      sleepMinutes,
      water,
      cravings,
      discharge,
      skin,
      hair,
      weight,
      digestion,
      stool,
      meditationMinutes,
      selfCare,
      ailments,
      notes,
    }

    console.log("Daily wellness check-in:", checkIn)

if (onSaveWellness) {
  onSaveWellness(checkIn)
}

alert("Today's wellness check-in has been saved successfully.")

    // Reset form
    setMood('')
    setEnergy(3)
    setFeelings([])
    setPain([])
    setSleepQuality('')
    setSleepHours('')
    setSleepMinutes('')
    setWater('')
    setCravings([])
    setDischarge('')
    setSkin([])
    setHair([])
    setWeight('')
    setDigestion([])
    setStool('')
    setMeditationMinutes('')
    setSelfCare([])
    setAilments([])
    setNotes('')
  }

  return (
    <section className="daily-wellness-page">

      {/* HEADER */}
      <div className="daily-wellness-header">
        <div>
          <span className="section-label">DAILY WELLNESS</span>
          <h2>Daily Wellness Check-in</h2>
          <p>Take a moment to record how you are feeling today.</p>
        </div>
        <div className="daily-wellness-header-icon">🌷</div>
      </div>

      {/* FORM */}
      <form className="daily-wellness-card" onSubmit={handleSubmit}>

        {/* MOOD */}
        <div className="wellness-question">
          <div className="question-heading">
            <div>
              <h3>😊 How are you feeling today?</h3>
              <span>Choose your overall mood</span>
            </div>
          </div>
          <div className="wellness-option-grid">
            {[
              ['😊', 'Great'],
              ['🙂', 'Good'],
              ['😐', 'Okay'],
              ['😔', 'Low'],
            ].map(([emoji, label]) => (
              <button
                key={label}
                type="button"
                className={mood === label ? 'wellness-option selected' : 'wellness-option'}
                onClick={() => setMood(label)}
              >
                <span className="option-emoji">{emoji}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ENERGY */}
        <div className="wellness-question">
          <div className="question-heading">
            <div>
              <h3>⚡ Energy Level</h3>
              <span>How energetic do you feel today?</span>
            </div>
            <strong>{energy} / 5</strong>
          </div>
          <input
            className="wellness-range"
            type="range"
            min="1"
            max="5"
            value={energy}
            onChange={(e) => setEnergy(Number(e.target.value))}
          />
          <div className="range-labels">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        {/* FEELINGS (UPDATED FOR MULTI-SELECT) */}
        <div className="wellness-question">
          <div className="question-heading">
            <div>
              <h3>💭 Feelings</h3>
              <span>How have you been feeling emotionally? (Select options)</span>
            </div>
          </div>
          <div className="wellness-option-grid">
            {[
              ['😌', 'Fine'],
              ['😊', 'Happy'],
              ['😢', 'Sad'],
              ['🥺', 'Sensitive'],
              ['😠', 'Angry'],
              ['🥰', 'Excited'],
              ['😰', 'Anxious'],
              ['🌪️', 'Mood swings'],
            ].map(([emoji, label]) => (
              <button
                key={label}
                type="button"
                className={feelings.includes(label) ? 'wellness-option selected' : 'wellness-option'}
                onClick={() => toggleSelection(label, feelings, setFeelings)}
              >
                <span className="option-emoji">{emoji}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* PAIN & BODY COMFORT (UPDATED FOR MULTI-SELECT) */}
        <div className="wellness-question">
          <div className="question-heading">
            <div>
              <h3>🩹 Pain & Body Comfort</h3>
              <span>Select all options that describe today</span>
            </div>
          </div>
          <div className="wellness-option-grid">
            {[
              ['😊', 'Pain-free'],
              ['🤱', 'Breast tenderness'],
              ['🤕', 'Headache'],
              ['🧠', 'Migraine'],
              ['🔙', 'Lower back'],
              ['🦵', 'Leg pain'],
              ['🦴', 'Joint pain'],
              ['😴', 'Fatigue'],
              ['🫧', 'Swelling'],
            ].map(([emoji, label]) => (
              <button
                key={label}
                type="button"
                className={pain.includes(label) ? 'wellness-option selected' : 'wellness-option'}
                onClick={() => toggleSelection(label, pain, setPain)}
              >
                <span className="option-emoji">{emoji}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* SLEEP */}
        <div className="wellness-question">
          <div className="question-heading">
            <div>
              <h3>😴 Sleep Quality</h3>
              <span>How was your sleep?</span>
            </div>
          </div>
          <div className="wellness-option-grid">
            {[
              ['🌙', 'Trouble falling asleep'],
              ['🛌', 'Restless sleep'],
              ['😌', 'Woke refreshed'],
              ['🥱', 'Woke tired'],
            ].map(([emoji, label]) => (
              <button
                key={label}
                type="button"
                className={sleepQuality === label ? 'wellness-option selected' : 'wellness-option'}
                onClick={() => setSleepQuality(label)}
              >
                <span className="option-emoji">{emoji}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
          <div className="input-row">
            <div className="small-input-group">
              <label>🕐 Hours</label>
              <input
                type="number"
                min="1"
                max="10"
                value={sleepHours}
                onChange={(e) => setSleepHours(e.target.value)}
                placeholder="7"
              />
            </div>
            <div className="small-input-group">
              <label>Minutes</label>
              <input
                type="number"
                min="1"
                max="59"
                value={sleepMinutes}
                onChange={(e) => setSleepMinutes(e.target.value)}
                placeholder="30"
              />
            </div>
          </div>
        </div>

        {/* WATER */}
        <div className="wellness-question">
          <div className="question-heading">
            <div>
              <h3>💧 Water Intake</h3>
              <span>How many glasses did you drink today?</span>
            </div>
          </div>
          <input
            className="wellness-number-input"
            type="number"
            min="0"
            max="25"
            value={water}
            onChange={(e) => setWater(e.target.value)}
            placeholder="Enter number of glasses"
          />
        </div>

        {/* CRAVINGS */}
        <div className="wellness-question">
          <div className="question-heading">
            <div>
              <h3>🍓 What are you craving today?</h3>
              <span>You can choose more than one</span>
            </div>
          </div>
          <div className="wellness-option-grid">
            {[
              ['🍫', 'Sweet'],
              ['🧂', 'Salty'],
              ['🍋', 'Sour'],
              ['🌶️', 'Spicy'],
              ['🍞', 'Carbs'],
              ['🍎', 'Fruits'],
              ['🥛', 'Dairy'],
              ['🍿', 'Crunchy'],
              ['✨', 'Other'],
            ].map(([emoji, label]) => (
              <button
                key={label}
                type="button"
                className={cravings.includes(label) ? 'wellness-option selected' : 'wellness-option'}
                onClick={() => toggleSelection(label, cravings, setCravings)}
              >
                <span className="option-emoji">{emoji}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* DISCHARGE */}
        <div className="wellness-question">
          <div className="question-heading">
            <div>
              <h3>💧 Discharge</h3>
              <span>Select the description that best matches today</span>
            </div>
          </div>
          <div className="wellness-option-grid">
            {[
              ['🚫', 'None'],
              ['🏐', 'Creamy'],
              ['🫟', 'Sticky'],
              ['🥚', 'Eggwhite'],
              ['⚠️', 'Atypical'],
            ].map(([emoji, label]) => (
              <button
                key={label}
                type="button"
                className={discharge === label ? 'wellness-option selected' : 'wellness-option'}
                onClick={() => setDischarge(label)}
              >
                <span className="option-emoji">{emoji}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* SKIN (UPDATED FOR MULTI-SELECT) */}
        <div className="wellness-question">
          <div className="question-heading">
            <div>
              <h3>✨ Skin</h3>
              <span>How is your skin today? (Select options)</span>
            </div>
          </div>
          <div className="wellness-option-grid">
            {[
              ['😊', 'Okay'],
              ['✨', 'Good'],
              ['🧩', 'Acne'],
              ['🏜️', 'Dry skin'],
              ['⌛', 'Oily skin'],
              ['😣', 'Itchy skin'],
              ['🟤', 'Dark spots'],
              ['🔴', 'Pimples'],
            ].map(([emoji, label]) => (
              <button
                key={label}
                type="button"
                className={skin.includes(label) ? 'wellness-option selected' : 'wellness-option'}
                onClick={() => toggleSelection(label, skin, setSkin)}
              >
                <span className="option-emoji">{emoji}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* HAIR (UPDATED FOR MULTI-SELECT) */}
        <div className="wellness-question">
          <div className="question-heading">
            <div>
              <h3>💇‍♀️ Hair</h3>
              <span>How is your hair and scalp today? (Select options)</span>
            </div>
          </div>
          <div className="wellness-option-grid">
            {[
              ['😊', 'OK hair'],
              ['✨', 'Good hair'],
              ['😞', 'Bad hair'],
              ['🧴', 'Oily scalp'],
              ['🏜️', 'Dry scalp'],
              ['🪮', 'Hair loss'],
              ['📉', 'Severe hair loss'],
            ].map(([emoji, label]) => (
              <button
                key={label}
                type="button"
                className={hair.includes(label) ? 'wellness-option selected' : 'wellness-option'}
                onClick={() => toggleSelection(label, hair, setHair)}
              >
                <span className="option-emoji">{emoji}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* WEIGHT */}
        <div className="wellness-question">
          <div className="question-heading">
            <div>
              <h3>⚖️ Weight</h3>
              <span>Enter your weight for today</span>
            </div>
          </div>
          <div className="weight-input-wrapper">
            <input
              className="weight-input"
              type="number"
              min="0"
              max="300"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="0.0"
            />
            <span>kg</span>
          </div>
        </div>

        {/* DIGESTION (UPDATED FOR MULTI-SELECT) */}
        <div className="wellness-question">
          <div className="question-heading">
            <div>
              <h3>🍽️ Digestion</h3>
              <span>How is your digestion today? (Select options)</span>
            </div>
          </div>
          <div className="wellness-option-grid">
            {[
              ['😊', 'Okay'],
              ['🎈', 'Bloated'],
              ['💨', 'Gassy'],
              ['🔥', 'Heartburn'],
              ['🤢', 'Nausea'],
              ['🤮', 'Vomiting'],
            ].map(([emoji, label]) => (
              <button
                key={label}
                type="button"
                className={digestion.includes(label) ? 'wellness-option selected' : 'wellness-option'}
                onClick={() => toggleSelection(label, digestion, setDigestion)}
              >
                <span className="option-emoji">{emoji}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* STOOL */}
        <div className="wellness-question">
          <div className="question-heading">
            <div>
              <h3>🚽 Stool</h3>
              <span>Select the option that describes today</span>
            </div>
          </div>
          <div className="wellness-option-grid">
            {[
              ['😊', 'Okay'],
              ['😣', 'Constipated'],
              ['💧', 'Diarrhea'],
            ].map(([emoji, label]) => (
              <button
                key={label}
                type="button"
                className={stool === label ? 'wellness-option selected' : 'wellness-option'}
                onClick={() => setStool(label)}
              >
                <span className="option-emoji">{emoji}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* MEDITATION */}
        <div className="wellness-question">
          <div className="question-heading">
            <div>
              <h3>⚛️ Meditation</h3>
              <span>Record meditation time for today</span>
            </div>
          </div>
          <div className="wellness-number-with-label">
            <input
              className="wellness-number-input"
              type="number"
              min="0"
              max="1440"
              value={meditationMinutes}
              onChange={(e) => setMeditationMinutes(e.target.value)}
              placeholder="Enter minutes"
            />
            <span>minutes</span>
          </div>
        </div>

        {/* SELF CARE */}
        <div className="wellness-question">
          <div className="question-heading">
            <div>
              <h3>🧘 Self-care</h3>
              <span>What did you do for yourself today?</span>
            </div>
          </div>
          <div className="wellness-option-grid">
            {[
              ['🧘', 'Yoga'],
              ['🚶', 'Walking'],
              ['🤸', 'Stretching'],
              ['🛌', 'Rest day'],
            ].map(([emoji, label]) => (
              <button
                key={label}
                type="button"
                className={selfCare.includes(label) ? 'wellness-option selected' : 'wellness-option'}
                onClick={() => toggleSelection(label, selfCare, setSelfCare)}
              >
                <span className="option-emoji">{emoji}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* AILMENTS */}
        <div className="wellness-question">
          <div className="question-heading">
            <div>
              <h3>🤒 Ailments</h3>
              <span>Select anything you experienced today</span>
            </div>
          </div>
          <div className="wellness-option-grid">
            {[
              ['🤧', 'Cold'],
              ['🤒', 'Flu'],
              ['🌼', 'Allergy'],
              ['🌡️', 'Fever'],
              ['🚻', 'UTI'],
              ['🔴', 'Skin irritation'],
              ['😣', 'Itching'],
            ].map(([emoji, label]) => (
              <button
                key={label}
                type="button"
                className={ailments.includes(label) ? 'wellness-option selected' : 'wellness-option'}
                onClick={() => toggleSelection(label, ailments, setAilments)}
              >
                <span className="option-emoji">{emoji}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* NOTES */}
        <div className="wellness-question">
          <div className="question-heading">
            <div>
              <h3>📝 Notes</h3>
              <span>Optional</span>
            </div>
          </div>
          <textarea
            className="wellness-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write anything you would like to remember about today..."
            rows="5"
          />
        </div>

        {/* ACTIONS */}
        <div className="daily-wellness-actions">
          <button
            type="button"
            className="wellness-cancel-button"
            onClick={onBack}
          >
            ← Back
          </button>
          <button
            type="submit"
            className="wellness-save-button"
          >
            Save Today's Check-in
            <span>→</span>
          </button>
        </div>

      </form>

      {/* DISCLAIMER */}
      <div className="wellness-disclaimer">
        <span>⚕</span>
        <p>
          This check-in is for personal wellness tracking and educational purposes.
          It does not provide a medical diagnosis or replace professional medical advice.
        </p>
      </div>

    </section>
  )
}

export default DailyWellness