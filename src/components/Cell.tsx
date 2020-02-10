import React from 'react';

interface CellProps {
  cellIndex: number;
  cellValue: number;
  colorOfLife: string;
  gameInPlay: boolean;
  rowIndex: number;
  updateWorld: (world: number[][]) => void;
  world: number[][];
}

const Cell = ({
  cellIndex,
  cellValue,
  colorOfLife,
  gameInPlay,
  rowIndex,
  updateWorld,
  world,
}: CellProps) => {
  const color = (value: number) => (value === 1 ? colorOfLife : '#fff');

  const toggleValue = (value: number) => {
    world[rowIndex][cellIndex] = value === 1 ? 0 : 1;
    updateWorld(world);
  };

  return (
    <td
      style={{
        background: color(cellValue),
        width: '15px',
        height: '15px',
        border: '1px solid lightgray',
      }}
      onClick={() => {
        if (!gameInPlay) {
          toggleValue(cellValue);
        }
      }}
    />
  );
};

export default Cell;
