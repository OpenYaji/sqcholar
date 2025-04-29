"use client";

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Assuming you are using React Router

const AddStudent = () => {
    const [studentId, setStudentId] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/admin/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    student_id: studentId,
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    password: password, // **SECURITY WARNING: In production, hash this password!**
                    // Add other fields as needed
                }),
            });

            if (response.ok) {
                alert('Student added successfully!');
                navigate('/admin'); // Redirect back to the admin dashboard
            } else {
                const errorData = await response.json();
                alert(`Error adding student: ${errorData.message || 'Something went wrong'}`);
            }
        } catch (error) {
            console.error("Error adding student:", error);
            alert('Failed to add student.');
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Add New Student</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="studentId" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                        Student ID:
                    </label>
                    <input
                        type="text"
                        id="studentId"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="firstName" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                        First Name:
                    </label>
                    <input
                        type="text"
                        id="firstName"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="lastName" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                        Last Name:
                    </label>
                    <input
                        type="text"
                        id="lastName"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                        Email:
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                        Password:
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <p className="text-xs italic text-gray-500 dark:text-gray-400">
                        Note: This password will be stored as plain text for this example. Use bcrypt in production!
                    </p>
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Add Student
                    </button>
                    <Link to="/admin" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600">
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default AddStudent;