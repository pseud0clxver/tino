"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import "wired-elements";
import styles from "./InfiniteCarousel.module.css";

const IMAGES = Array.from({ length: 10 }, (_, i) => `/images/img_${i + 1}.webp`);
const START_PHRASE = "Shall we begin, my love?";

type Phase = "loading" | "deck" | "forming" | "circle";

interface LoadedImage {
  src: string;
  width: number;
  height: number;
}

function scaleToFit(
  naturalW: number,
  naturalH: number,
  maxW: number,
  maxH: number
) {
  const ratio = Math.min(maxW / naturalW, maxH / naturalH, 1);
  return {
    width: Math.round(naturalW * ratio),
    height: Math.round(naturalH * ratio),
  };
}

function getDeckTransform(index: number, total: number) {
  const offsetX = index * 5;
  const offsetY = index * 4;
  const rotate = (index - total / 2) * 1.2;
  return `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) rotate(${rotate}deg)`;
}

function getWheelTransform(index: number, total: number, wheelRotation: number, wheelRadius: number) {
  const angle = (index / total) * 360 + wheelRotation;
  return `translate(-50%, -50%) rotate(${angle}deg) translateY(-${wheelRadius}px) rotate(${-angle}deg)`;
}

/** Bottom of the wheel (6 o'clock) gets the largest scale. */
function getCardFocus(index: number, total: number, wheelRotation: number) {
  const visualAngle = (((index / total) * 360 + wheelRotation) % 360 + 360) % 360;
  let distFromBottom = Math.abs(visualAngle - 180);
  if (distFromBottom > 180) distFromBottom = 360 - distFromBottom;

  const focus = Math.cos((distFromBottom / 180) * Math.PI);
  const t = (focus + 1) / 2;

  return {
    scale: 0.5 + t * 0.95,
    zIndex: Math.round(5 + t * 30),
    opacity: 0.6 + t * 0.4,
    isFocused: distFromBottom < 18,
  };
}

function getDimensions() {
  if (typeof window === "undefined") {
    return {
      wheelRadius: 250,
      deckMaxW: 300,
      deckMaxH: 380,
      wheelMaxW: 220,
      wheelMaxH: 280,
    };
  }

  const w = window.innerWidth;
  const isMobile = w < 480;
  const isTablet = w < 768;

  return {
    wheelRadius: isMobile ? 140 : isTablet ? 190 : 250,
    deckMaxW: isMobile ? 240 : isTablet ? 280 : 300,
    deckMaxH: isMobile ? 320 : isTablet ? 360 : 380,
    wheelMaxW: isMobile ? 150 : isTablet ? 180 : 220,
    wheelMaxH: isMobile ? 200 : isTablet ? 240 : 280,
  };
}

