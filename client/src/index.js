
import React from 'react';
import './presentation/styles/App.css';
import './presentation/styles/Empires.css';
import './presentation/styles/Accounts.css';
import './presentation/styles/Boards.css';
import './presentation/styles/colorbase.css';
import './presentation/styles/Treaties.css';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import { BrowserRouter, Routes, Route } from 'react-router'
import AccountPage from './presentation/pages/AccountPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="*" element={<App />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
