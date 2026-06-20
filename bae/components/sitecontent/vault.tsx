"use client";

import { useState } from "react";
import "wired-elements";
import styles from "./vault.module.css";

const KEY_STYLE = {
  color: "#2e1065",
  background: "#eadef7",
  width: "100%",
  height: "100%",
  minWidth: "72px",
  minHeight: "72px",
  fontSize: "1.5rem",
  padding: "0.75rem",
} as const;

const CLEAR_STYLE = {
  ...KEY_STYLE,
  color: "#fff",
  background: "#ffb7b2",
  fontSize: "1.1rem",
} as const;

export default function Vault({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const TARGET_PIN = "0412";

  const handlePress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setError(false);

      if (newPin.length === 4) {
        if (newPin === TARGET_PIN) {
          setTimeout(onUnlock, 500);
        } else {
          setError(true);
          setTimeout(() => setPin(""), 1000);
        }
      }
    }
  };

  const handleClear = () => setPin("");

  const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <wired-card elevation="5" style={{ padding: 0, background: "transparent", width: "100%" }}>
        <h2 className={styles.title}>Enter PIN</h2>

        <div className={styles.pinRow}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`${styles.pinDot} ${i < pin.length ? styles.pinDotFilled : ""} ${error ? styles.pinDotError : ""}`}
            />
          ))}
        </div>

        <div className={styles.keypad}>
          {keys.map((num) => (
            <div key={num} className={styles.keyWrapper}>
              <wired-button
                elevation="2"
                style={KEY_STYLE}
                onClick={() => handlePress(num.toString())}
              >
                {num}
              </wired-button>
            </div>
          ))}

          <div className={styles.keyWrapperEmpty} aria-hidden />

          <div className={styles.keyWrapper}>
            <wired-button
              elevation="2"
              style={KEY_STYLE}
              onClick={() => handlePress("0")}
            >
              0
            </wired-button>
          </div>

          <div className={styles.keyWrapper}>
            <wired-button
              elevation="2"
              style={CLEAR_STYLE}
              onClick={handleClear}
            >
              CLR
            </wired-button>
          </div>
        </div>

        {error && <p className={styles.error}>Incorrect PIN!</p>}
        </wired-card>
      </div>
    </div>
  );
}
