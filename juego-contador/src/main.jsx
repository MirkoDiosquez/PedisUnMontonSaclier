import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import JuegoContador from './JuegoContador.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <JuegoContador />
  </StrictMode>,
);
