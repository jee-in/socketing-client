import React, { createContext, useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import { useSocketConnection } from "../hooks/useSocketConnection";
import { SeatSelectedResponse } from "../types/api/socket";

// Types
interface Reservation {
  id: string;
  eventDate: {
    id: string;
    date: string;
  };
}

interface Seat {
  id: string;
  cx: number;
  cy: number;
  area: number;
  row: number;
  number: number;
  reservations: Reservation[];
  selectedBy?: string | null;
  updatedAt: string;
  expirationTime: string;
  reservedBy?: string;
}

interface ReservationContextType {
  socket: Socket | null;
  isConnected: boolean;
  eventId: string | null;
  setEventId: (id: string) => void;
  eventDateId: string | null;
  setEventDateId: (id: string) => void;
  seatsMap: Map<string, Seat>;
  updateSeat: (seatId: string, updates: Partial<Seat>) => void;
  joinRoom: (eventId: string, eventDateId: string) => void;
  selectSeat: (seatId: string) => void;
  currentUserId: string | null;
  selectedSeat: Seat | null;
  setSelectedSeat: (seat: Seat | null) => void;
  reserveSeat: (seatId: string, eventId: string, eventDateId: string) => void;
}

export const ReservationContext = createContext<ReservationContextType>(
  {} as ReservationContextType
);

export const ReservationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { socket, isConnected } = useSocketConnection();
  const [eventId, setEventId] = useState<string | null>(null);
  const [eventDateId, setEventDateId] = useState<string | null>(null);
  const [seatsMap, setSeatsMap] = useState<Map<string, Seat>>(new Map());
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);

  const updateSeat = (seatId: string, updates: Partial<Seat>) => {
    setSeatsMap((prev) => {
      const newMap = new Map(prev);
      const currentSeat = newMap.get(seatId);
      if (currentSeat) {
        newMap.set(seatId, {
          ...currentSeat,
          ...updates,
          selectedBy: updates.selectedBy,
          reservedBy: updates.reservedBy,
        });
      }
      return newMap;
    });
  };

  const joinRoom = (eventId: string, eventDateId: string) => {
    socket?.emit("joinRoom", { eventId, eventDateId });
  };

  const selectSeat = (seatId: string) => {
    if (!socket || !eventId || !eventDateId) return;
    // Only emit the event, don't update state directly
    const seat = seatsMap.get(seatId);
    if (seat) {
      setSelectedSeat(seat);
    }
    socket.emit("selectSeat", { seatId, eventId, eventDateId });
  };

  const reserveSeat = (seatId: string) => {
    if (!socket || !seatId || !eventId || !eventDateId) return;
    socket.emit("reserveSeat", { seatId, eventId, eventDateId });
  };

  useEffect(() => {
    if (!socket) return;

    // Get current user ID when socket connects
    socket.on("connect", () => {
      if (socket.id) setCurrentUserId(socket.id);
    });

    socket.on("roomJoined", (data: { seats: Seat[] }) => {
      const newSeatsMap = new Map();
      data.seats.forEach((seat) => newSeatsMap.set(seat.id, seat));
      setSeatsMap(newSeatsMap);
    });

    socket.on("seatSelected", (data: SeatSelectedResponse) => {
      updateSeat(data.seatId, {
        selectedBy: data.selectedBy,
        updatedAt: data.updatedAt,
        expirationTime: data.expirationTime,
        reservedBy: data.reservedBy,
      });
    });

    return () => {
      socket.off("connect");
      socket.off("roomJoined");
      socket.off("seatSelected");
    };
  }, [socket]);

  useEffect(() => {
    if (socket && eventId && eventDateId) {
      joinRoom(eventId, eventDateId);
    }
  }, [socket, eventId, eventDateId]);

  const value = {
    socket,
    isConnected,
    eventId,
    setEventId,
    eventDateId,
    setEventDateId,
    seatsMap,
    updateSeat,
    joinRoom,
    selectSeat,
    currentUserId,
    selectedSeat,
    setSelectedSeat,
    reserveSeat,
  };

  return (
    <ReservationContext.Provider value={value}>
      {children}
    </ReservationContext.Provider>
  );
};
