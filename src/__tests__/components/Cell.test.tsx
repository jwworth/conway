import React from 'react';
import ReactDOM from 'react-dom';

import Cell from '../../components/Cell';

it('renders without crashing', () => {
  const tr = document.createElement('tr');
  ReactDOM.render(
    // @ts-expect-error ts-migrate(2741) FIXME: Property 'colorOfLife' is missing in type '{ cellI... Remove this comment to see the full error message
    <Cell
      cellIndex={0}
      cellValue={0}
      gameInPlay={true}
      rowIndex={0}
      updateWorld={() => null}
      world={[]}
    />,
    tr
  );
});
