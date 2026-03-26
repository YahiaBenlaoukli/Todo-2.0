import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTasks, FaHome, FaMap, FaHeadphonesAlt, FaPhone, FaMoon, FaSun } from "react-icons/fa";
import { LuNotebookText } from "react-icons/lu";
import { useTheme } from '../contexts/ThemeContext';

const Navbar: React.FC = () => {
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();

    const isActive = (path: string) => location.pathname === path;

    return (
        <>
            {/* Desktop: vertical activity bar on left */}
            <nav className="hidden md:flex fixed left-0 top-0 h-screen w-14 bg-primary border-r border-[#2d2d2d] z-50 flex-col items-center py-3 justify-between">
                <div className="flex flex-col items-center gap-1">
                    {/* App icon */}
                    <div className="w-9 h-9 flex items-center justify-center mb-3">
                        <img
                            src="src/assets/Todo.png"
                            alt="Logo"
                            className="w-7 h-7 rounded object-cover opacity-80"
                        />
                    </div>

                    {/* Main nav */}
                    <NavItem to="/" icon={<FaHome size={20} />} label="Home" active={isActive('/')} />
                    <NavItem to="/tasks" icon={<FaTasks size={20} />} label="Tasks" active={isActive('/tasks')} />
                    <NavItem to="/roadmaps" icon={<FaMap size={20} />} label="RoadMaps" active={isActive('/roadmaps')} />
                    <NavItem to="/notes" icon={<LuNotebookText size={20} />} label="Notes" active={isActive('/notes')} />
                </div>

                {/* Bottom nav */}
                <div className="flex flex-col items-center gap-1 mb-2">
                    <button
                        onClick={toggleTheme}
                        data-tooltip={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        className="relative w-12 h-11 flex items-center justify-center rounded transition-colors duration-150 group text-text hover:text-white cursor-pointer"
                    >
                        {theme === 'dark' ? <FaSun size={18} /> : <FaMoon size={18} />}
                        <span className="pointer-events-none absolute left-full ml-2 whitespace-nowrap bg-primary text-[#ffffff] text-xs px-2.5 py-1.5 rounded shadow-lg border border-[#454545] opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-[60]">
                            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        </span>
                    </button>
                    <NavItem to="/about" icon={<FaPhone size={18} />} label="About Us" active={isActive('/about')} />
                    <NavItem to="/contact" icon={<FaHeadphonesAlt size={18} />} label="Contact Us" active={isActive('/contact')} />
                </div>
            </nav>

            {/* Mobile: horizontal bottom tab bar */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-primary border-t border-[#2d2d2d] z-50 flex items-center justify-around px-2">
                <NavItemMobile to="/" icon={<FaHome size={18} />} label="Home" active={isActive('/')} />
                <NavItemMobile to="/tasks" icon={<FaTasks size={18} />} label="Tasks" active={isActive('/tasks')} />
                <NavItemMobile to="/roadmaps" icon={<FaMap size={18} />} label="Maps" active={isActive('/roadmaps')} />
                <NavItemMobile to="/notes" icon={<LuNotebookText size={18} />} label="Notes" active={isActive('/notes')} />
                <button onClick={toggleTheme} className="flex flex-col items-center justify-center gap-0.5 px-1 py-1 rounded transition-colors duration-150 text-[#858585] hover:text-white">
                    {theme === 'dark' ? <FaSun size={16} /> : <FaMoon size={16} />}
                    <span className="text-[10px] leading-tight">Theme</span>
                </button>
            </nav>
        </>
    );
};

/* Desktop icon button with left-border active indicator + hover tooltip */
const NavItem = ({ to, icon, label, active }: { to: string; icon: React.ReactNode; label: string; active: boolean }) => (
    <Link
        to={to}
        data-tooltip={label}
        className={`relative w-12 h-11 flex items-center justify-center rounded transition-colors duration-150 group
            ${active
                ? 'text-white'
                : 'text-text hover:text-white'
            }`}
    >
        {/* Active indicator — left border */}
        {active && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-6 bg-white rounded-r" />
        )}
        {icon}

        {/* Tooltip */}
        <span className="pointer-events-none absolute left-full ml-2 whitespace-nowrap bg-primary text-[#ffffff] text-xs px-2.5 py-1.5 rounded shadow-lg border border-[#454545] opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-[60]">
            {label}
        </span>
    </Link>
);

/* Mobile bottom-bar item */
const NavItemMobile = ({ to, icon, label, active }: { to: string; icon: React.ReactNode; label: string; active: boolean }) => (
    <Link
        to={to}
        className={`flex flex-col items-center justify-center gap-0.5 px-1 py-1 rounded transition-colors duration-150
            ${active
                ? 'text-white'
                : 'text-[#858585]'
            }`}
    >
        {icon}
        <span className="text-[10px] leading-tight">{label}</span>
        {active && <span className="w-4 h-[2px] bg-white rounded-full mt-0.5" />}
    </Link>
);

export default Navbar;
