"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const Countdown = dynamic(() => import("@/components/countdown/countdown"), { ssr: false });
const MiniGame = dynamic(() => import("@/components/sitecontent/minigame"), { ssr: false });
const Vault = dynamic(() => import("@/components/sitecontent/vault"), { ssr: false });
const CountUpTimer = dynamic(() => import("@/components/countdown/CountUpTimer"), { ssr: false });
const InfiniteCarousel = dynamic(() => import("@/components/sitecontent/InfiniteCarousel"), { ssr: false });
const TicTacToe = dynamic(() => import("@/components/games/TicTacToe"), { ssr: false });
const RomanticSlides = dynamic(() => import("@/components/sitecontent/RomanticSlides"), { ssr: false });
const WhackAMole = dynamic(() => import("@/components/games/WhackAMole"), { ssr: false });
const PicturePuzzle = dynamic(() => import("@/components/games/PicturePuzzle"), { ssr: false });
const ProposalScreen = dynamic(() => import("@/components/sitecontent/ProposalScreen"), { ssr: false });

export default function Home() {
  type AppState =
    | "timer"
    | "minigame"
    | "vault"
    | "carousel"
    | "tictactoe"
    | "romantic"
    | "whackamole"
    | "puzzle"
    | "proposal";

  const [appState, setAppState] = useState<AppState>("timer");
  const [timerFixed, setTimerFixed] = useState(false);

  const showCountUp = [
    "carousel",
    "tictactoe",
    "romantic",
    "whackamole",
    "puzzle",
    "proposal",
  ].includes(appState);

  const targetDate = "2026-06-20T00:00:00";

  return (
    <main>
      {showCountUp && <CountUpTimer startDate={targetDate} isFixed={timerFixed} />}
      {appState === "timer" && (
        <Countdown
          targetDate={targetDate}
          onComplete={() => setAppState("minigame")}
        />
      )}
      {appState === "minigame" && (
        <MiniGame onComplete={() => setAppState("vault")} />
      )}
      {appState === "vault" && (
        <Vault onUnlock={() => setAppState("carousel")} />
      )}
      {appState === "carousel" && (
        <InfiniteCarousel onProceed={() => setAppState("tictactoe")} />
      )}
      {appState === "tictactoe" && (
        <TicTacToe onComplete={() => setAppState("romantic")} />
      )}
      {appState === "romantic" && (
        <RomanticSlides onComplete={() => setAppState("whackamole")} />
      )}
      {appState === "whackamole" && (
        <WhackAMole onComplete={() => setAppState("puzzle")} />
      )}
      {appState === "puzzle" && (
        <PicturePuzzle onComplete={() => setAppState("proposal")} />
      )}
      {appState === "proposal" && <ProposalScreen onFixTimer={() => setTimerFixed(true)} />}
    </main>
  );
}
