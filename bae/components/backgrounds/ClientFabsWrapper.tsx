"use client";

import dynamic from "next/dynamic";

const RandomWiredFabs = dynamic(() => import("./RandomWiredFabs"), { ssr: false });

export default function ClientFabsWrapper() {
  return <RandomWiredFabs />;
}
