import reportWebVitals from './reportWebVitals';
import React from 'react';
import ReactDOM from 'react-dom';
import { NextUIProvider } from '@nextui-org/react';
import { Title, MainTable } from './sections';
import './index.css';
import { OAuth2Component } from './mercado_api';

const root = ReactDOM.createRoot(document.getElementById('main'));
root.render(
  <NextUIProvider>
    <Title />
    <MainTable />
    <OAuth2Component />
  </NextUIProvider>
);

reportWebVitals();