export default function InfiniteCarousel({ onProceed }: { onProceed: () => void }) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [loadedImages, setLoadedImages] = useState<LoadedImage[]>([]);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [formingSpread, setFormingSpread] = useState(false);

  const [dimensions, setDimensions] = useState(getDimensions);

  useEffect(() => {
    const handleResize = () => setDimensions(getDimensions());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const spreadReady = phase === "circle" || formingSpread;

  const stepAngle = loadedImages.length > 0 ? 360 / loadedImages.length : 36;

  const rotateNext = useCallback(() => {
    setWheelRotation((r) => r + stepAngle);
  }, [stepAngle]);

  useEffect(() => {
    let cancelled = false;
    let index = 0;

    const loadNext = () => {
      if (cancelled || index >= IMAGES.length) {
        if (!cancelled && index >= IMAGES.length) {
          setTimeout(() => setPhase("deck"), 400);
        }
        return;
      }

      const src = IMAGES[index];
      const img = new window.Image();
      img.onload = () => {
        if (cancelled) return;
        setLoadedImages((prev) => [
          ...prev,
          { src, width: img.naturalWidth, height: img.naturalHeight },
        ]);
        index += 1;
        setTimeout(loadNext, 350);
      };
      img.onerror = () => {
        if (cancelled) return;
        index += 1;
        setTimeout(loadNext, 200);
      };
      img.src = src;
    };

    loadNext();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDeckClick = useCallback(() => {
    if (phase !== "deck") return;
    setFormingSpread(false);
    setPhase("forming");
    setTimeout(() => setPhase("circle"), 1100);
  }, [phase]);

  useEffect(() => {
    if (phase === "forming") {
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setFormingSpread(true));
      });
      return () => cancelAnimationFrame(id);
    }
    if (phase === "loading" || phase === "deck") {
      const id = requestAnimationFrame(() => setFormingSpread(false));
      return () => cancelAnimationFrame(id);
    }
  }, [phase]);

  const renderCard = (
    img: LoadedImage,
    displayW: number,
    displayH: number,
    focused = false,
    overlay?: React.ReactNode
  ) => (
    <div
      className={`${styles.cardInner} ${focused ? styles.cardFocused : ""}`}
      style={{ width: displayW, height: displayH }}
    >
      <Image
        src={img.src}
        alt="Memory"
        width={displayW}
        height={displayH}
        className={styles.cardImage}
        style={{ width: displayW, height: displayH, objectFit: "contain" }}
        unoptimized
      />
      {overlay}
    </div>
  );

  const showWheel = phase === "forming" || phase === "circle";

  return (
    <div className={styles.container}>
      <div className={styles.stage}>
        {(phase === "loading" || phase === "deck") && (
          <div className={styles.deckArea}>
            <div className={styles.deckStack}>
              {loadedImages.map((img, i) => {
                const { width, height } = scaleToFit(
                  img.width,
                  img.height,
                  dimensions.deckMaxW,
                  dimensions.deckMaxH
                );
                const isTop = i === loadedImages.length - 1;
                const deckClass = `${styles.card} ${styles.deckCard} ${isTop && phase === "deck" ? styles.deckCardTop : ""} ${phase === "loading" ? styles.landIn : ""}`;

                return (
                  <div
                    key={img.src}
                    className={deckClass}
                    style={{
                      zIndex: i + 1,
                      transform: getDeckTransform(i, loadedImages.length),
                    }}
                    onClick={isTop && phase === "deck" ? handleDeckClick : undefined}
                    role={isTop && phase === "deck" ? "button" : undefined}
                    tabIndex={isTop && phase === "deck" ? 0 : undefined}
                    onKeyDown={
                      isTop && phase === "deck"
                        ? (e) => e.key === "Enter" && handleDeckClick()
                        : undefined
                    }
                  >
                    {renderCard(
                      img,
                      width,
                      height,
                      isTop,
                      isTop && phase === "deck" ? (
                        <div className={styles.deckOverlay}>
                          <span className={styles.deckOverlayText}>{START_PHRASE}</span>
                        </div>
                      ) : undefined
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {showWheel && loadedImages.length > 0 && (
          <div className={styles.wheel}>
            {loadedImages.map((img, i) => {
              const { width, height } = scaleToFit(
                img.width,
                img.height,
                dimensions.wheelMaxW,
                dimensions.wheelMaxH
              );
              const focus =
                phase === "circle"
                  ? getCardFocus(i, loadedImages.length, wheelRotation)
                  : { scale: 1, zIndex: i + 1, opacity: 1, isFocused: false };

              const wheelTransform =
                phase === "forming" && !spreadReady
                  ? getDeckTransform(i, loadedImages.length)
                  : getWheelTransform(i, loadedImages.length, wheelRotation, dimensions.wheelRadius);

              return (
                <div
                  key={img.src}
                  className={`${styles.wheelCard} ${phase === "circle" ? styles.wheelCardTappable : ""}`}
                  style={{
                    zIndex: focus.zIndex,
                    transform: wheelTransform,
                    transition: "transform 0.65s cubic-bezier(0.34, 1.15, 0.64, 1)",
                  }}
                  onClick={
                    phase === "circle"
                      ? (e) => {
                          e.stopPropagation();
                          rotateNext();
                        }
                      : undefined
                  }
                  role={phase === "circle" ? "button" : undefined}
                  tabIndex={phase === "circle" ? 0 : undefined}
                  onKeyDown={
                    phase === "circle"
                      ? (e) => e.key === "Enter" && rotateNext()
                      : undefined
                  }
                >
                  <div
                    className={styles.wheelCardInner}
                    style={{
                      transform: `scale(${focus.scale})`,
                      opacity: focus.opacity,
                    }}
                  >
                    {renderCard(img, width, height, focus.isFocused)}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {phase === "circle" && (
          <div className={styles.centerHub}>
            <wired-button
              elevation="4"
              style={{
                background: "#ffb7b2",
                color: "#2e1065",
                padding: "14px 22px",
                fontSize: "1rem",
                borderRadius: "999px",
              }}
              onClick={onProceed}
            >
              Think you know me?
            </wired-button>
          </div>
        )}
      </div>

      {phase === "loading" && (
        <p className={styles.loadingText}>
          Gathering memories… {loadedImages.length} / {IMAGES.length}
        </p>
      )}

      {phase === "deck" && (
        <p className={styles.hint}>Tap the top card when you&apos;re ready</p>
      )}

      {phase === "circle" && (
        <p className={styles.hint}>Tap any card to rotate · tap center when ready</p>
      )}
    </div>
  );
}
