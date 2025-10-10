import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_URL ?? ""; // prefer REACT_APP_ for client-side env

// Fetch all phrases
export async function getPhrases() {
  const res = await axios.get(`${API_URL}/phrases`);
  return res.data;
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
