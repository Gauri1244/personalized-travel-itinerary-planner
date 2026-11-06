import { useState } from 'react'
import { tripsAPI } from '../services/tripsAPI'

const STEPS = [
  { id: 1, title: 'Where & when', hint: 'Pick a destination and travel dates.' },
  { id: 2, title: 'Budget & group', hint: 'Set your budget and party size.' },
  { id: 3, title: 'Travel style', hint: 'Tell us how you like to explore.' },
  { id: 4, title: 'Review', hint: 'Confirm the details, then create your trip.' },
]

const INTEREST_OPTIONS = [
  'Food & dining',
  'Culture & museums',
  'Nature & outdoors',
  'Nightlife',
  'Shopping',
  'Adventure',
  'Relaxation',
  'History',
]

const DIETARY_OPTIONS = [
  'None',
  'Vegetarian',
  'Vegan',
  'Gluten-free',
  'Halal',
  'Kosher',
  'Dairy-free',
]

const PACE_OPTIONS = [
  {
    value: 'relaxed',
    label: 'Relaxed',
    description: 'Fewer stops, more downtime.',
  },
  {
    value: 'moderate',
    label: 'Moderate',
    description: 'A balanced mix of sights and rest.',
  },
  {
    value: 'packed',
    label: 'Packed',
    description: 'Full days with lots to see.',
  },
  {
    value: 'adventure',
    label: 'Adventure',
    description: 'Outdoor activities and thrilling experiences.',
  },
  {
    value: 'luxury',
    label: 'Luxury',
    description: 'Premium experiences and comfortable stays.',
  },
  {
    value: 'budget',
    label: 'Budget',
    description: 'Affordable activities and cost-effective travel.',
  },
]

const INITIAL_FORM = {
  destination: '',
  startDate: '',
  endDate: '',
  budget: '',
  travellers: 1,
  interests: [],
  dietaryPreferences: [],
  travelPace: 'moderate',
}

