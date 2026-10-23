import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import EventsPage from "./pages/EventsPage";
import RegisterPage from "./pages/RegisterPage";
import OrganisersPage from "./pages/OrganisersPage";

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<EventsPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/organisers" element={<OrganisersPage />} />
      </Routes>
    </>
  );
}
