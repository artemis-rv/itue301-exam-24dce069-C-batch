import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav>
      <Link to="/">Events</Link>
      <Link to="/register">Register</Link>
      <Link to="/organisers">Organisers</Link>
    </nav>
  );
}
