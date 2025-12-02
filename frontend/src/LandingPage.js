const LandingPage = ({ onStart }) => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #60A5FA, #93C5FD)",
        color: "#fff",
        fontFamily: "'Poppins', sans-serif",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", marginBottom: "10px", letterSpacing: "1px" }}>
        Athichudi Pronunciation Checker
      </h1>
      <p style={{ fontSize: "1.2rem", maxWidth: "600px", lineHeight: "1.6" }}>
        Learn and perfect your Tamil pronunciation through real-time speech feedback.
      </p>

      <button
        onClick={onStart}
        style={{
          marginTop: "30px",
          padding: "12px 30px",
          fontSize: "1.1rem",
          fontWeight: "600",
          backgroundColor: "#fff",
          color: "#2563EB",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = "#2563EB";
          e.target.style.color = "#fff";
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = "#fff";
          e.target.style.color = "#2563EB";
        }}
      >
        Get Started →
      </button>
    </div>
  );
};

export default LandingPage;
