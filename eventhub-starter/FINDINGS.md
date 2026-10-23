# FINDINGS

---

## T1 — The Event Listing (Components and Props)

### Summary Table

| Task | Where (file / line) | Why it stopped the rules being met | How I fixed it |
| :--- | :--- | :--- | :--- |
| T1 | [`frontend/src/pages/EventsPage.jsx:10`](frontend/src/pages/EventsPage.jsx#L10) | Non-unique key `key={e.title}` was used (`Workshop` appears twice), producing console warnings and violating React list-rendering requirements. | Replaced `key={e.title}` with unique event identifier `key={e.id}`. |
| T1 | [`frontend/src/pages/EventsPage.jsx:11`](frontend/src/pages/EventsPage.jsx#L11) | Mismatched prop name (`seats={e.seatsLeft}` instead of `seatsLeft`), causing the component to receive `undefined`. | Renamed prop to `seatsLeft={e.seatsLeft}` so it matches `EventCard`'s props. |
| T1 | [`frontend/src/components/EventCard.jsx:2`](frontend/src/components/EventCard.jsx#L2) | Used assignment operator `seatsLeft = 0` instead of comparison `===`, mutating the variable and making `isFull` evaluate to `0` (falsy). | Changed condition to `const isFull = Number(seatsLeft) === 0;`. |
| T1 | [`frontend/src/utils/format.js:1-4`](frontend/src/utils/format.js#L1-L4) | `formatDate` was an unimplemented stub returning raw ISO date strings (`YYYY-MM-DD`). | Implemented `formatDate` to split date parts and format them as `DD Mon YYYY` (e.g. `05 Nov 2026`). |
| T1 | [`frontend/src/utils/format.js:6-9`](frontend/src/utils/format.js#L6-L9) | `formatDuration` was an unimplemented stub returning raw minutes instead of formatted hours and minutes omitting zero parts. | Implemented `formatDuration` to return `${h} h ${m} min`, `${h} h`, or `${m} min`. |
| T1 | [`frontend/src/components/EventCard.jsx:7`](frontend/src/components/EventCard.jsx#L7) | Displayed raw unformatted values (`{date} · {durationMin} min`) without invoking format utilities. | Updated card markup to render `{formatDate(date)} · {formatDuration(durationMin)}`. |
| T1 | [`frontend/src/main.jsx:8-10`](frontend/src/main.jsx#L8-L10) | Browser console emitted React Router v7 future transition and splat route resolution warnings. | Added `future={{ v7_startTransition: true, v7_relativeSplatPath: true }}` to `<BrowserRouter>`. |

---

## T2 — The Registration (Routing and State)

### Summary Table

| Task | Where (file / line) | Why it stopped the rules being met | How I fixed it |
| :--- | :--- | :--- | :--- |
| T2 | [`frontend/src/components/NavBar.jsx:7`](frontend/src/components/NavBar.jsx#L7) | Link pointed to `/registration` while `App.jsx` declared route `/register`, breaking SPA navigation. | Changed link path to `/register`. |
| T2 | [`frontend/src/pages/RegisterPage.jsx:13-14`](frontend/src/pages/RegisterPage.jsx#L13-L14) | Mutated state directly with `regs.push()` and passed the same reference to `setRegs`, failing re-renders. | Replaced with immutable state update `setRegs([...regs, newReg])`. |
| T2 | [`frontend/src/pages/RegisterPage.jsx:12`](frontend/src/pages/RegisterPage.jsx#L12) | No validation for empty name or email. | Added validation showing `"Name and email are required"`. |
| T2 | [`frontend/src/pages/RegisterPage.jsx:12`](frontend/src/pages/RegisterPage.jsx#L12) | Allowed registration when event is full or when an email reached 3 registrations. | Added checks refusing registration with `"Event is full"` or `"Limit of 3 registrations reached"`. |
| T2 | [`frontend/src/pages/RegisterPage.jsx:32`](frontend/src/pages/RegisterPage.jsx#L32) | Fee payable and 20% institutional discount for `@charusat.edu.in` were not computed or shown. | Computed fee (`0.8 * fee` for `@charusat.edu.in`, else full fee) and displayed formatted fee. |
| T2 | [`frontend/src/pages/RegisterPage.jsx:19-35`](frontend/src/pages/RegisterPage.jsx#L19-L35) | Missing remaining seats display, total payable counter, and cancellation mechanism. | Added `"Seats left: <n>"`, `"Total payable: ₹<amount>"`, and a `Cancel` button to restore seats and reduce total. |

---

## T3 — The Organisers Directory (API Consumption)

### Summary Table

| Task | Where (file / line) | Why it stopped the rules being met | How I fixed it |
| :--- | :--- | :--- | :--- |
| T3 | [`frontend/src/pages/OrganisersPage.jsx:10`](frontend/src/pages/OrganisersPage.jsx#L10) | `fetch(URL)` was in component root without `useEffect`, firing infinite HTTP requests on each state update. | Wrapped the API call in `useEffect(..., [])` to trigger exactly once on mount. |
| T3 | [`frontend/src/pages/OrganisersPage.jsx:13`](frontend/src/pages/OrganisersPage.jsx#L13) | `res.json()` was not returned in the promise handler, resolving to `undefined`. | Used `await res.json()` and passed the parsed array to `setData`. |
| T3 | [`frontend/src/pages/OrganisersPage.jsx:25`](frontend/src/pages/OrganisersPage.jsx#L25) | Organisers were rendered in arbitrary API order instead of sorted alphabetically. | Sorted list with `a.name.toLowerCase().localeCompare(b.name.toLowerCase())` (A–Z case-insensitive). |
| T3 | [`frontend/src/pages/OrganisersPage.jsx:24`](frontend/src/pages/OrganisersPage.jsx#L24) | Did not show the total count of organisers (`"<n> organisers"`). | Added `<p>{sortedData.length} organisers</p>`. |
| T3 | [`frontend/src/pages/OrganisersPage.jsx:8,16`](frontend/src/pages/OrganisersPage.jsx#L8-L16) | On network error or status outside 200–299, no error message or Retry button was shown. | Handled errors with `"Could not load organisers"` message and a `Retry` button to re-fetch without reload. |

---

## T4 — The Events Service (Express and Middleware)

### Summary Table

| Task | Where (file / line) | Why it stopped the rules being met | How I fixed it |
| :--- | :--- | :--- | :--- |
| T4 | [`backend/app.js:12-15`](backend/app.js#L12-L15) | Error-handling middleware was registered before routes, causing Express's default HTML handler to leak stack traces on 500. | Moved error middleware to the very end after all route definitions. |
| T4 | [`backend/app.js:24`](backend/app.js#L24) | `GET /api/v1/events` ignored the query parameter `?maxFee=n`. | Filtered events by `fee <= Number(req.query.maxFee)` when `maxFee` is present. |
| T4 | [`backend/app.js:29`](backend/app.js#L29) | `GET /api/v1/events/:id` used strict equality `e.id === req.params.id` (number vs string), always returning 404. | Converted `req.params.id` to `Number(req.params.id)`. |
| T4 | [`backend/app.js:34-41`](backend/app.js#L34-L41) | POST route had inverted title logic (`if (title) return 400`) and missing validations for capacity (1-500 integer) and fee. | Added checks for trimmed title (1-80 chars), capacity (integer 1-500), fee (>= 0, default 0). |
| T4 | [`backend/app.js:43`](backend/app.js#L43) | `DELETE /api/v1/events/:id` route was completely missing. | Implemented DELETE route returning 200 with the deleted event or 404 JSON if not found. |

---

## T5 — The Event Data (MongoDB and Mongoose)

### Summary Table

| Task | Where (file / line) | Why it stopped the rules being met | How I fixed it |
| :--- | :--- | :--- | :--- |
| T5 | [`backend/models/Event.js:4`](backend/models/Event.js#L4) | Used `require:` instead of `required:`, allowing documents to be saved with undefined titles. | Corrected property key to `required: [true, "title is required"]`. |
| T5 | [`backend/models/Event.js:5`](backend/models/Event.js#L5) | Defined `date` as `type: String`, allowing non-date strings (e.g. `"banana"`). | Changed type to `Date` with required validator. |
| T5 | [`backend/models/Event.js:18`](backend/models/Event.js#L18) | Used `Date.now()` (invoked immediately at file evaluation), giving all documents the identical startup timestamp. | Changed to function reference `default: Date.now`. |
| T5 | [`backend/utils/formatError.js:3-5`](backend/utils/formatError.js#L3-L5) | `formatValidationError` returned raw error object instead of client-safe formatted object. | Formatted error as `{ error: "Validation failed", details: [ { field, message }, ... ] }`. |
| T5 | [`backend/seed.js:8`](backend/seed.js#L8) | Missing seed implementation to save a valid event and demonstrate invalid error handling. | Added routine saving a valid event and printing formatted errors for an invalid document. |

