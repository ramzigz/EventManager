// src/types/events.d.ts

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
}

export interface EventsResponse {
  events: Event[];
  total: number;
  skip: number;
  limit: number;
}

export interface SearchResponse {
  events: Event[];
  total: number;
  skip: number;
  limit: number;
}

export type PaginationParams = {
  limit: number;
  skip: number;
  select?: string;
};