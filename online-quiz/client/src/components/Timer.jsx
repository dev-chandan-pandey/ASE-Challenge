import React, { useEffect, useState } from "react";

/**
 * Timer component
 * props:
 * - duration (seconds)
 * - onExpire()
 */
export default function Timer({ duration, onExpire }) {
  const [remaining, setRemaining] = useState(duration);

  useEffect(() => {
    setRemaining(duration);
  }, [duration]);

  useEffect(() => {
    if (remaining <= 0) {
      onExpire && onExpire();
      return;
    }
    const id = setInterval(() => {
      setRemaining(r => r - 1);
    }, 1000);
    return () => clearInterval(id);
  }, [remaining, onExpire]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  return <div className="timer">Time left: {mm}:{ss}</div>;
}
