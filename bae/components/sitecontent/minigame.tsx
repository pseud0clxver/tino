"use client";

import { useState, Fragment } from "react";
import "wired-elements";

const QUESTIONS = [
  {
    question: "When did we first talk?",
    options: ["25 April 2026", "29 April 2026", "1 May 2026"],
    correct: "29 April 2026"
  },
  {
    question: "When was our first kiss?",
    options: ["1 May 2026", "4 May 2026", "10 May 2026"],
    correct: "4 May 2026"
  },
  {
    question: "What anime did you recommend to me when we first met?",
    options: ["Devil May Cry", "Kotaro Lives alone", "Spy X Family"],
    correct: "Kotaro Lives alone"
  }
];

export default function MiniGame({ onComplete }: { onComplete: () => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [error, setError] = useState(false);

  const handleAnswer = (answer: string) => {
    if (answer === QUESTIONS[currentQuestion].correct) {
      setError(false);
      if (currentQuestion + 1 < QUESTIONS.length) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        onComplete();
      }
    } else {
      setError(true);
      setTimeout(() => setError(false), 1000);
    }
  };

  const q = QUESTIONS[currentQuestion];

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full relative p-4">
      <wired-card elevation="4" style={{ padding: "2rem", background: "rgba(255,255,255,0.85)", borderRadius: "12px", textAlign: "center", zIndex: 10, maxWidth: "500px", width: "100%" }}>
        <h2 className="text-2xl font-bold text-purple-900 mb-2">Security Questions</h2>
        <p className="text-md text-purple-700 mb-6 font-bold">Question {currentQuestion + 1} of {QUESTIONS.length}</p>
        
        <p className="text-xl text-gray-800 mb-8 min-h-[4rem] flex items-center justify-center font-gloria">
          {q.question}
        </p>

        <div className="flex flex-col gap-4">
          {q.options.map((opt) => (
            <Fragment key={opt}>
              <wired-button
                elevation="2"
                style={{ background: "#eadef7", color: "#2e1065", padding: "10px 20px", fontSize: "1.1rem" }}
                onClick={() => handleAnswer(opt)}
              >
                {opt}
              </wired-button>
            </Fragment>
          ))}
        </div>

        {error && (
          <p className="text-red-500 font-bold mt-4 animate-pulse">Incorrect, try again!</p>
        )}
      </wired-card>
    </div>
  );
}
