

import React from 'react';
import PageLayout from '../presentation/layouts/PageLayout';
import Router from './routing/Router';
import { AccountProvider } from './providers/AccountContext';
import '../presentation/styles/App.css';

/**
 * App (Composite, Error Boundary, Singleton Patterns)
 * Root entry point. Sets up context providers (including AccountProvider for auth/session), error boundaries, and renders PageLayout and Router.
 */
export default function App() {
    return (
        <AccountProvider>
            <PageLayout>
                <Router />
            </PageLayout>
        </AccountProvider>
    );
}

