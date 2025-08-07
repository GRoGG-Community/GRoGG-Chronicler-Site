import { Routes, Route } from 'react-router-dom';
import AccountPage from '../../presentation/pages/AccountPage';
import EmpirePage from '../../presentation/pages/EmpirePage';
import ManageEmpiresPage from '../../presentation/pages/ManageEmpiresPage';
import TreatyPage from '../../presentation/pages/TreatyPage';
import MessageBoardPage from '../../presentation/pages/MessageBoardPage';

/**
 * Router 
 * Centralizes route-to-page mapping, decoupling navigation from page logic.
 */
export default function Router() {
    return (
        <Routes>
            <Route path="/accounts" element={<AccountPage />} />
            <Route path="/empires" element={<EmpirePage />} />
            <Route path="/manage-empires" element={<ManageEmpiresPage />} />
            <Route path="/treaties" element={<TreatyPage />} />
            <Route path="/channels" element={<MessageBoardPage />} />
        </Routes>
    );
}
