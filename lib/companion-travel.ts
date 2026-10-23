export type CompanionPoint = { x: number; y: number };
export type CompanionViewport = { width: number; height: number };
export type CompanionBounds = { minX: number; maxX: number; minY: number; maxY: number };
export type CompanionTravelKind = 'wander' | 'dash' | 'advance' | 'hover';

export const ACTOR_WIDTH = 64;
export const ACTOR_HEIGHT = 104;
export const COMPANION_MARGIN = 16;
export const BATTLE_RESERVE = 100;

function finite(value: number, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? Math.max(-32_768, Math.min(32_768, value)) : fallback;
}

function size(viewport: CompanionViewport): CompanionViewport {
  return { width: Math.max(0, finite(viewport?.width)), height: Math.max(0, finite(viewport?.height)) };
}

function geometry(viewport: CompanionViewport) {
  const { width } = size(viewport);
  const inset = width <= 600 ? 12 : 18;
  return { width, homeX: width - inset - ACTOR_WIDTH };
}

/** Horizontal translations along the actor's fixed bottom edge. */
export function getCompanionBounds(viewport: CompanionViewport): CompanionBounds {
  const { homeX } = geometry(viewport);
  return {
    minX: Math.min(0, COMPANION_MARGIN - homeX), maxX: 0,
    minY: 0, maxY: 0,
  };
}

function reserveAxis(minimum: number, maximum: number, requestedMinimum: number, requestedMaximum: number) {
  const min = Math.max(minimum, requestedMinimum);
  const max = Math.min(maximum, requestedMaximum);
  if (min <= max) return { min, max };
  // On a screen too small for the full effect, center it within the normal
  // safe range. Never invert bounds or sacrifice the actor's visible area.
  const center = Math.max(minimum, Math.min(maximum, (requestedMinimum + requestedMaximum) / 2));
  return { min: center, max: center };
}

/** Reserve 100px on either horizontal side while keeping the actor at the bottom. */
export function getCompanionBattleBounds(viewport: CompanionViewport): CompanionBounds {
  const normal = getCompanionBounds(viewport);
  const { width, homeX } = geometry(viewport);
  const margin = COMPANION_MARGIN + BATTLE_RESERVE;
  const horizontal = reserveAxis(normal.minX, normal.maxX, margin - homeX, width - margin - ACTOR_WIDTH - homeX);
  return { minX: horizontal.min, maxX: horizontal.max, minY: 0, maxY: 0 };
}

function within(point: CompanionPoint, bounds: CompanionBounds): CompanionPoint {
  return {
    x: Math.max(bounds.minX, Math.min(bounds.maxX, finite(point?.x))),
    y: 0,
  };
}

export function clampPoint(point: CompanionPoint, viewport: CompanionViewport): CompanionPoint {
  return within(point, getCompanionBounds(viewport));
}

export function clampBattlePoint(point: CompanionPoint, viewport: CompanionViewport): CompanionPoint {
  return within(point, getCompanionBattleBounds(viewport));
}

function unit(random: () => number): number {
  const value = random();
  return typeof value === 'number' && Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0.5;
}

export function planTravel(
  origin: CompanionPoint,
  viewport: CompanionViewport,
  kind: CompanionTravelKind,
  speed: number,
  random: () => number = Math.random,
): { destination: CompanionPoint; duration: number; direction: 'left' | 'right' } {
  const bounds = kind === 'wander' ? getCompanionBounds(viewport) : getCompanionBattleBounds(viewport);
  // Preserve horizontal distance from the live origin, but discard any old
  // vertical offset so changing modes or resizing can never resume flight.
  const live = { x: finite(origin?.x), y: 0 };
  const start = within(live, bounds);
  const spanX = bounds.maxX - bounds.minX;
  const target = { x: bounds.minX + unit(random) * spanX, y: 0 };
  // Avoid a stationary route from a centered sample. On narrow screens, use
  // the available horizontal corridor instead of creating vertical distance.
  if (Math.abs(target.x - start.x) < Math.min(24, spanX * 0.2)) {
    target.x = start.x - bounds.minX >= bounds.maxX - start.x ? bounds.minX : bounds.maxX;
  }
  const minimum = kind === 'dash' ? (size(viewport).width >= 768 ? 160 : 60) : 36;
  if (Math.abs(target.x - start.x) < minimum) {
    target.x = start.x - bounds.minX >= bounds.maxX - start.x ? bounds.minX : bounds.maxX;
  }

  const extent = Math.abs(target.x - start.x);
  const randomDistance = unit(random);
  const maximum = kind === 'dash' ? 220 + randomDistance * 300
    : kind === 'advance' ? 100 + randomDistance * 140
      : kind === 'hover' ? 80 + randomDistance * 120 : 90 + randomDistance * 170;
  const ratio = extent > 0 ? Math.min(1, maximum / extent) : 0;
  const destination = within({ x: start.x + (target.x - start.x) * ratio, y: 0 }, bounds);
  const distance = Math.abs(destination.x - live.x);
  const pixelsPerSecond = typeof speed === 'number' && Number.isFinite(speed) && speed > 0 ? Math.max(1, speed) : kind === 'wander' ? 36 : 420;
  // Short battle corridors still retain each form's real speed. The pose and
  // combo timing stay independent of this brief horizontal world movement.
  const duration = Math.max(kind === 'wander' ? 180 : 32, Math.min(kind === 'wander' ? 8_000 : kind === 'dash' ? 1_000 : 1_200, distance / pixelsPerSecond * 1_000));
  return { destination, duration, direction: destination.x > live.x ? 'right' : 'left' };
}
