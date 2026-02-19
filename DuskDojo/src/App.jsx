import { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Enter from './kickdoor';
import WarriorSelection from './WarriorSelection';
import TrainingPanel from './TrainingPanel';
import SkillTree from './SkillTree';
import ProgressDashboard from './ProgressDashboard';

function App() {
  const [selectedWarrior, setSelectedWarrior] = useState(null);
  const [characterStats, setCharacterStats] = useState({
    name: 'Po',
    level: 1,
    experience: 0,
    skillPoints: 0,
    health: 100,
    attack: 10,
    agility: 5,
    defense: 8,
    trainingCompleted: 0,
    skills: {
      jumpHeight: 0,
      punchPower: 0,
      dodgeChance: 0,
      innerPeace: 0,
      focusedMind: 0,
    }
  });

  const handleWarriorSelect = (warrior) => {
    setSelectedWarrior(warrior);
    setCharacterStats(prev => {
      const newExp = prev.experience + 50;
      const expThreshold = 300;
      const newSkillPoints = Math.floor(newExp / expThreshold);
      const expAfterSkillPoints = newExp % expThreshold;
      
      return {
        ...prev,
        name: 'Po',
        experience: expAfterSkillPoints,
        skillPoints: prev.skillPoints + newSkillPoints
      };
    });
  };

  const handleSkillUpgrade = (skillName) => {
    setCharacterStats(prev => {
      if (prev.skillPoints <= 0) return prev;
      return {
        ...prev,
        skillPoints: prev.skillPoints - 1,
        skills: {
          ...prev.skills,
          [skillName]: (prev.skills[skillName] || 0) + 1
        }
      };
    });
  };

  const handleTrainingComplete = (expEarned = 150) => {
    setCharacterStats(prev => {
      const newExp = prev.experience + expEarned;
      const expThreshold = 300;
      const newSkillPoints = Math.floor(newExp / expThreshold);
      const expAfterSkillPoints = newExp % expThreshold;
      
      return {
        ...prev,
        trainingCompleted: prev.trainingCompleted + 1,
        experience: expAfterSkillPoints,
        skillPoints: prev.skillPoints + newSkillPoints,
        level: Math.floor(newExp / 300) + 1
      };
    });
  };

  return(
    <Router>
      <Routes>
        <Route path="/" element={<Enter />} />
        <Route path="/warrior-selection" element={<WarriorSelection onSelect={handleWarriorSelect} />} />
        <Route path="/training" element={<TrainingPanel stats={characterStats} onComplete={handleTrainingComplete} />} />
        <Route path="/skills" element={<SkillTree stats={characterStats} onUpgrade={handleSkillUpgrade} />} />
        <Route path="/progress" element={<ProgressDashboard stats={characterStats} />} />
      </Routes>
    </Router>
  )
}

export default App
