import React from 'react';

import PropTypes from 'prop-types';

const Cell = ({
  cellIndex,
  cellValue,
  gameInPlay,
  rowIndex,
  updateWorld,
  world,
}) => {
  const color = cellValue => (cellValue === 1 ? '#029874' : '#fff');

  const toggleValue = cellValue => {
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

Cell.propTypes = {
  cellIndex: PropTypes.number.isRequired,
  cellValue: PropTypes.number.isRequired,
  gameInPlay: PropTypes.bool.isRequired,
  rowIndex: PropTypes.number.isRequired,
  updateWorld: PropTypes.func.isRequired,
  world: PropTypes.arrayOf(PropTypes.array).isRequired,
};

export default Cell;
