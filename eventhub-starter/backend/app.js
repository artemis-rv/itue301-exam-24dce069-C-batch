const express = require("express");
const app = express();

// Request logger: [METHOD] [PATH] [TIMESTAMP]
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path} [${new Date().toISOString()}]`);
  next();
});

app.use(express.json());

let events = [
  { id: 1, title: "Hack Night", capacity: 30, fee: 100 },
  { id: 2, title: "Open Mic", capacity: 50, fee: 0 },
  { id: 3, title: "Robotics Expo", capacity: 80, fee: 250 },
];
let nextId = 4;

app.get("/api/v1/events", (req, res) => {
  if (req.query.maxFee !== undefined) {
    const maxFee = Number(req.query.maxFee);
    const filtered = events.filter((e) => e.fee <= maxFee);
    return res.status(200).json(filtered);
  }
  res.status(200).json(events);
});

app.get("/api/v1/events/:id", (req, res) => {
  const event = events.find((e) => e.id === Number(req.params.id));
  if (!event) return res.status(404).json({ error: "Event not found" });
  res.status(200).json(event);
});

app.post("/api/v1/events", (req, res) => {
  const { title, capacity } = req.body;
  const fee = req.body.fee === undefined ? 0 : req.body.fee;

  if (typeof title !== "string" || title.trim().length === 0 || title.trim().length > 80) {
    return res.status(400).json({ error: "Title must be 1 to 80 characters" });
  }

  if (typeof capacity !== "number" || !Number.isInteger(capacity) || capacity < 1 || capacity > 500) {
    return res.status(400).json({ error: "Capacity must be an integer between 1 and 500" });
  }

  if (typeof fee !== "number" || isNaN(fee) || fee < 0) {
    return res.status(400).json({ error: "Fee must be a number greater than or equal to 0" });
  }

  const event = { id: nextId++, title: title.trim(), capacity, fee };
  events.push(event);
  res.status(201).json(event);
});

app.delete("/api/v1/events/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = events.findIndex((e) => e.id === id);
  if (index === -1) return res.status(404).json({ error: "Event not found" });
  const [removed] = events.splice(index, 1);
  res.status(200).json(removed);
});

// Diagnostic route used to test the error handler. Leave it in place.
app.get("/api/v1/boom", () => {
  throw new Error("Stage collapsed");
});

// Global error handler (MUST be declared after all routes)
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: "Something went wrong" });
});

module.exports = app;
