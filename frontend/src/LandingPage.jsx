import React from 'react';
import "./LandingPage.css";

const LandingPage = ({ onStart }) => {
  return (
    <div className="landing-container">
      <h1 className="landing-title">
        Athichudi Pronunciation Checker
      </h1>
      <p className="landing-description">
        Master Tamil pronunciation with real-time AI feedback.
        Practice ancient wisdom, one phrase at a time.
      </p>

      <button onClick={onStart} className="btn-landing">
        Start Practicing →
      </button>
    </div>
  );
};

export default LandingPage;