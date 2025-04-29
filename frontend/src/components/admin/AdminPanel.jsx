import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import {
    Users,
    Book,
    List,
    GraduationCap, // Let's see if this exists in Lucide, if not we'll find a suitable alternative
    Bell,
    LayoutDashboard,
} from 'lucide-react'; // Changed import from 'react-feather'
import AdminHeader from './AdminHeader';
import './admin.css'; // Import a CSS file for admin styles

const AdminSidebar = ({ activeSection, handleSectionChange }) => {
    return (
        <aside className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 w-64 min-h-screen flex-shrink-0 p-4">
            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-500 dark:text-blue-400">Admin Panel</h2>
            </div>
            <nav>
                <ul className="space-y-2">
                    <li>
                        <Link
                            to="/admin/dashboard"
                            className={`flex items-center space-x-2 p-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700 ${activeSection === 'dashboard' ? 'bg-blue-500 text-white dark:bg-blue-600' : 'text-gray-700 dark:text-gray-300'}`}
                            onClick={() => handleSectionChange('dashboard')}
                        >
                            <LayoutDashboard className="h-5 w-5" />
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/students"
                            className={`flex items-center space-x-2 p-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700 ${activeSection === 'students' ? 'bg-blue-500 text-white dark:bg-blue-600' : 'text-gray-700 dark:text-gray-300'}`}
                            onClick={() => handleSectionChange('students')}
                        >
                            <Users className="h-5 w-5" />
                            <span>Manage Students</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/grades"
                            className={`flex items-center space-x-2 p-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700 ${activeSection === 'grades' ? 'bg-blue-500 text-white dark:bg-blue-600' : 'text-gray-700 dark:text-gray-300'}`}
                            onClick={() => handleSectionChange('grades')}
                        >
                            <List className="h-5 w-5" />
                            <span>Manage Grades</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/courses"
                            className={`flex items-center space-x-2 p-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700 ${activeSection === 'courses' ? 'bg-blue-500 text-white dark:bg-blue-600' : 'text-gray-700 dark:text-gray-300'}`}
                            onClick={() => handleSectionChange('courses')}
                        >
                            <Book className="h-5 w-5" />
                            <span>Manage Courses</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/instructors"
                            className={`flex items-center space-x-2 p-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700 ${activeSection === 'instructors' ? 'bg-blue-500 text-white dark:bg-blue-600' : 'text-gray-700 dark:text-gray-300'}`}
                            onClick={() => handleSectionChange('instructors')}
                        >
                            {/* Checking if GraduationCap exists in Lucide */}
                            {GraduationCap ? <GraduationCap className="h-5 w-5" /> : <Users className="h-5 w-5" />}
                            <span>Manage Instructors</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/notifications"
                            className={`flex items-center space-x-2 p-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700 ${activeSection === 'notifications' ? 'bg-blue-500 text-white dark:bg-blue-600' : 'text-gray-700 dark:text-gray-300'}`}
                            onClick={() => handleSectionChange('notifications')}
                        >
                            <Bell className="h-5 w-5" />
                            <span>Manage Notifications</span>
                        </Link>
                    </li>
                    {/* Add more links for other admin functionalities */}
                </ul>
            </nav>
        </aside>
    );
};

const AdminPanel = ({ onLogout }) => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState(() => {
        const path = window.location.pathname;
        if (path.includes('/admin/grades')) return 'grades';
        if (path.includes('/admin/courses')) return 'courses';
        if (path.includes('/admin/instructors')) return 'instructors';
        if (path.includes('/admin/notifications')) return 'notifications';
        if (path.includes('/admin/students')) return 'students';
        return 'dashboard';
    });

    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex">
            <AdminSidebar activeSection={activeSection} handleSectionChange={handleSectionChange} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader onLogout={onLogout} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
                    <Outlet /> {/* This is where the content of the specific admin section will be rendered */}
                </main>
            </div>
        </div>
    );
};

export default AdminPanel;