import axios from "axios";
import { baseURL } from "../../constants/api";
import {
  EventsResponse,
  SingleEventResponse,
  NewEvent,
  NewEventResponse,
  EventDeleteResponse,
  NewAreasResponse,
  CreateAreaRequest,
} from "../../types/api/event";
import { OrderSeatResponse } from "../../types/api/order";

const API_URL = baseURL + "events/";

const api = axios.create({
  baseURL: API_URL,
});

const fetchAllEvents = async (): Promise<EventsResponse> => {
  const response = await api.get<EventsResponse>(API_URL);
  return response.data;
};

const fetchOneEvent = async (
  event_id: string
): Promise<SingleEventResponse> => {
  const response = await api.get<SingleEventResponse>(API_URL + event_id);
  return response.data;
};

const createNewEvent = async ({
  title,
  thumbnail,
  place,
  cast,
  ageLimit,
  eventDates,
  svg,
  ticketingStartTime,
}: NewEvent): Promise<NewEventResponse> => {
  const response = await api.post<NewEventResponse>(API_URL, {
    title,
    thumbnail,
    place,
    cast,
    ageLimit,
    eventDates,
    svg,
    ticketingStartTime,
  });
  return response.data;
};

const deleteEvent = async (event_id: string): Promise<EventDeleteResponse> => {
  const response = await api.delete<EventDeleteResponse>(`${event_id}`);
  return response.data;
};

const createNewArea = async ({
  event_id,
  areas,
}: CreateAreaRequest): Promise<NewAreasResponse> => {
  const response = await api.post<NewAreasResponse>(
    API_URL + event_id + "/seats" + "/batch",
    {
      areas,
    }
  );
  return response.data;
};

const fetchAllSeats = async (event_id: string): Promise<OrderSeatResponse> => {
  const response = await api.get<OrderSeatResponse>(
    API_URL + event_id + "/seats"
  );
  return response.data;
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => {
    if (error instanceof Error) {
      return Promise.reject(error);
    }
    return Promise.reject(new Error(String(error)));
  }
);

export {
  fetchAllEvents,
  fetchOneEvent,
  createNewEvent,
  createNewArea,
  fetchAllSeats,
  deleteEvent,
};
