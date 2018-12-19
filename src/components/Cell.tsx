import React from 'react';

const Cell = ({
  cellIndex,
  cellValue,
  gameInPlay,
  rowIndex,
  updateWorld,
  world,
}: {
  cellIndex: number;
  cellValue: number;
  gameInPlay: boolean;
  rowIndex: number;
  updateWorld: (world: number[][]) => void;
  world: number[][];
}) => {
  const color = (cellValue: number) => (cellValue === 1 ? '#029874' : '#fff');

  const toggleValue = (cellValue: number) => {
    world[rowIndex][cellIndex] = cellValue === 1 ? 0 : 1;
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
