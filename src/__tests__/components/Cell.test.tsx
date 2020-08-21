import React from 'react';
import ReactDOM from 'react-dom';

import Cell from '../../components/Cell';

it('renders without crashing', () => {
  const tr = document.createElement('tr');
  ReactDOM.render(
    <Cell
      cellIndex={0}
      cellValue={0}
      colorOfLife={"#000"}
      gameInPlay={true}
      rowIndex={0}
      updateWorld={() => null}
      world={[]}
    />,
    tr
  );
});
