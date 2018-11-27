import './normalize.css';
import './App.css';

import React, { Component } from 'react';

import { chunk } from 'lodash';

import Cell from './components/Cell';

class App extends Component {
  constructor(props) {
    super(props);

    const randomness = 0.2;
    const sideLength = 30;

    this.state = {
      randomness,
      sideLength,
      timer: null,
      gameInPlay: false,
      days: 0,
      speed: 30,
      world: this.randomWorld(sideLength, randomness),
    };
  }

  setDays = days => this.setState({ days });
  setGameInPlay = gameInPlay => this.setState({ gameInPlay });
  setRandomness = randomness => this.setState({ randomness });
  setSideLength = sideLength => this.setState({ sideLength });
  setSpeed = speed => this.setState({ speed });
  setTimer = timer => this.setState({ timer });
  setWorld = world => this.setState({ world });

  start = () => {
    const timer = setInterval(this.advanceState, this.state.speed);
    this.setTimer(timer);
    this.setGameInPlay(true);
  };

  stop = () => {
    clearInterval(this.state.timer);
    this.setTimer(null);
    this.setGameInPlay(false);
  };

  resetWorld = () => {
    this.stop();
    this.setDays(0);
    this.setWorld(
      this.randomWorld(this.state.sideLength, this.state.randomness)
    );
  };

  advanceState = () => {
    const newWorld = this.state.world.map((row, rowIndex) =>
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

    if (JSON.stringify(newWorld) === JSON.stringify(this.state.world)) {
      this.stop();
    } else {
      this.setDays(this.state.days + 1);
      this.setWorld(newWorld);
    }
  };

  neighborScore = (rowIndex, cellIndex) => {
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
        if (this.state.world[position[0]]) {
          count = this.state.world[position[0]][position[1]] || 0;
        } else {
          count = 0;
        }

        return count;
      })
      .reduce((a, b) => a + b, 0);
    return score;
  };

  randomWorld = (newSideLength, newRandomness) => {
    let newWorld = [];
    for (let i = 0; i < newSideLength ** 2; i++) {
      const sentience = Math.random() < newRandomness ? 1 : 0;
      newWorld.push(sentience);
    }
    return chunk(newWorld, newSideLength);
  };

  updateRandomness = newRandomness => {
    this.setDays(0);
    this.setRandomness(newRandomness);
    this.setWorld(this.randomWorld(this.state.sideLength, newRandomness));
  };

  updateSpeed = newSpeed => {
    clearInterval(this.state.timer);
    this.setTimer(null);
    this.setSpeed(newSpeed);
  };

  updateSideLength = newSideLength => {
    this.setDays(0);
    this.setSideLength(newSideLength);
    this.setWorld(this.randomWorld(newSideLength, this.state.randomness));
  };

  render() {
    const {
      world,
      gameInPlay,
      days,
      randomness,
      timer,
      speed,
      sideLength,
    } = this.state;
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
                      gameInPlay={gameInPlay}
                      cellValue={cellValue}
                      cellIndex={cellIndex}
                      rowIndex={rowIndex}
                      key={cellIndex}
                      world={world}
                      updateWorld={this.setWorld}
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
            onChange={e => this.updateRandomness(e.target.value)}
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
            onChange={e => this.updateSpeed(e.target.value)}
          />
          <label htmlFor="dimensionsSlider">
            <strong>Side length:</strong> {sideLength}
          </label>
          <input
            disabled={gameInPlay}
            type="range"
            id="dimensionsSlider"
            min="10"
            max="30"
            value={sideLength}
            step="1"
            onChange={e => this.updateSideLength(e.target.value)}
          />
        </p>
        <button disabled={timer} onClick={this.start}>
          Start
        </button>
        <button disabled={!timer} onClick={this.stop}>
          Stop
        </button>
        <button onClick={this.resetWorld}>Reset World</button>
        <div style={{ paddingTop: '20px' }}>
          <a href="http://github.com/jwworth/conway" style={{ color: '#000' }}>
            Source code
          </a>
        </div>
      </div>
    );
  }
}

export default App;
