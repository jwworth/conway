import './normalize.css';
import './App.css';

import React, { useState } from 'react';

import { chunk } from 'lodash';

import Cell from './components/Cell';

const RANDOMNESS = 0.2;
const SIDELENGTH = 30;

const randomWorld = (newSideLength, newRandomness) => {
  const newWorld = [];
  for (let i = 0; i < newSideLength ** 2; i++) {
    const sentience = Math.random() < newRandomness ? 1 : 0;
    newWorld.push(sentience);
  }
  return chunk(newWorld, newSideLength);
};

const App = () => {
  const [days, setDays] = useState(0);
  const [randomness, setRandomness] = useState(RANDOMNESS);
  const [sideLength, setSideLength] = useState(SIDELENGTH);
  const [world, setWorld] = useState(randomWorld(SIDELENGTH, RANDOMNESS));

  const resetWorld = () => {
    setDays(0);
    setWorld(randomWorld(sideLength, randomness));
  };

  const advanceState = () => {
    const newWorld = world.map((row, rowIndex) =>
      row.map((cell, cellIndex) => {
        const score = neighborScore(rowIndex, cellIndex);
        let status;
        if (cell === 1 && (score === 2 || score === 3)) {
          status = 1;
        } else if (cell === 0 && score === 3) {
          status = 1;
        }
        return status || 0;
      })
    );

    setDays(days + 1);
    setWorld(newWorld);
  };

  const neighborScore = (rowIndex, cellIndex) => {
    const rightNeighbor = [rowIndex, cellIndex + 1];
    const leftNeighbor = [rowIndex, cellIndex - 1];
    const topNeighbor = [rowIndex - 1, cellIndex];
    const topLeftNeighbor = [rowIndex - 1, cellIndex - 1];
    const topRightNeighbor = [rowIndex - 1, cellIndex + 1];
    const bottomNeighbor = [rowIndex + 1, cellIndex];
    const bottomLeftNeighbor = [rowIndex + 1, cellIndex - 1];
    const bottomRightNeighbor = [rowIndex + 1, cellIndex + 1];

    const positions = [
      rightNeighbor,
      leftNeighbor,
      topNeighbor,
      topLeftNeighbor,
      topRightNeighbor,
      bottomNeighbor,
      bottomLeftNeighbor,
      bottomRightNeighbor,
    ];

    const score = positions
      .map(position => {
        let count;
        if (world[position[0]]) {
          count = world[position[0]][position[1]] || 0;
        } else {
          count = 0;
        }

        return count;
      })
      .reduce((a, b) => a + b, 0);
    return score;
  };

  const updateRandomness = newRandomness => {
    setDays(0);
    setRandomness(newRandomness);
    setWorld(randomWorld(sideLength, newRandomness));
  };

  const updateSideLength = newSideLength => {
    setDays(0);
    setSideLength(newSideLength);
    setWorld(randomWorld(newSideLength, randomness));
  };

  return (
    <div style={{ margin: 'auto', width: '450px' }}>
      <h1>Game of Life</h1>
      <table>
        <tbody>
          {world.map((row, rowIndex) => {
            return (
              <tr row={row} key={rowIndex}>
                {row.map((cellValue, cellIndex) => (
                  <Cell
                    cellValue={cellValue}
                    cellIndex={cellIndex}
                    rowIndex={rowIndex}
                    key={cellIndex}
                    world={world}
                    updateWorld={setWorld}
                  />
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <p>
        <strong>Days:</strong> {days}
      </p>
      <p>
        <label htmlFor="randomnessSlider">
          <strong>Chance of life:</strong> {randomness}
        </label>
        <input
          type="range"
          id="randomnessSlider"
          min="0"
          max="1"
          value={randomness}
          step="0.1"
          onChange={e => updateRandomness(e.target.value)}
        />
        <label htmlFor="dimensionsSlider">
          <strong>Side length:</strong> {sideLength}
        </label>
        <input
          type="range"
          id="dimensionsSlider"
          min="10"
          max="30"
          value={sideLength}
          step="1"
          onChange={e => updateSideLength(e.target.value)}
        />
      </p>
      <button onClick={advanceState}>Advance World</button>
      <button onClick={resetWorld}>Reset World</button>
      <div style={{ paddingTop: '20px' }}>
        <a href="http://github.com/jwworth/conway" style={{ color: '#000' }}>
          Source code
        </a>
      </div>
    </div>
  );
};

export default App;
