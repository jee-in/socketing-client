import { ApiResponse } from "./common";

export interface Event {
  id: string;
  title: string;
  eventDates: EventDate[];
  thumbnail: string;
  place: string;
  cast: string;
  ageLimit: number;
  svg?: string;
  createdAt: string;
  updatedAt: string;
  ticketingStartTime?: string;
}

export interface EventDate {
  id: string;
  date: string;
  event?: NewEventResponseData;
  createdAt?: string;
  updatedAt?: string;
}

export type EventsResponse = ApiResponse<Event[]>;

export type SingleEventResponse = ApiResponse<Event>;

export interface NewEvent {
  title: string;
  thumbnail: string;
  place: string;
  cast: string;
  ageLimit: number;
  eventDates: string[];
  svg: string;
  ticketingStartTime: string;
}

export interface NewEventResponseData {
  id: string;
  title: string;
  thumbnail: string;
  place: string;
  cast: string;
  ageLimit: number;
  eventDates?: string[];
  svg?: string;
}

export type NewEventResponse = ApiResponse<NewEventResponseData>;

export interface Seat {
  id: string; // DB의 고유 ID
  seat_id?: string; // 임시 ID (SeatMaker에서 사용)
  cx: number; // x 좌표
  cy: number; // y 좌표
  x?: number; // 임시 x 좌표 (SeatMaker에서 사용)
  y?: number; // 임시 y 좌표 (SeatMaker에서 사용)
  area: number;
  row: number;
  number: number;
}

export type EventDeleteResponse = ApiResponse<null>;

export type SeatResponse = ApiResponse<Seat[]>;

export interface NewSeat {
  event_id: string;
  cx: number;
  cy: number;
  area: number;
  row: number;
  number: number;
}

export interface NewSeatResponseData {
  id: string;
  cx: number;
  cy: number;
  area: number;
  row: number;
  number: number;
  event: Event;
}

export type NewSeatResponse = ApiResponse<NewSeatResponseData>;

export interface Point {
  x: number;
  y: number;
}

export interface CustomEventsProps extends Omit<Event, "ticketingStartTime"> {
  ticketingStartTime: number;
}

export interface CardListProps {
  events: CustomEventsProps[] | null;
}
