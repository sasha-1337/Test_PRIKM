import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ShowText from './ShowText';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
        <App />
  </React.StrictMode>
);

const display = ReactDOM.createRoot(document.getElementById('display'));
display.render(
    <React.StrictMode>
        <ShowText />
    </React.StrictMode>
);