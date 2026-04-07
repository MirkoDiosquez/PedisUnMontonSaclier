import React, { useState, useEffect } from "react";

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [countdown, setCountdown] = useState("");
  const [timeLeft, setTimeLeft] = useState(5);
  const [clicks, setClicks] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [canClick, setCanClick] = useState(false);

  const startGame = () => {
    setGameStarted(true);
    setCountdown("Preparados");

    setTimeout(() => setCountdown("Listos"), 1000);
    setTimeout(() => {
      setCountdown("Ya");
      setCanClick(true);
    }, 2000);

    setTimeout(() => {
      setCountdown("");
      setTimeLeft(5);
    }, 3000);
  };

  useEffect(() => {
    let timer;
    if (canClick && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setCanClick(false);
      setGameStarted(false);
      if (clicks > maxScore) setMaxScore(clicks);
    }
    return () => clearInterval(timer);
  }, [canClick, timeLeft]);

  const handleClick = () => {
    if (canClick) setClicks((prev) => prev + 1);
  };

  const resetGame = () => {
    setClicks(0);
    setTimeLeft(5);
  };

  useEffect(() => {
    if (!gameStarted) resetGame();
  }, [gameStarted]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Juego Contador</h1>
      <h2>Puntaje Máximo: {maxScore}</h2>

      <button onClick={startGame} disabled={gameStarted}>
        Iniciar
      </button>

      <button onClick={handleClick} disabled={!canClick}>
        Click!
      </button>

      <h2>{countdown}</h2>

      {canClick && (
        <>
          <p>Tiempo restante: {timeLeft}s</p>
          <p>Clicks: {clicks}</p>
        </>
      )}
    </div>
  );
}

export default App;
