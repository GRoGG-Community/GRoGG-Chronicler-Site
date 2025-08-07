import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/common/Header';

interface PageLayoutProps {
    children: ReactNode;
}

/**
 * PageLayout (Composite Pattern)
 * Provides a consistent app-wide layout: header, navigation, and main content slot.
 * This enforces the Single Responsibility Principle by separating layout from logic and data.
 */
export default function PageLayout({ children }: PageLayoutProps) {
    const location = useLocation();
    
    // Extract activeTab from current route path
    const getActiveTab = () => {
        const path = location.pathname.substring(1); // Remove leading slash
        return path || 'channels'; // Default to channels if on root
    };

    return (
        <div className="app-container">
            <Header activeTab={getActiveTab()} />
            <main className="main-content">{children}</main>
        </div>
    );
}
