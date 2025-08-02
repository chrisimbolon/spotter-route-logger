// src/lib/api.ts

import axios from 'axios';

export const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getTrips() {
  const res = await api.get("/trips/");
  return res.data;
}

export async function getLogsheet(tripId: string) {
  const res = await api.get(`/generate-logsheet/${tripId}/`);
  return res.data;
}

export default api;
