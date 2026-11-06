const API_BASE_URL = "http://127.0.0.1:8000";

// Generate itinerary
export const generateTrip = async (tripData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/trips/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tripData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Failed to generate itinerary");
    }

    return data;
  } catch (error) {
    console.error("Trip generation error:", error);
    throw error;
  }
};

// Optimize route
export const optimizeRoute = async (routeData) => {
  const response = await fetch(`${API_BASE_URL}/trips/optimize-route`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(routeData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to optimize route");
  }

  return data;
};

// Modify itinerary
export const modifyTrip = async (modificationData) => {
  const response = await fetch(`${API_BASE_URL}/trips/modify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(modificationData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to modify itinerary");
  }

  return data;
};

// Save trip
export const saveTrip = async (tripData) => {
  const response = await fetch(`${API_BASE_URL}/trips/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tripData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to save trip");
  }

  return data;
};

// Get trip history
export const getTripHistory = async () => {
  const response = await fetch(`${API_BASE_URL}/trips/history`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to fetch trip history");
  }

  return data;
};

// Update trip
export const updateTrip = async (tripId, tripData) => {
  const response = await fetch(`${API_BASE_URL}/trips/${tripId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tripData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to update trip");
  }

  return data;
};

// Delete trip
export const deleteTrip = async (tripId) => {
  const response = await fetch(`${API_BASE_URL}/trips/${tripId}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to delete trip");
  }

  return data;
};

// Export all API functions
export const tripsAPI = {
  createTrip: generateTrip,
  optimizeRoute,
  modifyTrip,
  saveTrip,
  getTripHistory,
  updateTrip,
  deleteTrip,
};