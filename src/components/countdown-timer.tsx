"use client";

import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  endsAt: string | Date;
}

export default function CountdownTimer({ endsAt }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endsAt).getTime() - new Date().getTime();
      
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isExpired: false,
      };
    };

    // Set initial
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endsAt]);

  if (timeLeft.isExpired) {
    return (
      <span className="inline-flex items-center gap-1 rounded bg-red-100 px-2.5 py-1 text-xs font-bold text-red-800 dark:bg-red-950/30 dark:text-red-400">
        Expired
      </span>
    );
  }

  const formatNum = (num: number) => num.toString().padStart(2, "0");

  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-1 text-[11px] font-bold text-red-600 dark:text-red-400 uppercase tracking-widest">
        <Clock size={12} className="animate-spin-slow" />
        Ends In
      </span>
      <div className="flex items-center gap-1 text-xs font-mono font-bold text-red-600 dark:text-red-400">
        {timeLeft.days > 0 && (
          <>
            <span>{timeLeft.days}d</span>
            <span className="text-gray-300 dark:text-gray-700">:</span>
          </>
        )}
        <span>{formatNum(timeLeft.hours)}h</span>
        <span className="text-gray-300 dark:text-gray-700">:</span>
        <span>{formatNum(timeLeft.minutes)}m</span>
        <span className="text-gray-300 dark:text-gray-700">:</span>
        <span>{formatNum(timeLeft.seconds)}s</span>
      </div>
    </div>
  );
}
