"""Trip management service using Supabase."""


from app.db.database import database


class TripService:

    def __init__(self):
        self.db = database.get_service_client()

    def save_trip(self, trip_data: dict):
        print("Saving trip using:", self.db)
        response = self.db.table("trips").insert(trip_data).execute()
        return response.data

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