const connect = require("./db");
const Event = require("./models/Event");
const { formatValidationError } = require("./utils/formatError");

(async () => {
  try {
    await connect();

    // Save one valid event
    const validEvent = new Event({
      title: "Campus Hackathon 2026",
      date: new Date("2026-11-20"),
      category: "tech",
      capacity: 100,
      fee: 50,
    });
    const saved = await validEvent.save();
    console.log("Valid event saved successfully:", saved);

    // Validate/save an invalid event and print formatted error
    const invalidEvent = new Event({
      title: "",
      date: "invalid-date",
      category: "cultural",
      capacity: 250, // exceeds 200 for cultural
      fee: -10, // cannot be negative
    });

    try {
      await invalidEvent.save();
    } catch (err) {
      const formatted = formatValidationError(err);
      console.log("Formatted error for invalid event:\n", JSON.stringify(formatted, null, 2));
    }
  } catch (err) {
    console.error("Seed script error:", err.message);
  } finally {
    process.exit(0);
  }
})();
