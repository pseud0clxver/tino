"use client";

import { useState, useEffect } from "react";
import styles from "./CountUpTimer.module.css";
import confetti from "canvas-confetti";

interface Props {
  startDate: string;
  isFixed: boolean;
}

export default function CountUpTimer({ startDate, isFixed }: Props) {
  const [timePassed, setTimePassed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [phase, setPhase] = useState<"idle" | "unveiling" | "moving" | "done">("idle");
  const [rollingNumbers, setRollingNumbers] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    if (!isFixed || phase !== "idle") return;

    const startId = window.setTimeout(() => {
      setPhase("unveiling");

      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#2e1065', '#db2777', '#ffb7b2']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#2e1065', '#db2777', '#ffb7b2']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();

      window.setTimeout(() => {
        setPhase("moving");
        window.setTimeout(() => setPhase("done"), 1000);
      }, 3000);
    }, 0);

    return () => clearTimeout(startId);
  }, [isFixed, phase]);

  useEffect(() => {
    if (phase === "unveiling") {
      const rollInterval = setInterval(() => {
        setRollingNumbers({
          d: Math.floor(Math.random() * 999),
          h: Math.floor(Math.random() * 24),
          m: Math.floor(Math.random() * 60),
          s: Math.floor(Math.random() * 60),
        });
      }, 50);
      return () => clearInterval(rollInterval);
    }
  }, [phase]);

  useEffect(() => {
    if (!isFixed || phase === "unveiling" || phase === "moving") {
      return;
    }

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const start = new Date(startDate).getTime();
      const distance = now - start;

      if (distance > 0) {
        setTimePassed({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startDate, isFixed, phase]);

  const format = (n: number) => String(n).padStart(2, "0");

  const idleTime = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const activeTime = isFixed ? timePassed : idleTime;

  const display = phase === "unveiling" || phase === "moving" 
    ? { days: rollingNumbers.d, hours: rollingNumbers.h, minutes: rollingNumbers.m, seconds: rollingNumbers.s } 
    : activeTime;

  return (
    <div className={`${styles.overlay} ${styles[phase]}`}>
      <div className={`${styles.card} ${phase === "unveiling" ? styles.shake : ""}`}>
        <p className={styles.title}>Since the big day</p>
        <div className={styles.row}>
          <div className={styles.unit}>
            <span className={styles.value}>{format(display.days)}</span>
            <span className={styles.label}>Days</span>
          </div>
          <span className={styles.sep}>:</span>
          <div className={styles.unit}>
            <span className={styles.value}>{format(display.hours)}</span>
            <span className={styles.label}>Hrs</span>
          </div>
          <span className={styles.sep}>:</span>
          <div className={styles.unit}>
            <span className={styles.value}>{format(display.minutes)}</span>
            <span className={styles.label}>Min</span>
          </div>
          <span className={styles.sep}>:</span>
          <div className={styles.unit}>
            <span className={styles.value}>{format(display.seconds)}</span>
            <span className={styles.label}>Sec</span>
          </div>
        </div>
      </div>
    </div>
  );
}
