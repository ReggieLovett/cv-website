'use client';

import { useEffect, useRef, useState } from 'react';

type RevealVariant = 'up' | 'blur' | 'scale';

const variantClass: Record<RevealVariant, string> = {
  up: 'reveal',
  blur: 'reveal-blur',
  scale: 'reveal-scale',
};

/**
 * Apple-style scroll entrance: elements settle in once as they cross into view,
 * then stay put. One observer per element, disconnected after it fires, so
 * scrolling back up never re-triggers the animation.
 *
 * `prefers-reduced-motion` is handled in CSS — the reveal classes collapse to
 * their finished state, so nothing is ever hidden from a reader who opts out.
 */
export function Reveal({
  children,
  variant = 'up',
  delay = 0,
  className = '',
  as: Tag = 'div',
  id,
}: {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'li' | 'header' | 'figure';
  id?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Anything already on screen at mount (the hero) should settle immediately
    // rather than waiting for a scroll event that may never come.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      id={id}
      ref={ref as never}
      data-visible={visible ? 'true' : 'false'}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as React.CSSProperties) : undefined}
      className={`${variantClass[variant]} ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
