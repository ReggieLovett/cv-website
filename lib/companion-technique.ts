export type TechniqueConfig<T extends string = string> = {
  keyframes: Keyframe[];
  duration: number;
  effect: T;
  label: string;
  travel: 'dash' | 'advance' | 'hover';
};

type Pose = 'strike' | 'cast' | 'draw' | 'rush' | 'brace' | 'spin' | 'vanish';
const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';
const EASE_IN_OUT = 'cubic-bezier(0.77, 0, 0.175, 1)';
const NEUTRAL = 'translate3d(0, 0, 0) rotate(0deg) scale(1)';

function frame(offset: number, x = 0, angle = 0, scale = '1', opacity = 1): Keyframe {
  return { offset, transform: `translate3d(${x === 0 ? '0' : `${x}px`}, 0, 0) rotate(${angle}deg) scale(${scale})`, opacity,
    easing: offset < 0.3 ? EASE_IN_OUT : EASE_OUT };
}

/** Body poses pivot at the feet. Only the outer actor owns horizontal travel. */
function poseFrames(pose: Pose): Keyframe[] {
  const middle: Record<Pose, Keyframe[]> = {
    strike: [frame(0.2, -4, -8, '0.98, 1.02'), frame(0.44, 10, 11, '1.06, 0.96'), frame(0.74, 3, -4)],
    cast: [frame(0.2, -2, -5, '1.03, 0.96'), frame(0.43, 0, -3, '1.04'), frame(0.68, 5, 5, '1.03')],
    draw: [frame(0.24, -5, -15, '0.98, 1.02'), frame(0.5, 11, 22, '1.06, 0.96'), frame(0.8, 2, -4)],
    rush: [frame(0.16, -4, -8, '1.03, 0.95'), frame(0.46, 12, 10, '1.08, 0.94', 0.84), frame(0.8, 2, 3)],
    brace: [frame(0.2, 0, 0, '1.06, 0.94'), frame(0.48, 0, -2, '1.03'), frame(0.76, 0, 2, '1.04, 0.97')],
    spin: [frame(0.22, -3, -18, '0.98, 1.02'), frame(0.48, 7, 28, '1.04, 0.97'), frame(0.76, -2, -10)],
    vanish: [frame(0.22, -3, -4, '0.98', 0.8), frame(0.47, 0, 0, '0.95', 0.5), frame(0.7, 6, 5, '1.02', 0.85)],
  };
  return [{ ...frame(0), transform: NEUTRAL }, ...middle[pose], { ...frame(1), transform: NEUTRAL }];
}

export function makeTechnique<T extends string>(label: string, effect: T, travel: TechniqueConfig['travel'], pose: Pose, duration: number): TechniqueConfig<T> {
  return { label, effect, travel, keyframes: poseFrames(pose), duration };
}

