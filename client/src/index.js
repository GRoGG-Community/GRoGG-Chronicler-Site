
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router'
import { AccountPage } from './pages/AccountPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/accounts" element ={<AccountPage/>}/>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
