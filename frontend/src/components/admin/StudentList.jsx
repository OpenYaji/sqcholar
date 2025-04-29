"use client";

import React, { useState, useEffect } from "react";
import { Pencil, Trash } from "lucide-react";
import { Link } from "react-router-dom"; // Assuming you are using React Router

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch('http://localhost:5000/admin/students');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setStudents(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    if (loading) {
        return <p>Loading students...</p>;
    }

    if (error) {
        return <p>Error loading students: {error}</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg">
                <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student ID</th>
                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">First Name</th>
                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Name</th>
                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                        <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {students.map(student => (
                        <tr key={student.student_id}>
                            <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{student.student_id}</td>
                            <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{student.first_name}</td>
                            <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{student.last_name}</td>
                            <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{student.email}</td>
                            <td className="py-4 px-6 whitespace-nowrap text-right text-sm font-medium">
                                <Link to={`/admin/edit/${student.student_id}`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-2">
                                    <Pencil className="h-5 w-5" />
                                </Link>
                                <button
                                    onClick={() => handleDelete(student.student_id)}
                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                >
                                    <Trash className="h-5 w-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    async function handleDelete(studentId) {
        if (window.confirm(`Are you sure you want to delete student with ID: ${studentId}?`)) {
            try {
                const response = await fetch(`http://localhost:5000/admin/students/${studentId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setStudents(students.filter(student => student.student_id !== studentId));
                    alert('Student deleted successfully!');
                } else {
                    const errorData = await response.json();
                    alert(`Error deleting student: ${errorData.message || 'Something went wrong'}`);
                }
            } catch (err) {
                console.error("Error deleting student:", err);
                alert('Failed to delete student.');
            }
        }
    }
};

export default StudentList;