import { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Enter from './kickdoor';
import Main from './main-dojo';

function App() {
  return(
    <Router>
      <Routes>
        <Route path="/" element={<Enter />} />
        <Route path="/main-dojo" element={<Main />} />
      </Routes>
    </Router>
  )
}

export default App
