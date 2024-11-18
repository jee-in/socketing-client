import { useEventDetail } from "../../../store/EventDetailContext";

const EventDetailAbout = () => {
  const { event } = useEventDetail();

  if (!event) {
    return null;
  }

  return (
    <div className="px-2">
      <div id="event-content-title" className="tab-content-title-container">
        <h2 className="tab-content-title">공연 소개</h2>
      </div>
      <div id="event-about" className="content-container bg-slate-400">
        <div key={event.id} className="event-details p-2 flex">
          <div className="h-full flex justify-center w-1/2">
            <img
              src={event.thumbnail}
              alt={event.title}
              className="h-full object-contain rounded-lg"
            />
          </div>

          <div className="w-1/2 pl-4">
            <h2 className="text-2xl font-bold">{event.title}</h2>
            <p className="text-gray-600 text-lg">{event.place}</p>
            <p className="text-gray-600 text-lg">출연: {event.cast}</p>
            <p className="text-gray-600 text-lg">
              연령 제한: {event.ageLimit}세 이상
            </p>

            <div className="mt-4">
              <h3 className="text-xl font-semibold">공연 일정</h3>
              <ul className="list-disc pl-6">
                {event.eventDates.map((schedule) => (
                  <li key={schedule.id} className="text-gray-600 text-lg">
                    {new Date(schedule.date).toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailAbout;