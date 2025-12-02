import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPhrases } from "./api";
import "./PhraseList.css";

const PhraseList = () => {
  const [phrases, setPhrases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        const data = await getPhrases();
        if (mounted) setPhrases(data);
      } catch (e) {
        console.error("Error fetching phrases:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchData();
    return () => (mounted = false);
  }, []);

  return (
    <div className="phrase-list-container">
      <h1 className="list-header">Athichudi — Phrases</h1>

      {loading ? (
        <div className="loading-container">Loading phrases...</div>
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