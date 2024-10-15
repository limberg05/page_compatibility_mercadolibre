import reportWebVitals from './reportWebVitals';
import React from 'react';
import ReactDOM from 'react-dom';
import { NextUIProvider } from '@nextui-org/react';
import { MainTable } from './sections';
import './index.css';
import { OAuth2Component, RandomItemsComponent } from './mercado_api';
import { Navbar } from './sections';

const root = ReactDOM.createRoot(document.getElementById('main'));
root.render(
  <NextUIProvider>
    <Navbar></Navbar>
    <MainTable />
    <OAuth2Component />
    <RandomItemsComponent />
  </NextUIProvider>
);

reportWebVitals();
