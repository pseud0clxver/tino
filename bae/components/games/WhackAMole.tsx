"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import styles from "./WhackAMole.module.css";

const HOLES = 9;
const TARGET_SCORE = 20;
const GAME_DURATION = 30;
const MOLE_VISIBLE_MS = 900;
const TINO_IMG = "/images/easter_egg_2.webp";

export default function WhackAMole({ onComplete }: { onComplete: () => void }) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [activeHole, setActiveHole] = useState<number | null>(null);
  const [whackedHole, setWhackedHole] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState<"win" | "lose" | null>(null);
  const moleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gameTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const playingRef = useRef(false);
  const scoreRef = useRef(0);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  const clearMoleTimer = () => {
    if (moleTimer.current) {
      clearTimeout(moleTimer.current);
      moleTimer.current = null;
    }
  };

  const endGame = useCallback(
    (result: "win" | "lose") => {
      setFinished(result);
      playingRef.current = false;
      setPlaying(false);
      clearMoleTimer();
      if (gameTimer.current) clearInterval(gameTimer.current);
      setActiveHole(null);
      if (result === "win") setTimeout(onComplete, 1500);
    },
    [onComplete]
  );

  const spawnMole = useCallback(function spawnMoleImpl() {
    if (!playingRef.current) return;
    clearMoleTimer();
    const next = Math.floor(Math.random() * HOLES);
    setActiveHole(next);
    setWhackedHole(null);

    moleTimer.current = setTimeout(() => {
      setActiveHole(null);
      moleTimer.current = setTimeout(spawnMoleImpl, 180);
    }, MOLE_VISIBLE_MS);
  }, []);

  const startGame = () => {
    clearMoleTimer();
    if (gameTimer.current) clearInterval(gameTimer.current);
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setActiveHole(null);
    setWhackedHole(null);
    setFinished(null);
    setPlaying(true);
    playingRef.current = true;
    spawnMole();
  };

  useEffect(() => {
    if (!playing || finished) return;

    gameTimer.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (gameTimer.current) clearInterval(gameTimer.current);
          playingRef.current = false;
          setPlaying(false);
          clearMoleTimer();
          setActiveHole(null);
          window.setTimeout(() => {
            endGame(scoreRef.current >= TARGET_SCORE ? "win" : "lose");
          }, 0);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (gameTimer.current) clearInterval(gameTimer.current);
    };
  }, [playing, finished, endGame]);

  const handleWhack = (index: number) => {
    if (!playing || finished || activeHole !== index) return;

    clearMoleTimer();
    setWhackedHole(index);
    setActiveHole(null);
    setScore((s) => {
      const next = s + 1;
      if (next >= TARGET_SCORE) {
        window.setTimeout(() => endGame("win"), 0);
      }
      return next;
    });

    setTimeout(() => {
      setWhackedHole(null);
      spawnMole();
    }, 200);
  };

  useEffect(() => {
    return () => {
      clearMoleTimer();
      if (gameTimer.current) clearInterval(gameTimer.current);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Whack a Tino</h1>
        <p className={styles.subtitle}>
          Whack Tino {TARGET_SCORE} times in {GAME_DURATION} seconds!
        </p>

        <div className={styles.stats}>
          <div>
            <div className={styles.statValue}>{score}</div>
            <div>Score</div>
          </div>
          <div>
            <div className={styles.statValue}>{timeLeft}s</div>
            <div>Time</div>
          </div>
        </div>

        <div className={styles.grid}>
          {Array.from({ length: HOLES }).map((_, i) => (
            <button
              key={i}
              type="button"
              className={styles.hole}
              onClick={() => handleWhack(i)}
              disabled={!playing || !!finished}
              aria-label={`Hole ${i + 1}`}
            >
              <div className={styles.holeInner}>
                <div
                  className={`${styles.mole} ${activeHole === i ? styles.moleUp : ""} ${whackedHole === i ? styles.moleWhacked : ""}`}
                >
                  <Image
                    src={TINO_IMG}
                    alt="Tino"
                    width={80}
                    height={80}
                    className={styles.moleImg}
                    unoptimized
                  />
                </div>
              </div>
            </button>
          ))}
        </div>

        <p className={`${styles.result} ${finished === "win" ? styles.win : finished === "lose" ? styles.lose : ""}`}>
          {!playing && !finished && "Ready?"}
          {playing && !finished && "Whack Her!"}
          {finished === "win" && "You did it!"}
          {finished === "lose" && "Time's up — try again!"}
        </p>

        {(!playing || finished === "lose") && (
          <button type="button" className={styles.startBtn} onClick={startGame}>
            {finished === "lose" ? "Try Again" : "Start"}
          </button>
        )}
      </div>
    </div>
  );
}
