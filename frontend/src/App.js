import React, { useState } from "react";
import LandingPage from "./LandingPage";
import PhrasePractice from "./PhrasePractice";

function App() {
  const [started, setStarted] = useState(false);

  return (
    <div>
      {started ? <PhrasePractice /> : <LandingPage onStart={() => setStarted(true)} />}
    </div>
  );
}

export default App;
