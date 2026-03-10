"use client";

import { useEffect, useRef, useState } from "react";
import Lottie, { type LottieRef } from "lottie-react";
import { cn } from "@/lib/utils";

type TreeLottieProps = {
  className?: string;
  /** When true, play the animation from the start (e.g. when parent is hovered). */
  playTrigger?: boolean;
};

export function TreeLottie({ className, playTrigger }: TreeLottieProps) {
  const [animationData, setAnimationData] = useState<object | null>(null);
  const lottieRef = useRef<LottieRef["current"]>(null);

  useEffect(() => {
    fetch("/Tree.json")
      .then((res) => res.json())
      .then(setAnimationData)
      .catch(() => setAnimationData(null));
  }, []);

  const prevTrigger = useRef(false);
  useEffect(() => {
    if (playTrigger && !prevTrigger.current && lottieRef.current) {
      lottieRef.current.goToAndStop(0, true);
      lottieRef.current.play();
    }
    prevTrigger.current = !!playTrigger;
  }, [playTrigger]);

  const handleComplete = () => {
    lottieRef.current?.goToAndStop(0, true);
  };

  if (!animationData) return <div className={cn("h-6 w-6 shrink-0 flex items-center justify-center", className)} />;

  return (
    <div
      className={cn("h-6 w-6 shrink-0 flex items-center justify-center", className)}
      style={{ filter: "brightness(0) invert(1)" }}
      aria-hidden
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop={false}
        onComplete={handleComplete}
        style={{ width: 24, height: 24 }}
      />
    </div>
  );
}
