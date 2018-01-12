import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sideLength: 20,
      dataModel: this.randomWorld(20),
    };
  }

  randomWorld = sideLength => {
    let world = [];
    for (var i = 0; i < sideLength ** 2; i++) {
      const sentience = Math.random() < 0.07 ? 1 : 0;
      world.push(sentience);
    }
    return world;
  };

  randomizeWorld = () => {
    this.setState({
      dataModel: this.randomWorld(this.state.sideLength),
    });
  };

  chunk = (arr, chunkSize) => {
    let groups = [], i;
    for (i = 0; i < arr.length; i += chunkSize) {
      groups.push(arr.slice(i, i + chunkSize));
    }
    return groups;
  };

  joinRow = row => row.join('');

  render() {
    return (
      <div className="App">
        <button onClick={() => this.randomizeWorld()}>Reset World</button>
        <table>
          <tbody>
            {this.chunk(
              this.state.dataModel,
              this.state.sideLength
            ).map((row, i) => (
              <Row
                row={row}
                key={i + this.joinRow(row)}
                joinRow={this.joinRow}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

const Row = ({ row, joinRow }) => {
  return (
    <tr>
      {row.map((cell, i) => <Cell cell={cell} key={joinRow(row) + cell + i} />)}
    </tr>
  );
};

const Cell = ({ cell }) => {
  const color = binary => (binary === 1 ? 'purple' : 'white');

  return (
    <td
      style={{
        background: color(cell),
        width: '30px',
        height: '30px',
        border: '1px solid gray',
      }}
    />
  );
};

export default App;
