import React, { useEffect, useState } from 'react';
import { getCurrentSprint, listSprints, fetchSprint } from './api';

const Sprint = ({ token }) => {
  const [currentSprint, setCurrentSprint] = useState(null);
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleFetchSprint = async () => {
    setLoading(true);
    try {
      await fetchSprint(token);  // Trigger backend fetch
      const current = await getCurrentSprint(token);
      setCurrentSprint(current);
      const allSprints = await listSprints(token);
      setSprints(allSprints);
    } catch (error) {
      setError('Failed to fetch sprint data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchSprint();  // Fetch data on component mount
  }, [token]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Current Sprint</h1>
      {currentSprint ? (
        <div>
          <h2>{currentSprint.name}</h2>
          <p>{currentSprint.summary_ai}</p>
          <ul>
            {currentSprint.tickets.map((ticket) => (
              <li key={ticket.key}>
                <strong>{ticket.key}</strong>: {ticket.summary} [{ticket.status}]
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No current sprint data available.</p>
      )}

      <h1>All Sprints</h1>
      <ul>
        {sprints.map((sprint) => (
          <li key={sprint._id}>
            <h2>{sprint.name}</h2>
            <p>{sprint.summary_ai}</p>
          </li>
        ))}
      </ul>
      <button onClick={handleFetchSprint}>Refresh Sprint Data</button>
    </div>
  );
};

export default Sprint;