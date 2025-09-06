import React, { useState, useRef } from "react";
import "./TigrinhoSlotMachine.css";

const symbols = [
  { icon: "🐯", name: "Tigre" },
  { icon: "🍒", name: "Cereja" },
  { icon: "💎", name: "Diamante" },
  { icon: "🔔", name: "Sino" },
  { icon: "🍋", name: "Limão" },
  { icon: "⭐", name: "Estrela" },
];

function getRandomSymbol() {
  return symbols[Math.floor(Math.random() * symbols.length)];
}

// Função para tocar som
function playSound(ref) {
  if (ref.current) {
    ref.current.currentTime = 0;
    ref.current.play();
  }
}

export default function TigrinhoSlotMachine({ onScore }) {
  const [reels, setReels] = useState([getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]);
  const [coins, setCoins] = useState(100);
  const [message, setMessage] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [animate, setAnimate] = useState(false);

  // Refs de áudio
  const spinSound = useRef(null);
  const winSound = useRef(null);
  const jackpotSound = useRef(null);
  const loseSound = useRef(null);

  const spin = () => {
    if (spinning || coins <= 0) return;
    setSpinning(true);
    setCoins((c) => c - 5);
    setMessage("");
    setAnimate(true);
    playSound(spinSound);

    let spins = 18;
    let interval = setInterval(() => {
      setReels([getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]);
      spins--;
      if (spins === 0) {
        clearInterval(interval);
        setTimeout(() => finishSpin(), 300);
      }
    }, 60);
  };

  function finishSpin() {
    const finalReels = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
    setReels(finalReels);

    // Regras de vitória
    if (finalReels.every((s) => s.icon === "🐯")) {
      setCoins((c) => {
        const nc = c + 100;
        onScore && onScore(nc);
        return nc;
      });
      setMessage("🎉 JACKPOT! Três tigres! Você ganhou 100 moedas!");
      playSound(jackpotSound);
    } else if (finalReels[0].icon === finalReels[1].icon && finalReels[1].icon === finalReels[2].icon) {
      setCoins((c) => {
        const nc = c + 30;
        onScore && onScore(nc);
        return nc;
      });
      setMessage("👏 Três símbolos iguais! Você ganhou 30 moedas.");
      playSound(winSound);
    } else if (finalReels.filter((s) => s.icon === "🐯").length === 2) {
      setCoins((c) => {
        const nc = c + 10;
        onScore && onScore(nc);
        return nc;
      });
      setMessage("😺 Dois tigres! Você ganhou 10 moedas.");
      playSound(winSound);
    } else {
      setMessage("😢 Não foi dessa vez. Tente novamente!");
      playSound(loseSound);
    }
    setSpinning(false);
    setAnimate(false);
  }

  const resetGame = () => {
    setCoins(100);
    setMessage("");
    setReels([getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]);
    onScore && onScore(100);
  };

  return (
    <div className="slot-container">
      <h2>
        Jogo do Tigrinho <span role="img" aria-label="tigre">🐯</span>
      </h2>
      <div className="slot-coins">Moedas: {coins}</div>
      <div className={`slot-reels ${animate ? "spin-anim" : ""}`}>
        {reels.map((symbol, idx) => (
          <span key={idx} className="slot-reel">
            <span className="slot-symbol">{symbol.icon}</span>
            <span className="slot-name">{symbol.name}</span>
          </span>
        ))}
      </div>
      <div className="slot-message">{message}</div>
      <button
        className="slot-btn slot-spin"
        onClick={spin}
        disabled={spinning || coins <= 0}
      >
        Girar
      </button>
      <button className="slot-btn slot-reset" onClick={resetGame}>
        Reiniciar
      </button>
      {coins <= 0 && (
        <div className="slot-gameover">
          Suas moedas acabaram! Clique em "Reiniciar".
        </div>
      )}
      {/* Áudios */}
      <audio ref={spinSound} src="/spin.mp3" preload="auto" />
      <audio ref={winSound} src="/win.mp3" preload="auto" />
      <audio ref={jackpotSound} src="/jackpot.mp3" preload="auto" />
      <audio ref={loseSound} src="/lose.mp3" preload="auto" />
    </div>
  );
}