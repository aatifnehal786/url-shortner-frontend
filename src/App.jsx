import React, { useState } from "react";
import "./App.css";

function App() {
  const [longUrl, setLongUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [expirationTime, setExpirationTime] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [analytics, setAnalytics] = useState(null);
  const [code, setCode] = useState("");

  const handleShorten = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ longUrl, customAlias, expirationTime }),
      });

      const data = await res.json();
      if (data.shortUrl) {
        setShortUrl(data.shortUrl);
        setAnalytics(null);
      } else {
        alert(data.error || data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error creating short URL");
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/analytics/${code}`);
      const data = await res.json();
      if (data.clickCounts !== undefined) {
        setAnalytics(data);
      } else {
        alert(data.message || "Analytics not found");
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching analytics");
    }
  };

  return (
    <div className="container">
      <h1>🔗 URL Shortener</h1>

      {/* Shorten Form */}
      <div className="card">
        <input
          type="text"
          placeholder="Enter long URL"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="Custom alias (optional)"
          value={customAlias}
          onChange={(e) => setCustomAlias(e.target.value)}
        />
        <input
          type="number"
          placeholder="Expiration time (minutes, optional)"
          value={expirationTime}
          onChange={(e) => setExpirationTime(e.target.value)}
        />
        <button onClick={handleShorten} className="primary">
          Shorten URL
        </button>
      </div>

      {/* Show Short URL */}
      {shortUrl && (
        <div className="short-url-box card">
          <p><strong>Short URL:</strong></p>
          <a href={shortUrl} target="_blank" rel="noopener noreferrer">
            {shortUrl}
          </a>
        </div>
      )}

      {/* Analytics Section */}
      <div className="card">
        <input
          type="text"
          placeholder="Enter short code (e.g., abc123)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button onClick={fetchAnalytics} className="secondary">
          Get Analytics
        </button>

        {analytics && (
          <div className="analytics">
            <p><strong>Click Count:</strong> {analytics.clickCounts}</p>
            <h3>Analytics Logs:</h3>
            <ul>
              {analytics.analytics.map((entry, i) => (
                <li key={i}>
                  <strong>IP:</strong> {entry.ipaddress} |{" "}
                  <strong>User-Agent:</strong> {entry.user} |{" "}
                  <strong>Time:</strong>{" "}
                  {new Date(entry.timestamp).toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
