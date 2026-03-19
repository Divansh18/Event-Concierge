import axios from 'axios';
import { EventSearch } from '@/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000, // 60s — AI calls can be slow
});

export async function createEventSearch(query: string): Promise<EventSearch> {
  const { data } = await api.post<EventSearch>('/events', { query });
  return data;
}

export async function fetchAllSearches(): Promise<EventSearch[]> {
  const { data } = await api.get<EventSearch[]>('/events');
  return data;
}

export async function deleteSearch(id: number): Promise<void> {
  await api.delete(`/events/${id}`);
}
