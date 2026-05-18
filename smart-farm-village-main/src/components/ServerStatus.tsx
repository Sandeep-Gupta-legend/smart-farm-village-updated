import React, { useEffect, useState } from "react";

const SERVER_URL = "http://localhost:5000/api/health";

const ServerStatus: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [serverUp, setServerUp] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let lastStatus = true;
    const checkServer = async () => {
      try {
        const res = await fetch(SERVER_URL);
        if (res.ok) {
          setServerUp(true);
          if (!lastStatus) {
            window.location.reload(); // reload when server comes back
          }
          lastStatus = true;
        } else {
          setServerUp(false);
          lastStatus = false;
        }
      } catch {
        setServerUp(false);
        lastStatus = false;
      } finally {
        setLoading(false);
      }
    };
    checkServer();
    const interval = setInterval(checkServer, 10000); // check every 10s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="server-loading">
        <div className="server-spinner" />
        <h2>Checking server status...</h2>
      </div>
    );
  }

  if (!serverUp) {
    return (
      <div className="server-down">
        <div className="server-down-animation">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#e53e3e" strokeWidth="2" /><path d="M8 12h8" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round" /><circle cx="12" cy="16" r="1" fill="#e53e3e" /></svg>
        </div>
        <h1 style={{ color: '#e53e3e', fontWeight: 'bold', fontSize: '2rem', marginTop: '1rem' }}>Server Down</h1>
        <p style={{ color: '#555', fontSize: '1.2rem' }}>Please try again later. The backend server is not reachable.</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ServerStatus;
