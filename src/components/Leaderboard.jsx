import React, { useEffect, useState } from "react";

const STORAGE_KEY = "tigrinho-leaderboard";

function getLeaderboard() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveLeaderboard(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export default function Leaderboard({ score }) {
  const [leaderboard, setLeaderboard] = useState(getLeaderboard());
  const [name, setName] = useState("");
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    if (score && (leaderboard.length < 5 || score > leaderboard[leaderboard.length - 1].score)) {
      setShowInput(true);
    }
    // eslint-disable-next-line
  }, [score]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;
    const newList = [...leaderboard, { name, score }]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    setLeaderboard(newList);
    saveLeaderboard(newList);
    setShowInput(false);
    setName("");
  };

  return (
    <div className="leaderboard-container">
      <h3>Leaderboard</h3>
      <ol>
        {leaderboard.map((item, idx) => (
          <li key={idx}>
            <span role="img" aria-label="user">👤</span> {item.name || "Anônimo"}: <b>{item.score}</b>
          </li>
        ))}
      </ol>
      {showInput && (
        <form onSubmit={handleSubmit} className="leaderboard-form">
          <input
            value={name}
            placeholder="Seu nome"
            maxLength={12}
            onChange={e => setName(e.target.value)}
            required
          />
          <button type="submit">Salvar</button>
        </form>
      )}
    </div>
  );
}