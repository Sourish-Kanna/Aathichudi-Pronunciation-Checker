import { useCallback } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import LandingPage from "./LandingPage";
import PhrasePractice from "./PhrasePractice";
import PhraseList from "./PhraseList";

function App() {
  const navigate = useNavigate();
  const onStart = useCallback(() => navigate("/phrases"), [navigate]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage onStart={onStart} />} />
        <Route path="/phrases" element={<PhraseList />} />
        <Route path="/phrases/:id" element={<PhrasePractice />} />
      </Routes>
    </div>
  );
}

export default App;
