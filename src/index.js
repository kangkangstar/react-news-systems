import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './utils/http'
// 必须引入不然会报错
import "./i18next"

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <App />
);
