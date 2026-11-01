'use client';

import { useSyncExternalStore } from 'react';
import { getTheme, getThemeServerSnapshot, subscribeToTheme } from '@/lib/theme';
import SpotlightCard from './react-bits/SpotlightCard';

/**
 * SpotlightPanel — a `.card` lit from the pointer.
 *
 * React Bits' SpotlightCard, set in this system's terms: the light is the
 * `signal` token, so it is Sheikah blue on the normal site and gold under the
 * Zelda theme without this file knowing either exists. The component draws its
 * own hairline so the edge glow can ride on it — `.spotlight-card.card` in
 * globals.css hands the border over and restores the card's fill and radius.
 *
 * The light is low on purpose. It should read as the card noticing the
 * pointer, not as a torch. Padding belongs to the child, because the
 * component's own stylesheet loads in an order Tailwind's utilities cannot
 * be relied on to beat.
 */
export function SpotlightPanel({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const theme = useSyncExternalStore(subscribeToTheme, getTheme, getThemeServerSnapshot);

  return (
    <SpotlightCard
      className={`card ${className}`}
      spotlightColor="rgb(var(--signal))"
      theme={theme}
      intensity={0.14}
      spotlightSize={300}
      borderGlow={0.9}
      proximity={60}
    >
      {children}
    </SpotlightCard>
  );
}
