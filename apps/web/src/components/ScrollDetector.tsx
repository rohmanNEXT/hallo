'use client';

import { useEffect } from 'react';

export default function ScrollDetector() {
  useEffect(() => {
    const timeouts = new Map<HTMLElement, NodeJS.Timeout>();

    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target || !target.classList) return;

      target.classList.add('is-scrolling');

      const existingTimeout = timeouts.get(target);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      const timeout = setTimeout(() => {
        target.classList.remove('is-scrolling');
        timeouts.delete(target);
      }, 1000); // Hide scrollbar after 1 second of scroll inactivity

      timeouts.set(target, timeout);
    };

    // Use capture phase (true) so scroll events from any nested container propagate up
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return null;
}
