import React from 'react';
import ReactDOM from 'react-dom/client';
import { Providers } from '@/app/Providers';

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element #root not found in index.html');
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Providers />
  </React.StrictMode>,
);
