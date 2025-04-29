// src/components/admin/StudentManagement.jsx
"use client"

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newStudent, setNewStudent] = useState({
    student_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    password: '', // Consider not including password in initial state for security
    program: '',
    year_level: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem("qcu_admin_token");
    try {
      const response = await fetch("http://localhost:5000/admin/students", {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      console.error("Error fetching students:", err);
      setError('Failed to fetch students.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const token = localStorage.getItem("qcu_admin_token");
    try {
      const response = await fetch("http://localhost:5000/admin/students", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newStudent),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);}
        fetchStudents();
        setIsAdding(false);
        setNewStudent({
          student_id: '',
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          address: '',
          password: '',
          program: '',
          year_level: '',
        });
      } catch (err) {
        console.error("Error adding student:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    const handleStartEdit = (student) => {
      setEditingStudent({ ...student });
      setIsEditing(true);
    };
  
    const handleEditInputChange = (e) => {
      setEditingStudent({ ...editingStudent, [e.target.name]: e.target.value });
    };
  
    const handleUpdateStudent = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');
      const token = localStorage.getItem("qcu_admin_token");
      try {
        const response = await fetch(`http://localhost:5000/admin/students/${editingStudent.student_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(editingStudent),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        fetchStudents();
        setIsEditing(false);
        setEditingStudent(null);
      } catch (err) {
        console.error("Error updating student:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    const handleCancelEdit = () => {
      setIsEditing(false);
      setEditingStudent(null);
    };
  
    const handleDeleteStudent = async (studentId) => {
      if (window.confirm("Are you sure you want to delete this student?")) {
        setLoading(true);
        setError('');
        const token = localStorage.getItem("qcu_admin_token");
        try {
          const response = await fetch(`http://localhost:5000/admin/students/${studentId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
          }
          fetchStudents();
        } catch (err) {
          console.error("Error deleting student:", err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };
  
    if (loading) return <div>Loading students...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
  
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Student Management</h2>
          <button
            onClick={() => setIsAdding(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            <Plus className="h-4 w-4 mr-2 inline-block" /> Add Student
          </button>
        </div>
  
        {isAdding && (
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Add New Student</h3>
            <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label htmlFor="student_id" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Student ID:</label>
                <input type="text" id="student_id" name="student_id" value={newStudent.student_id} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
              </div>
              <div>
                <label htmlFor="first_name" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">First Name:</label>
                <input type="text" id="first_name" name="first_name" value={newStudent.first_name} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
              </div>
              <div>
                <label htmlFor="last_name" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Last Name:</label>
                <input type="text" id="last_name" name="last_name" value={newStudent.last_name} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Email:</label>
                <input type="email" id="email" name="email" value={newStudent.email} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
              </div>
              <div>
                <label htmlFor="phone" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Phone:</label>
                <input type="tel" id="phone" name="phone" value={newStudent.phone} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label htmlFor="address" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Address:</label>
                <input type="text" id="address" name="address" value={newStudent.address} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Password:</label>
                <input type="password" id="password" name="password" value={newStudent.password} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
              </div>
              <div>
                <label htmlFor="program" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Program:</label>
                <input type="text" id="program" name="program" value={newStudent.program} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
              </div>
              <div>
                <label htmlFor="year_level" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Year Level:</label>
                <input type="number" id="year_level" name="year_level" value={newStudent.year_level} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
              </div>
              <div className="col-span-full flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  {loading ? 'Adding...' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        )}
  
        {isEditing && editingStudent && (
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Edit Student</h3>
            <form onSubmit={handleUpdateStudent} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label htmlFor="edit_student_id" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Student ID:</label>
                <input type="text" id="edit_student_id" name="student_id" value={editingStudent.student_id} onChange={handleEditInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" readOnly />
              </div>
              <div>
                <label htmlFor="edit_first_name" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">First Name:</label>
                <input type="text" id="edit_first_name" name="first_name" value={editingStudent.first_name} onChange={handleEditInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
              </div>
              <div>
                <label htmlFor="edit_last_name" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Last Name:</label>
                <input type="text" id="edit_last_name" name="last_name" value={editingStudent.last_name} onChange={handleEditInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
              </div>
              <div>
                <label htmlFor="edit_email" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Email:</label>
                <input type="email" id="edit_email" name="email" value={editingStudent.email} onChange={handleEditInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
              </div>
              <div>
                <label htmlFor="edit_phone" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Phone:</label>
                <input type="tel" id="edit_phone" name="phone" value={editingStudent.phone} onChange={handleEditInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label htmlFor="edit_address" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Address:</label>
                <input type="text" id="edit_address" name="address" value={editingStudent.address} onChange={handleEditInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label htmlFor="edit_program" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Program:</label>
                <input type="text" id="edit_program" name="program" value={editingStudent.program} onChange={handleEditInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
              </div>
              <div>
                <label htmlFor="edit_year_level" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Year Level:</label>
                <input type="number" id="edit_year_level" name="year_level" value={editingStudent.year_level} onChange={handleEditInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
              </div>
              <div className="col-span-full flex justify-end">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  {loading ? 'Updating...' : 'Update Student'}
                </button>
              </div>
            </form>
          </div>
        )}
  
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Current Students</h3>
          {students.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No students found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400uppercase tracking-wider">Student ID</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">First Name</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Name</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Email</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Phone</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Program</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Year</th>
                  <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {students.map(student => (
                  <tr key={student.student_id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                    <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{student.student_id}</td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{student.first_name}</td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{student.last_name}</td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 hidden md:table-cell">{student.email}</td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 hidden lg:table-cell">{student.phone || 'N/A'}</td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 hidden lg:table-cell">{student.program}</td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{student.year_level}</td>
                    <td className="py-4 px-6 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleStartEdit(student)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-600 mr-2"
                      >
                        <Edit className="h-4 w-4 inline-block" />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student.student_id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-600"
                      >
                        <Trash className="h-4 w-4 inline-block" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentManagement;