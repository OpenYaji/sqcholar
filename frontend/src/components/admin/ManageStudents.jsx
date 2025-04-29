import React, { useState, useEffect } from 'react';

const ManageStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [addFormData, setAddFormData] = useState({
        student_id: '',
        email: '',
        password: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        suffix: '',
        gender: 'Other',
        birthday: '',
        birthplace: '',
        civil_status: 'Single',
        citizenship: '',
        religion: '',
        phone: '',
        address: '',
        emergency_contact_name: '',
        emergency_contact_relationship: '',
        emergency_contact_phone: '',
        enrollment_status: 'Enrolled',
        profile_picture: '', // You might handle file uploads differently
        face_data: '',     // Consider how to handle this
    });
    const [editStudentId, setEditStudentId] = useState(null);
    const [editFormData, setEditFormData] = useState({}); // To be populated

    useEffect(() => {
        fetch('http://localhost:5000/admin/students')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setStudents(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, []);

    const handleAddStudent = () => {
        setIsAdding(true);
        setAddFormData({
            student_id: '',
            email: '',
            password: '',
            first_name: '',
            middle_name: '',
            last_name: '',
            suffix: '',
            gender: 'Other',
            birthday: '',
            birthplace: '',
            civil_status: 'Single',
            citizenship: '',
            religion: '',
            phone: '',
            address: '',
            emergency_contact_name: '',
            emergency_contact_relationship: '',
            emergency_contact_phone: '',
            enrollment_status: 'Enrolled',
            profile_picture: '',
            face_data: '',
        });
    };

    const handleAddFormChange = (e) => {
        setAddFormData({ ...addFormData, [e.target.name]: e.target.value });
    };

    const handleSaveNewStudent = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/admin/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(addFormData),
            });

            if (response.ok) {
                const newStudent = await response.json();
                setStudents([...students, newStudent]); // Assuming the server returns the new student data
                setIsAdding(false);
                setAddFormData({});
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to add student');
            }
        } catch (error) {
            console.error('Error adding student:', error);
            setError('Failed to connect to the server');
        }
    };

    const handleCancelAdd = () => {
        setIsAdding(false);
    };

    const handleEditClick = (student) => {
        setEditStudentId(student.student_id);
        setEditFormData({ ...student }); // Populate with existing student data
    };

    const handleEditFormChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleSaveEdit = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/admin/students/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editFormData),
            });

            if (response.ok) {
                const updatedStudents = students.map(s =>
                    s.student_id === id ? { ...s, ...editFormData } : s
                );
                setStudents(updatedStudents);
                setEditStudentId(null);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to update student');
            }
        } catch (error) {
            console.error('Error updating student:', error);
            setError('Failed to connect to the server');
        }
    };

    const handleCancelEdit = () => {
        setEditStudentId(null);
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                const response = await fetch(`http://localhost:5000/admin/students/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setStudents(students.filter(student => student.student_id !== id));
                } else {
                    const errorData = await response.json();
                    setError(errorData.message || 'Failed to delete student');
                }
            } catch (error) {
                console.error('Error deleting student:', error);
                setError('Failed to connect to the server');
            }
        }
    };

    if (loading) {
        return <div>Loading students...</div>;
    }

    if (error) {
        return <div>Error loading students: {error.message}</div>;
    }

    return (
        <div className="container mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Manage Students</h2>

            <div className="mb-4">
                {!isAdding && (
                    <button onClick={handleAddStudent} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Add Enrolled Student
                    </button>
                )}
                {isAdding && (
                    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mt-4">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Add New Student</h3>
                        <form onSubmit={handleSaveNewStudent} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="student_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Student ID</label>
                                <input type="number" name="student_id" id="student_id" value={addFormData.student_id} onChange={handleAddFormChange} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" required />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                                <input type="email" name="email" id="email" value={addFormData.email} onChange={handleAddFormChange} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" required />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                                <input type="password" name="password" id="password" value={addFormData.password} onChange={handleAddFormChange} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" required />
                            </div>
                            <div>
                                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                                <input type="text" name="first_name" id="first_name" value={addFormData.first_name} onChange={handleAddFormChange} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" required />
                            </div>
                            <div>
                                <label htmlFor="middle_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Middle Name</label>
                                <input type="text" name="middle_name" id="middle_name" value={addFormData.middle_name} onChange={handleAddFormChange} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" />
                            </div>
                            <div>
                                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                                <input type="text" name="last_name" id="last_name" value={addFormData.last_name} onChange={handleAddFormChange} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600dark:text-gray-300" required />
                            </div>
                            <div>
                                <label htmlFor="suffix" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Suffix</label>
                                <input type="text" name="suffix" id="suffix" value={addFormData.suffix} onChange={handleAddFormChange} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" />
                            </div>
                            <div>
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
                                <select name="gender" id="gender" value={addFormData.gender} onChange={handleAddFormChange} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="birthday" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Birthday</label>
                                <input type="date" name="birthday" id="birthday" value={addFormData.birthday} onChange={handleAddFormChange} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" />
                            </div>
                            <div>
                                <label htmlFor="birthplace" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Birthplace</label>
                                <input type="text" name="birthplace" id="birthplace" value={addFormData.birthplace} onChange={handleAddFormChange} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" />
                            </div>
                            <div>
                                <label htmlFor="civil_status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Civil Status</label>
                                <select name="civil_status" id="civil_status" value={addFormData.civil_status} onChange={handleAddFormChange} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="Widowed">Widowed</option>
                                    <option value="Separated">Separated</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="citizenship" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Citizenship</label>
                                <input type="text" name="citizenship" id="citizenship" value={addFormData.citizenship} onChange={handleAddFormChange} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" />
                            </div>
                            <div>
                                <label htmlFor="religion" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Religion</label>
                                <input type="text" name="religion" id="religion" value={addFormData.religion} onChange={handleAddFormChange} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                                <input type="tel" name="phone" id="phone" value={addFormData.phone} onChange={handleAddFormChange} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" />
                            </div>
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                                <textarea name="address" id="address" rows="2" value={addFormData.address} onChange={handleAddFormChange} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"></textarea>
                            </div>
                            <div>
                                <label htmlFor="emergency_contact_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Emergency Contact Name</label>
                                <input type="text" name="emergency_contact_name" id="emergency_contact_name" value={addFormData.emergency_contact_name} onChange={handleAddFormChange} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" />
                            </div>
                            <div>
                                <label htmlFor="emergency_contact_relationship" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Emergency Contact Relationship</label>
                                <input type="text" name="emergency_contact_relationship" id="emergency_contact_relationship" value={addFormData.emergency_contact_relationship} onChange={handleAddFormChange} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" />
                            </div>
                            <div>
                                <label htmlFor="emergency_contact_phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Emergency Contact Phone</label>
                                <input type="tel" name="emergency_contact_phone" id="emergency_contact_phone" value={addFormData.emergency_contact_phone} onChange={handleAddFormChange} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" />
                            </div>
                            <div>
                                <label htmlFor="enrollment_status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Enrollment Status</label>
                                <select name="enrollment_status" id="enrollment_status" value={addFormData.enrollment_status} onChange={handleAddFormChange} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                                    <option value="Enrolled">Enrolled</option>
                                    <option value="Leave">Leave</option>
                                    <option value="Graduated">Graduated</option>
                                    <option value="Dropped">Dropped</option>
                                </select>
                            </div>
                            {/* Consider how to handle profile_picture and face_data (e.g., file uploads) */}
                            <div className="col-span-full">
                                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2">
                                    Save New Student
                                </button>
                                <button type="button" onClick={handleCancelAdd} className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-700 shadow-md rounded-lg">
                    <thead className="bg-gray-100 dark:bg-gray-600">
                        <tr>
                            <th className="py-2 px-4 border-b text-left text-gray-600 dark:text-gray-300">ID</th>
                            <th className="py-2 px-4 border-b text-left text-gray-600 dark:text-gray-300">Email</th>
                            <th className="py-2 px-4 border-b text-left text-gray-600 dark:text-gray-300">Name</th>
                            <th className="py-2 px-4 border-b text-left text-gray-600 dark:text-gray-300">Enrollment Status</th>
                            <th className="py-2 px-4 border-b text-left text-gray-600 dark:text-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => (
                            <tr key={student.student_id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="py-2 px-4 border-b text-gray-700 dark:text-gray-300">{student.student_id}</td>
                                <td className="py-2 px-4 border-b text-gray-700 dark:text-gray-300">{student.email}</td>
                                <td className="py-2 px-4 border-b text-gray-700 dark:text-gray-300">{student.first_name} {student.middle_name && `${student.middle_name} `}{student.last_name} {student.suffix}</td>
                                <td className="py-2 px-4 border-b text-gray-700 dark:text-gray-300">{student.enrollment_status}</td>
                                <td className="py-2 px-4 border-b">
                                    {editStudentId === student.student_id ? (
                                        <>
                                            {/* Implement Edit Form here - similar to Add Form but pre-filled */}
                                            <button
                                                onClick={() => handleSaveEdit(student.student_id)}
                                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-1 px-2 rounded"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleEditClick(student)}
                                                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(student.student_id)}
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageStudents;