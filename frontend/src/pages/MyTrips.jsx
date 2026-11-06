import { useEffect, useState } from 'react'
import { getTripHistory, deleteTrip, updateTrip } from '../services/tripsAPI'
import TripView from './TripView'
function MyTrips({ onBack }) {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [sharedTrip, setSharedTrip] = useState(null)
  const [editingTrip, setEditingTrip] = useState(null)
  const [editDestination, setEditDestination] = useState('')
  const [editStartDate, setEditStartDate] = useState('')
  const [editEndDate, setEditEndDate] = useState('')

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await getTripHistory()

        const tripList = Array.isArray(data)
          ? data
          : data.result || data.trips || data.data || []

        setTrips(tripList)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTrips()
  }, [])

  const getItinerary = (trip) => {
    let preferences = trip.preferences || {}

    if (typeof preferences === 'string') {
      preferences = JSON.parse(preferences)
    }

    let itinerary = preferences.generated_itinerary || {}

    if (typeof itinerary === 'string') {
      itinerary = JSON.parse(itinerary)
    }

    return itinerary
  }

  const handleDelete = async (tripId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this trip?'
    )
  
    if (!confirmDelete) return
  
    try {
      await deleteTrip(tripId)
  
      setTrips((prevTrips) =>
        prevTrips.filter((trip) => trip.id !== tripId)
      )
  
      setSelectedTrip(null)
      alert('Trip deleted successfully!')
    } catch (err) {
      alert(err.message)
    }
  }

  const handleUpdate = async () => {
    try {
      await updateTrip(editingTrip.id, {
        destination: editDestination,
        start_date: editStartDate,
        end_date: editEndDate,
      })
  
      setTrips((prevTrips) =>
        prevTrips.map((trip) =>
          trip.id === editingTrip.id
            ? {
                ...trip,
                destination: editDestination,
                start_date: editStartDate,
                end_date: editEndDate,
              }
            : trip
        )
      )
  
      setEditingTrip(null)
      alert('Trip updated successfully!')
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="page">
      <main className="hero">
        <h1>My Trips</h1>
        <p>Your saved travel itineraries.</p>

        <button
          onClick={onBack}
          className="btn btn-primary"
        >
          Back to Home
        </button>

        {loading && <p>Loading your trips...</p>}

        {error && <p>{error}</p>}

        {!loading && !error && trips.length === 0 && (
          <p>You haven't saved any trips yet.</p>
        )}

        {editingTrip && (
          <section className="feature">
            <h2>Edit Trip</h2>

            <label>Destination</label>
            <input
              type="text"
              value={editDestination}
              onChange={(e) => setEditDestination(e.target.value)}
            />

            <label>Start Date</label>
            <input
              type="date"
              value={editStartDate}
              onChange={(e) => setEditStartDate(e.target.value)}
            />

            <label>End Date</label>
            <input
              type="date"
              value={editEndDate}
              onChange={(e) => setEditEndDate(e.target.value)}
            />

            <button className="btn btn-primary" onClick={handleUpdate}>
              Save Changes
            </button>

            <button
             className="btn btn-ghost"
             onClick={() => setEditingTrip(null)}
            >
             Cancel
            </button>
            </section>
        )}
        {!selectedTrip && !sharedTrip && trips.map((trip) => (
          <article className="feature" key={trip.id}>
            <h2>{trip.destination}</h2>

            <p>Start date: {trip.start_date}</p>
            <p>End date: {trip.end_date}</p>

            <button
              className="btn btn-primary"
              onClick={() => setSelectedTrip(trip)}
            >
              View Itinerary
            </button>

            <button
              className="btn btn-ghost"
              onClick={() => handleDelete(trip.id)}
            >
              Delete Trip
            </button>

            <button
              className="btn btn-primary"
              onClick={() => {
                setEditingTrip(trip)
                setEditDestination(trip.destination)
                setEditStartDate(trip.start_date)
                setEditEndDate(trip.end_date)
             }}
            >
              Edit Trip
            </button>

            <button
              className="btn btn-primary"
              onClick={() => setSharedTrip(trip)}
            >
              Share & Export
            </button>
          </article>
        ))}
        {sharedTrip && (
          <TripView
            trip={sharedTrip}
            onBack={() => setSharedTrip(null)}
         />
        )}
        {selectedTrip && (
          <section className="feature">
            <button
              className="btn btn-ghost"
              onClick={() => setSelectedTrip(null)}
            >
              ← Back to My Trips
            </button>

            <h2>{selectedTrip.destination} Itinerary</h2>

            <p>
              {selectedTrip.start_date} to {selectedTrip.end_date}
            </p>

            {getItinerary(selectedTrip).days?.map((day) => (
              <article className="feature" key={day.day}>
                <h2>Day {day.day}</h2>
                <p>{day.date}</p>

                {['morning', 'afternoon', 'evening'].map((period) => {
                  const activity = day[period]

                  if (!activity) return null

                  return (
                    <div key={period}>
                      <h3>
                        {period.charAt(0).toUpperCase() + period.slice(1)}
                      </h3>

                      <h4>{activity.activity}</h4>

                      <p>{activity.time}</p>
                      <p>{activity.notes}</p>
                    </div>
                  )
                })}
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  )
}

export default MyTrips