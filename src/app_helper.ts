import {chunk} from 'lodash';

const COLORS = [
  '#c4b5fd', // soft purple
  '#a78bfa', // lavender
  '#93c5fd', // blue
  '#7dd3fc', // sky blue
  '#67e8f9', // cyan
  '#6ee7b7', // mint green
  '#86efac', // light green
  '#fde68a', // soft yellow
  '#fdba74', // peach
  '#fca5a5', // soft red
  '#f9a8d4', // pink
  '#f0abfc', // magenta
];

export const randomColor = (): string =>
  COLORS[Math.floor(Math.random() * COLORS.length)];

export const randomWorld = (
  sideLength: number,
  randomness: number,
): number[][] => {
  const world = [];
  for (let i = 0; i < sideLength ** 2; i++) {
    const sentience = Number(Math.random() < randomness);
    world.push(sentience);
  }
  return chunk(world, sideLength);
};