function CreateTrip() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState('')
  const [generatedItinerary, setGeneratedItinerary] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [optimizedRoute, setOptimizedRoute] = useState(null)
  const [modificationRequest, setModificationRequest] = useState('')
  const [isModifying, setIsModifying] = useState(false)
  const [modificationError, setModificationError] = useState('')

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => {
      if (!prev[name]) return prev
      const next = { ...prev }
      delete next[name]
      return next
    })
    setSubmitError('')
    setSubmitSuccess('')
  }

  function toggleInterest(interest) {
    setForm((prev) => {
      const alreadySelected = prev.interests.includes(interest)
      return {
        ...prev,
        interests: alreadySelected
          ? prev.interests.filter((item) => item !== interest)
          : [...prev.interests, interest],
      }
    })
    setErrors((prev) => {
      if (!prev.interests) return prev
      const next = { ...prev }
      delete next.interests
      return next
    })
  }

  function toggleDietary(option) {
    if (option === 'None') {
      updateField('dietaryPreferences', ['None'])
      return
    }

    setForm((prev) => {
      const withoutNone = prev.dietaryPreferences.filter((item) => item !== 'None')
      const alreadySelected = withoutNone.includes(option)
      return {
        ...prev,
        dietaryPreferences: alreadySelected
          ? withoutNone.filter((item) => item !== option)
          : [...withoutNone, option],
      }
    })
  }

  function validateStep(currentStep) {
    const nextErrors = {}

    if (currentStep === 1) {
      if (!form.destination.trim()) {
        nextErrors.destination = 'Please enter a destination.'
      }
      if (!form.startDate) {
        nextErrors.startDate = 'Please choose a start date.'
      }
      if (!form.endDate) {
        nextErrors.endDate = 'Please choose an end date.'
      }
      if (form.startDate && form.endDate && form.endDate < form.startDate) {
        nextErrors.endDate = 'End date must be on or after the start date.'
      }
    }

    if (currentStep === 2) {
      const budgetNumber = Number(form.budget)
      if (form.budget === '' || Number.isNaN(budgetNumber)) {
        nextErrors.budget = 'Please enter a budget amount.'
      } else if (budgetNumber <= 0) {
        nextErrors.budget = 'Budget must be greater than 0.'
      }

      const travellersNumber = Number(form.travellers)
      if (!travellersNumber || travellersNumber < 1) {
        nextErrors.travellers = 'At least 1 traveller is required.'
      } else if (travellersNumber > 20) {
        nextErrors.travellers = 'Please enter 20 travellers or fewer.'
      }
    }

    if (currentStep === 3) {
      if (form.interests.length === 0) {
        nextErrors.interests = 'Select at least one interest.'
      }
      if (!form.travelPace) {
        nextErrors.travelPace = 'Please choose a travel pace.'
      }
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function goNext() {
    if (!validateStep(step)) return
    setStep((prev) => Math.min(prev + 1, STEPS.length))
  }

  function goPrevious() {
    setSubmitError('')
    setSubmitSuccess('')
    setStep((prev) => Math.max(prev - 1, 1))
  }

  function buildTripPayload() {
    return {
      destination: form.destination.trim(),
      start_date: form.startDate,
      end_date: form.endDate,
      preferences: {
        budget: Number(form.budget),
        travellers: Number(form.travellers),
        interests: form.interests,
        dietary_preferences: form.dietaryPreferences,
        travel_pace: form.travelPace,
      },
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!validateStep(3)) {
      setStep(3)
      return
    }

    setIsSubmitting(true)
    setSubmitError('')
    setSubmitSuccess('')

    const payload = buildTripPayload()

    try {
      const result = await tripsAPI.createTrip(payload)

      setGeneratedItinerary(result?.result || null)
      const days = result?.result?.days || [];

const activities = days.flatMap((day) =>
  ['morning', 'afternoon', 'evening']
    .map((period) => day?.[period])
    .filter((activity) => activity && activity.activity)
    .map((activity) => ({
      activity: activity.activity,
      location: activity.location || activity.activity,
    }))
);

if (activities.length > 0) {
  const routeResult = await tripsAPI.optimizeRoute({
    destination: result?.result?.destination || form.destination,
    travel_style: payload.preferences.travel_pace,
    activities,
  });

  setOptimizedRoute(routeResult?.result || null);
} else {
  setOptimizedRoute(null);
}
      setGeneratedItinerary(result?.result || null)

      setSubmitSuccess('Your personalized itinerary was generated successfully!')
    } catch (error) {
      const message = error && error.message ? error.message : String(error)

      setSubmitError(message || 'Something went wrong while creating your trip.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleSaveTrip() {
    const userId = import.meta.env.VITE_SUPABASE_TEST_USER_ID
    if (!userId) {
      setSaveMessage('Add VITE_SUPABASE_TEST_USER_ID to frontend/.env using your Supabase test user ID, then restart the frontend.')
      return
    }
    if (!generatedItinerary) {
      setSaveMessage('Generate an itinerary before saving your trip.')
      return
    }
    setIsSaving(true)
    setSaveMessage('')
    try {
      const saved = await tripsAPI.saveTrip({
        user_id: userId,
        destination: form.destination.trim(),
        start_date: form.startDate,
        end_date: form.endDate,
        preferences: {
          budget: Number(form.budget),
          travellers: Number(form.travellers),
          interests: form.interests,
          dietary_preferences: form.dietaryPreferences,
          travel_pace: form.travelPace,
          generated_itinerary: generatedItinerary,
        },
      })
      setSaveMessage(saved?.message || 'Your trip was saved successfully!')
    } catch (error) {
      setSaveMessage(error?.message || 'Unable to save your trip. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleModifyItinerary = async () => {
    if (!modificationRequest.trim() || !generatedItinerary) {
      setModificationError('Please enter a modification request.')
      return
    }
  
    setIsModifying(true)
    setModificationError('')
  
    try {
      const result = await tripsAPI.modifyTrip({
        destination: generatedItinerary.destination || form.destination,
        existing_itinerary: generatedItinerary,
        user_request: modificationRequest,
        preferences: {
          travel_pace: form.travelPace,
          budget: form.budget,
          interests: form.interests,
          travellers: form.travellers,
        },
      })
  
      setGeneratedItinerary(result.result)
      setModificationRequest('')
    } catch (error) {
      setModificationError(error.message)
    } finally {
      setIsModifying(false)
    }
  }

  const currentStep = STEPS.find((item) => item.id === step)
  const progressPercent = (step / STEPS.length) * 100

  return (
    <div className="create-trip page">
      <style>{createTripStyles}</style>

      <header className="create-trip-header">
        <p className="eyebrow">Plan a new trip</p>
        <h1>Create your itinerary</h1>
        <p className="lede create-trip-lede">
          {currentStep ? currentStep.hint : 'Share a few details and Voyage will shape the days.'}
        </p>
      </header>

      <div className="stepper" aria-label="Form progress">
        {STEPS.map((item) => (
          <div
            key={item.id}
            className={`step-pill ${step === item.id ? 'active' : ''} ${step > item.id ? 'done' : ''}`}
          >
            <span className="step-number">{item.id}</span>
            <span className="step-label">{item.title}</span>
          </div>
        ))}
      </div>

      <div className="progress-track" aria-hidden="true">
        <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
      </div>

      <form className="create-trip-form" onSubmit={handleSubmit} noValidate>
        {step === 1 && (
          <section className="form-panel" aria-labelledby="step-1-title">
            <h2 id="step-1-title">Where &amp; when</h2>

            <label className="field">
              <span>Destination</span>
              <input
                type="text"
                name="destination"
                placeholder="e.g. Kyoto, Japan"
                value={form.destination}
                onChange={(event) => updateField('destination', event.target.value)}
                aria-invalid={Boolean(errors.destination)}
              />
              {errors.destination && <p className="field-error">{errors.destination}</p>}
            </label>

            <div className="field-row">
              <label className="field">
                <span>Start date</span>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={(event) => updateField('startDate', event.target.value)}
                  aria-invalid={Boolean(errors.startDate)}
                />
                {errors.startDate && <p className="field-error">{errors.startDate}</p>}
              </label>

              <label className="field">
                <span>End date</span>
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  min={form.startDate || undefined}
                  onChange={(event) => updateField('endDate', event.target.value)}
                  aria-invalid={Boolean(errors.endDate)}
                />
                {errors.endDate && <p className="field-error">{errors.endDate}</p>}
              </label>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="form-panel" aria-labelledby="step-2-title">
            <h2 id="step-2-title">Budget &amp; group</h2>

            <div className="field-row">
              <label className="field">
                <span>Total budget (USD)</span>
                <input
                  type="number"
                  name="budget"
                  min="1"
                  step="1"
                  placeholder="1500"
                  value={form.budget}
                  onChange={(event) => updateField('budget', event.target.value)}
                  aria-invalid={Boolean(errors.budget)}
                />
                {errors.budget && <p className="field-error">{errors.budget}</p>}
              </label>

              <label className="field">
                <span>Number of travellers</span>
                <input
                  type="number"
                  name="travellers"
                  min="1"
                  max="20"
                  value={form.travellers}
                  onChange={(event) => updateField('travellers', event.target.value)}
                  aria-invalid={Boolean(errors.travellers)}
                />
                {errors.travellers && <p className="field-error">{errors.travellers}</p>}
              </label>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="form-panel" aria-labelledby="step-3-title">
            <h2 id="step-3-title">Travel style</h2>

            <fieldset className="choice-group">
              <legend>Interests</legend>
              <div className="chip-grid">
                {INTEREST_OPTIONS.map((interest) => {
                  const selected = form.interests.includes(interest)
                  return (
                    <button
                      key={interest}
                      type="button"
                      className={`chip ${selected ? 'selected' : ''}`}
                      onClick={() => toggleInterest(interest)}
                      aria-pressed={selected}
                    >
                      {interest}
                    </button>
                  )
                })}
              </div>
              {errors.interests && <p className="field-error">{errors.interests}</p>}
            </fieldset>

            <fieldset className="choice-group">
              <legend>Dietary preferences</legend>
              <div className="chip-grid">
                {DIETARY_OPTIONS.map((option) => {
                  const selected = form.dietaryPreferences.includes(option)
                  return (
                    <button
                      key={option}
                      type="button"
                      className={`chip ${selected ? 'selected' : ''}`}
                      onClick={() => toggleDietary(option)}
                      aria-pressed={selected}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>
            </fieldset>

            <fieldset className="choice-group">
              <legend>Travel pace</legend>
              <div className="pace-grid">
                {PACE_OPTIONS.map((option) => {
                  const selected = form.travelPace === option.value
                  return (
                    <label
                      key={option.value}
                      className={`pace-card ${selected ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="travelPace"
                        value={option.value}
                        checked={selected}
                        onChange={() => updateField('travelPace', option.value)}
                      />
                      <strong>{option.label}</strong>
                      <span>{option.description}</span>
                    </label>
                  )
                })}
              </div>
              {errors.travelPace && <p className="field-error">{errors.travelPace}</p>}
            </fieldset>
          </section>
        )}

        {step === 4 && (
          <section className="form-panel" aria-labelledby="step-4-title">
            <h2 id="step-4-title">Review your trip</h2>
            <dl className="review-list">
              <div>
                <dt>Destination</dt>
                <dd>{form.destination || '—'}</dd>
              </div>
              <div>
                <dt>Dates</dt>
                <dd>
                  {form.startDate || '—'} → {form.endDate || '—'}
                </dd>
              </div>
              <div>
                <dt>Budget</dt>
                <dd>{form.budget ? `$${Number(form.budget).toLocaleString()}` : '—'}</dd>
              </div>
              <div>
                <dt>Travellers</dt>
                <dd>{form.travellers || '—'}</dd>
              </div>
              <div>
                <dt>Interests</dt>
                <dd>{form.interests.length ? form.interests.join(', ') : '—'}</dd>
              </div>
              <div>
                <dt>Dietary preferences</dt>
                <dd>
                  {form.dietaryPreferences.length
                    ? form.dietaryPreferences.join(', ')
                    : 'None selected'}
                </dd>
              </div>
              <div>
                <dt>Travel pace</dt>
                <dd>
                  {PACE_OPTIONS.find((option) => option.value === form.travelPace)?.label ||
                    form.travelPace}
                </dd>
              </div>
            </dl>

            {submitError && (
              <p className="banner banner-error" role="alert">
                {submitError}
              </p>
            )}
            {submitSuccess && (
              <p className="banner banner-success" role="status">
                {submitSuccess}
              </p>
            )}
            {generatedItinerary && (
  <div className="itinerary-result">
    <h2>Your Personalized Itinerary</h2>
    <button type="button" className="btn btn-primary" onClick={handleSaveTrip} disabled={isSaving}>
      {isSaving ? 'Saving trip…' : 'Save Trip'}
    </button>
    {saveMessage && <p className="banner banner-success" role="status">{saveMessage}</p>}

    {generatedItinerary.days?.map((day) => (
      <div className="itinerary-day" key={day.day}>
        <h3>Day {day.day} – {day.date}</h3>

        {['morning', 'afternoon', 'evening'].map((period) => {
          const activity = day[period]

          return (
            <div className="activity-card" key={period}>
              <h4>{period.charAt(0).toUpperCase() + period.slice(1)}</h4>
              <h5>{activity?.activity}</h5>
              <p className="activity-time">{activity?.time}</p>
              <p>{activity?.notes}</p>
            </div>
          )
        })}
      </div>
    ))}
  </div>
)}

{optimizedRoute?.optimized_route && (
  <div className="itinerary-result">
    <h2>Optimized Travel Route</h2>

    {optimizedRoute.optimized_route.map((item) => (
      <div className="itinerary-day" key={item.sequence}>
        <h3>Stop {item.sequence}: {item.activity}</h3>
        <p><strong>Location:</strong> {item.location}</p>
        <p><strong>Travel time:</strong> {item.estimated_travel_time}</p>
        <p>{item.reason}</p>
      </div>
    ))}

    <p>{optimizedRoute.optimization_summary}</p>
  </div>
)}

   <div className="itinerary-result">
      <h2>Modify Your Itinerary</h2>
      <p>Tell us what you would like to change about your trip.</p>

      <input
        type="text"
        id="modification-request"
        placeholder="e.g. Make Day 2 more adventurous"
        value={modificationRequest}
        onChange={(e) => setModificationRequest(e.target.value)}
      />
      {modificationError && <p>{modificationError}</p>}

      <button
        type="button"
        onClick={handleModifyItinerary}
      >
        Update Itinerary
      </button>
    </div>

          </section>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={goPrevious}
            disabled={step === 1 || isSubmitting}
          >
            Previous
          </button>

          {step < STEPS.length ? (
            <button type="button" className="btn btn-primary" onClick={goNext}>
              Next
            </button>
          ) : (
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating trip…' : 'Create trip'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

const createTripStyles = `
  .create-trip {
    max-width: 760px;
  }

  .create-trip-header h1 {
    margin: 0 0 12px;
    font-family: Fraunces, Georgia, serif;
    font-size: clamp(2rem, 4vw, 2.8rem);
    line-height: 1.15;
    letter-spacing: -0.03em;
    color: var(--navy);
  }

  .create-trip-lede {
    margin-bottom: 28px;
  }

  .stepper {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;
    margin-bottom: 14px;
  }

  .step-pill {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 46px;
    padding: 8px 12px;
    border-radius: 14px;
    border: 1px solid rgba(19, 40, 61, 0.08);
    background: rgba(255, 252, 248, 0.72);
    color: var(--muted);
    font-size: 0.86rem;
    font-weight: 600;
  }

  .step-pill.active {
    color: var(--navy);
    border-color: rgba(27, 122, 110, 0.35);
    background: rgba(27, 122, 110, 0.1);
  }

  .step-pill.done {
    color: var(--teal-deep);
  }

  .step-number {
    width: 24px;
    height: 24px;
    border-radius: 8px;
    display: grid;
    place-items: center;
    background: var(--sand);
    color: var(--navy);
    font-size: 0.78rem;
    flex-shrink: 0;
  }

  .step-pill.active .step-number,
  .step-pill.done .step-number {
    background: var(--teal);
    color: white;
  }

  .step-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .progress-track {
    height: 6px;
    border-radius: 999px;
    background: rgba(19, 40, 61, 0.08);
    overflow: hidden;
    margin-bottom: 22px;
  }

  .progress-fill {
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, var(--teal), #2a9d8f);
    transition: width 0.25s ease;
  }

  .create-trip-form {
    display: grid;
    gap: 18px;
  }

  .form-panel {
    padding: 24px;
    border-radius: var(--radius);
    background: rgba(255, 252, 248, 0.88);
    border: 1px solid rgba(19, 40, 61, 0.07);
    box-shadow: 0 10px 30px rgba(11, 31, 51, 0.05);
  }

  .form-panel h2 {
    margin: 0 0 18px;
    font-size: 1.2rem;
    color: var(--navy);
  }

  .field {
    display: grid;
    gap: 8px;
    margin-bottom: 16px;
    color: var(--navy);
    font-weight: 600;
    font-size: 0.94rem;
  }

  .field:last-child {
    margin-bottom: 0;
  }

  .field input {
    width: 100%;
    min-height: 48px;
    padding: 0 14px;
    border-radius: 14px;
    border: 1px solid rgba(19, 40, 61, 0.14);
    background: var(--white);
    color: var(--ink);
    font: inherit;
    font-weight: 500;
  }

  .field input:focus {
    outline: 2px solid rgba(27, 122, 110, 0.35);
    border-color: var(--teal);
  }

  .field-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .field-error {
    margin: 0;
    color: #b42318;
    font-size: 0.86rem;
    font-weight: 500;
  }

  .choice-group {
    margin: 0 0 18px;
    padding: 0;
    border: 0;
  }

  .choice-group:last-child {
    margin-bottom: 0;
  }

  .choice-group legend {
    margin-bottom: 10px;
    color: var(--navy);
    font-weight: 600;
    font-size: 0.94rem;
  }

  .chip-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .chip {
    min-height: 40px;
    padding: 0 14px;
    border-radius: 999px;
    border: 1px solid rgba(19, 40, 61, 0.14);
    background: var(--white);
    color: var(--ink);
    font: inherit;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .chip.selected {
    border-color: transparent;
    background: rgba(27, 122, 110, 0.14);
    color: var(--teal-deep);
  }

  .pace-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }

  .pace-card {
    display: grid;
    gap: 4px;
    padding: 14px;
    border-radius: 16px;
    border: 1px solid rgba(19, 40, 61, 0.12);
    background: var(--white);
    cursor: pointer;
  }

  .pace-card input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  .pace-card strong {
    color: var(--navy);
  }

  .pace-card span {
    color: var(--muted);
    font-size: 0.86rem;
  }

  .pace-card.selected {
    border-color: rgba(27, 122, 110, 0.45);
    background: rgba(27, 122, 110, 0.08);
  }

  .review-list {
    margin: 0;
    display: grid;
    gap: 14px;
  }

  .review-list > div {
    display: grid;
    grid-template-columns: 160px 1fr;
    gap: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(19, 40, 61, 0.08);
  }

  .review-list dt {
    margin: 0;
    color: var(--muted);
    font-weight: 600;
    font-size: 0.9rem;
  }

  .review-list dd {
    margin: 0;
    color: var(--navy);
    font-weight: 600;
  }

  .banner {
    margin: 18px 0 0;
    padding: 12px 14px;
    border-radius: 14px;
    font-size: 0.92rem;
    font-weight: 500;
  }

  .banner-error {
    background: rgba(180, 35, 24, 0.08);
    color: #b42318;
  }

  .banner-success {
    background: rgba(27, 122, 110, 0.12);
    color: var(--teal-deep);
  }

  .form-actions {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }

  .form-actions .btn:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

    .itinerary-result {
    margin-top: 28px;
  }

  .itinerary-day {
    margin-top: 20px;
    padding: 20px;
    border-radius: 16px;
    background: white;
    border: 1px solid rgba(19, 40, 61, 0.1);
  }

  .itinerary-day h3 {
    color: var(--teal-deep);
    margin-bottom: 16px;
  }

  .activity-card {
    padding: 14px;
    margin-top: 12px;
    border-radius: 12px;
    background: rgba(27, 122, 110, 0.06);
  }

  .activity-card h4 {
    color: var(--teal-deep);
    margin: 0 0 8px;
    text-transform: capitalize;
  }

  .activity-card h5 {
    margin: 0 0 6px;
    color: var(--navy);
    font-size: 1rem;
  }

  .activity-card p {
    margin: 6px 0;
  }

  .activity-time {
    font-weight: 600;
    color: var(--teal-deep);
  }

  @media (max-width: 720px) {
    .stepper {
      grid-template-columns: 1fr 1fr;
    }

    .field-row,
    .pace-grid {
      grid-template-columns: 1fr;
    }

    .review-list > div {
      grid-template-columns: 1fr;
      gap: 4px;
    }
  }
`

export default CreateTrip
