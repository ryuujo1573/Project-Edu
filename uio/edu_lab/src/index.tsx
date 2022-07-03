import React from 'react';
import { render } from 'react-dom';
import { DefaultButton, ThemeProvider, initializeIcons, hsl2rgb } from '@fluentui/react';
import reportWebVitals from './reportWebVitals';
import Board from './containers/Board';
import './index.scss'
import { BoardState } from './containers/Board/board.reducer';

const INIT: BoardState = {
  "map": {
      "size": [4, 6], // w h
      "pages": [
          {
              "index": 0,
              "widgets": [{
                  "geometry": [1, 1, 2, 1], // x y w h
                  "typeid": "datetime"
              }, {
                  "geometry": [3, 1, 2, 1],
                  "typeid": "blank"
              }, {
                  "geometry": [1, 2, 1, 1],
                  "typeid": "stack"
              }, {
                  "geometry": [2, 2, 3, 2],
                  "typeid": "weather"
              }, {
                  "geometry": [1, 3, 1, 2],
                  "typeid": "blank"
              }, {
                  "geometry": [2, 4, 3, 2],
                  "typeid": "schedule"
              }]
          },
      ]
  }
}

const App: React.FunctionComponent = () => {
  const min = 0;
  const max = 359;
  const rand = () => min + Math.random() * (max - min);

  return (
    <ThemeProvider className='root'>
      <Board {...INIT} />
    </ThemeProvider>
  )
}

const rootElement = document.getElementById('root');
render(<App />, rootElement);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
