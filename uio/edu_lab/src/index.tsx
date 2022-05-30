import React from 'react';
import { render } from 'react-dom';
import { DefaultButton, ThemeProvider, initializeIcons } from '@fluentui/react';
import reportWebVitals from './reportWebVitals';

initializeIcons();

const App: React.FunctionComponent = () => {
  return (
    <ThemeProvider>
      <DefaultButton onClick={() => alert('hello')}>Hello World</DefaultButton>
    </ThemeProvider>
  );
};

const rootElement = document.getElementById('root');
render(<App />, rootElement);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
