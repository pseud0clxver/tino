"use client";

import { useState } from "react";
import Countdown from "@/components/countdown/countdown";
import ProposalContent from "@/components/sitecontent/proposalcontent";

export default function Home() {
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // The Big Day: June 1st, 2026
  const targetDate = "2026-06-01T00:00:00";

  return (
    <main>
      {isFinished ? (
        <ProposalContent />
      ) : (
        <Countdown
          targetDate={targetDate}
          onComplete={() => setIsFinished(true)}
        />
      )}
    </main>
  );
}
