"use client";

import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom"; // Assuming you are using React Router

const EditStudent = () => {
    const [studentId, setStudentId] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [emergencyContact, setEmergencyContact] = useState("");
    const [emergencyPhone, setEmergencyPhone] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { studentId: currentStudentId } = useParams(); // Get the studentId from the route parameters

    useEffect(() => {
        if (currentStudentId) {
            fetchStudent(currentStudentId);
        }
    }, [currentStudentId]);

    const fetchStudent = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/admin/students/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setStudentId(data.student_id);
            setFirstName(data.first_name);
            setLastName(data.last_name);
            setEmail(data.email);
            setPhone(data.phone || "");
            setAddress(data.address || "");
            setEmergencyContact(data.emergency_contact || "");
            setEmergencyPhone(data.emergency_phone || "");
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/admin/students/${currentStudentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    phone: phone,
                    address: address,
                    emergency_contact: emergencyContact,
                    emergency_phone: emergencyPhone,
                    // You might want to include password update functionality here
                }),
            });

            if (response.ok) {
                alert('Student updated successfully!');
                navigate('/admin'); // Redirect back to the admin dashboard
            } else {
                const errorData = await response.json();
                alert(`Error updating student: ${errorData.message || 'Something went wrong'}`);
            }
        } catch (error) {
            console.error("Error updating student:", error);
            alert('Failed to update student.');
        }
    };

    if (loading) {
        return <p>Loading student data...</p>;
    }

    if (error) {
        return <p>Error loading student data: {error}</p>;
    }

    return (
        <div className="p-6 max-w-md mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Edit Student</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="studentId" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                        Student ID:
                    </label>
                    <input
                        type="text"
                        id="studentId"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 cursor-not-allowed"
                        value={studentId}
                        readOnly
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
                    <label htmlFor="phone" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                        Phone:
                    </label>
                    <input
                        type="text"
                        id="phone"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="address" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                        Address:
                    </label>
                    <input
                        type="text"
                        id="address"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="emergencyContact" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                        Emergency Contact:
                    </label>
                    <input
                        type="text"
                        id="emergencyContact"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700"
                        value={emergencyContact}
                        onChange={(e) => setEmergencyContact(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="emergencyPhone" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                        Emergency Phone:
                    </label>
                    <input
                        type="text"
                        id="emergencyPhone"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700"
                        value={emergencyPhone}
                        onChange={(e) => setEmergencyPhone(e.target.value)}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Update Student
                    </button>
                    <Link to="/admin" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600">
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default EditStudent;