import React, { useState } from "react";
import TigrinhoSlotMachine from "./components/TigrinhoSlotMachine";
import Leaderboard from "./components/Leaderboard";
import "./App.css";

function App() {
  const [score, setScore] = useState(100);

  return (
    <div className="app-main">
      <TigrinhoSlotMachine onScore={setScore} />
      <Leaderboard score={score} />
      <footer className="footer">
        <small>
          Slot machine fictício para fins educacionais. Não envolve apostas reais.<br />
          Desenvolvido por <a href="https://github.com/rafaelangical" target="_blank" rel="noopener">rafaelangical</a>
        </small>
      </footer>
    </div>
  );
}

export default App;