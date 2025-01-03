import React from "react";
import { EventDate } from "../../../types/api/event";
import { formatToKoreanDateAndTime } from "../../../utils/dateUtils";

interface DateProps {
  dateData: EventDate[];
}

const ReservationCalendarSideBar: React.FC<DateProps> = ({ dateData }) => {
  return (
    <div className="h-full flex justify-center overflow-y-auto">
      <div className="space-y-3">
        <h2 className="text-lg text-center font-bold mb-2">공연 일정</h2>
        {dateData.map((dateData, index) => (
          <button
            key={index}
            className="w-full md:w-[150px] p-3 text-sm bg-white font-bold shadow rounded-lg text-center border"
          >
            {formatToKoreanDateAndTime(dateData.date)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReservationCalendarSideBar;
