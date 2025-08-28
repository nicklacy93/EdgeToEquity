'use client';

import { useEffect, useRef } from 'react';

export default function useIdleTrigger({
  timeout = 300000, // 5 minutes default
  onIdle,
}: {
  timeout?: number;
  onIdle: () => void;
}) {
  const idleRef = useRef<NodeJS.Timeout | null>(null);

  const resetIdleTimer = () => {
    if (idleRef.current) clearTimeout(idleRef.current);
    idleRef.current = setTimeout(() => {
      onIdle();
    }, timeout);
  };

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];

    for (const event of events) {
      window.addEventListener(event, resetIdleTimer);
    }

    resetIdleTimer(); // init

    return () => {
      for (const event of events) {
        window.removeEventListener(event, resetIdleTimer);
      }
      if (idleRef.current) clearTimeout(idleRef.current);
    };
  }, [timeout, onIdle]);
}
