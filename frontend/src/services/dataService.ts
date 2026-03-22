// API Service for interacting with backend

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role?: "USER" | "ADMIN";
  approved?: boolean;
  superAdmin?: boolean;
}

export interface Review {
  id: string;
  uid: string;
  userName: string;
  destination: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Itinerary {
  id: string;
  uid: string;
  destination: string;
  duration: number;
  content: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  uid: string;
  destination: string;
  travelers: number;
  startDate: string;
  endDate: string;
  price?: number;
  status?: string;
  createdAt: string;
}

export const dataService = {

  // ---------------- AUTH ----------------

  login: async (email: string, password: string): Promise<User> => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");

    return data;
  },

  signup: async (email: string, password: string, displayName: string, role?: string): Promise<User> => {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, displayName, role })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Signup failed");

    return data;
  },

  requestOTP: async (email: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/auth/otp/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to send OTP");

    if (data.otp) console.log(`[DEBUG OTP]: ${data.otp}`);
  },

  verifyOTP: async (email: string, otp: string): Promise<User> => {
    const res = await fetch(`${API_BASE}/auth/otp/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Invalid OTP");

    return data;
  },

  // ---------------- REVIEWS ----------------

  getReviews: async (): Promise<Review[]> => {
    const res = await fetch(`${API_BASE}/reviews`);
    const data = await res.json();

    if (!res.ok) throw new Error("Failed to fetch reviews");

    return data;
  },

  subscribeToReviews: (callback: (reviews: Review[]) => void) => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_BASE}/reviews`);
        const data = await res.json();

        if (!res.ok) return;

        callback(data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    fetchReviews();
    const interval = setInterval(fetchReviews, 5000);

    return () => clearInterval(interval);
  },

  addReview: async (review: Omit<Review, "id" | "createdAt">) => {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(review)
    });

    const data = await res.json();
    if (!res.ok) throw new Error("Failed to add review");

    return data;
  },

  deleteReview: async (id: string) => {
    const res = await fetch(`${API_BASE}/reviews/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) throw new Error("Failed to delete review");

    return await res.json();
  },

  // ---------------- ITINERARY ----------------

  saveItinerary: async (itinerary: Omit<Itinerary, "id" | "createdAt">) => {
    const res = await fetch(`${API_BASE}/itineraries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(itinerary)
    });

    const data = await res.json();
    if (!res.ok) throw new Error("Failed to save itinerary");

    return data;
  },

  getItineraries: async (uid: string) => {
    const res = await fetch(`${API_BASE}/itineraries/${uid}`);
    const data = await res.json();

    if (!res.ok) throw new Error("Failed to load itineraries");

    return data;
  },

  getAllItineraries: async (): Promise<Itinerary[]> => {
    const res = await fetch(`${API_BASE}/itineraries`);
    const data = await res.json();

    if (!res.ok) throw new Error("Failed to load itineraries");

    return data;
  },

  deleteItinerary: async (id: string) => {
    const res = await fetch(`${API_BASE}/itineraries/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) throw new Error("Failed to delete itinerary");

    return await res.json();
  },

  // ---------------- BOOKINGS ----------------

  bookTour: async (booking: any) => {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Booking failed");

    return data;
  },
  updateBooking: async (id: string, booking: any) => {
  const res = await fetch(`${API_BASE}/bookings/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(booking)
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Failed to update booking");

  return data;
},

  getUserBookings: async (uid: string): Promise<Booking[]> => {
    const res = await fetch(`${API_BASE}/bookings/user/${uid}`);
    const data = await res.json();

    if (!res.ok) throw new Error("Failed to load bookings");

    return data;
  },

  getAllBookings: async (): Promise<Booking[]> => {
    const res = await fetch(`${API_BASE}/bookings`);
    const data = await res.json();

    if (!res.ok) throw new Error("Failed to load bookings");

    return data;
  },

  deleteBooking: async (id: string) => {
    const res = await fetch(`${API_BASE}/bookings/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) throw new Error("Failed to delete booking");

    return await res.json();
  },

  // ---------------- DESTINATIONS ----------------

  getDestinations: async () => {
    const res = await fetch(`${API_BASE}/destinations`);
    const data = await res.json();

    if (!res.ok) throw new Error("Failed to load destinations");

    return data;
  },// ---------------- DESTINATIONS ----------------

updateDestination: async (id: string, destination: any) => {
  const res = await fetch(`${API_BASE}/destinations/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(destination)
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Failed to update destination");

  return data;
},

  addDestination: async (destination: any) => {
    const res = await fetch(`${API_BASE}/destinations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(destination)
    });

    if (!res.ok) throw new Error("Failed to add destination");

    return await res.json();
  },

  deleteDestination: async (id: string) => {
    const res = await fetch(`${API_BASE}/destinations/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) throw new Error("Failed to delete destination");

    return await res.json();
  },

  // ---------------- ADMIN ----------------

  getAllUsers: async (): Promise<User[]> => {
    const res = await fetch(`${API_BASE}/admin/users`);
    const data = await res.json();

    if (!res.ok) throw new Error("Failed to load users");

    return data;
  },

  getAdminStats: async () => {
    const res = await fetch(`${API_BASE}/admin/stats`);
    const data = await res.json();

    if (!res.ok) throw new Error("Failed to load admin stats");

    return data;
  },

  updateUser: async (uid: string, userData: Partial<User>) => {
    const res = await fetch(`${API_BASE}/admin/users/${uid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });

    if (!res.ok) throw new Error("Failed to update user");

    return await res.json();
  },

  deleteUser: async (uid: string) => {
    const res = await fetch(`${API_BASE}/admin/users/${uid}`, {
      method: "DELETE"
    });

    if (!res.ok) throw new Error("Failed to delete user");

    return await res.json();
  },

 approveUser: async (uid: string, adminEmail: string) => {
  const res = await fetch(`${API_BASE}/admin/users/${uid}/approve?adminEmail=${adminEmail}`, {
    method: "PUT"
  });

  if (!res.ok) throw new Error("Failed to approve user");

  return await res.json();
}
};