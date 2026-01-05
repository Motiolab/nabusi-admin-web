import { useState } from 'react';
import styles from './Sidebar.module.css';
import { NavItem } from '@/shared/ui/NavItem';
import {
    Home,
    Users,
    GraduationCap,
    Calendar,
    Ticket,
    Bell,
    Settings,
    ShieldCheck,
    ChevronLeft,
    Menu,
    User
} from 'lucide-react';

interface SidebarProps {
    isMobileOpen?: boolean;
    onCloseMobile?: () => void;
}

export const Sidebar = ({ isMobileOpen, onCloseMobile }: SidebarProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    const menuItems = [
        { href: '/', icon: <Home size={20} />, label: '홈' },
        { href: '/member', icon: <Users size={20} />, label: '회원 관리' },
        { href: '/teacher', icon: <GraduationCap size={20} />, label: '강사 관리' },
        { href: '/wellness-class', icon: <Calendar size={20} />, label: '수업 관리' },
        { href: '/wellness-ticket', icon: <Ticket size={20} />, label: '수강권 관리' },
        { href: '/notice', icon: <Bell size={20} />, label: '공지사항' },
        { href: '/setting/policy', icon: <Settings size={20} />, label: '운영 정책' },
        { href: '/setting/authmanagement', icon: <ShieldCheck size={20} />, label: '권한 관리' },
        { href: '/profile', icon: <User size={20} />, label: '내 정보' },
    ];

    return (
        <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : styles.expanded} ${isMobileOpen ? styles.mobileOpen : ''}`}>
            <div className={styles.header}>
                {!isCollapsed && <div className={styles.logo}>나부시 관리자</div>}
                <button className={styles.toggleButton} onClick={toggleCollapse}>
                    {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            <nav className={styles.navSection}>
                {menuItems.map((item) => (
                    <div key={item.href}>
                        {item.href === '/profile' && <div className={styles.divider} />}
                        <NavItem
                            href={item.href}
                            icon={item.icon}
                            label={item.label}
                            isCollapsed={isCollapsed}
                        />
                    </div>
                ))}
            </nav>
        </aside>
    );
};
