import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL ?? "";

// Fetch all phrases
export async function getPhrases() {
  try {
    const res = await axios.get(`${API_URL}/phrases`, {
      timeout: 30000, // 30 second timeout
    });
    return res.data;
  } catch (err) {
    console.error("API error:", err);
    // Re-throw with more descriptive error
    if (err.code === 'ECONNABORTED') {
      throw new Error('Backend connection timeout. Please try again.');
    } else if (err.code === 'ERR_NETWORK' || !err.response) {
      throw new Error('Cannot connect to backend server. Please check if the backend is running.');
    } else {
      throw new Error(`Backend error: ${err.response?.statusText || err.message}`);
    }
  }
}

// Check pronunciation for a phrase
export async function checkPronunciation(phraseId, file) {
  const formData = new FormData();
  formData.append("phrase_id", phraseId);
  formData.append("audio_file", file);

  try {
    const res = await axios.post(`${API_URL}/check_pronunciation`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60000, // allow Render to wake up
    });
    return res.data;
  } catch (err) {
    console.error(" API error:", err);
    alert("Network error — please try again after a few seconds.");
    return { verdict: "error" };
  }
}
