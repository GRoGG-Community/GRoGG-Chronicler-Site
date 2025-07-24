import { useState, useRef, useEffect } from 'react';

export function useBurgerMenu(account) {
    const [showMenu, setShowMenu] = useState(false);
    const [showPermissions, setShowPermissions] = useState(false);
    const [showRoadmap, setShowRoadmap] = useState(false);
    const [gmPermissions, setGmPermissions] = useState(() => {
        const saved = localStorage.getItem('stellarisGmPermissions');
        return saved ? JSON.parse(saved) : { canDeleteMessages: true };
    });
    const menuDropdownRef = useRef(null);
    const permissionsDropdownRef = useRef(null);

    useEffect(() => {
        localStorage.setItem('stellarisGmPermissions', JSON.stringify(gmPermissions));
    }, [gmPermissions]);

    function handleMenuToggle() {
        setShowMenu(v => !v);
        setShowPermissions(false);
        setShowRoadmap(false);
    }
    function handleMenuClose() {
        setShowMenu(false);
        setShowPermissions(false);
        setShowRoadmap(false);
    }
    function handlePermissionsToggle() {
        setShowPermissions(v => !v);
    }
    function handleRoadmapToggle() {
        setShowRoadmap(v => !v);
        setShowMenu(false);
        setShowPermissions(false);
    }
    function handlePermissionChange(key, value) {
        setGmPermissions(prev => ({ ...prev, [key]: value }));
    }

    useEffect(() => {
        if (!showMenu && !showPermissions) return;
        function handleMouseMove(e) {
            if (
                menuDropdownRef.current &&
                permissionsDropdownRef.current &&
                !menuDropdownRef.current.contains(e.target) &&
                !permissionsDropdownRef.current.contains(e.target)
            ) {
                setShowMenu(false);
                setShowPermissions(false);
            }
        }
        document.addEventListener('mousedown', handleMouseMove);
        return () => document.removeEventListener('mousedown', handleMouseMove);
    }, [showMenu, showPermissions]);

    return {
        showMenu,
        showPermissions,
        gmPermissions,
        showRoadmap,
        handleMenuToggle,
        handleMenuClose,
        handlePermissionsToggle,
        handlePermissionChange,
        handleRoadmapToggle,
        menuDropdownRef,
        permissionsDropdownRef
    };
}

