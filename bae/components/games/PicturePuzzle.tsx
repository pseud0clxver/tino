"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import styles from "./PicturePuzzle.module.css";

const PUZZLE_IMAGE = "/images/easter_egg_5.webp";
const COLS = 4;
const ROWS = 2;
const PIECE_COUNT = COLS * ROWS;

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pieceOffset(pieceId: number) {
  const col = pieceId % COLS;
  const row = Math.floor(pieceId / COLS);
  return {
    transform: `translate(-${col * (100 / COLS)}%, -${row * (100 / ROWS)}%)`,
  };
}

function PuzzlePiece({ pieceId }: { pieceId: number }) {
  return (
    <Image
      src={PUZZLE_IMAGE}
      alt=""
      width={400}
      height={200}
      className={styles.pieceImg}
      style={pieceOffset(pieceId)}
      unoptimized
      draggable={false}
    />
  );
}

function createInitialBank() {
  return shuffle(Array.from({ length: PIECE_COUNT }, (_, i) => i));
}

export default function PicturePuzzle({ onComplete }: { onComplete: () => void }) {
  const [slots, setSlots] = useState<(number | null)[]>(() => Array(PIECE_COUNT).fill(null));
  const [bank, setBank] = useState<number[]>(createInitialBank);
  const [selected, setSelected] = useState<{ from: "bank" | "slot"; id: number } | null>(null);
  const [solved, setSolved] = useState(false);
  const [status, setStatus] = useState("Tap a piece, then tap the matching numbered spot.");

  const [showOverlay, setShowOverlay] = useState(false);

  const init = useCallback(() => {
    setSlots(Array(PIECE_COUNT).fill(null));
    setBank(createInitialBank());
    setSelected(null);
    setSolved(false);
    setStatus("Tap a piece, then tap the matching numbered spot.");
  }, []);

  const checkWin = useCallback(
    (nextSlots: (number | null)[]) => {
      const complete = nextSlots.every((p, i) => p === i);
      if (complete) {
        setSolved(true);
        setStatus("Perfect — you did it!");
        setTimeout(() => setShowOverlay(true), 800);
      } else if (nextSlots.every((p) => p !== null)) {
        setStatus("Almost! A few pieces are in the wrong spot — tap to swap.");
      }
    },
    []
  );

  const handleBankPiece = (pieceId: number) => {
    if (solved) return;
    setSelected({ from: "bank", id: pieceId });
    setStatus(`Piece selected — tap spot #${pieceId + 1} on the board.`);
  };

  const handleSlot = (slotIndex: number) => {
    if (solved) return;

    const placed = slots[slotIndex];

    if (selected?.from === "bank") {
      if (placed !== null) return;

      const nextSlots = [...slots];
      nextSlots[slotIndex] = selected.id;
      const nextBank = bank.filter((p) => p !== selected.id);

      setSlots(nextSlots);
      setBank(nextBank);
      setSelected(null);

      if (selected.id === slotIndex) {
        setStatus("Nice! Keep going.");
      } else {
        setStatus(`Placed — spot #${slotIndex + 1} needs piece #${slotIndex + 1}.`);
      }

      checkWin(nextSlots);
      return;
    }

    if (placed !== null) {
      const nextSlots = [...slots];
      nextSlots[slotIndex] = null;
      setSlots(nextSlots);
      setBank((b) => [...b, placed]);
      setSelected({ from: "bank", id: placed });
      setStatus(`Piece back in tray — tap the right spot.`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Who&apos;s that pokémon?</h1>
        <p className={styles.subtitle}>
          Drag-free jigsaw — tap a piece below, then tap its matching number on the board.
        </p>

        <p className={`${styles.status} ${solved ? styles.win : ""}`}>{status}</p>

        <div className={`${styles.board} ${solved ? styles.correctFlash : ""}`}>
          {slots.map((pieceId, slotIndex) => (
            <button
              key={slotIndex}
              type="button"
              className={`${styles.slot} ${pieceId !== null ? styles.slotFilled : ""} ${selected?.from === "bank" && selected.id === slotIndex ? styles.slotSelected : ""}`}
              onClick={() => handleSlot(slotIndex)}
              disabled={solved}
              aria-label={`Slot ${slotIndex + 1}`}
            >
              {pieceId === null && (
                <span className={styles.slotLabel}>{slotIndex + 1}</span>
              )}
              {pieceId !== null && <PuzzlePiece pieceId={pieceId} />}
            </button>
          ))}
        </div>

        {!solved && bank.length > 0 && (
          <>
            <p className={styles.trayLabel}>Pieces</p>
            <div className={styles.tray}>
              {bank.map((pieceId) => (
                <button
                  key={pieceId}
                  type="button"
                  className={`${styles.trayPiece} ${selected?.from === "bank" && selected.id === pieceId ? styles.trayPieceSelected : ""}`}
                  onClick={() => handleBankPiece(pieceId)}
                  aria-label={`Piece ${pieceId + 1}`}
                >
                  <PuzzlePiece pieceId={pieceId} />
                </button>
              ))}
            </div>
          </>
        )}

        {!solved && (
          <button type="button" className={styles.resetBtn} onClick={init}>
            Start over
          </button>
        )}
      </div>

      {showOverlay && (
        <div className={styles.packOverlay}>
          <div className={styles.packEffects}>
            <div className={styles.starburst}></div>
            <div className={styles.glare}></div>
          </div>
          <div className={styles.packContent}>
            <div className={styles.packHeader}>Who&apos;s that pokémon?</div>
            <div className={styles.packCard}>
              <Image src={PUZZLE_IMAGE} alt="Completed puzzle" fill className={styles.packImg} unoptimized />
            </div>
            <button className={styles.packButton} onClick={onComplete} aria-label="Tap to open">
              Proceed
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
