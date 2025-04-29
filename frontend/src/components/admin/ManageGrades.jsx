import React, { useState, useEffect } from 'react';

const ManageGrades = () => {
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editGradeId, setEditGradeId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        midterm: '',
        finals: '',
        final_grade: '',
        remarks: '',
        instructor_id: '',
    });

    useEffect(() => {
        fetch('http://localhost:5000/admin/grades')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setGrades(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, []);

    const handleEditClick = (grade) => {
        setEditGradeId(grade.id);
        setEditFormData({
            midterm: grade.midterm,
            finals: grade.finals,
            final_grade: grade.final_grade,
            remarks: grade.remarks,
            instructor_id: grade.instructor_id,
        });
    };

    const handleEditFormChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleSaveEdit = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/admin/grades/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editFormData),
            });

            if (response.ok) {
                const updatedGrades = grades.map(grade =>
                    grade.id === id ? { ...grade, ...editFormData } : grade
                );
                setGrades(updatedGrades);
                setEditGradeId(null);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to update grade');
            }
        } catch (error) {
            console.error('Error updating grade:', error);
            setError('Failed to connect to the server');
        }
    };

    const handleCancelEdit = () => {
        setEditGradeId(null);
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('Are you sure you want to delete this grade?')) {
            try {
                const response = await fetch(`http://localhost:5000/admin/grades/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setGrades(grades.filter(grade => grade.id !== id));
                } else {
                    const errorData = await response.json();
                    setError(errorData.message || 'Failed to delete grade');
                }
            } catch (error) {
                console.error('Error deleting grade:', error);
                setError('Failed to connect to the server');
            }
        }
    };

    if (loading) {
        return <div>Loading grades...</div>;
    }

    if (error) {
        return <div>Error loading grades: {error.message}</div>;
    }

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Manage Grades</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-700 shadow-md rounded-lg">
                    <thead className="bg-gray-100 dark:bg-gray-600">
                        <tr>
                            <th className="py-2 px-4 border-b text-left text-gray-600 dark:text-gray-300">ID</th>
                            <th className="py-2 px-4 border-b text-left text-gray-600 dark:text-gray-300">Student ID</th>
                            <th className="py-2 px-4 border-b text-left text-gray-600 dark:text-gray-300">Student Name</th>
                            <th className="py-2 px-4 border-b text-left text-gray-600 dark:text-gray-300">Subject Code</th>
                            <th className="py-2 px-4 border-b text-left text-gray-600 dark:text-gray-300">Subject Title</th>
                            <th className="py-2 px-4 border-b text-left text-gray-600 dark:text-gray-300">Midterm</th>
                            <th className="py-2 px-4 border-b text-left text-gray-600 dark:text-gray-300">Finals</th>
                            <th className="py-2 px-4 border-b text-left text-gray-600 dark:text-gray-300">Final Grade</th>
                            <th className="py-2 px-4 border-b text-left text-gray-600 dark:text-gray-300">Remarks</th>
                            <th className="py-2 px-4 border-b text-left text-gray-600 dark:text-gray-300">Instructor ID</th>
                            <th className="py-2 px-4 border-b text-left text-gray-600 dark:text-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {grades.map(grade => (
                            <tr key={grade.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="py-2 px-4 border-b text-gray-700 dark:text-gray-300">{grade.id}</td>
                                <td className="py-2 px-4 border-b text-gray-700 dark:text-gray-300">{grade.student_id}</td>
                                <td className="py-2 px-4 border-b text-gray-700 dark:text-gray-300">{grade.first_name} {grade.last_name}</td>
                                <td className="py-2 px-4 border-b text-gray-700 dark:text-gray-300">{grade.subject_code}</td>
                                <td className="py-2 px-4 border-b text-gray-700 dark:text-gray-300">{grade.subject_title}</td>
                                {editGradeId === grade.id ? (
                                    <>
                                        <td className="py-2 px-4 border-b">
                                            <input
                                                type="text"
                                                name="midterm"
                                                value={editFormData.midterm}
                                                onChange={handleEditFormChange}
                                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <input
                                                type="text"
                                                name="finals"
                                                value={editFormData.finals}
                                                onChange={handleEditFormChange}
                                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <input
                                                type="text"
                                                name="final_grade"
                                                value={editFormData.final_grade}
                                                onChange={handleEditFormChange}
                                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <input
                                                type="text"
                                                name="remarks"
                                                value={editFormData.remarks}
                                                onChange={handleEditFormChange}
                                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <input
                                                type="text"
                                                name="instructor_id"
                                                value={editFormData.instructor_id}
                                                onChange={handleEditFormChange}
                                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <button
                                                onClick={() => handleSaveEdit(grade.id)}
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
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="py-2 px-4 border-b text-gray-700 dark:text-gray-300">{grade.midterm}</td>
                                        <td className="py-2 px-4 border-b text-gray-700 dark:text-gray-300">{grade.finals}</td>
                                        <td className="py-2 px-4 border-b text-gray-700 dark:text-gray-300">{grade.final_grade}</td>
                                        <td className="py-2 px-4 border-b text-gray-700 dark:text-gray-300">{grade.remarks}</td>
                                        <td className="py-2 px-4 border-b text-gray-700 dark:text-gray-300">{grade.instructor_id}</td>
                                        <td className="py-2 px-4 border-b">
                                            <button
                                                onClick={() => handleEditClick(grade)}
                                                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(grade.id)}
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageGrades;