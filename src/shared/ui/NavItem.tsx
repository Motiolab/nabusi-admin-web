import { Link, useLocation } from 'react-router-dom';
import styles from './NavItem.module.css';
import React from 'react';

interface NavItemProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    isCollapsed?: boolean;
}

export const NavItem = ({ href, icon, label, isCollapsed }: NavItemProps) => {
    const location = useLocation();
    const isActive = location.pathname === href;

    return (
        <Link
            to={href}
            className={`${styles.navItem} ${isActive ? styles.active : ''} ${isCollapsed ? styles.collapsed : ''}`}
        >
            <span className={styles.icon}>{icon}</span>
            <span className={styles.label}>{label}</span>
        </Link>
    );
};
