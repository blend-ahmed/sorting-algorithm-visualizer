export const clamp = (v: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, v));

export const sleep = (ms: number): Promise<void> =>
  new Promise<void>((r) => setTimeout(r, ms));

export const msFromSpeed = (speed: number): number =>
  clamp(650 - speed * 6, 10, 650);

export function makeRandomArray(n: number, min = 5, max = 100): number[] {
  return Array.from(
    { length: n },
    () => Math.floor(Math.random() * (max - min + 1)) + min
  );
}
