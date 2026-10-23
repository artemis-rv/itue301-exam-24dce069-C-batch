import { formatDate, formatDuration } from "../utils/format";

export default function EventCard({ title, date, category, seatsLeft, fee, durationMin }) {
  const isFull = Number(seatsLeft) === 0;
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{category}</p>
      <p>{formatDate(date)} · {formatDuration(durationMin)}</p>
      <p>{Number(fee) === 0 ? "Free" : `₹${Number(fee).toFixed(2)}`}</p>
      <p className="badge">{isFull ? "Full" : `${seatsLeft} seats left`}</p>
    </div>
  );
}
