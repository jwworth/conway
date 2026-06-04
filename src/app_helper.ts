import {chunk} from 'lodash';

const COLORS = [
  '#7c3aed', // purple
  '#8b5cf6', // lavender
  '#2563eb', // blue
  '#0284c7', // sky blue
  '#0891b2', // cyan
  '#059669', // mint green
  '#16a34a', // green
  '#ca8a04', // yellow/gold
  '#ea580c', // peach/orange
  '#dc2626', // soft red
  '#db2777', // pink
  '#c026d3', // magenta
] as const;

export type Color = (typeof COLORS)[number];

export const randomColor = ({
  exclude,
}: {
  exclude?: (typeof COLORS)[number];
} = {}): Color => {
  const colors = exclude ? COLORS.filter((color) => color !== exclude) : COLORS;

  return colors[Math.floor(Math.random() * colors.length)];
};

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
