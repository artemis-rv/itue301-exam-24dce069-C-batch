import { useState } from "react";
import { events } from "../data/events";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [eventId, setEventId] = useState(events[0]?.id || 1);
  const [regs, setRegs] = useState([]);
  const [message, setMessage] = useState("");

  const selectedEvent = events.find((e) => Number(e.id) === Number(eventId)) || events[0];
  const registeredForEvent = regs.filter((r) => Number(r.eventId) === Number(selectedEvent?.id)).length;
  const seatsLeft = selectedEvent ? selectedEvent.seatsLeft - registeredForEvent : 0;
  const totalPayable = regs.reduce((sum, r) => sum + r.fee, 0);

  const titleOf = (id) => events.find((e) => Number(e.id) === Number(id))?.title || "";

  const register = () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail) {
      setMessage("Name and email are required");
      return;
    }

    if (seatsLeft <= 0) {
      setMessage("Event is full");
      return;
    }

    const emailRegCount = regs.filter(
      (r) => r.email.toLowerCase() === trimmedEmail.toLowerCase()
    ).length;
    if (emailRegCount >= 3) {
      setMessage("Limit of 3 registrations reached");
      return;
    }

    const isCharusat = trimmedEmail.toLowerCase().endsWith("@charusat.edu.in");
    const fee = isCharusat ? selectedEvent.fee * 0.8 : selectedEvent.fee;

    setRegs([
      ...regs,
      {
        id: Date.now() + Math.random(),
        name: trimmedName,
        email: trimmedEmail,
        eventId: selectedEvent.id,
        fee,
      },
    ]);
    setName("");
    setEmail("");
    setMessage("");
  };

  const cancel = (id) => {
    setRegs(regs.filter((r) => r.id !== id));
  };

  return (
    <main>
      <h2>Register for an Event</h2>

      {message && <p style={{ color: "red" }}>{message}</p>}

      <div>
        <input
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <select
          value={eventId}
          onChange={(e) => setEventId(Number(e.target.value))}
        >
          {events.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title} ({e.date})
            </option>
          ))}
        </select>
        <button onClick={register}>Register</button>
      </div>

      <p>Seats left: {seatsLeft}</p>

      <h3>My registrations ({regs.length})</h3>
      <p>Total payable: ₹{totalPayable.toFixed(2)}</p>

      <ul>
        {regs.map((r) => (
          <li key={r.id}>
            {r.name} — {titleOf(r.eventId)} — ₹{Number(r.fee).toFixed(2)}{" "}
            <button onClick={() => cancel(r.id)}>Cancel</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
