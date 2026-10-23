import EventCard from "../components/EventCard";
import { events } from "../data/events";

export default function EventsPage() {
  return (
    <main>
      <h2>Upcoming Events</h2>
      <div className="grid">
        {events.map((e) => (
          <EventCard
            key={e.id}
            title={e.title}
            date={e.date}
            category={e.category}
            seatsLeft={e.seatsLeft}
            fee={e.fee}
            durationMin={e.durationMin}
          />
        ))}
      </div>
    </main>
  );
}
