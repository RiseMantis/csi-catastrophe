import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProgressDashboard({ stats }) {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [foundBackButton, setFoundBackButton] = useState(false);
  const [lampRadius] = useState(150);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      // Check if mouse is over back button
      const backButton = document.getElementById("back-button");
      if (backButton) {
        const rect = backButton.getBoundingClientRect();
        const distance = Math.sqrt(
          Math.pow(e.clientX - (rect.left + rect.width / 2), 2) +
            Math.pow(e.clientY - (rect.top + rect.height / 2), 2)
        );
        if (distance < lampRadius) {
          setFoundBackButton(true);
        }
        else{
          setFoundBackButton(false);
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [lampRadius]);

  const getVisibility = (elementRect, mouseX, mouseY) => {
    if (!elementRect) return 0;
    const elementCenterX = elementRect.left + elementRect.width / 2;
    const elementCenterY = elementRect.top + elementRect.height / 2;
    const distance = Math.sqrt(
      Math.pow(mouseX - elementCenterX, 2) + Math.pow(mouseY - elementCenterY, 2)
    );
    return Math.max(0, 1 - distance / lampRadius);
  };

  return (
    <div style={styles.container}>
      {/* Lamp effect */}
      <div
        style={{
          ...styles.lamp,
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
          width: `${lampRadius * 2}px`,
          height: `${lampRadius * 2}px`,
        }}
      />

      {/* Dark overlay */}
      <div style={styles.darkOverlay} />

      {/* Title - barely visible */}
      <div style={styles.titleSection}>
        <h1 style={styles.title}>🥋 PROGRESS DASHBOARD 🥋</h1>
        <p style={styles.subtitle}>
          (Navigate through the darkness... find your stats... if you can)
        </p>
      </div>

      {/* Stats Cards - Hidden in darkness */}
      <div style={styles.statsGrid}>
        {/* Character Info */}
        <div style={styles.statCard}>
          <h3 style={styles.cardTitle}>✨ CHARACTER INFO ✨</h3>
          <p style={styles.statLine}>Name: <span style={styles.value}>{stats.name}</span></p>
          <p style={styles.statLine}>Level: <span style={styles.value}>{Math.floor(stats.experience / 300) + 1}</span></p>
          <p style={styles.statLine}>
            Experience: <span style={styles.value}>{stats.experience}/300</span>
          </p>
          <div style={styles.expMeterContainer}>
            <div style={{
              ...styles.expMeterBar,
              width: `${(stats.experience / 300) * 100}%`
            }}></div>
          </div>
          <p style={{...styles.statLine, marginTop: "10px"}}>
            Skill Points: <span style={{...styles.value, color: "#00ff00", fontSize: "18px"}}>{stats.skillPoints || 0} ⭐</span>
          </p>
        </div>

        {/* Battle Stats */}
        <div style={styles.statCard}>
          <h3 style={styles.cardTitle}>⚔️ BATTLE STATS ⚔️</h3>
          <p style={styles.statLine}>Health: <span style={styles.value}>{stats.health}</span></p>
          <p style={styles.statLine}>Attack Power: <span style={styles.value}>{stats.attack}</span></p>
          <p style={styles.statLine}>Agility: <span style={styles.value}>{stats.agility}</span></p>
          <p style={styles.statLine}>Defense: <span style={styles.value}>{stats.defense}</span></p>
        </div>

        {/* Training Progress */}
        <div style={styles.statCard}>
          <h3 style={styles.cardTitle}>📈 TRAINING PROGRESS 📈</h3>
          <p style={styles.statLine}>
            Trainings Completed: <span style={styles.value}>{stats.trainingCompleted}</span>
          </p>
          <p style={styles.statLine}>
            Skills Unlocked: <span style={styles.value}>
              {Object.values(stats.skills).filter((s) => s > 0).length}
            </span>
          </p>
        </div>

        {/* Skills Status */}
        <div style={styles.statCard}>
          <h3 style={styles.cardTitle}>🌟 ACTIVE SKILLS 🌟</h3>
          <p style={styles.statLine}>
            Jump Height: <span style={styles.value}>Lvl {stats.skills.jumpHeight || 0}</span>
          </p>
          <p style={styles.statLine}>
            Punch Power: <span style={styles.value}>Lvl {stats.skills.punchPower || 0}</span>
          </p>
          <p style={styles.statLine}>
            Dodge Chance: <span style={styles.value}>Lvl {stats.skills.dodgeChance || 0}</span>
          </p>
          <p style={styles.statLine}>
            Inner Peace: <span style={styles.value}>Lvl {stats.skills.innerPeace || 0}</span>
          </p>
        </div>
      </div>

      {/* Hidden Back Button - Only visible with lamp */}
      <button
        id="back-button"
        style={{
          ...styles.backButton,
          opacity: foundBackButton ? 0.5 : 0,
          cursor: foundBackButton ? "pointer" : "default",
          transform: foundBackButton ? "scale(1)" : "scale(0.8)",
        }}
        onClick={() => {
          if (foundBackButton) {
            navigate("/skills");
          }
        }}
        disabled={!foundBackButton}
      >
        ← RETURN TO SKILL TREE
      </button>

      {/* Instructions */}
      <div style={styles.instructionBox}>
        <p style={styles.instructionText}>
          💡 Oh God where are the lights... Work with this lamp in the meanwhile
        </p>
        <p style={styles.instructionText}>
          🔍 Its way too dark, I think we should go back
        </p>
      </div>

      {/* Coordinates display (for debugging) */}
      <div style={styles.coordBox}>
        <p style={styles.coordText}>
          Lamp Position: {mousePos.x}, {mousePos.y}
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    minHeight: "100vh",
    background: "#000",
    color: "#ffd700",
    padding: "40px 20px",
    fontFamily: "'SimSun', 'Noto Sans SC', serif",
    position: "relative",
    overflow: "hidden",
    cursor: "none",
  },
  lamp: {
    position: "fixed",
    borderRadius: "50%",
    background: `radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, rgba(255, 215, 0, 0.1) 70%, transparent 100%)`,
    pointerEvents: "none",
    zIndex: 100,
    transform: "translate(-50%, -50%)",
    boxShadow: `0 0 60px rgba(255, 215, 0, 0.5), 
                0 0 120px rgba(255, 215, 0, 0.2)`,
  },
  darkOverlay: {
    position: "fixed",
    inset: 0,
    background: "radial-gradient(circle 100px at var(--mouseX, 50%) var(--mouseY, 50%), transparent 0%, rgba(0, 0, 0, 0.95) 100%)",
    pointerEvents: "none",
    zIndex: 99,
  },
  titleSection: {
    position: "absolute",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    textAlign: "center",
    opacity: 1,
    pointerEvents: "none",
  },
  title: {
    fontSize: "48px",
    margin: 0,
    textShadow: "0 0 20px rgba(255, 215, 0, 0.6)",
    color: "#ffd700",
    letterSpacing: "2px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
    margin: "10px 0 0 0",
    fontStyle: "italic",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "30px",
    maxWidth: "1000px",
    margin: "120px auto 0",
    position: "relative",
    zIndex: 50,
  },
  statCard: {
    background: "linear-gradient(135deg, rgba(196, 30, 58, 0.15), rgba(0, 20, 40, 0.2))",
    border: "3px solid rgba(255, 215, 0, 0.3)",
    padding: "25px",
    borderRadius: "0px",
    boxShadow: "0 0 30px rgba(255, 215, 0, 0.1)",
    opacity: 1,
    transition: "opacity 0.2s ease-out",
  },
  cardTitle: {
    color: "#ffd700",
    textShadow: "0 0 10px rgba(255, 215, 0, 0.4)",
    marginTop: 0,
    marginBottom: "15px",
    fontSize: "18px",
    letterSpacing: "1px",
  },
  statLine: {
    margin: "8px 0",
    fontSize: "14px",
    color: "#ccc",
  },
  value: {
    color: "#00ff00",
    fontWeight: "bold",
    textShadow: "0 0 5px rgba(0, 255, 0, 0.4)",
  },
  backButton: {
    position: "fixed",
    bottom: "50px",
    right: "50px",
    padding: "15px 30px",
    fontSize: "16px",
    fontWeight: "bold",
    background: "linear-gradient(135deg, #c41e3a, #8b1538)",
    color: "#ffd700",
    border: "3px solid #ffd700",
    cursor: "pointer",
    zIndex: 200,
    transition: "all 0.3s ease",
    textShadow: "1px 1px 3px rgba(0, 0, 0, 0.8)",
  },
  instructionBox: {
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "rgba(0, 0, 0, 0.8)",
    border: "2px solid rgba(255, 215, 0, 0.3)",
    padding: "15px 30px",
    borderRadius: "0px",
    maxWidth: "500px",
    textAlign: "center",
    zIndex: 150,
  },
  instructionText: {
    margin: "5px 0",
    fontSize: "13px",
    color: "#ffd700",
    opacity: 1,
  },
  coordBox: {
    position: "fixed",
    top: "10px",
    left: "10px",
    background: "rgba(255, 215, 0, 0.1)",
    border: "1px solid rgba(255, 215, 0, 0.2)",
    padding: "8px 12px",
    fontSize: "11px",
    color: "#666",
    zIndex: 100,
  },
  coordText: {
    margin: 0,
  },
};

// Add custom cursor animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes lampGlow {
    0%, 100% {
      box-shadow: 0 0 60px rgba(255, 215, 0, 0.5), 
                  0 0 120px rgba(255, 215, 0, 0.2);
    }
    50% {
      box-shadow: 0 0 80px rgba(255, 215, 0, 0.6), 
                  0 0 150px rgba(255, 215, 0, 0.3);
    }
  }

  input[type="range"]::-webkit-slider-thumb {
    appearance: none;
  }

  button:disabled {
    opacity: 0 !important;
    cursor: default !important;
  }
`;
if (!document.querySelector("style[data-progress]")) {
  styleSheet.setAttribute("data-progress", "true");
  document.head.appendChild(styleSheet);
}

export default ProgressDashboard;