import './App.css';

import React, { Component } from 'react';

import { chunk } from 'lodash';

import Cell from './components/Cell';

const randomWorld = (sideLength: number, randomness: number): number[][] => {
  const world = [];
  for (let i = 0; i < sideLength ** 2; i++) {
    const sentience = Number(Math.random() < randomness);
    world.push(sentience);
  }
  return chunk(world, sideLength);
};

interface AppState {
  days: number;
  randomness: number;
  sideLength: number;
  speed: number;
  timer: undefined | NodeJS.Timeout;
  world: number[][];
}

class App extends Component<{}, AppState> {
  state = {
    days: 0,
    randomness: 0.2,
    sideLength: 40,
    speed: 300,
    timer: undefined,
    world: randomWorld(40, 0.2),
  };

  start = () => {
    const timer = setInterval(this.advanceState, this.state.speed);
    this.setState({ timer });
  };

  stop = () => {
    clearInterval(this.state.timer);
    this.setState({ timer: undefined });
  };

  resetWorld = () => {
    this.stop();
    this.setState(({ sideLength, randomness }) => {
      return { world: randomWorld(sideLength, randomness), days: 0 };
    });
  };

  advanceState = () => {
    const world = this.state.world.map((row, rowIndex) =>
      row.map((cell, cellIndex) => {
        const score = this.neighborScore(rowIndex, cellIndex);
        let status;
        if (cell === 1 && (score === 2 || score === 3)) {
          status = 1;
        } else if (cell === 0 && score === 3) {
          status = 1;
        }
        return status || 0;
      })
    );

    if (JSON.stringify(world) === JSON.stringify(this.state.world)) {
      this.stop();
    } else {
      const days = this.state.days;
      this.setState({ world, days: days + 1 });
    }
  };

  neighborScore = (rowIndex: number, cellIndex: number): number => {
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
        let count = 0;
        const rowInWorld = this.state.world[position[0]];

        if (rowInWorld) {
          count = rowInWorld[position[1]] || 0;
        }
        return count;
      })
      .reduce((acc, current) => acc + current, 0);
    return score;
  };

  updateRandomness = (randomness: number): void => {
    this.setState(({ sideLength }) => {
      return {
        world: randomWorld(sideLength, randomness),
        randomness,
        days: 0,
      };
    });
  };

  updateSpeed = (speed: number): void => {
    clearInterval(this.state.timer);
    this.setState({ timer: undefined, speed });
  };

  updateSideLength = (sideLength: number): void => {
    this.setState(({ randomness }) => {
      return {
        world: randomWorld(sideLength, randomness),
        sideLength,
        days: 0,
      };
    });
  };

  updateWorld = (world: number[][]): void => {
    this.setState({ world });
  };

  render() {
    const { days, randomness, sideLength, speed, timer, world } = this.state;
    const gameInPlay = Boolean(timer);
    return (
      <div style={{ margin: 'auto', width: '600px' }}>
        <h1>Game of Life</h1>
        <table>
          <tbody>
            {world.map((row, rowIndex) => {
              return (
                <tr key={rowIndex}>
                  {row.map((cellValue, cellIndex) => (
                    <Cell
                      gameInPlay={gameInPlay}
                      cellValue={cellValue}
                      cellIndex={cellIndex}
                      rowIndex={rowIndex}
                      key={cellIndex}
                      world={world}
                      updateWorld={this.updateWorld}
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
            disabled={gameInPlay}
            type="range"
            id="randomnessSlider"
            min="0"
            max="1"
            value={randomness}
            step="0.1"
            onChange={e => this.updateRandomness(Number(e.target.value))}
          />
          <label htmlFor="speedSlider">
            <strong>Speed:</strong> {speed}
            ms
          </label>
          <input
            disabled={gameInPlay}
            type="range"
            id="speedSlider"
            min="10"
            max="3000"
            value={speed}
            step="10"
            onChange={e => this.updateSpeed(Number(e.target.value))}
          />
          <label htmlFor="dimensionsSlider">
            <strong>Side length:</strong> {sideLength}
          </label>
          <input
            disabled={gameInPlay}
            type="range"
            id="dimensionsSlider"
            min="10"
            max="40"
            value={sideLength}
            step="1"
            onChange={e => this.updateSideLength(Number(e.target.value))}
          />
        </p>
        <button disabled={gameInPlay} onClick={this.start}>
          Start
        </button>
        <button disabled={!gameInPlay} onClick={this.stop}>
          Stop
        </button>
        <button onClick={this.resetWorld}>Reset World</button>
        <div style={{ padding: '30px 0' }}>
          <a href="http://github.com/jwworth/conway" style={{ color: '#000' }}>
            Source code
          </a>
        </div>
      </div>
    );
  }
}

export default App;
