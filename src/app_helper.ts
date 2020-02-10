import { chunk } from 'lodash';

const PURPLES = [
  '#e6e6fa',
  '#d8bfd8',
  '#dda0dd',
  '#ee82ee',
  '#da70d6',
  '#ff00ff',
  '#ff00ff',
  '#ba55d3',
  '#9370db',
  '#8a2be2',
  '#9400d3',
  '#9932cc',
  '#8b008b',
  '#800080',
  '#4b0082',
];

export const randomColor = (): string =>
  PURPLES[Math.floor(Math.random() * PURPLES.length)];

export const randomWorld = (
  sideLength: number,
  randomness: number
): number[][] => {
  const world = [];
  for (let i = 0; i < sideLength ** 2; i++) {
    const sentience = Number(Math.random() < randomness);
    world.push(sentience);
  }
  return chunk(world, sideLength);
};
