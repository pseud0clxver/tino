"use client";

import { useState, useEffect } from "react";
import styles from "./countdown.module.css";

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
  "Who would've thought I'd get you...", // Daniel Caesar - Get You
  "You're my water when I'm stuck in the desert...", // Daniel Caesar - Get You
  "You're the best part of my days...", // Daniel Caesar - Best Part
  "If my love's a weapon, I'm dangerous...", // Daniel Caesar - Japanese Denim
  "It's the sweetest thing...", // Daniel Caesar - Best Part
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

const LockHeartArrow = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', color: '#ffb7b2' }}>
    {/* Lock */}
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
    {/* Arrow */}
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
    {/* Heart */}
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  </div>
);

const Countdown: React.FC<Props> = ({ targetDate, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // Phrase rotation interval
  useEffect(() => {
    const phraseTimer = setInterval(() => {
      setFade(false); // trigger fade out
      setTimeout(() => {
        setPhraseIndex((prev) => (prev + 1) % PHRASES.length);
        setFade(true); // trigger fade in
      }, 500); // Wait for fade out to complete before changing text
    }, 5000); // Change phrase every 5 seconds

    return () => clearInterval(phraseTimer);
  }, []);

  // Countdown interval
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance <= 0) {
        clearInterval(timer);
        onComplete();
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
  }, [targetDate, onComplete]);

  const format = (n: number) => String(n).padStart(2, "0");

  return (
    <div className={styles.container}>
      <div className={styles.glassCard}>
        <LockHeartArrow />
        
        <div className={styles.subtitleContainer}>
          <p className={`${styles.subtitle} ${fade ? styles.fadeIn : styles.fadeOut}`}>
            {PHRASES[phraseIndex]}
          </p>
        </div>

        <div className={styles.timer}>
          <div className={styles.unit}>
            <span>{format(timeLeft.days)}</span>
            <label>Days</label>
          </div>
          <div className={styles.unit}>
            <span>{format(timeLeft.hours)}</span>
            <label>Hrs</label>
          </div>
          <div className={styles.unit}>
            <span>{format(timeLeft.minutes)}</span>
            <label>Min</label>
          </div>
          <div className={styles.unit}>
            <span>{format(timeLeft.seconds)}</span>
            <label>Sec</label>
          </div>
        </div>

        <button
          type="button"
          className={styles.lockedButton}
          disabled
          aria-label="Locked until the countdown ends"
        >
          <svg
            className={styles.lockedIcon}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>LOCKED</span>
        </button>
      </div>
    </div>
  );
};

export default Countdown;
