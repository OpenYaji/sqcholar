"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Assuming you are using React Router
import StudentList from "./StudentList";
import { Users } from "lucide-react";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false); // State to track admin status

    useEffect(() => {
        // Basic check if the user is an admin (you'll need a proper authentication mechanism)
        const checkAdminStatus = () => {
            const adminStatus = localStorage.getItem('qcu_is_admin') === 'true'; // Example: Check local storage
            setIsAdmin(adminStatus);
            if (!adminStatus) {
                // Redirect to the student dashboard or a login page if not an admin
                navigate('/'); // Adjust the route as needed
            }
        };

        checkAdminStatus();
    }, [navigate]);

    if (!isAdmin) {
        return null; // Or a loading/redirecting message
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
                <Users className="mr-2 h-6 w-6" />
                Admin Panel - Manage Students
            </h1>
            <StudentList />
            {/* You can add more admin functionalities here */}
        </div>
    );
};

export default AdminDashboard;