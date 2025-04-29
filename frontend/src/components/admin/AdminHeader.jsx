import React from 'react';

const AdminHeader = ({ onLogout }) => {
    return (
        <header className="bg-white dark:bg-gray-800 shadow-md py-4 px-6 flex justify-end">
            <button
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                Logout
            </button>
        </header>
    );
};

export default AdminHeader;