import { useState } from 'react'

function TripView({ trip, onBack }) {
const [copied, setCopied] = useState(false)

const getItinerary = () => {
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

const itinerary = getItinerary()

const shareTrip = async () => {
const summary = `My Trip to ${trip.destination}
Travel Dates: ${trip.start_date} to ${trip.end_date}

${itinerary.days?.map(day => `Day ${day.day} - ${day.date}
Morning: ${day.morning?.activity || 'Free time'}
Afternoon: ${day.afternoon?.activity || 'Free time'}
Evening: ${day.evening?.activity || 'Free time'}`).join('\n') || 'Itinerary details unavailable.'}`


try {
  await navigator.clipboard.writeText(summary)
  setCopied(true)
  setTimeout(() => setCopied(false), 2000)
} catch (error) {
  alert('Unable to copy trip details.')
}


}

const downloadTrip = () => {
const content = `TRAVEL ITINERARY
Destination: ${trip.destination}
Start Date: ${trip.start_date}
End Date: ${trip.end_date}

${itinerary.days?.map(day => `DAY ${day.day} - ${day.date}
Morning: ${day.morning?.activity || 'Free time'}
Afternoon: ${day.afternoon?.activity || 'Free time'}
Evening: ${day.evening?.activity || 'Free time'}`).join('\n') || 'No itinerary details available.'}`


const blob = new Blob([content], {
  type: 'text/plain;charset=utf-8'
})

const url = URL.createObjectURL(blob)
const link = document.createElement('a')

link.href = url
link.download = `${trip.destination}-itinerary.txt;`
link.click()

URL.revokeObjectURL(url)


}

return ( <div className="page"> <main className="hero"> <button className="btn btn-ghost" onClick={onBack}>
← Back to My Trips </button>


    <h1>{trip.destination} Travel Plan</h1>

    <p>
      {trip.start_date} to {trip.end_date}
    </p>

    <button className="btn btn-primary" onClick={shareTrip}>
      {copied ? 'Copied!' : 'Share Trip'}
    </button>

    <button className="btn btn-primary" onClick={downloadTrip}>
      Download Itinerary
    </button>

    {itinerary.days?.map(day => (
      <article className="feature" key={day.day}>
        <h2>Day {day.day}</h2>
        <p>{day.date}</p>

        {['morning', 'afternoon', 'evening'].map(period => {
          const activity = day[period]
          if (!activity) return null

          return (
            <div key={period}>
              <h3>{period.charAt(0).toUpperCase() + period.slice(1)}</h3>
              <h4>{activity.activity}</h4>
              <p>{activity.time}</p>
              <p>{activity.notes}</p>
            </div>
          )
        })}
      </article>
    ))}
  </main>
</div>


)
}

export default TripView
