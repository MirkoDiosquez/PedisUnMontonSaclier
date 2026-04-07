import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './JuegoContador.module.css';

const GAME_DURATION_MS = 5000;
const COUNTDOWN_MESSAGES = ['Preparados', 'Listos', '¡Ya!'];

/**
 * JuegoContador
 *
 * Juego de clics contrarreloj: el usuario intenta hacer la mayor cantidad de
 * clics posible en 5 segundos, compitiendo contra su propio récord.
 */
export default function JuegoContador() {
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [progressPct, setProgressPct] = useState(100);
  const [phase, setPhase] = useState('idle'); // 'idle' | 'countdown' | 'playing' | 'finished'
  const [countdownMsg, setCountdownMsg] = useState('');
  const [newRecord, setNewRecord] = useState(false);
  const [resultMsg, setResultMsg] = useState('');

  const gameTimerRef = useRef(null);
  const scoreRef = useRef(0);

  // Keep scoreRef in sync so the interval closure always reads the latest value
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  const endGame = useCallback(() => {
    clearInterval(gameTimerRef.current);

    const finalScore = scoreRef.current;
    const isNewRecord = finalScore > 0 && finalScore > best; // best from closure is safe here

    setPhase('finished');
    setNewRecord(isNewRecord);

    if (isNewRecord) {
      setBest(finalScore);
      setResultMsg('¡Nuevo récord!');
    } else if (finalScore === 0) {
      setResultMsg('¡Animate a clickear!');
    } else {
      setResultMsg('¡Buen intento!');
    }
  }, [best]);

  const beginPlaying = useCallback(() => {
    setPhase('playing');
    setCountdownMsg('');

    const startTime = Date.now();

    gameTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, GAME_DURATION_MS - elapsed);
      const secondsLeft = Math.ceil(remaining / 1000);
      const pct = (remaining / GAME_DURATION_MS) * 100;

      setTimeLeft(secondsLeft);
      setProgressPct(pct);

      if (remaining <= 0) {
        endGame();
      }
    }, 50);
  }, [endGame]);

  const startGame = useCallback(() => {
    // Reset state
    setScore(0);
    scoreRef.current = 0;
    setTimeLeft(5);
    setProgressPct(100);
    setNewRecord(false);
    setResultMsg('');
    setPhase('countdown');

    let step = 0;
    setCountdownMsg(COUNTDOWN_MESSAGES[step]);

    const seq = setInterval(() => {
      step += 1;
      if (step < COUNTDOWN_MESSAGES.length) {
        setCountdownMsg(COUNTDOWN_MESSAGES[step]);
      }
      if (step === COUNTDOWN_MESSAGES.length - 1) {
        clearInterval(seq);
        setTimeout(beginPlaying, 900);
      }
    }, 1000);
  }, [beginPlaying]);

  const registerClick = useCallback(() => {
    setScore((prev) => prev + 1);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearInterval(gameTimerRef.current);
  }, []);

  const isCountdown = phase === 'countdown';
  const isPlaying = phase === 'playing';
  const isFinished = phase === 'finished';

  const startDisabled = isCountdown || isPlaying;
  const clickDisabled = !isPlaying;

  const timeClass = [styles.statValue, timeLeft <= 2 && isPlaying ? styles.danger : ''].join(' ');
  const progressClass = [styles.progressFill, timeLeft <= 2 && isPlaying ? styles.progressDanger : ''].join(' ');

  return (
    <main className={styles.wrapper}>
      <h1 className={styles.title}>JuegoContador</h1>

      <section className={styles.statsRow} aria-label="Estadísticas">
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Clicks</span>
          <output className={styles.statValue} aria-live="polite">{score}</output>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Máximo</span>
          <output className={styles.statValue}>{best}</output>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Tiempo</span>
          <output className={timeClass} aria-live="polite">{timeLeft}s</output>
        </div>
      </section>

      <div className={styles.progressWrap} role="progressbar" aria-valuenow={Math.round(progressPct)} aria-valuemin={0} aria-valuemax={100}>
        <div className={progressClass} style={{ width: `${progressPct}%` }} />
      </div>

      {(isCountdown || isFinished) && (
        <p className={styles.countdownMsg} aria-live="assertive" key={countdownMsg || resultMsg}>
          {isCountdown ? countdownMsg : resultMsg}
        </p>
      )}

      {newRecord && (
        <p className={styles.recordBadge} aria-live="polite">🏆 ¡Nuevo récord!</p>
      )}

      <section className={styles.buttonsRow}>
        <button
          className={styles.btnStart}
          onClick={startGame}
          disabled={startDisabled}
          aria-label="Iniciar juego"
        >
          ▶ Iniciar
        </button>

        <button
          className={styles.btnClick}
          onClick={registerClick}
          disabled={clickDisabled}
          aria-label="Hacer click"
        >
          ¡CLICK!
        </button>
      </section>
    </main>
  );
}
