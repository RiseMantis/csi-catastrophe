import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function WarriorSelection({ onSelect }) {
  const navigate = useNavigate();
  const [attemptedWarriors, setAttemptedWarriors] = useState([]);
  const [showTakenPopup, setShowTakenPopup] = useState(false);
  const [lastAttemptedWarrior, setLastAttemptedWarrior] = useState(null);
  const [showPoOption, setShowPoOption] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredWarriorId, setHoveredWarriorId] = useState(null);

  // These are intentionally confusing - they're not the actual characters
  const warriors = [
    { id: 1, name: "furious-tiger", emoji: "🐻", displayName: "Option 1" },
    { id: 2, name: "sneaky-crane", emoji: "🦊", displayName: "Option 2" },
    { id: 3, name: "mighty-serpent", emoji: "🐢", displayName: "Option 3" },
    { id: 4, name: "noble-mantis", emoji: "🦁", displayName: "Option 4" },
    { id: 5, name: "graceful-monkey", emoji: "🐸", displayName: "Option 5" },
  ];

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSelection = (warrior) => {
    setLastAttemptedWarrior(warrior);
    setAttemptedWarriors([...attemptedWarriors, warrior.id]);
    setShowTakenPopup(true);
  };

  const handlePopupOk = () => {
    setShowTakenPopup(false);
    // Check if all warriors have been attempted
    if (attemptedWarriors.length === warriors.length) {
      setShowPoOption(true);
    }
  };

  const handlePoSelection = () => {
    onSelect({ id: 0, name: "po", emoji: "🐼", displayName: "Po" });
    navigate("/training");
  };

  // WarriorCard component to handle individual card movement
  const WarriorCard = ({ warrior, offset, isAttempted, isDisabled }) => {
    const cardRef = useRef(null);

    useEffect(() => {
      if (cardRef.current && hoveredWarriorId === warrior.id) {
        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distX = centerX - mousePos.x;
        const distY = centerY - mousePos.y;
        const distance = Math.sqrt(distX * distX + distY * distY);

        if (distance < 120) {
          const angle = Math.atan2(distY, distX);
          const pushDistance = Math.max(0, 120 - distance) / 1.5;

          const newOffset = {
            x: Math.cos(angle) * pushDistance,
            y: Math.sin(angle) * pushDistance,
          };

          cardRef.current.style.transform = `translate(${newOffset.x}px, ${newOffset.y}px)`;
        } else {
          cardRef.current.style.transform = "translate(0px, 0px)";
        }
      }
    }, [mousePos, hoveredWarriorId]);

    return (
      <div
        key={warrior.id}
        ref={cardRef}
        style={{
          ...styles.warriorCard,
          opacity: isAttempted && !showPoOption ? 0.5 : 1,
          border: isAttempted ? "3px solid #999" : "3px solid #ffd700",
          pointerEvents: isDisabled ? "none" : "auto",
          cursor: isDisabled ? "not-allowed" : "pointer",
          transition: "transform 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
        onMouseEnter={() => setHoveredWarriorId(warrior.id)}
        onMouseLeave={() => setHoveredWarriorId(null)}
        onClick={() => !isAttempted && handleSelection(warrior)}
      >
        <div style={styles.silhouette}>{warrior.emoji}</div>
        <p style={styles.warriorName}>{warrior.displayName}</p>
        <p style={styles.warriorType}>
          {isAttempted ? "❌ TAKEN" : "???"}
        </p>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>⚔️ Choose Your Warrior ⚔️</h1>
      <p style={styles.subtitle}>Select wisely... or does it matter?</p>

      {/* Hidden text about illusion of choice */}
      <div style={styles.warningBox}>
        <p style={styles.warningText}>
          "In the Dojo, all warriors are equal... all warriors are Po" - Confusing Master
        </p>
      </div>

      {/* Warrior Selection Grid */}
      <div style={styles.grid}>
        {warriors.map((warrior) => (
          <WarriorCard
            key={warrior.id}
            warrior={warrior}
            isAttempted={attemptedWarriors.includes(warrior.id)}
            isDisabled={attemptedWarriors.includes(warrior.id) && !showPoOption}
          />
        ))}
      </div>

      {/* Illusion of Choice Messages */}
      {showTakenPopup && (
        <div style={styles.popupOverlay}>
          <div style={styles.messageBox}>
            <h2 style={styles.messageTitle}>⚠️ WARRIOR TAKEN! ⚠️</h2>
            <p style={styles.messageText}>
              "{lastAttemptedWarrior?.displayName}" is already taken by another student!
            </p>
            <p style={{ ...styles.messageText, fontSize: "14px", color: "#aaa" }}>
              Choose another warrior... if you can find one available.
            </p>
            <button style={styles.okButton} onClick={handlePopupOk}>
              OK
            </button>
          </div>
        </div>
      )}

      {/* Po Only Choice Screen */}
      {showPoOption && (
        <div style={styles.poOptionContainer}>
          <h2 style={styles.poTitle}>⚡ NO WARRIORS AVAILABLE ⚡</h2>
          <p style={styles.poSubtitle}>
            Every student has attempted their choice...
          </p>
          <p style={styles.poSubtitle}>
            But only ONE true path remains.
          </p>
          
          <div style={styles.poCard} onClick={handlePoSelection}>
            <div style={styles.poEmoji}>🐼</div>
            <h3 style={styles.poName}>PO - The Dragon Warrior</h3>
            <p style={styles.poDescription}>Your destiny has been chosen for you.</p>
            <button style={styles.selectPoButton}>
              🎯 SELECT PO 🎯
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1a1a1a 0%, #2d1b1b 50%, #1a2d2d 100%)",
    backgroundAttachment: "fixed",
    color: "#ffd700",
    padding: "40px 20px",
    fontFamily: "'SimSun', 'Noto Sans SC', serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: "56px",
    marginBottom: "10px",
    textShadow: "0 0 30px rgba(255, 215, 0, 0.9), 0 0 60px rgba(196, 30, 58, 0.6), 2px 2px 8px rgba(0, 0, 0, 0.9)",
    color: "#ffd700",
    fontWeight: "bold",
    letterSpacing: "3px",
  },
  subtitle: {
    fontSize: "18px",
    color: "#c41e3a",
    marginBottom: "30px",
    textShadow: "1px 1px 3px rgba(0, 0, 0, 0.8)",
    letterSpacing: "2px",
  },
  warningBox: {
    background: "linear-gradient(135deg, rgba(196, 30, 58, 0.2) 0%, rgba(255, 215, 0, 0.1) 100%)",
    border: "3px solid #c41e3a",
    borderRadius: "0px",
    padding: "15px 30px",
    marginBottom: "40px",
    maxWidth: "600px",
    boxShadow: "0 0 20px rgba(255, 215, 0, 0.3)",
  },
  warningText: {
    margin: 0,
    color: "#ffd700",
    fontSize: "14px",
    fontStyle: "italic",
    letterSpacing: "1px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: "20px",
    maxWidth: "700px",
    marginBottom: "40px",
  },
  progressIndicator: {
    maxWidth: "700px",
    margin: "20px auto 40px",
    background: "linear-gradient(135deg, rgba(0, 200, 0, 0.1), rgba(0, 0, 0, 0.2))",
    border: "2px solid #00ff00",
    padding: "20px",
    textAlign: "center",
    boxShadow: "0 0 15px rgba(0, 200, 0, 0.2)",
  },
  progressText: {
    margin: "0 0 15px 0",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#ffd700",
  },
  progressValue: {
    color: "#00ff00",
    fontSize: "18px",
    textShadow: "0 0 10px rgba(0, 255, 0, 0.6)",
  },
  progressBar: {
    display: "flex",
    gap: "8px",
    justifyContent: "center",
  },
  progressSegment: {
    width: "40px",
    height: "8px",
    borderRadius: "4px",
    transition: "background 0.3s ease",
    border: "1px solid #ffd700",
  },
  popupOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  okButton: {
    marginTop: "20px",
    padding: "12px 30px",
    fontSize: "16px",
    fontWeight: "bold",
    background: "linear-gradient(135deg, #c41e3a, #8b1538)",
    color: "#ffd700",
    border: "3px solid #ffd700",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  poOptionContainer: {
    position: "fixed",
    inset: 0,
    background: "linear-gradient(135deg, #1a1a1a 0%, #2d1b1b 50%, #1a2d2d 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  poTitle: {
    fontSize: "48px",
    color: "#ffd700",
    textShadow: "0 0 30px rgba(255, 215, 0, 0.9), 0 0 60px rgba(196, 30, 58, 0.6)",
    marginBottom: "10px",
    letterSpacing: "2px",
  },
  poSubtitle: {
    fontSize: "18px",
    color: "#c41e3a",
    textShadow: "1px 1px 3px rgba(0, 0, 0, 0.8)",
    marginBottom: "10px",
    letterSpacing: "1px",
  },
  poCard: {
    marginTop: "40px",
    background: "linear-gradient(135deg, rgba(196, 30, 58, 0.3), rgba(0, 0, 0, 0.3))",
    border: "4px solid #ffd700",
    padding: "40px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 0 40px rgba(255, 215, 0, 0.4)",
  },
  poEmoji: {
    fontSize: "120px",
    marginBottom: "20px",
    filter: "drop-shadow(0 0 20px rgba(255, 215, 0, 0.6))",
  },
  poName: {
    fontSize: "32px",
    color: "#ffd700",
    textShadow: "0 0 15px rgba(255, 215, 0, 0.6)",
    margin: "10px 0",
    letterSpacing: "2px",
  },
  poDescription: {
    fontSize: "16px",
    color: "#aaa",
    marginBottom: "20px",
    fontStyle: "italic",
  },
  selectPoButton: {
    padding: "15px 40px",
    fontSize: "18px",
    fontWeight: "bold",
    background: "linear-gradient(135deg, #c41e3a, #8b1538)",
    color: "#ffd700",
    border: "3px solid #ffd700",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 0 20px rgba(255, 215, 0, 0.3)",
  },
  warriorCard: {
    background: "linear-gradient(135deg, rgba(196, 30, 58, 0.2) 0%, rgba(0, 0, 0, 0.3) 100%)",
    border: "3px solid #ffd700",
    borderRadius: "0px",
    padding: "20px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 0 15px rgba(255, 215, 0, 0.2)",
  },
  silhouette: {
    fontSize: "60px",
    marginBottom: "10px",
    filter: "drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))",
  },
  warriorName: {
    margin: "8px 0 4px 0",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#ffd700",
    letterSpacing: "1px",
  },
  warriorType: {
    margin: 0,
    fontSize: "12px",
    color: "#999",
    fontStyle: "italic",
  },
  messageBox: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(196, 30, 58, 0.3) 100%)",
    border: "4px solid #ffd700",
    borderRadius: "0px",
    padding: "40px",
    maxWidth: "500px",
    textAlign: "center",
    boxShadow: "0 0 50px rgba(255, 215, 0, 0.6), inset 0 0 30px rgba(0, 0, 0, 0.8)",
    zIndex: 1000,
    animation: "popIn 0.5s ease-out",
  },
  messageTitle: {
    fontSize: "32px",
    color: "#ff0000",
    textShadow: "0 0 20px rgba(255, 0, 0, 0.8)",
    marginTop: 0,
    marginBottom: "20px",
    letterSpacing: "2px",
  },
  messageText: {
    fontSize: "16px",
    color: "#ffd700",
    marginBottom: "15px",
    textShadow: "1px 1px 3px rgba(0, 0, 0, 0.8)",
  },
};

// Add animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes popIn {
    0% {
      transform: translate(-50%, -50%) scale(0);
      opacity: 0;
    }
    70% {
      transform: translate(-50%, -50%) scale(1.1);
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
  }
`;
if (!document.querySelector("style[data-warrior]")) {
  styleSheet.setAttribute("data-warrior", "true");
  document.head.appendChild(styleSheet);
}

export default WarriorSelection;