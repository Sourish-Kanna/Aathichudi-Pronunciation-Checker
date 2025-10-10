import React, { useEffect, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { getPhrases, checkPronunciation } from "./api";

const PhrasePractice = () => {
  const [phrases, setPhrases] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false); // Tracks live recording
// eslint-disable-next-line
  const { startRecording, stopRecording, mediaBlobUrl, status } = useReactMediaRecorder({ // eslint-disable-next-line
    audio: true,
    onStop: () => setIsRecording(false),
    onStart: () => setIsRecording(true),
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getPhrases();
        setPhrases(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching phrases:", error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const currentPhrase = phrases[currentIndex];

  const handleUpload = async () => {
    if (!mediaBlobUrl || !currentPhrase) return;
    const response = await fetch(mediaBlobUrl);
    const blob = await response.blob();
    const file = new File([blob], "user.wav", { type: "audio/wav" });
    const result = await checkPronunciation(currentPhrase.id, file);

    if (result.verdict === "correct") {
      setFeedback("✅ Correct! Moving to next phrase...");
      setTimeout(() => {
        setFeedback("");
        setCurrentIndex((prev) => (prev + 1 < phrases.length ? prev + 1 : 0));
      }, 1500);
    } else {
      setFeedback("❌ Try Again!");
    }
  };

  if (loading) return <div style={{ textAlign: "center", marginTop: "100px" }}>Loading phrases...</div>;
  if (!currentPhrase) return <div style={{ textAlign: "center", marginTop: "100px" }}>No phrases found.</div>;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #60A5FA, #93C5FD)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Poppins', sans-serif",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "16px",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
          width: "100%",
          maxWidth: "500px",
          textAlign: "center",
          padding: "40px 20px",
          transition: "transform 0.3s ease",
        }}
      >
        <h2 style={{ color: "#2563EB", marginBottom: "10px" }}>📖 Athichudi Practice</h2>
        <p style={{ fontSize: "1.4rem", fontWeight: "600", color: "#1F2937" }}>
          {currentPhrase.tamil}
        </p>
        <p style={{ color: "#4B5563", fontStyle: "italic" }}>
          ({currentPhrase.transliteration})
        </p>
        <p style={{ margin: "10px 0", color: "#6B7280" }}>
          Meaning: <strong>{currentPhrase.meaning_en}</strong>
        </p>

        <audio controls src={currentPhrase.audio_tts} style={{ marginTop: "10px", width: "100%" }} />

        <div style={{ marginTop: "25px" }}>
          <button
            onClick={() => { startRecording(); setIsRecording(true); }}
            style={{
              backgroundColor: "#2563EB",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "10px 20px",
              margin: "5px",
              cursor: "pointer",
              fontSize: "1rem",
              transition: "background 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#1E40AF")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#2563EB")}
          >
            🎙️ Start Recording
          </button>

          <button
            onClick={() => { stopRecording(); setIsRecording(false); }}
            style={{
              backgroundColor: "#DC2626",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "10px 20px",
              margin: "5px",
              cursor: "pointer",
              fontSize: "1rem",
              transition: "background 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#991B1B")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#DC2626")}
          >
            🛑 Stop
          </button>
        </div>

        {/* Live recording feedback */}
        {isRecording && (
          <h3
            style={{
              marginTop: "15px",
              color: "#F59E0B",
              fontWeight: "600",
              transition: "all 0.3s ease",
            }}
          >
            🔴 Recording in progress...
          </h3>
        )}

        {mediaBlobUrl && (
          <div style={{ marginTop: "20px" }}>
            <audio src={mediaBlobUrl} controls style={{ width: "100%" }} />
            <button
              onClick={handleUpload}
              style={{
                backgroundColor: "#059669",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "10px 25px",
                marginTop: "10px",
                cursor: "pointer",
                fontSize: "1rem",
                transition: "background 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#047857")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#059669")}
            >
              ✅ Upload & Check
            </button>
          </div>
        )}

        {feedback && (
          <h3
            style={{
              marginTop: "20px",
              color: feedback.includes("✅") ? "#059669" : "#DC2626",
              fontWeight: "600",
              transition: "all 0.3s ease",
            }}
          >
            {feedback}
          </h3>
        )}
      </div>
    </div>
  );
};

export default PhrasePractice;
