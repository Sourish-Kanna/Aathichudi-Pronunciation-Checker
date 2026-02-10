import { useEffect, useState, useCallback } from "react";
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
  const [error, setError] = useState(null);
  const [score, setScore] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const navigate = useNavigate(); // Hook to change URL
  const { id } = useParams();     // Get ID from URL

  // eslint-disable-next-line
  const { startRecording, stopRecording, mediaBlobUrl, clearBlobUrl } = useReactMediaRecorder({
    audio: true,
    onStop: () => setIsRecording(false),
    onStart: () => setIsRecording(true),
  });

  // 1. DATA LOADING LOGIC (The Fix)
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
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
    } catch (error) {
      console.error("Error fetching phrases:", error);
      setError(error.message || "Failed to load phrases. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Re-run this if the user manually changes the URL ID

  const currentPhrase = phrases[currentIndex];

  // 2. NAVIGATION LOGIC
  const handleUpload = async () => {
    if (!mediaBlobUrl || !currentPhrase) return;

    setIsChecking(true);
    setFeedback("");

    try {
      // Convert blob to file
      const response = await fetch(mediaBlobUrl);
      const blob = await response.blob();
      const file = new File([blob], "user.wav", { type: "audio/wav" });

      // Check pronunciation
      const result = await checkPronunciation(currentPhrase.id, file);

      // Store the score
      setScore(result.score);

      if (result.verdict === "correct") {
        setFeedback(`✅ Correct! Score: ${(result.score * 100).toFixed(1)}% - Moving to next phrase...`);

        setTimeout(() => {
          setFeedback("");
          setScore(null);
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
        }, 3000); // Wait 3 seconds before moving to next phrase
      } else {
        setFeedback(`❌ Try Again. Score: ${(result.score * 100).toFixed(1)}% - Listen closely and repeat.`);
      }
    } finally {
      setIsChecking(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) {
    return (
      <div className="practice-container">
        <div className="practice-card">
          <div className="practice-header">
            <h2 className="practice-title">Error</h2>
            <Link to="/phrases" className="back-link">← Back</Link>
          </div>
          <div style={{
            padding: '20px',
            backgroundColor: '#FEE2E2',
            border: '2px solid #EF4444',
            borderRadius: '8px',
            color: '#991B1B',
            textAlign: 'center',
            margin: '20px 0'
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
        </div>
      </div>
    );
  }
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
            <button 
              onClick={handleUpload} 
              className="btn btn-check"
              disabled={isChecking}
              style={{
                opacity: isChecking ? 0.6 : 1,
                cursor: isChecking ? 'not-allowed' : 'pointer'
              }}
            >
              {isChecking ? '⏳ Checking...' : '✅ Check Pronunciation'}
            </button>
          </div>
        )}

        {/* Loading indicator while checking */}
        {isChecking && (
          <div style={{
            marginTop: '15px',
            padding: '12px',
            backgroundColor: '#EFF6FF',
            border: '2px solid #3B82F6',
            borderRadius: '8px',
            color: '#1E40AF',
            textAlign: 'center',
            fontSize: '15px',
            fontWeight: '500'
          }}>
            ⏳ Analyzing your pronunciation...
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