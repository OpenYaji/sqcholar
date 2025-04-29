import React from 'react';
import { Link } from 'react-router-dom';
import { List, Book, GraduationCap, Bell } from 'lucide-react';

const AdminSidebar = ({ activeSection, setActiveSection }) => {
    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    return (
        <aside className="bg-gray-200 dark:bg-gray-800 w-64 min-h-screen p-4">
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Admin Panel</h3>
            </div>
            <nav>
                <ul className="space-y-2">
                    <li>
                        <Link
                            to="/admin/grades"
                            className={`flex items-center space-x-2 p-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700 ${activeSection === 'grades' ? 'bg-blue-500 text-white dark:bg-blue-600' : 'texttext-gray-700 dark:text-gray-300'}`}
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
                            <GraduationCap className="h-5 w-5" />
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

export default AdminSidebar;