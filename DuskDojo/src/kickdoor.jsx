import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Enter() {
  const navigate = useNavigate();
  const [force, setForce] = useState(50);
  const [distance, setDistance] = useState(50);
  const [doorOpen, setDoorOpen] = useState(false);
  const [doorRotation, setDoorRotation] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [targetTorque, setTargetTorque] = useState(2500);

  useEffect(() => {
    // Generate random target torque between 1500 and 3500
    const randomTorque = Math.floor(Math.random() * 2000) + 1500;
    setTargetTorque(randomTorque);
  }, []);

  const TORQUE_TOLERANCE = 2;

  const currentTorque = force * distance;

  const handlePush = () => {
    setAttempts(attempts + 1);
    
    // Check if torque is correct
    if (currentTorque >= targetTorque - TORQUE_TOLERANCE && 
        currentTorque <= targetTorque + TORQUE_TOLERANCE) {
      setDoorOpen(true);
      setDoorRotation(-90);
      setTimeout(() => {
        navigate("/warrior-selection");
      }, 1500);
    } else {
      // Door shakes if torque is wrong
      const shake = (Math.random() - 0.5) * 20;
      setDoorRotation(shake);
      setTimeout(() => setDoorRotation(0), 200);
    }
  };

  const torquePercentage = (currentTorque / targetTorque) * 100;
  const isTorqueClose = Math.abs(currentTorque - targetTorque) < 1;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🥋 Dusk Dojo 🥋</h1>
      <p style={styles.subtitle}>Enter the Sacred Halls of Warrior Training</p>

      <div style={styles.instructionBox}>
        <h2 style={styles.instructionTitle}>Push the Door with Perfect Torque!</h2>
        <p style={styles.instruction}>
          Torque = Force × Distance from Pivot<br/>
          <span style={{ fontSize: "12px", color: "#888" }}>(This is completely arbitrary)</span>
        </p>
      </div>

      {/* Door Visual */}
      <div style={styles.doorContainer}>
        <div 
          style={{
            ...styles.door,
            transform: `rotate(${doorRotation}deg)`,
            transition: doorOpen ? "transform 1s ease-in-out" : "transform 0.1s ease-out"
          }}
        >
          <div style={styles.doorFrame}>
            {/* Vertical Door Planks */}
            <div style={styles.doorPlank1}></div>
            <div style={styles.doorPlank2}></div>
            <div style={styles.doorPlank3}></div>
            <div style={styles.doorPlank4}></div>

            {/* Center Decorative Circle */}
            <div style={styles.decorativeCircle}></div>

            {/* Center Text */}
            <div style={styles.doorPanel}>
              <div style={styles.chineseSymbol}>武</div>
              <p style={styles.doorText}>PUSH WITH HONOR</p>
              {!doorOpen && <div style={styles.doorShimmer}></div>}
            </div>

            {/* Metal Brackets */}
            <div style={styles.bracketLeft}></div>
            <div style={styles.bracketRight}></div>
          </div>
        </div>
        <div style={styles.pivot}>⭕</div>
      </div>

      {/* Force Control */}
      <div style={styles.controlSection}>
        <div style={styles.control}>
          <label style={styles.label}>
            💪 Force Applied: <span style={styles.value}>{Math.round(force)} N</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={force}
            onChange={(e) => setForce(Number(e.target.value))}
            style={styles.slider}
            disabled={doorOpen}
          />
          <div style={styles.sliderLabels}>
            <span style={{ fontSize: "10px" }}>Weak</span>
            <span style={{ fontSize: "10px" }}>OUCH</span>
          </div>
        </div>

        {/* Distance Control */}
        <div style={styles.control}>
          <label style={styles.label}>
            📏 Distance from Pivot: <span style={styles.value}>{Math.round(distance)} cm</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            style={styles.slider}
            disabled={doorOpen}
          />
          <div style={styles.sliderLabels}>
            <span style={{ fontSize: "10px" }}>Near</span>
            <span style={{ fontSize: "10px" }}>Far</span>
          </div>
        </div>
      </div>

      {/* Torque Display */}
      <div style={styles.torqueBox}>
        <h3 style={styles.torqueTitle}>⚙️ Current Torque: {currentTorque.toFixed(0)} N·cm</h3>
        <p style={styles.torqueTarget}>Target Torque: nearly {targetTorque} N·cm</p>
        
        {/* Torque Bar */}
        <div style={styles.torqueBarContainer}>
          <div 
            style={{
              ...styles.torqueBar,
              width: `${Math.min(torquePercentage, 100)}%`,
              backgroundColor: isTorqueClose ? "#00ff00" : 
                               torquePercentage < 50 ? "#ff6b6b" : 
                               torquePercentage < 90 ? "#ffd700" : "#00ff00"
            }}
          ></div>
        </div>

        {isTorqueClose && (
          <p style={styles.closeMessage}>✨ You're getting close! ✨</p>
        )}
        {doorOpen && (
          <p style={styles.successMessage}>🎉 DOOR OPENING! ENTER THE DOJO! 🎉</p>
        )}
      </div>

      {/* Push Button */}
      <button
        onClick={handlePush}
        style={styles.pushButton}
        disabled={doorOpen}
      >
        🤜 PUSH THE DOOR 🤛
      </button>

      {/* Attempts Counter */}
      <div style={styles.attemptsBox}>
        <p style={styles.attemptsText}>Failed Attempts: <span style={styles.attemptsCount}>{attempts}</span></p>
      </div>

      {/* Hint Button */}
      <button
        onClick={() => setShowHint(!showHint)}
        style={styles.hintButton}
      >
        💡 Show Hint
      </button>

      {showHint && (
        <div style={styles.hintBox}>
          <p>🤫 <strong>Master says:</strong> "Only Cowards take a hint, Warriors take their Shot"</p>
          <p>⚡ Consider the balance between strength and precision</p>
        </div>
      )}

      {/* Physics Note */}
      <div style={styles.noteBox}>
        <p style={styles.note}>
          ⚠️ <strong>"There is no force, there is no distance, there is only... microtransactions baby"</strong> - A Very Confused Master
        </p>
      </div>
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
    padding: "20px",
    fontFamily: "'SimSun', 'Noto Sans CJK SC', serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  title: {
    fontSize: "56px",
    marginBottom: "10px",
    textShadow: "0 0 30px rgba(255, 215, 0, 0.9), 0 0 60px rgba(196, 30, 58, 0.6), 2px 2px 8px rgba(0, 0, 0, 0.9)",
    animation: "glow 3s ease-in-out infinite",
    color: "#ffd700",
    fontWeight: "bold",
    letterSpacing: "3px",
  },
  subtitle: {
    fontSize: "18px",
    color: "#c41e3a",
    marginBottom: "40px",
    maxWidth: "600px",
    textShadow: "1px 1px 3px rgba(0, 0, 0, 0.8)",
    fontStyle: "italic",
    letterSpacing: "2px",
  },
  instructionBox: {
    background: "linear-gradient(135deg, rgba(196, 30, 58, 0.2) 0%, rgba(255, 215, 0, 0.1) 100%)",
    border: "3px solid #c41e3a",
    borderRadius: "0px",
    padding: "20px",
    marginBottom: "40px",
    maxWidth: "600px",
    boxShadow: "0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 10px rgba(255, 215, 0, 0.1)",
  },
  instructionTitle: {
    color: "#ffd700",
    marginTop: 0,
    fontSize: "24px",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
    letterSpacing: "2px",
  },
  instruction: {
    fontSize: "14px",
    marginBottom: 0,
    color: "#fff",
    lineHeight: "1.8",
  },
  doorContainer: {
    position: "relative",
    width: "300px",
    height: "400px",
    marginBottom: "40px",
    perspective: "1200px",
  },
  door: {
    width: "100%",
    height: "100%",
    transformStyle: "preserve-3d",
    transformOrigin: "left center",
  },
  doorFrame: {
    width: "100%",
    height: "100%",
    background: "linear-gradient(135deg, #c41e3a 0%, #8b1538 50%, #c41e3a 100%)",
    border: "8px solid #ffd700",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.8), inset 0 0 20px rgba(255, 255, 255, 0.1), inset 0 0 40px rgba(255, 215, 0, 0.2)",
    position: "relative",
    overflow: "hidden",
  },
  doorPlank1: {
    position: "absolute",
    left: "20px",
    top: "10%",
    width: "15px",
    height: "80%",
    background: "rgba(0, 0, 0, 0.3)",
    borderRadius: "3px",
  },
  doorPlank2: {
    position: "absolute",
    left: "50%",
    top: "10%",
    transform: "translateX(-50%)",
    width: "15px",
    height: "80%",
    background: "rgba(0, 0, 0, 0.3)",
    borderRadius: "3px",
  },
  doorPlank3: {
    position: "absolute",
    right: "20px",
    top: "10%",
    width: "15px",
    height: "80%",
    background: "rgba(0, 0, 0, 0.3)",
    borderRadius: "3px",
  },
  doorPlank4: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    height: "8px",
    background: "linear-gradient(90deg, rgba(0,0,0,0.3), rgba(255,215,0,0.2), rgba(0,0,0,0.3))",
    borderRadius: "4px",
  },
  decorativeCircle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100px",
    height: "100px",
    border: "4px solid rgba(255, 215, 0, 0.4)",
    borderRadius: "50%",
  },
  doorPanel: {
    width: "70%",
    height: "70%",
    background: "rgba(0, 0, 0, 0.2)",
    borderRadius: "15px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    zIndex: 10,
  },
  chineseSymbol: {
    fontSize: "80px",
    fontWeight: "bold",
    color: "#ffd700",
    textShadow: "0 0 10px rgba(255, 215, 0, 0.8), 2px 2px 4px rgba(0, 0, 0, 0.8)",
    margin: 0,
    fontFamily: "SimSun, serif",
  },
  doorKnob: {
    fontSize: "60px",
    marginBottom: "20px",
    filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))",
  },
  doorText: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#ffd700",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
    margin: "10px 0 0 0",
    letterSpacing: "2px",
  },
  doorShimmer: {
    position: "absolute",
    top: "20px",
    left: "20px",
    width: "60px",
    height: "60px",
    background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 70%)",
    borderRadius: "50%",
  },
  bracketLeft: {
    position: "absolute",
    left: "30px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "20px",
    height: "120px",
    border: "3px solid #ffd700",
    borderRadius: "5px",
    boxShadow: "inset 0 0 10px rgba(255, 215, 0, 0.3)",
  },
  bracketRight: {
    position: "absolute",
    right: "30px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "20px",
    height: "120px",
    border: "3px solid #ffd700",
    borderRadius: "5px",
    boxShadow: "inset 0 0 10px rgba(255, 215, 0, 0.3)",
  },
  pivot: {
    position: "absolute",
    left: "0",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "30px",
  },
  controlSection: {
    width: "100%",
    maxWidth: "500px",
    marginBottom: "30px",
  },
  control: {
    marginBottom: "30px",
    background: "linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(196, 30, 58, 0.15) 100%)",
    padding: "20px",
    borderRadius: "0px",
    border: "2px solid #c41e3a",
    boxShadow: "inset 0 0 10px rgba(255, 215, 0, 0.1), 0 0 15px rgba(196, 30, 58, 0.2)",
  },
  label: {
    display: "block",
    marginBottom: "12px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#ffd700",
    textShadow: "1px 1px 3px rgba(0, 0, 0, 0.8)",
    letterSpacing: "1px",
  },
  value: {
    color: "#ffd700",
    fontSize: "20px",
    textShadow: "0 0 10px rgba(255, 215, 0, 0.6)",
  },
  slider: {
    width: "100%",
    height: "10px",
    cursor: "pointer",
    appearance: "none",
    background: "linear-gradient(to right, #c41e3a 0%, #ffd700 50%, #00d000 100%)",
    borderRadius: "5px",
    outline: "none",
    boxShadow: "0 0 10px rgba(255, 215, 0, 0.3)",
  },
  sliderLabels: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "8px",
    color: "#999",
    fontSize: "12px",
    fontStyle: "italic",
  },
  torqueBox: {
    width: "100%",
    maxWidth: "500px",
    background: "linear-gradient(135deg, rgba(0, 128, 0, 0.15) 0%, rgba(0, 0, 0, 0.2) 100%)",
    border: "3px solid #00d000",
    borderRadius: "0px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 0 20px rgba(0, 200, 0, 0.3), inset 0 0 10px rgba(0, 200, 0, 0.1)",
  },
  torqueTitle: {
    marginTop: 0,
    marginBottom: "8px",
    color: "#00ff00",
    fontSize: "20px",
    textShadow: "0 0 10px rgba(0, 255, 0, 0.6)",
    letterSpacing: "2px",
  },
  torqueTarget: {
    fontSize: "14px",
    color: "#aaa",
    marginBottom: "12px",
  },
  torqueBarContainer: {
    width: "100%",
    height: "20px",
    background: "linear-gradient(90deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5))",
    borderRadius: "0px",
    overflow: "hidden",
    marginBottom: "12px",
    border: "2px solid #00d000",
    boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.5)",
  },
  torqueBar: {
    height: "100%",
    transition: "width 0.1s ease-out",
    background: "linear-gradient(90deg, #00ff00, #00ff00)",
    boxShadow: "0 0 10px rgba(0, 255, 0, 0.8)",
  },
  closeMessage: {
    color: "#00ff00",
    fontSize: "14px",
    fontWeight: "bold",
    textAlign: "center",
    margin: 0,
    animation: "blink 0.5s infinite",
    textShadow: "0 0 10px rgba(0, 255, 0, 0.8)",
  },
  successMessage: {
    color: "#ffd700",
    fontSize: "16px",
    fontWeight: "bold",
    textAlign: "center",
    margin: 0,
    animation: "blink 0.3s infinite",
    textShadow: "0 0 15px rgba(255, 215, 0, 0.9)",
  },
  pushButton: {
    padding: "15px 40px",
    fontSize: "18px",
    fontWeight: "bold",
    background: "linear-gradient(135deg, #c41e3a 0%, #8b1538 100%)",
    color: "#ffd700",
    border: "3px solid #ffd700",
    borderRadius: "0px",
    cursor: "pointer",
    marginBottom: "20px",
    transition: "all 0.3s ease",
    boxShadow: "0 5px 20px rgba(196, 30, 58, 0.6), 0 0 15px rgba(255, 215, 0, 0.3)",
    textShadow: "1px 1px 3px rgba(0, 0, 0, 0.8)",
    letterSpacing: "2px",
  },
  attemptsBox: {
    background: "linear-gradient(135deg, rgba(196, 30, 58, 0.2) 0%, rgba(0, 0, 0, 0.1) 100%)",
    borderRadius: "0px",
    padding: "15px 30px",
    marginBottom: "20px",
    border: "2px solid #c41e3a",
    boxShadow: "0 0 15px rgba(196, 30, 58, 0.3)",
  },
  attemptsText: {
    margin: 0,
    fontSize: "16px",
    color: "#ffd700",
    letterSpacing: "1px",
  },
  attemptsCount: {
    color: "#c41e3a",
    fontSize: "24px",
    fontWeight: "bold",
    textShadow: "0 0 10px rgba(196, 30, 58, 0.6)",
  },
  hintButton: {
    padding: "10px 25px",
    fontSize: "14px",
    background: "linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(0, 0, 0, 0.1) 100%)",
    color: "#ffd700",
    border: "2px solid #ffd700",
    borderRadius: "0px",
    cursor: "pointer",
    marginBottom: "15px",
    fontWeight: "bold",
    textShadow: "1px 1px 3px rgba(0, 0, 0, 0.8)",
    letterSpacing: "1px",
  },
  hintBox: {
    background: "linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(0, 0, 0, 0.2) 100%)",
    border: "2px solid #ffd700",
    borderRadius: "0px",
    padding: "15px",
    maxWidth: "500px",
    textAlign: "center",
    margin: "0 0 30px 0",
    boxShadow: "0 0 15px rgba(255, 215, 0, 0.2)",
  },
  noteBox: {
    background: "linear-gradient(135deg, rgba(196, 30, 58, 0.15) 0%, rgba(0, 0, 0, 0.1) 100%)",
    borderRadius: "0px",
    padding: "15px",
    maxWidth: "500px",
    textAlign: "center",
    border: "2px solid #c41e3a",
    marginTop: "20px",
    boxShadow: "0 0 15px rgba(196, 30, 58, 0.2)",
  },
  note: {
    margin: 0,
    fontSize: "12px",
    color: "#ff9999",
    letterSpacing: "1px",
  },
};

// Add global animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes glow {
    0%, 100% {
      text-shadow: 0 0 30px rgba(255, 215, 0, 0.9), 0 0 60px rgba(196, 30, 58, 0.6), 2px 2px 8px rgba(0, 0, 0, 0.9);
    }
    50% {
      text-shadow: 0 0 40px rgba(255, 215, 0, 1), 0 0 80px rgba(196, 30, 58, 0.8), 2px 2px 8px rgba(0, 0, 0, 0.9);
    }
  }
  
  @keyframes blink {
    0%, 49% {
      opacity: 1;
    }
    50%, 100% {
      opacity: 0.5;
    }
  }
`;
if (!document.querySelector("style[data-dojo]")) {
  styleSheet.setAttribute("data-dojo", "true");
  document.head.appendChild(styleSheet);
}

export default Enter;