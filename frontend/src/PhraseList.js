import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPhrases } from "./api";

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

  if (loading) return <div style={{ textAlign: "center", marginTop: "100px" }}>Loading phrases...</div>;
  if (!phrases.length) return <div style={{ textAlign: "center", marginTop: "100px" }}>No phrases found.</div>;

  return (
    <div style={{ padding: "24px", fontFamily: "'Poppins', sans-serif" }}>
      <h1 style={{ color: "#2563EB", textAlign: "center" }}>Athichudi — Phrases</h1>
      <div style={{ display: "grid", gap: "12px", marginTop: "16px", maxWidth: "900px", marginLeft: "auto", marginRight: "auto" }}>
        {phrases.map((p) => (
          <Link
            to={`/phrases/${p.id}`}
            key={p.id}
            style={{
              textDecoration: "none",
              borderRadius: "10px",
              padding: "16px",
              backgroundColor: "#fff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              color: "#111827",
              display: "block",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "1.3rem", fontWeight: 600 }}>{p.tamil}</div>
                <div style={{ color: "#6B7280" }}>{p.transliteration} — <em>{p.meaning_en}</em></div>
              </div>
              <div style={{ color: "#2563EB", fontWeight: 600 }}>Practice →</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PhraseList;
