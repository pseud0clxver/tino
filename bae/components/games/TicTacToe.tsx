"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import styles from "./TicTacToe.module.css";

type Cell = "X" | "O" | null;
type Board = Cell[];

interface TriviaQuestion {
  question: string;
  options: string[];
  correct: string[];
}

const TRIVIA: TriviaQuestion[] = [
  {
    question: "Who is my favourite basketball player?",
    options: ["Ja Morant", "Lebron James", "Kobe Bryant", "Lamelo Ball"],
    correct: ["Ja Morant"],
  },
  {
    question: "Who is my favourite artist?",
    options: ["Yeat", "Drake", "Frank Ocean", "Travis Scott"],
    correct: ["Yeat"],
  },
  {
    question: "What is my favourite thing to do?",
    options: ["Play Basketball", "Watch Anime", "Play video games", "Listen to music"],
    correct: ["Play Basketball", "Watch Anime"],
  },
];

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function checkWinner(board: Board): Cell | "draw" | null {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  if (board.every((c) => c !== null)) return "draw";
  return null;
}

function minimax(board: Board, isMaximizing: boolean): number {
  const result = checkWinner(board);
  if (result === "O") return 1;
  if (result === "X") return -1;
  if (result === "draw") return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = "O";
        best = Math.max(best, minimax(board, false));
        board[i] = null;
      }
    }
    return best;
  }

  let best = Infinity;
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      board[i] = "X";
      best = Math.min(best, minimax(board, true));
      board[i] = null;
    }
  }
  return best;
}

