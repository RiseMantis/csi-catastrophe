import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const fs = require("fs");
var bagOfWords;

fs.readFile("DuskDojo/public/words_alpha.txt", "utf-8", (err, data) => {
  if (err) {
    console.log("File read mei Haga");
    console.error(err);
  } else {
    bagOfWords = data.split("\n"); // split into array of words
    console.log("Loaded words:", bagOfWords.length);
    console.log("Sample:", bagOfWords.slice(0, 20)); // preview first 20
  }
});

function TrainingPanel({ stats, onComplete }) {
  const EXP_THRESHOLD = 300;
  const navigate = useNavigate();
  const [trainingPhase, setTrainingPhase] = useState("selection"); // selection, punching, jumping, complete
  const [typingGameTimer, setTypingGameTimer] = useState(60);
  const [wordsList, setWordsList] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [typedWord, setTypedWord] = useState("");
  const [correctWords, setCorrectWords] = useState(0);
  const [lastGameType, setLastGameType] = useState(null);
  const [isAFK, setIsAFK] = useState(false);
  const [afkTimer, setAfkTimer] = useState(0);
  const [mantraPoints, setMantraPoints] = useState([
    { id: 1, x: 30, y: 20, active: false },
    { id: 2, x: 70, y: 40, active: false },
    { id: 3, x: 50, y: 60, active: false },
    { id: 4, x: 20, y: 80, active: false },
  ]);
  const typingInputRef = useRef(null);
  const [obstacleJumps, setObstacleJumps] = useState(0);
  const [obstacles, setObstacles] = useState([]);
  const [playerPos, setPlayerPos] = useState(0);
  const [gameRunning, setGameRunning] = useState(false);
  const afkTimerRef = useRef(null);

  // Word pool with normal and confusing words
  const generateWordPool = () => {
    const normalWords = bagOfWords;
    const confusingWords = ["xzkd", "pqvw", "jxmn", "bfhp", "zqkl"];
    
    let pool = [];
    for (let i = 0; i < 15; i++) {
      if (Math.random() > 0.75) {
        pool.push(confusingWords[Math.floor(Math.random() * confusingWords.length)]);
      } else {
        pool.push(normalWords[Math.floor(Math.random() * normalWords.length)]);
      }
    }
    return pool;
  };

  // Handle typing input
  const handleTypingInput = (e) => {
    if (trainingPhase !== "punching" || isAFK) return;
    
    setAfkTimer(0);
    const key = e.key;
    
    if (key === " " || key === "Enter") {
      e.preventDefault();
      if (typedWord === wordsList[currentWordIndex]) {
        setCorrectWords((prev) => prev + 1);
        setCurrentWordIndex((prev) => prev + 1);
        setTypedWord("");
      } else if (typedWord.length > 0) {
        // Extend word on mistake
        const newWord = wordsList[currentWordIndex] + String.fromCharCode(97 + Math.floor(Math.random() * 26));
        setWordsList((prev) => {
          const updated = [...prev];
          updated[currentWordIndex] = newWord;
          return updated;
        });
        setTypedWord("");
      }
    } else if (key.length === 1) {
      setTypedWord((prev) => prev + key);
    } else if (key === "Backspace") {
      setTypedWord((prev) => prev.slice(0, -1));
    }
  };

  // Typing game timer
  useEffect(() => {
    if (trainingPhase !== "punching" || !wordsList.length) return;

    const timer = setInterval(() => {
      setTypingGameTimer((prev) => {
        if (prev <= 1) {
          setLastGameType("typing");
          setTrainingPhase("selection");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [trainingPhase, wordsList]);

  // AFK Detection
  useEffect(() => {
    if (trainingPhase !== "punching") return;

    afkTimerRef.current = setInterval(() => {
      setAfkTimer((prev) => {
        const newTimer = prev + 1;
        if (newTimer >= 5) {
          setIsAFK(true);
        }
        return newTimer;
      });
    }, 1000);

    return () => clearInterval(afkTimerRef.current);
  }, [trainingPhase]);

  // Wake up by tapping mantra points
  const handleMantraTap = (id) => {
    if (!isAFK) return;
    setMantraPoints((prev) =>
      prev.map((point) =>
        point.id === id ? { ...point, active: true } : point
      )
    );

    const allActive = mantraPoints.length === mantraPoints.filter((p) => p.active).length + 1;
    if (allActive) {
      setIsAFK(false);
      setAfkTimer(0);
      setMantraPoints((prev) => prev.map((p) => ({ ...p, active: false })));
    }
  };

  // Obstacle generation
  useEffect(() => {
    if (trainingPhase !== "jumping" || !gameRunning) return;

    const interval = setInterval(() => {
      setObstacles((prev) => [
        ...prev,
        {
          id: Math.random(),
          x: 100,
          opacity: 1,
        },
      ]);
    }, 800);

    return () => clearInterval(interval);
  }, [trainingPhase, gameRunning]);

  // Obstacle movement
  useEffect(() => {
    if (trainingPhase !== "jumping" || !gameRunning) return;

    const interval = setInterval(() => {
      setObstacles((prev) => {
        return prev
          .map((obs) => ({
            ...obs,
            x: obs.x - 5,
            opacity: obs.x > 30 ? 1 : obs.x > 10 ? 0.3 : 0,
          }))
          .filter((obs) => obs.x > -50);
      });
    }, 30);

    return () => clearInterval(interval);
  }, [trainingPhase, gameRunning]);

  // Jump detection
  const handleJump = () => {
    if (trainingPhase !== "jumping" || !gameRunning) return;

    const collision = obstacles.some(
      (obs) => Math.abs(obs.x - 50) < 20 && obs.opacity > 0.8
    );

    if (!collision) {
      setObstacleJumps((prev) => prev + 1);
    } else {
      alert("❌ HIT BY OBSTACLE! Training Failed!");
      setGameRunning(false);
      setTrainingPhase("selection");
    }
  };

  // Start training
  const startTraining = (type) => {
    setTrainingPhase(type);
    setLastGameType(null);
    if (type === "punching") {
      const pool = generateWordPool();
      setWordsList(pool);
      setCurrentWordIndex(0);
      setTypedWord("");
      setCorrectWords(0);
      setTypingGameTimer(60);
      setIsAFK(false);
      setAfkTimer(0);
      setTimeout(() => typingInputRef.current?.focus(), 100);
    } else if (type === "jumping") {
      setObstacleJumps(0);
      setObstacles([]);
      setGameRunning(true);
    }
  };

  // Complete training
  const completeTraining = (expAmount = 150) => {
    onComplete(expAmount);
    navigate("/skills");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🥋 TRAINING PANEL 🥋</h1>
      <p style={styles.subtitle}>Current Warrior: {stats.name}</p>

      {/* Navigation Bar */}
      <div style={styles.navBar}>
        <button
          style={styles.navButton}
          onClick={() => navigate("/skills")}
        >
          📖 SKILL TREE
        </button>
        <button
          style={styles.navButton}
          onClick={() => navigate("/progress")}
        >
          📊 PROGRESS DASHBOARD
        </button>
      </div>

      {trainingPhase === "selection" && !lastGameType && (
        <div style={styles.selectionPanel}>
          <h2 style={styles.sectionTitle}>Choose Your Training</h2>
          <div style={styles.buttonGrid}>
            <button
              style={styles.trainingButton}
              onClick={() => startTraining("punching")}
            >
              ⌨️ TYPING DOJO<br />
              <span style={{ fontSize: "12px" }}>Type words for 60 seconds</span>
            </button>
            <button
              style={styles.trainingButton}
              onClick={() => startTraining("jumping")}
            >
              🚀 OBSTACLE JUMPING<br />
              <span style={{ fontSize: "12px" }}>Jump over 10 obstacles</span>
            </button>
          </div>
        </div>
      )}

      {/* TYPING GAME */}
      {trainingPhase === "punching" && wordsList.length > 0 && (
        <div style={styles.gameContainer}>
          <div style={styles.statsBar}>
            <span>⏱️ Time: {typingGameTimer}s</span>
            <span>✅ Words: {correctWords}</span>
            <span>🤖 AFK Timer: {afkTimer}s</span>
            <button
              style={styles.cancelButton}
              onClick={() => setTrainingPhase("selection")}
            >
              Quit
            </button>
          </div>

          <div
            style={styles.typingGameArea}
            onClick={() => typingInputRef.current?.focus()}
          >
            <div style={styles.currentWordDisplay}>
              Current Word: <span style={{ fontSize: "48px", color: "#c41e3a" }}>{currentWordIndex < wordsList.length ? wordsList[currentWordIndex] : "DONE!"}</span>
            </div>
            <div style={styles.typedWordDisplay}>
              You Typed: <span style={{ fontSize: "32px", color: "#00ff00" }}>{typedWord}</span>
            </div>
            
            <input
              ref={typingInputRef}
              type="text"
              style={styles.hiddenInput}
              onKeyDown={handleTypingInput}
              autoFocus
            />
          </div>

          {isAFK && (
            <div style={styles.mantraInstructions}>
              <p>⚡ TAP THE MANTRA POINTS TO WAKE UP! ⚡</p>
              <div style={styles.mantraGrid}>
                {mantraPoints.map((point) => (
                  <div
                    key={point.id}
                    style={{
                      ...styles.mantraPoint,
                      left: `${point.x}%`,
                      top: `${point.y}%`,
                      background: point.active ? "#00ff00" : "#ffd700",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMantraTap(point.id);
                    }}
                  >
                    ✦
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* OBSTACLE JUMPING GAME */}
      {trainingPhase === "jumping" && gameRunning && (
        <div style={styles.gameContainer}>
          <div style={styles.statsBar}>
            <span>🚀 Jumps: {obstacleJumps}/10</span>
            <span>Press SPACE to jump</span>
            <button
              style={styles.cancelButton}
              onClick={() => {
                setGameRunning(false);
                setTrainingPhase("selection");
              }}
            >
              Quit Game
            </button>
          </div>

          <div
            style={styles.jumpingGameArea}
            onKeyDown={(e) => {
              if (e.code === "Space") {
                handleJump();
              }
            }}
            tabIndex="0"
          >
            {/* Player */}
            <div style={styles.player}>🐼</div>

            {/* Obstacles - get fader as they approach */}
            {obstacles.map((obs) => (
              <div
                key={obs.id}
                style={{
                  ...styles.obstacle,
                  left: `${obs.x}%`,
                  opacity: obs.opacity,
                }}
              >
                ▮
              </div>
            ))}
          </div>

          {obstacleJumps >= 10 && (
            <button style={styles.completeButton} onClick={() => setTrainingPhase("selection")}>
              ✅ Jumping Training Complete!
            </button>
          )}
        </div>
      )}

      {/* TRAINING SUMMARY */}
      {trainingPhase === "selection" && lastGameType && (
          <div style={styles.completionPanel}>
            <h2 style={styles.sectionTitle}>Training Complete!</h2>
            {lastGameType === "typing" && (
              <>
                <p style={styles.progressText}>
                  ⌨️ Typing Dojo: {correctWords > 0 ? "✅ COMPLETED" : "❌ NO WORDS TYPED"}
                </p>
                <p style={styles.progressText}>
                  Words Typed: {correctWords}
                </p>
                <p style={styles.progressText}>
                  Experience Earned: {correctWords * 2} EXP
                </p>
                {correctWords > 0 && (
                  <button 
                    style={styles.nextButton} 
                    onClick={() => completeTraining(correctWords * 2)}
                  >
                    ✅ CLAIM REWARDS → SKILLS
                  </button>
                )}
                {correctWords === 0 && (
                  <button 
                    style={styles.nextButton} 
                    onClick={() => setTrainingPhase("selection")}
                  >
                    ← Back to Selection
                  </button>
                )}
              </>
            )}
            {punchCount >= 20 && (
              <p style={styles.progressText}>
                🤜 Punching Bag: MASTERED
              </p>
            )}
            {obstacleJumps >= 10 && (
              <p style={styles.progressText}>
                🚀 Obstacle Jumping: MASTERED
              </p>
            )}
            {lastGameType !== "typing" && (
              <button style={styles.nextButton} onClick={() => setTrainingPhase("selection")}>
                ← Back to Selection
              </button>
            )}
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
  },
  title: {
    fontSize: "48px",
    textShadow: "0 0 30px rgba(255, 215, 0, 0.9), 0 0 60px rgba(196, 30, 58, 0.6)",
    textAlign: "center",
    marginBottom: "10px",
  },
  subtitle: {
    textAlign: "center",
    color: "#c41e3a",
    marginBottom: "40px",
    fontSize: "18px",
  },
  navBar: {
    maxWidth: "800px",
    margin: "0 auto 30px",
    display: "flex",
    gap: "15px",
    justifyContent: "center",
  },
  navButton: {
    padding: "12px 25px",
    fontSize: "14px",
    fontWeight: "bold",
    background: "linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(196, 30, 58, 0.2))",
    color: "#ffd700",
    border: "2px solid #ffd700",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 0 10px rgba(255, 215, 0, 0.2)",
  },
  selectionPanel: {
    maxWidth: "800px",
    margin: "0 auto",
    background: "linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(196, 30, 58, 0.1))",
    border: "3px solid #c41e3a",
    padding: "40px",
    borderRadius: "0px",
  },
  sectionTitle: {
    fontSize: "32px",
    color: "#ffd700",
    textShadow: "0 0 15px rgba(255, 215, 0, 0.6)",
    marginTop: 0,
    marginBottom: "30px",
  },
  buttonGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  trainingButton: {
    padding: "30px 20px",
    fontSize: "18px",
    fontWeight: "bold",
    background: "linear-gradient(135deg, #c41e3a 0%, #8b1538 100%)",
    color: "#ffd700",
    border: "3px solid #ffd700",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 0 20px rgba(255, 215, 0, 0.3)",
  },
  gameContainer: {
    maxWidth: "900px",
    margin: "0 auto",
  },
  statsBar: {
    background: "linear-gradient(135deg, rgba(196, 30, 58, 0.2), rgba(0, 0, 0, 0.2))",
    border: "2px solid #ffd700",
    padding: "15px 30px",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "16px",
    color: "#ffd700",
    fontWeight: "bold",
  },
  cancelButton: {
    padding: "8px 15px",
    background: "rgba(196, 30, 58, 0.5)",
    border: "2px solid #c41e3a",
    color: "#ffd700",
    cursor: "pointer",
    fontSize: "14px",
  },
  punchingGameArea: {
    width: "100%",
    height: "400px",
    background: "radial-gradient(circle, rgba(0,0,0,0.2), rgba(0,0,0,0.6))",
    border: "4px solid #ffd700",
    position: "relative",
    cursor: "text",
    marginBottom: "20px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "30px",
  },
  typingGameArea: {
    width: "100%",
    height: "400px",
    background: "radial-gradient(circle, rgba(0,0,0,0.2), rgba(0,0,0,0.6))",
    border: "4px solid #ffd700",
    position: "relative",
    cursor: "text",
    marginBottom: "20px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "30px",
  },
  currentWordDisplay: {
    fontSize: "24px",
    color: "#ffd700",
    textShadow: "0 0 10px rgba(255, 215, 0, 0.6)",
  },
  typedWordDisplay: {
    fontSize: "20px",
    color: "#ffd700",
    minHeight: "40px",
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    width: 0,
    height: 0,
  },
  punchBag: {
    position: "absolute",
    top: "150px",
    left: "150px",
    fontSize: "80px",
    cursor: "pointer",
    filter: "drop-shadow(0 0 15px rgba(255, 215, 0, 0.6))",
  },
  sleepingCharacter: {
    position: "absolute",
    bottom: "20px",
    left: "20px",
    fontSize: "60px",
  },
  zzz: {
    position: "absolute",
    fontSize: "24px",
    color: "#ffd700",
    animation: "float 1s ease-in-out infinite",
  },
  mantraInstructions: {
    position: "absolute",
    inset: 0,
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  mantraGrid: {
    position: "relative",
    width: "300px",
    height: "300px",
  },
  mantraPoint: {
    position: "absolute",
    width: "40px",
    height: "40px",
    background: "#ffd700",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    animation: "pulse 0.8s ease-in-out infinite",
  },
  jumpingGameArea: {
    width: "100%",
    height: "400px",
    background: "linear-gradient(180deg, rgba(100, 150, 200, 0.1), rgba(0, 0, 0, 0.4))",
    border: "4px solid #ffd700",
    position: "relative",
    marginBottom: "20px",
    overflow: "hidden",
    focus: "outline: none",
  },
  player: {
    position: "absolute",
    bottom: "20px",
    left: "50px",
    fontSize: "60px",
  },
  obstacle: {
    position: "absolute",
    top: "50%",
    fontSize: "80px",
    color: "#ff0000",
    transition: "opacity 0.05s linear",
  },
  completeButton: {
    padding: "15px 40px",
    fontSize: "18px",
    fontWeight: "bold",
    background: "linear-gradient(135deg, #00ff00, #00d000)",
    color: "#000",
    border: "3px solid #00ff00",
    cursor: "pointer",
    marginTop: "20px",
    width: "100%",
  },
  completionPanel: {
    maxWidth: "600px",
    margin: "40px auto 0",
    background: "linear-gradient(135deg, rgba(0, 255, 0, 0.1), rgba(0, 0, 0, 0.2))",
    border: "3px solid #00ff00",
    padding: "30px",
  },
  progressText: {
    fontSize: "18px",
    color: "#00ff00",
    margin: "10px 0",
    textShadow: "0 0 10px rgba(0, 255, 0, 0.6)",
  },
  nextButton: {
    width: "100%",
    padding: "15px",
    marginTop: "20px",
    fontSize: "16px",
    fontWeight: "bold",
    background: "linear-gradient(135deg, #c41e3a, #8b1538)",
    color: "#ffd700",
    border: "3px solid #ffd700",
    cursor: "pointer",
  },
};

// Add animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); opacity: 1; }
    100% { transform: translateY(-40px); opacity: 0; }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }
`;
if (!document.querySelector("style[data-training]")) {
  styleSheet.setAttribute("data-training", "true");
  document.head.appendChild(styleSheet);
}

export default TrainingPanel;