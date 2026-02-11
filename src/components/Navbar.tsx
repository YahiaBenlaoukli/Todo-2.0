import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTasks, FaHome, FaMap, FaHeadphonesAlt, FaPhone, FaBars, FaTimes } from "react-icons/fa";
import { LuNotebookText } from "react-icons/lu";

const Navbar: React.FC = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const isActive = (path: string) => location.pathname === path;

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            <button
                onClick={toggleMenu}
                className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md md:hidden text-primary hover:bg-gray-50 transition-colors"
                aria-label="Toggle Menu"
            >
                {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <nav className={`fixed left-0 top-0 h-screen w-64 bg-secondary/95 backdrop-blur-xl border-r border-white/10 shadow-2xl z-50 flex flex-col justify-between py-8 px-6 transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col items-center">
                    <div className="relative group cursor-pointer">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                        <img
                            src="src/assets/Todo.png"
                            alt="Logo"
                            className="relative rounded-xl w-24 h-24 object-cover shadow-lg transform group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-center space-y-3 mt-8">
                    <NavItem
                        to="/"
                        icon={<FaHome size={20} />}
                        label="Home"
                        active={isActive('/')}
                        onClick={() => setIsOpen(false)}
                    />
                    <NavItem
                        to="/tasks"
                        icon={<FaTasks size={20} />}
                        label="Tasks"
                        active={isActive('/tasks')}
                        onClick={() => setIsOpen(false)}
                    />
                    <NavItem
                        to="/roadmaps"
                        icon={<FaMap size={20} />}
                        label="RoadMaps"
                        active={isActive('/roadmaps')}
                        onClick={() => setIsOpen(false)}
                    />
                    <NavItem
                        to="/notes"
                        icon={<LuNotebookText size={20} />}
                        label="Notes"
                        active={isActive('/notes')}
                        onClick={() => setIsOpen(false)}
                    />
                </div>

                <div className="space-y-3 mt-auto">
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-4"></div>
                    <NavItem
                        to="/about"
                        icon={<FaPhone size={18} />}
                        label="About Us"
                        active={isActive('/about')}
                        onClick={() => setIsOpen(false)}
                    />
                    <NavItem
                        to="/contact"
                        icon={<FaHeadphonesAlt size={18} />}
                        label="Contact Us"
                        active={isActive('/contact')}
                        onClick={() => setIsOpen(false)}
                    />
                    <p className="text-xs text-center text-white/30 mt-6 font-light">© 2026 Todo App</p>
                </div>
            </nav>
        </>
    );
};

const NavItem = ({ to, icon, label, active, onClick }: { to: string, icon: React.ReactNode, label: string, active: boolean, onClick?: () => void }) => (
    <Link
        to={to}
        onClick={onClick}
        className={`group flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ease-out
            ${active
                ? 'bg-primary text-white shadow-lg shadow-primary/25 translate-x-1'
                : 'text-gray-300 hover:bg-white/10 hover:text-white hover:translate-x-1'
            }`}
    >
        <span className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
            {icon}
        </span>
        <span className="font-medium tracking-wide">{label}</span>
        {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-glow animate-pulse"></div>}
    </Link>
);

export default Navbar;
