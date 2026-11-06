import { useState } from 'react'
import './App.css'
import CreateTrip from './pages/CreateTrip'
import MyTrips from './pages/MyTrips'

function App() {
  const [showPlanner, setShowPlanner] = useState(false)
  const [showMyTrips, setShowMyTrips] = useState(false)

  if (showMyTrips) {
    return <MyTrips onBack={() => setShowMyTrips(false)} />
  }

  if (showPlanner) {
    return <CreateTrip />
  }

  return (
    <div className="page">
      <header className="nav">
        <div className="brand">
          <span className="mark" aria-hidden="true">✈</span>
          Voyage
        </div>

        <div>
          <button
            className="nav-cta"
            type="button"
            onClick={() => setShowMyTrips(true)}
          >
            My Trips
          </button>

          <button
            className="nav-cta"
            type="button"
            onClick={() => setShowPlanner(true)}
          >
            Get Started
          </button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div>
            <p className="eyebrow">AI-powered trip design</p>

            <h1>Personalized Travel Itinerary Planner</h1>

            <p className="lede">
              Turn a destination, a few dates, and your travel style into a
              day-by-day itinerary. Voyage helps you balance must-see places,
              restful downtime, and a budget that actually fits.
            </p>

            <div className="hero-actions">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => setShowPlanner(true)}
              >
                Get Started
              </button>

              <a className="btn btn-ghost" href="#how-it-works">
                See how it works
              </a>
            </div>
          </div>
        </section>

        <section className="features" id="how-it-works">
          <article className="feature">
            <div className="icon">1</div>
            <h2>Share your trip vision</h2>
            <p>Tell us your destination, dates and travel preferences.</p>
          </article>

          <article className="feature">
            <div className="icon">2</div>
            <h2>Get a tailored itinerary</h2>
            <p>Receive a personalized day-by-day travel plan.</p>
          </article>

          <article className="feature">
            <div className="icon">3</div>
            <h2>Refine as you go</h2>
            <p>Adjust your activities and budget as needed.</p>
          </article>
        </section>
      </main>

      <footer className="footer">
        Personalized Travel Itinerary Planner · Voyage
      </footer>
    </div>
  )
}

export default App
