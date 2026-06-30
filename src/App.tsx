import styles from './App.module.css';
import React, {Component} from 'react';

import {randomColor, randomWorld, Color} from './app_helper';
import Cell from './components/Cell';

interface AppState {
  colorOfLife: Color;
  days: number;
  flair?: string;
  randomness: number;
  sideLength: number;
  speed: number;
  timer?: NodeJS.Timeout;
  world: number[][];
}

class App extends Component<{}, AppState> {
  state = {
    flair: undefined,
    colorOfLife: randomColor(),
    days: 0,
    randomness: 0.2,
    sideLength: 40,
    speed: 300,
    timer: undefined,
    world: randomWorld(40, 0.2),
  };

  start = () => {
    const timer = setInterval(this.advanceState, this.state.speed);
    this.setState({timer});
  };

  stop = () => {
    clearInterval(this.state.timer);
    this.setState({timer: undefined});
  };

  resetWorld = () => {
    this.stop();
    this.setState(({sideLength, randomness}) => {
      return {
        world: randomWorld(sideLength, randomness),
        flair: undefined,
        days: 0,
      };
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
      }),
    );

    if (JSON.stringify(world) === JSON.stringify(this.state.world)) {
      const hasLife = world.some((row) => row.some((cell) => cell === 1));
      this.setState({flair: hasLife ? 'Still life' : 'Extinction'});
      this.stop();
    } else {
      const days = this.state.days;
      this.setState({world, days: days + 1});
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
      .map((position) => {
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
    this.setState(({sideLength}) => {
      return {
        world: randomWorld(sideLength, randomness),
        flair: undefined,
        randomness,
        days: 0,
      };
    });
  };

  updateSpeed = (speed: number): void => {
    clearInterval(this.state.timer);
    this.setState({timer: undefined, speed});
  };

  updateSideLength = (sideLength: number): void => {
    this.setState(({randomness}) => {
      return {
        world: randomWorld(sideLength, randomness),
        sideLength,
        flair: undefined,
        days: 0,
      };
    });
  };

  updateWorld = (world: number[][]): void => {
    this.setState({world});
  };

  handleChangeColorClick = () => {
    this.setState(({colorOfLife: currentColor}) => ({
      colorOfLife: randomColor({exclude: currentColor}),
    }));
  };

  render() {
    const {colorOfLife, days, randomness, sideLength, speed, timer, world} =
      this.state;

    const gameInPlay = Boolean(timer);

    return (
      <div className={styles.root}>
        <h1 className={styles.title}>
          <span className={styles.titleText}>Conway&#39;s Game of Life</span>
          <span
            className={styles.emoji}
            style={{'--color-of-life': colorOfLife} as React.CSSProperties}
          >
            🦠
          </span>
        </h1>

        <table>
          <tbody>
            {world.map((row, rowIndex) => {
              return (
                <tr key={rowIndex}>
                  {row.map((cellValue, cellIndex) => (
                    <Cell
                      gameInPlay={gameInPlay}
                      cellIndex={cellIndex}
                      cellValue={cellValue}
                      colorOfLife={colorOfLife}
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
        <div className={styles.tableFooter}>
          <div className={styles.hint}>
            Filled cells are alive. When stopped, click any cell to change life
            state.
          </div>
          <div>
            <button onClick={this.handleChangeColorClick}>Change color</button>
          </div>
        </div>

        <div className={styles.controls}>
          <p className={styles.daysPassed}>
            <strong>Days passed:</strong> <span>{days}</span>
            {this.state.flair && (
              <span
                className={styles.flair}
                style={{'--color-of-life': colorOfLife} as React.CSSProperties}
              >
                {this.state.flair}
              </span>
            )}
          </p>

          <div className={styles.sliders}>
            <div>
              <label htmlFor="randomnessSlider" className={styles.label}>
                <strong>Chance of life:</strong> {randomness * 100}%
              </label>
              <input
                className={styles.rangeInput}
                disabled={gameInPlay}
                type="range"
                id="randomnessSlider"
                min="0"
                max="1"
                value={randomness}
                step="0.1"
                onChange={(e) => this.updateRandomness(Number(e.target.value))}
              />
            </div>

            <div>
              <label htmlFor="speedSlider" className={styles.label}>
                <strong>Speed:</strong> {speed} ms
              </label>
              <input
                className={styles.rangeInput}
                disabled={gameInPlay}
                type="range"
                id="speedSlider"
                min="10"
                max="3000"
                value={speed}
                step="10"
                onChange={(e) => this.updateSpeed(Number(e.target.value))}
              />
            </div>

            <div>
              <label htmlFor="dimensionsSlider" className={styles.label}>
                <strong>Side length:</strong> {sideLength} cells
              </label>
              <input
                className={styles.rangeInput}
                disabled={gameInPlay}
                type="range"
                id="dimensionsSlider"
                min="10"
                max="40"
                value={sideLength}
                step="1"
                onChange={(e) => this.updateSideLength(Number(e.target.value))}
              />
            </div>
          </div>

          <div className={styles.controlButtons}>
            <button disabled={gameInPlay} onClick={this.start}>
              Start
            </button>

            <button disabled={!gameInPlay} onClick={this.stop}>
              Stop
            </button>

            <button onClick={this.resetWorld}>Reset</button>
          </div>
        </div>

        <div className={styles.footer}>
          Created by <a href="https://github.com/jwworth">@jwworth</a> |{' '}
          <a
            href="http://github.com/jwworth/conway"
            className={styles.sourceLink}
          >
            {' '}
            Source code{' '}
          </a>
        </div>
      </div>
    );
  }
}

export default App;
