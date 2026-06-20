"use client";

import { useState, useEffect } from "react";
import styles from "./countdown.module.css";
import "wired-elements";
import { RoughNotation } from "react-rough-notation";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface Props {
  targetDate: string;
  onComplete: () => void;
}

const PHRASES = [
  "Our next chapter begins in...",
  "Who would've thought I'd get you...",
  "You're my water when I'm stuck in the desert...",
  "You're the best part of my days...",
  "If my love's a weapon, I'm dangerous...",
  "It's the sweetest thing...",
  "I've been waiting for you all my life...",
  "Just a little longer now...",
  "Counting the seconds until you...",
  "Every time you cross my mind...",
  "Can't take my eyes off of you...",
  "Can't wait to hold you...",
  "You are my sunshine...",
  "Every day I love you more...",
  "I'll be your favorite thing..."
];

const Countdown: React.FC<Props> = ({ targetDate, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isBroken, setIsBroken] = useState(false);

  // Phrase rotation interval
  useEffect(() => {
    const phraseTimer = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % PHRASES.length);
    }, 5000);

    return () => clearInterval(phraseTimer);
  }, []);

  // Countdown interval
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance <= 0) {
        clearInterval(timer);
        setIsBroken(true);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const format = (n: number) => String(n).padStart(2, "0");

  return (
    <div className={styles.container}>
      <wired-card elevation="5" style={{ background: "rgba(255, 255, 255, 0.6)", padding: "2rem", borderRadius: "8px", maxWidth: "90%", width: "500px" }}>
        <div className={styles.innerCard}>
          <div className={styles.subtitleContainer}>
            <RoughNotation type="highlight" show={true} color="#ffd1dc" animationDuration={1000}>
              <p className={styles.subtitle}>
                {PHRASES[phraseIndex]}
              </p>
            </RoughNotation>
          </div>

          <div className={`${styles.timer} ${isBroken ? styles.brokenTimer : ""}`}>
            <div className={styles.unit}>
              <span className={styles.pop}>{isBroken ? "XX" : format(timeLeft.days)}</span>
              <label>Days</label>
            </div>
            <div className={styles.unit}>
              <span className={styles.pop}>{isBroken ? "XX" : format(timeLeft.hours)}</span>
              <label>Hrs</label>
            </div>
            <div className={styles.unit}>
              <span className={styles.pop}>{isBroken ? "XX" : format(timeLeft.minutes)}</span>
              <label>Min</label>
            </div>
            <div className={styles.unit}>
              <span className={styles.pop}>{isBroken ? "XX" : format(timeLeft.seconds)}</span>
              <label>Sec</label>
            </div>
          </div>

          {isBroken ? (
            <div className={styles.actionContainer}>
              <wired-button 
                elevation="3" 
                style={{ color: "#2e1065", background: "#b19cd9", fontSize: "1.2rem", marginTop: "2rem" }}
                onClick={onComplete}
              >
                Fix Timer & Unlock
              </wired-button>
            </div>
          ) : (
            <div className={styles.actionContainer}>
              <wired-button disabled style={{ color: "#888", marginTop: "2rem" }}>
                LOCKED
              </wired-button>
            </div>
          )}
        </div>
      </wired-card>
    </div>
  );
};

export default Countdown;
