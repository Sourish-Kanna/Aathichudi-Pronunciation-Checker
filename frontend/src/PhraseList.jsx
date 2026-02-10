import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPhrases } from "./api";
import "./PhraseList.css";

const PhraseList = () => {
  const [phrases, setPhrases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPhrases();
      setPhrases(data);
    } catch (e) {
      console.error("Error fetching phrases:", e);
      setError(e.message || "Failed to load phrases. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="phrase-list-container">
      <h1 className="list-header">Athichudi — Phrases</h1>

      {loading ? (
        <div className="loading-container">Loading phrases...</div>
      ) : error ? (
        <div className="error-container" style={{
          padding: '20px',
          margin: '20px auto',
          maxWidth: '600px',
          backgroundColor: '#FEE2E2',
          border: '2px solid #EF4444',
          borderRadius: '8px',
          color: '#991B1B',
          textAlign: 'center'
        }}>
          <h3 style={{ marginTop: 0 }}>⚠️ Backend Connection Error</h3>
          <p>{error}</p>
          <button 
            onClick={fetchData} 
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              backgroundColor: '#DC2626',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Retry
          </button>
        </div>
      ) : !phrases.length ? (
        <div className="loading-container">No phrases found.</div>
      ) : (
        <div className="list-grid">
          {phrases.map((p) => (
            <Link to={`/phrases/${p.id}`} key={p.id} className="phrase-card-link">
              <div className="card-content">
                <div className="text-group">
                  <div className="tamil-text">{p.tamil}</div>
                  <div className="transliteration-text">
                    {p.transliteration} — <em>{p.meaning_en}</em>
                  </div>
                </div>
                <div className="practice-cta">Practice →</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhraseList;