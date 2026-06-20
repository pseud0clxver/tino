"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./RomanticSlides.module.css";

const SLIDES = [
  {
    src: "/images/img_11.webp",
    message: "When I first saw I thought you were scary spoiler alert I still think you are.",
  },
  {
    src: "/images/img_12.webp",
    message: "But Lord help me never before have I been graced with such mesmerizing beauty.",
  },
  {
    src: "/images/img_13.webp",
    message: "Sir Lucki once said 'Stay away from drugs and ridiculously pretty girls' thank God I didn't listen",
  },
  {
    src: "/images/img_14.webp",
    message: "Call me crazy but Drake also said 'I've heard about soulmates, I've never got this close'",
  },
  {
    src: "/images/img_15.webp",
    message: "And to close it off just like Daniel Ceasar said you really are 'The Best Part'",
  },
];

export default function RomanticSlides({ onComplete }: { onComplete: () => void }) {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];

  const handleNext = () => {
    if (index + 1 < SLIDES.length) {
      setIndex((i) => i + 1);
    } else {
      onComplete();
    }
  };

  return (
    <button
      type="button"
      className={styles.container}
      onClick={handleNext}
      aria-label="Next slide"
    >
      <div key={slide.src} className={styles.slide}>
        <div className={styles.imageWrap}>
          <Image
            src={slide.src}
            alt=""
            width={480}
            height={640}
            className={styles.image}
            unoptimized
            priority
          />
        </div>
        <p className={styles.message}>{slide.message}</p>
        <p className={styles.tapHint}>
          {index < SLIDES.length - 1 ? "Tap for more" : "Tap to continue"}
        </p>
      </div>

      <div className={styles.progress}>
        {SLIDES.map((_, i) => (
          <span
            key={i}
            className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
          />
        ))}
      </div>
    </button>
  );
}
