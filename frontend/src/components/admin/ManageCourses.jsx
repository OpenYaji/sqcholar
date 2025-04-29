import React, { useState, useEffect } from 'react';

const ManageCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // ... state for adding/editing courses

    useEffect(() => {
        fetch('http://localhost:5000/admin/courses')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setCourses(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, []);

    // ... functions for adding, editing, deleting courses

    if (loading) {
        return <div>Loading courses...</div>;
    }

    if (error) {
        return <div>Error loading courses: {error.message}</div>;
    }

    return (
        <div className="container mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Manage Courses</h2>
            {/* ... UI for displaying, adding, and editing courses */}
        </div>
    );
};

export default ManageCourses;