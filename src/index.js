import reportWebVitals from './reportWebVitals';
import React from 'react';
import ReactDOM from 'react-dom';
import { NextUIProvider } from '@nextui-org/react';
import { Title, MainTable } from './sections';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('main'));
root.render(
  <NextUIProvider>
    <Title />
    <MainTable />
  </NextUIProvider>
);

reportWebVitals();
