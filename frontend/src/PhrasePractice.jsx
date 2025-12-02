import { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useReactMediaRecorder } from "react-media-recorder";
import { getPhrases, checkPronunciation } from "./api"; 
import "./PhrasePractice.css";

const PhrasePractice = () => {
  const [phrases, setPhrases] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);

  const navigate = useNavigate(); // Hook to change URL
  const { id } = useParams();     // Get ID from URL

  // eslint-disable-next-line
  const { startRecording, stopRecording, mediaBlobUrl, clearBlobUrl } = useReactMediaRecorder({
    audio: true,
    onStop: () => setIsRecording(false),
    onStart: () => setIsRecording(true),
  });

  // 1. DATA LOADING LOGIC (The Fix)
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // ALWAYS fetch the full list. This is crucial for "Next" logic.
        const allPhrases = await getPhrases();
        setPhrases(allPhrases);

        // If URL has an ID (e.g., /phrases/5), find that phrase in our list
        if (id) {
          const foundIndex = allPhrases.findIndex((p) => String(p.id) === String(id));
          if (foundIndex !== -1) {
            setCurrentIndex(foundIndex);
          } else {
            // ID invalid/not found? Go to start.
            setCurrentIndex(0);
          }
        } else {
          // No ID? Start at 0.
          setCurrentIndex(0);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching phrases:", error);
        setLoading(false);
      }
    }
    fetchData();
  }, [id]); // Re-run this if the user manually changes the URL ID

  const currentPhrase = phrases[currentIndex];

  // 2. NAVIGATION LOGIC
  const handleUpload = async () => {
    if (!mediaBlobUrl || !currentPhrase) return;

    // Convert blob to file
    const response = await fetch(mediaBlobUrl);
    const blob = await response.blob();
    const file = new File([blob], "user.wav", { type: "audio/wav" });

    // Check pronunciation
    const result = await checkPronunciation(currentPhrase.id, file);

    if (result.verdict === "correct") {
      setFeedback("✅ Correct! Moving to next phrase...");

      setTimeout(() => {
        setFeedback("");
        clearBlobUrl(); // Clear the recording for the next phrase

        // Calculate the next ID
        const nextIndex = currentIndex + 1;

        if (nextIndex < phrases.length) {
          // Move to next phrase by changing the URL
          const nextPhraseId = phrases[nextIndex].id;
          navigate(`/phrases/${nextPhraseId}`);
        } else {
          // End of list? Loop back to the first one (or show a completion screen)
          const firstPhraseId = phrases[0].id;
          navigate(`/phrases/${firstPhraseId}`);
        }
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

        {/* Audio Player for TTS */}
        {/* We add a 'key' here so the audio player reloads when the phrase changes */}
        <audio
          key={currentPhrase.audio_tts}
          controls
          src={currentPhrase.audio_tts}
          className="audio-player"
        />

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