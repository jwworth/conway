import React, { Component } from 'react';
import './normalize.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sideLength: 20,
      world: this.randomWorld(20),
    };
  }

  componentDidMount() {
    setInterval(this.advanceState, 30);
  }

  advanceState = () => {
    const world = this.state.world.map((row, rowIndex) =>
      row.map((cell, cellIndex) => {
        const score = this.neighborScore(rowIndex, cellIndex);
        if (cell === 1) {
          if (score < 2 || score > 3) {
            return 0;
          } else if (score === 2 || score === 3) {
            return 1;
          }
        } else if (cell === 0) {
          if (score === 3) {
            return 1;
          } else {
            return 0;
          }
        }
      })
    );

    this.setState({ world });
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

  randomWorld = sideLength => {
    let world = [];
    for (var i = 0; i < sideLength ** 2; i++) {
      const sentience = Math.random() < 0.2 ? 1 : 0;
      world.push(sentience);
    }
    return this.chunk(world, 20);
  };

  randomizeWorld = () => {
    this.setState({
      world: this.randomWorld(this.state.sideLength),
    });
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
      <div style={{ margin: 'auto', width: '900px' }}>
        <button onClick={() => this.randomizeWorld()}>Reset World</button>
        <table>
          <tbody>
            {this.state.world.map((row, i) => {
              const rowKey = row.join('');
              return <Row row={row} key={i + rowKey} rowKey={rowKey} />;
            })}
          </tbody>
        </table>
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
        width: '30px',
        height: '30px',
        border: '1px solid lightgray',
      }}
    />
  );
};

export default App;
