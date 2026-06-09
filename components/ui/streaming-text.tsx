'use client';

import { useState, useEffect, useRef } from 'react';

interface StreamingTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}

export function StreamingText({
  text,
  speed = 15,
  onComplete,
  className = '',
}: StreamingTextProps) {
  const [displayed, setDisplayed] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    setDisplayed('');
    setIsComplete(false);

    if (!text) {
      setIsComplete(true);
      return;
    }

    let index = 0;
    const timer = setInterval(() => {
      index++;
      setDisplayed(text.slice(0, index));

      if (index >= text.length) {
        clearInterval(timer);
        setIsComplete(true);
        onCompleteRef.current?.();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span className={className}>
      {displayed}
      {!isComplete && (
        <span className="inline-block w-[2px] h-[1em] bg-current align-text-bottom ml-0.5 animate-pulse" />
      )}
    </span>
  );
}
