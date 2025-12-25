import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './components/App';
import './styles/global.css';

/**
 * QuestNotes - A 16-Bit GBA Style Note Taking Adventure
 *
 * Sam's note: This is the entry point. All state is managed via
 * React Context + localStorage. No external database needed.
 *
 * Data integrity is ensured through:
 * - Versioned localStorage saves
 * - Type-safe reducer actions
 * - Defensive null checks throughout
 */

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found! Check index.html for #root div.');
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
