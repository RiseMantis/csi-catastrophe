import { useNavigate } from "react-router-dom";

function SkillTree({ stats, onUpgrade }) {
  const navigate = useNavigate();

  const skills = [
    {
      id: "jumpHeight",
      name: "Gorilla Tactics",
      icon: "🚀",
      benefit: "+30% Jump Height",
      drawback: "⚠️ -50% Jump Cooldown Speed",
      description:
        "Leap higher to reach new heights... but recover slowly.",
      cost: 100,
    },
    {
      id: "punchPower",
      name: "One Paw-nch Man",
      icon: "👊",
      benefit: "+40% Punch Damage",
      drawback: "⚠️ -25% Attack Speed",
      description:
        "Hit harder... at the cost of deliberate, slow movements.",
      cost: 100,
    },
    {
      id: "dodgeChance",
      name: "Curse of Sans",
      icon: "🌀",
      benefit: "+35% Dodge Chance",
      drawback: "⚠️ -40% Defense Power",
      description:
        "Evade attacks... but take more damage when hit.",
      cost: 100,
    },
    {
      id: "innerPeace",
      name: "Inner Peace",
      icon: "☮️",
      benefit: "+50% Focus",
      drawback: "⚠️ Cannot use any Combat Skills for 10s",
      description: "Achieve ultimate harmony... at great inconvenience.",
      cost: 150,
    },
  ];

  const handleUpgrade = (skillId) => {
    if ((stats.skillPoints || 0) >= 1) {
      onUpgrade(skillId);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🌳 SKILL TREE 🌳</h1>
      <p style={styles.subtitle}>Current Warrior: {stats.name}</p>

      {/* Points Display */}
      <div style={styles.pointsDisplay}>
        <p style={styles.pointsText}>
          Available Skill Points: <span style={styles.pointsValue}>{stats.skillPoints || 0}</span>
        </p>
      </div>

      {/* Skills Grid */}
      <div style={styles.skillsContainer}>
        {skills.map((skill) => (
          <div key={skill.id} style={styles.skillCard}>
            <div style={styles.skillHeader}>
              <div style={styles.skillIcon}>{skill.icon}</div>
              <h3 style={styles.skillName}>{skill.name}</h3>
            </div>

            <p style={styles.skillDescription}>{skill.description}</p>

            {/* Benefits and Drawbacks */}
            <div style={styles.tradeoffSection}>
              <div style={styles.benefit}>
                <span style={styles.benefitLabel}>✅ GAIN:</span>
                <p style={styles.benefitText}>{skill.benefit}</p>
              </div>
              <div style={styles.drawback}>
                <span style={styles.drawbackLabel}>❌ LOSE:</span>
                <p style={styles.drawbackText}>{skill.drawback}</p>
              </div>
            </div>

            {/* Current upgrades */}
            <p style={styles.currentLevel}>
              Level: {stats.skills[skill.id] || 0}
            </p>

            {/* Upgrade button */}
            <button
              style={{
                ...styles.upgradeButton,
                opacity: (stats.skillPoints || 0) >= 1 ? 1 : 0.5,
              }}
              disabled={(stats.skillPoints || 0) < 1}
              onClick={() => handleUpgrade(skill.id)}
            >
              ⬆️ UPGRADE ({skill.cost} EXP)
            </button>
          </div>
        ))}
      </div>

      {/* Stats Preview */}
      <div style={styles.statsPanel}>
        <h2 style={styles.statsTitle}>📊 CHARACTER STATS</h2>
        <div style={styles.statsGrid}>
          <div style={styles.statBox}>
            <span style={styles.statLabel}>Health:</span>
            <span style={styles.statValue}>{stats.health}</span>
          </div>
          <div style={styles.statBox}>
            <span style={styles.statLabel}>Attack:</span>
            <span style={styles.statValue}>{stats.attack}</span>
          </div>
          <div style={styles.statBox}>
            <span style={styles.statLabel}>Agility:</span>
            <span style={styles.statValue}>{stats.agility}</span>
          </div>
          <div style={styles.statBox}>
            <span style={styles.statLabel}>Defense:</span>
            <span style={styles.statValue}>{stats.defense}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={styles.navigationPanel}>
        <button style={styles.navButton} onClick={() => navigate("/progress")}>
          → VIEW PROGRESS DASHBOARD
        </button>
        <button style={styles.backButton} onClick={() => navigate("/training")}>
          ← BACK TO TRAINING (if you dare)
        </button>
      </div>

      {/* Warning message */}
      <div style={styles.warningBox}>
        <p style={styles.warningText}>
          ⚡ Remember: Every gain comes with a sacrifice. Choose wisely... or regret eternally.
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
    padding: "40px 20px",
    fontFamily: "'SimSun', 'Noto Sans SC', serif",
  },
  title: {
    fontSize: "56px",
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
  pointsDisplay: {
    maxWidth: "800px",
    margin: "0 auto 30px",
    background: "linear-gradient(135deg, rgba(0, 200, 0, 0.15), rgba(0, 0, 0, 0.2))",
    border: "3px solid #00ff00",
    padding: "20px",
    textAlign: "center",
    boxShadow: "0 0 20px rgba(0, 200, 0, 0.3)",
  },
  pointsText: {
    fontSize: "20px",
    margin: 0,
    fontWeight: "bold",
  },
  pointsValue: {
    color: "#00ff00",
    fontSize: "28px",
    textShadow: "0 0 10px rgba(0, 255, 0, 0.8)",
  },
  skillsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    maxWidth: "1200px",
    margin: "0 auto 40px",
  },
  skillCard: {
    background: "linear-gradient(135deg, rgba(196, 30, 58, 0.2), rgba(0, 0, 0, 0.3))",
    border: "3px solid #ffd700",
    borderRadius: "0px",
    padding: "20px",
    boxShadow: "0 0 20px rgba(255, 215, 0, 0.2)",
  },
  skillHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "15px",
    gap: "15px",
  },
  skillIcon: {
    fontSize: "48px",
  },
  skillName: {
    margin: 0,
    color: "#ffd700",
    fontSize: "20px",
    textShadow: "0 0 10px rgba(255, 215, 0, 0.6)",
  },
  skillDescription: {
    margin: "10px 0 15px",
    color: "#ccc",
    fontSize: "13px",
    fontStyle: "italic",
  },
  tradeoffSection: {
    background: "rgba(0, 0, 0, 0.3)",
    padding: "15px",
    marginBottom: "15px",
    border: "1px solid rgba(255, 215, 0, 0.3)",
  },
  benefit: {
    marginBottom: "10px",
  },
  benefitLabel: {
    display: "block",
    color: "#00ff00",
    fontSize: "12px",
    fontWeight: "bold",
    marginBottom: "5px",
  },
  benefitText: {
    margin: 0,
    color: "#00ff00",
    fontSize: "13px",
  },
  drawback: {},
  drawbackLabel: {
    display: "block",
    color: "#ff6b6b",
    fontSize: "12px",
    fontWeight: "bold",
    marginBottom: "5px",
  },
  drawbackText: {
    margin: 0,
    color: "#ff9999",
    fontSize: "13px",
  },
  currentLevel: {
    textAlign: "center",
    color: "#999",
    fontSize: "12px",
    margin: "10px 0",
  },
  upgradeButton: {
    width: "100%",
    padding: "12px",
    fontSize: "14px",
    fontWeight: "bold",
    background: "linear-gradient(135deg, #c41e3a 0%, #8b1538 100%)",
    color: "#ffd700",
    border: "2px solid #ffd700",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  statsPanel: {
    maxWidth: "1000px",
    margin: "0 auto 30px",
    background: "linear-gradient(135deg, rgba(0, 60, 100, 0.15), rgba(0, 0, 0, 0.2))",
    border: "3px solid #00d000",
    padding: "30px",
    boxShadow: "0 0 20px rgba(0, 200, 0, 0.2)",
  },
  statsTitle: {
    color: "#00ff00",
    textShadow: "0 0 15px rgba(0, 255, 0, 0.6)",
    marginTop: 0,
    marginBottom: "20px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "15px",
  },
  statBox: {
    background: "rgba(0, 0, 0, 0.3)",
    border: "2px solid #00ff00",
    padding: "15px",
    textAlign: "center",
  },
  statLabel: {
    display: "block",
    color: "#ffd700",
    fontSize: "12px",
    marginBottom: "8px",
    fontWeight: "bold",
  },
  statValue: {
    display: "block",
    color: "#00ff00",
    fontSize: "24px",
    fontWeight: "bold",
    textShadow: "0 0 10px rgba(0, 255, 0, 0.6)",
  },
  navigationPanel: {
    maxWidth: "800px",
    margin: "0 auto 40px",
    display: "flex",
    gap: "20px",
  },
  navButton: {
    flex: 1,
    padding: "15px",
    fontSize: "16px",
    fontWeight: "bold",
    background: "linear-gradient(135deg, #c41e3a, #8b1538)",
    color: "#ffd700",
    border: "3px solid #ffd700",
    cursor: "pointer",
  },
  backButton: {
    flex: 1,
    padding: "15px",
    fontSize: "14px",
    background: "rgba(196, 30, 58, 0.2)",
    color: "#ffd700",
    border: "2px solid #ffd700",
    cursor: "pointer",
  },
  warningBox: {
    maxWidth: "800px",
    margin: "0 auto",
    background: "linear-gradient(135deg, rgba(196, 30, 58, 0.2), rgba(0, 0, 0, 0.1))",
    border: "3px solid #c41e3a",
    padding: "20px",
    textAlign: "center",
    boxShadow: "0 0 15px rgba(196, 30, 58, 0.3)",
  },
  warningText: {
    margin: 0,
    color: "#ffd700",
    fontSize: "14px",
    letterSpacing: "1px",
  },
};

export default SkillTree;