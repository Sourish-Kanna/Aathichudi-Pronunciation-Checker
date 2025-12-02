import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useReactMediaRecorder } from "react-media-recorder";
import { getPhrases, getPhraseById, checkPronunciation } from "./api";
import "./PhrasePractice.css";

const PhrasePractice = () => {
  const [phrases, setPhrases] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);

  // eslint-disable-next-line
  const { startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({
    audio: true,
    onStop: () => setIsRecording(false),
    onStart: () => setIsRecording(true),
  });

  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        if (id) {
          const single = await getPhraseById(id);
          setPhrases([single]);
        } else {
          const data = await getPhrases();
          setPhrases(data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching phrases:", error);
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

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
      setFeedback("❌ Try Again. Listen closely and repeat.");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!currentPhrase) return <div className="loading">No phrase found.</div>;

  return (
    <div className="practice-container">
      <div className="practice-card">
        {/* Header */}
        <div className="practice-header">
          <h2 className="practice-title">Practice</h2>
          <Link to="/phrases" className="back-link">← Back</Link>
        </div>

        {/* Content */}
        <div className="tamil-phrase">{currentPhrase.tamil}</div>
        <div className="transliteration">{currentPhrase.transliteration}</div>
        <div className="meaning-box">
          <strong>Meaning:</strong> {currentPhrase.meaning_en}
        </div>

        <audio controls src={currentPhrase.audio_tts} className="audio-player" />

        {/* Controls */}
        <div className="controls">
          {!isRecording ? (
            <button onClick={startRecording} className="btn btn-record">
              🎙️ Start Recording
            </button>
          ) : (
            <button onClick={stopRecording} className="btn btn-stop">
              🛑 Stop Recording
            </button>
          )}
        </div>

        {isRecording && <div className="status-recording">🔴 Recording in progress...</div>}

        {/* Playback & Check */}
        {mediaBlobUrl && !isRecording && (
          <div style={{ marginTop: "20px", borderTop: "1px solid #E5E7EB", paddingTop: "20px" }}>
            <audio src={mediaBlobUrl} controls style={{ width: "100%" }} />
            <button onClick={handleUpload} className="btn btn-check">
              ✅ Check Pronunciation
            </button>
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <div className={`feedback-msg ${feedback.includes("✅") ? "feedback-correct" : "feedback-incorrect"}`}>
            {feedback}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhrasePractice;