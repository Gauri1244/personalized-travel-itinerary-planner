import './App.css'

function App() {
  const goToPlanner = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="page">
      <header className="nav">
        <div className="brand">
          <span className="mark" aria-hidden="true">
            ✈
          </span>
          Voyage
        </div>
        <button className="nav-cta" type="button" onClick={goToPlanner}>
          Get Started
        </button>
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
              <button className="btn btn-primary" type="button" onClick={goToPlanner}>
                Get Started
              </button>
              <a className="btn btn-ghost" href="#how-it-works">
                See how it works
              </a>
            </div>
          </div>

          <div className="visual" aria-hidden="true">
            <article className="postcard">
              <div className="postcard-art">
                <div className="stamp" />
              </div>
              <h3>Kyoto · 5 days</h3>
              <p>Temples at sunrise, tea houses at dusk, and one unhurried afternoon.</p>
            </article>
            <div className="float-card">
              <span>Today’s plan</span>
              <strong>Arashiyama &amp; riverside walk</strong>
            </div>
          </div>
        </section>

        <section className="features" id="how-it-works">
          <article className="feature">
            <div className="icon">1</div>
            <h2>Share your trip vision</h2>
            <p>
              Tell us where you want to go, how you like to travel, and what
              you care about most — food, culture, nature, or nightlife.
            </p>
          </article>
          <article className="feature">
            <div className="icon">2</div>
            <h2>Get a tailored itinerary</h2>
            <p>
              Receive a clear day-by-day plan with pacing that matches your
              energy, plus time for meals, transit, and unexpected finds.
            </p>
          </article>
          <article className="feature">
            <div className="icon">3</div>
            <h2>Refine as you go</h2>
            <p>
              Swap activities, tighten the budget, or add a rest day. Your
              itinerary stays flexible from the first draft to departure.
            </p>
          </article>
        </section>
      </main>

      <footer className="footer">
        Personalized Travel Itinerary Planner · Frontend preview
      </footer>
    </div>
  )
}

export default App
