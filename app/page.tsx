"use client";

import { GameLayout } from "@/components/GameLayout";
import { GameProvider } from "@/lib/store";

export default function Home() {
  return (
    <GameProvider>
      <GameLayout />
    </GameProvider>
  );
}
