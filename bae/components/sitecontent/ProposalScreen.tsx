"use client";

import { useState, useEffect } from "react";
import styles from "./ProposalScreen.module.css";

const PAGES = [
  "Hey baby, how you doing? Hopefully better now that I'm here.",
  "I know you don't like reading but just read through this one letter.",
  "Sooo it's been what now? IDK but here's what I do know.",
  "Ever since you came into my life, I've had nothing but a great time. I've had conversations with you that felt heavenly.",
  "Laying on the kitchen floor at 4AM just so I could hear your sweet voice even for just a second longer. Yeah IK call me weird it's fine.",
  "From the moment we said 'hi' and you called Baki trash I always knew that you had a role to play in my life.",
  "But I'll save the sweet talk for when you're in front of me.",
  "I know the past couple months haven't been the easiest for either of us but we still here.",
  "I love every second spent with you and I want to make you more than just a talking stage.",
  "So as for the first part of this proposal this is it for now. This is our little sanctuary.",
  "Expect me at your door tomorrow idk what for but expect me.",
  "Only a little longer Big Daddy Alpha, Dada Clxver is on his way."
];

function TypewriterText({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let isCancelled = false;
    let i = 0;
    
    // We start the interval without an immediate sync set state
    const interval = setInterval(() => {
      if (isCancelled) return;
      
      if (i === 0) {
        setDisplayedText(""); // Clear previous text on first tick
      }
      
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 40);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [text]);

  return <span>{displayedText}</span>;
}

export default function ProposalScreen({ onFixTimer }: { onFixTimer: () => void }) {
  const [page, setPage] = useState(0);

  const handleNext = () => {
    if (page < PAGES.length) {
      setPage(page + 1);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const isLastPage = page === PAGES.length;

  return (
    <div className={styles.container} onClick={handleNext} role="button" tabIndex={0} aria-label="Next page">
      <div className={styles.book} onClick={(e) => {
        e.stopPropagation();
        handleNext();
      }}>
        {/* Faint background graphics */}
        <div className={styles.bookBackground}>
          <div className={styles.squiggleBg}></div>
          <svg className={styles.bgIcon1} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
          <svg className={styles.bgIcon2} viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="5" y1="19" x2="19" y2="5" /><polyline points="10 5 19 5 19 14" /><path d="M5 19l-2 2" /><circle cx="6" cy="18" r="2" /></svg>
          <svg className={styles.bgIcon3} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
          <svg className={styles.bgIcon4} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
          <svg className={styles.bgIcon5} viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="3" /><path d="M12 15c-3.5 0-6-2.5-6-6s2.5-6 6-6 6 2.5 6 6-2.5 6-6 6z" /><path d="M12 21v-6" /></svg>
          <svg className={styles.bgIcon6} viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="5" y1="19" x2="19" y2="5" /><polyline points="10 5 19 5 19 14" /><path d="M5 19l-2 2" /><circle cx="6" cy="18" r="2" /></svg>
          <svg className={styles.bgIcon7} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
        </div>

        <div key={page} className={styles.pageContent}>
          {page === 0 && (
            <>
              <div className={styles.heart}>💜</div>
              <h1 className={styles.title}>
                <TypewriterText text="The time has finally come?" />
              </h1>
            </>
          )}

          {page > 0 && !isLastPage && (
            <p className={styles.message}>
              <TypewriterText text={PAGES[page - 1]} />
            </p>
          )}

          {isLastPage && (
            <>
              <p className={styles.message}>
                <TypewriterText text="Expect me at your door idk what for but expect me" />
              </p>
              <p className={styles.signature}>From one GOAT to another,<br/>Love Clxver ♥</p>
              <button 
                className={styles.fixBtn} 
                onClick={(e) => {
                  e.stopPropagation();
                  onFixTimer();
                }}
              >
                Start our next chapter
              </button>
            </>
          )}
        </div>
        
        {page > 0 && (
          <button className={styles.prevBtn} onClick={handlePrev} aria-label="Previous page">
            ← Back
          </button>
        )}
        {!isLastPage && <span className={styles.hint}>Tap to flip</span>}
      </div>
    </div>
  );
}