function getBestMove(board: Board): number {
  let bestScore = -Infinity;
  let move = 0;
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      board[i] = "O";
      const score = minimax(board, false);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function isCorrectAnswer(q: TriviaQuestion, answer: string): boolean {
  return q.correct.some(
    (c) => c.toLowerCase() === answer.toLowerCase()
  );
}

export default function TicTacToe({ onComplete }: { onComplete: () => void }) {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [gameOver, setGameOver] = useState<Cell | "draw" | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [showQuestion, setShowQuestion] = useState(true);
  const [playerMovesLeft, setPlayerMovesLeft] = useState(0);
  const [statusHint, setStatusHint] = useState("Answer about me to earn your moves!");

  const failCountRef = useRef(0);
  const boardRef = useRef(board);

  const questionPhase = questionsAnswered < TRIVIA.length;

  const shuffledOptions = useMemo(() => {
    if (showQuestion && questionPhase) {
      return shuffle(TRIVIA[questionsAnswered].options);
    }
    return [];
  }, [showQuestion, questionsAnswered, questionPhase]);

  useEffect(() => {
    boardRef.current = board;
  }, [board]);

  const handleResult = useCallback(
    (result: Cell | "draw") => {
      setGameOver(result);
      if (result === "X" || result === "draw") {
        setTimeout(onComplete, 1500);
      }
    },
    [onComplete]
  );

  const finishRound = useCallback(
    (nextQuestionsAnswered: number) => {
      if (nextQuestionsAnswered >= TRIVIA.length) {
        setStatusHint("No more questions — play to win or draw!");
        return;
      }
      setShowQuestion(true);
      setStatusHint("Answer about me to earn your moves!");
    },
    []
  );

  const runAiMove = useCallback(
    (current: Board, afterMove?: () => void) => {
      const result = checkWinner(current);
      if (result) {
        handleResult(result);
        return;
      }

      setIsAiThinking(true);
      setStatusHint("AI is moving…");

      setTimeout(() => {
        const next = [...current];
        const move = getBestMove(next);
        next[move] = "O";
        setBoard(next);
        setIsAiThinking(false);

        const end = checkWinner(next);
        if (end) {
          handleResult(end);
        } else {
          setStatusHint(
            questionsAnswered >= TRIVIA.length
              ? "Your turn!"
              : "Answer about me to earn your moves!"
          );
          afterMove?.();
        }
      }, 450);
    },
    [handleResult, questionsAnswered]
  );

  const completeQuestionRound = useCallback(
    (nextCount: number) => {
      setQuestionsAnswered(nextCount);
      if (nextCount >= TRIVIA.length) {
        setShowQuestion(false);
        setStatusHint("Your turn — beat the AI!");
      } else {
        finishRound(nextCount);
      }
    },
    [finishRound]
  );

  const handleAnswer = (answer: string) => {
    if (!questionPhase || isAiThinking || gameOver) return;

    const q = TRIVIA[questionsAnswered];
    const correct = isCorrectAnswer(q, answer);
    setShowQuestion(false);

    if (correct) {
      setPlayerMovesLeft(1);
      setStatusHint("Correct! Place your move.");
      return;
    }

    failCountRef.current += 1;
    console.log(`Tic-tac-toe trivia failures: ${failCountRef.current}`);

    setStatusHint("Wrong! AI gets a free move.");
    const nextCount = questionsAnswered + 1;
    runAiMove(boardRef.current, () => completeQuestionRound(nextCount));
  };

  const handleClick = (index: number) => {
    if (board[index] || gameOver || isAiThinking) return;
    if (showQuestion) return;

    if (questionPhase && playerMovesLeft === 0) {
      setShowQuestion(true);
      return;
    }

    const next = [...board];
    next[index] = "X";
    setBoard(next);

    const result = checkWinner(next);
    if (result) {
      handleResult(result);
      return;
    }

    if (questionPhase && playerMovesLeft > 0) {
      const remaining = playerMovesLeft - 1;
      setPlayerMovesLeft(remaining);

      if (remaining > 0) {
        setStatusHint(`One more move! (${remaining} left)`);
        return;
      }

      const nextCount = questionsAnswered + 1;
      completeQuestionRound(nextCount);
      return;
    }

    runAiMove(next);
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setGameOver(null);
    setIsAiThinking(false);
    setQuestionsAnswered(0);
    setShowQuestion(true);
    setPlayerMovesLeft(0);
    setStatusHint("Answer about me to earn your moves!");
    failCountRef.current = 0;
  };

  const statusText = () => {
    if (gameOver === "X") return "You won!";
    if (gameOver === "O") return "The AI wins. Try again.";
    if (gameOver === "draw") return "A draw — you pass!";
    if (isAiThinking) return "AI is moving…";
    return statusHint;
  };

  const statusClass =
    gameOver === "X" ? styles.win
    : gameOver === "O" ? styles.lose
    : gameOver === "draw" ? styles.draw
    : "";

  const canPlayCell =
    !gameOver &&
    !isAiThinking &&
    !showQuestion &&
    (playerMovesLeft > 0 || !questionPhase);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Tic Tac Toe</h1>
        <p className={styles.subtitle}>
          Know me, earn moves. Wrong answers give the AI a bonus turn.
        </p>

        <p className={`${styles.status} ${statusClass}`}>{statusText()}</p>

        <div className={styles.board}>
          {board.map((cell, i) => (
            <button
              key={i}
              type="button"
              className={`${styles.cell} ${cell === "O" ? styles.cellAi : ""}`}
              onClick={() => handleClick(i)}
              disabled={!!cell || !canPlayCell}
              aria-label={`Cell ${i + 1}`}
            >
              {cell}
            </button>
          ))}
        </div>

        {gameOver === "O" && (
          <div className={styles.retry}>
            <button
              type="button"
              className={styles.optionBtn}
              onClick={reset}
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {showQuestion && questionPhase && !gameOver && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modal}>
            <p className={styles.modalTitle}>
              Question {questionsAnswered + 1} of {TRIVIA.length}
            </p>
            <p className={styles.modalQuestion}>
              {TRIVIA[questionsAnswered].question}
            </p>
            <div className={styles.options}>
              {shuffledOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={styles.optionBtn}
                  onClick={() => handleAnswer(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
