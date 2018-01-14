import React, { Component } from 'react';
import './normalize.css';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    const randomness = 0.2;
    const sideLength = 35;

    this.state = {
      randomness,
      sideLength,
      timer: null,
      days: 0,
      world: this.randomWorld(sideLength, randomness),
    };
  }

  start = () => {
    const timer = setInterval(this.advanceState, 30);
    this.setState({ timer });
  };

  stop = () => {
    clearInterval(this.state.timer);
    this.setState({ timer: null });
  };

  resetWorld = () => {
    this.setState({ days: 0 });
    this.randomizeWorld(this.state.randomness);
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
      let days = this.state.days;
      this.setState({ world, days: days + 1 });
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

  randomWorld = (sideLength, randomness) => {
    let world = [];
    for (var i = 0; i < sideLength ** 2; i++) {
      const sentience = Math.random() < randomness ? 1 : 0;
      world.push(sentience);
    }
    return this.chunk(world, sideLength);
  };

  randomizeWorld = randomness => {
    this.setState({
      world: this.randomWorld(this.state.sideLength, randomness),
    });
  };

  updateRandomness = randomness => {
    this.setState({ randomness });
    this.randomizeWorld(randomness);
  };

  chunk = (arr, chunkSize) => {
    let groups = [], i;
    for (i = 0; i < arr.length; i += chunkSize) {
      groups.push(arr.slice(i, i + chunkSize));
    }
    return groups;
  };

  render() {
    return (
      <div style={{ margin: 'auto', width: '525px' }}>
        <table>
          <tbody>
            {this.state.world.map((row, i) => {
              const rowKey = row.join('');
              return <Row row={row} key={i + rowKey} rowKey={rowKey} />;
            })}
          </tbody>
        </table>
        <p><strong>Days:</strong> {this.state.days}</p>
        <p>
          <label htmlFor={'randomnessSlider'}>
            <strong>Chance of life:</strong> {this.state.randomness}
          </label>
          <input
            type="range"
            id="randomnessSlider"
            min="0"
            max="1"
            value={this.state.randomness}
            step="0.1"
            onChange={e => this.updateRandomness(e.target.value)}
          />
        </p>
        <button onClick={() => this.resetWorld()}>
          Reset World
        </button>
        <button disabled={this.state.timer} onClick={() => this.start()}>
          Start
        </button>
        <button disabled={!this.state.timer} onClick={() => this.stop()}>
          Stop
        </button>
      </div>
    );
  }
}

const Row = ({ row, rowKey }) => {
  return (
    <tr>
      {row.map((cell, i) => <Cell cell={cell} key={rowKey + cell + i} />)}
    </tr>
  );
};

const Cell = ({ cell }) => {
  const color = binary => (binary === 1 ? '#654EA3' : '#fff');

  return (
    <td
      style={{
        background: color(cell),
        width: '15px',
        height: '15px',
        border: '1px solid lightgray',
      }}
    />
  );
};

export default App;
