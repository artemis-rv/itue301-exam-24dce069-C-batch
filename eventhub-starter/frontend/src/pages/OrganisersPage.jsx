import { useState, useEffect } from "react";

const URL = "https://jsonplaceholder.typicode.com/users?_limit=10";

export default function OrganisersPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrganisers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(URL);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError("Could not load organisers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganisers();
  }, []);

  if (loading) return <p>Loading organisers...</p>;

  if (error) {
    return (
      <main>
        <h2>Organisers</h2>
        <p>{error}</p>
        <button onClick={fetchOrganisers}>Retry</button>
      </main>
    );
  }

  const sortedData = [...data].sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );

  return (
    <main>
      <h2>Organisers</h2>
      <p>{sortedData.length} organisers</p>
      <ul>
        {sortedData.map((o) => (
          <li key={o.id}>
            <strong>{o.name}</strong> — {o.company?.name} ({o.email})
          </li>
        ))}
      </ul>
    </main>
  );
}
