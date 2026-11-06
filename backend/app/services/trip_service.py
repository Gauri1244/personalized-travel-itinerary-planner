"""Trip management service using Supabase."""


from app.db.database import database
from datetime import datetime


class TripService:

    def __init__(self):
        self.db = database.get_service_client()

    def save_trip(self, trip_data: dict):
        print("Saving trip using:", self.db)

        preferences = trip_data.get("preferences", {})
        itinerary = preferences.get("generated_itinerary", {})

        trip_id = None

        try:
            # Save the main trip
            trip_response = (
                self.db.table("trips")
                .insert(trip_data)
                .execute()
            )

            if not trip_response.data:
                raise Exception("Trip could not be saved.")

            saved_trip = trip_response.data[0]
            trip_id = saved_trip["id"]

            # Save itinerary days
            days = itinerary.get("days", [])

            for day in days:
                day_number = day.get("day", day.get("day_number"))

                day_response = (
                    self.db.table("itinerary_days")
                    .insert({
                        "trip_id": trip_id,
                        "day_number": day_number,
                        "title": day.get("title") or f"Day {day_number}",
                        "notes": day.get("notes", "")
                    })
                    .execute()
                )

                day_id = day_response.data[0]["id"]

                # Save activities for this day
                for period in ["morning", "afternoon", "evening"]:
                    activity = day.get(period)

                    if not activity or not activity.get("activity"):
                        continue

                    # Extract starting time
                    time_value = activity.get("time", "")
                    start_time = None

                    if time_value:
                        try:
                            time_text = time_value.split("-")[0].strip()

                            try:
                                start_time = datetime.strptime(
                                    time_text, "%I:%M %p"
                                ).strftime("%H:%M:%S")
                            except ValueError:
                                start_time = datetime.strptime(
                                    time_text, "%H:%M"
                                ).strftime("%H:%M:%S")

                        except ValueError:
                            start_time = None

                    self.db.table("activities").insert({
                        "day_id": day_id,
                        "title": activity["activity"],
                        "category": period.capitalize(),
                        "start_time": start_time,
                        "location": activity.get("location"),
                        "sort_order": ["morning", "afternoon", "evening"].index(period)
                    }).execute()

            return trip_response.data

        except Exception:
            # Remove partially saved trip and dependent records
            if trip_id:
                self.db.table("trips").delete().eq("id", trip_id).execute()

            raise

    def get_trips(self):
        response = self.db.table("trips").select("*").execute()
        return response.data

    def get_trip(self, trip_id: str):
        response = (
            self.db.table("trips")
            .select("*")
            .eq("id", trip_id)
            .execute()
        )
        return response.data

    def update_trip(self, trip_id: str, trip_data: dict):
        response = (
            self.db.table("trips")
            .update(trip_data)
            .eq("id", trip_id)
            .execute()
        )
        return response.data

    def delete_trip(self, trip_id: str):
        response = (
            self.db.table("trips")
            .delete()
            .eq("id", trip_id)
            .execute()
        )
        return response.data


trip_service = TripService()