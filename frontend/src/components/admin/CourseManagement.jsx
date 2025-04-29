// src/components/admin/CourseManagement.jsx
"use client"

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newCourse, setNewCourse] = useState({
    subject_code: '',
    subject_title: '',
    units: '',
    instructor_id: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem("qcu_admin_token");
    try {
      const response = await fetch("http://localhost:5000/admin/courses", {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCourses(data);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError('Failed to fetch courses.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const token = localStorage.getItem("qcu_admin_token");
    try {
      const response = await fetch("http://localhost:5000/admin/courses", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newCourse),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      fetchCourses();
      setIsAdding(false);
      setNewCourse({ subject_code: '', subject_title: '', units: '', instructor_id: '' });
    } catch (err) {
      console.error("Error adding course:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (course) => {
    setEditingCourse({ ...course });
    setIsEditing(true);
  };

  const handleEditInputChange = (e) => {
    setEditingCourse({ ...editingCourse, [e.target.name]: e.target.value });
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const token = localStorage.getItem("qcu_admin_token");
    try {
      const response = await fetch(`http://localhost:5000/admin/courses/${editingCourse.course_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editingCourse),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      fetchCourses();
      setIsEditing(false);
      setEditingCourse(null);
    } catch (err) {
      console.error("Error updating course:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingCourse(null);
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      setLoading(true);
      setError('');
      const token = localStorage.getItem("qcu_admin_token");
      try {
        const response = await fetch(`http://localhost:5000/admin/courses/${courseId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        fetchCourses();
      } catch (err) {
        console.error("Error deleting course:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Course Management</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          <Plus className="h-4 w-4 mr-2 inline-block" /> Add Course
        </button>
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Add New Course</h3>
          <form onSubmit={handleAddCourse} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="subject_code" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Subject Code:</label>
              <input type="text" id="subject_code" name="subject_code" value={newCourse.subject_code} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
            </div>
            <div>
              <label htmlFor="subject_title" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Subject Title:</label>
              <input type="text" id="subject_title" name="subject_title" value={newCourse.subject_title} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
            </div>
            <div>
              <label htmlFor="units" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Units:</label>
              <input type="number" id="units" name="units" value={newCourse.units} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
            </div>
            <div>
              <label htmlFor="instructor_id" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Instructor ID (Optional):</label>
              <input type="text" id="instructor_id" name="instructor_id" value={newCourse.instructor_id} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
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
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {loading ? 'Adding...' : 'Add Course'}
              </button>
            </div>
          </form>
        </div>
      )}

      {isEditing && editingCourse && (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Edit Course</h3>
          <form onSubmit={handleUpdateCourse} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit_subject_code" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Subject Code:</label>
              <input type="text" id="edit_subject_code" name="subject_code" value={editingCourse.subject_code} onChange={handleEditInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
            </div>
            <div>
              <label htmlFor="edit_subject_title" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Subject Title:</label>
              <input type="text" id="edit_subject_title" name="subject_title" value={editingCourse.subject_title} onChange={handleEditInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
            </div>
            <div>
              <label htmlFor="edit_units" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Units:</label>
              <input type="number" id="edit_units" name="units" value={editingCourse.units} onChange={handleEditInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
            </div>
            <div>
              <label htmlFor="edit_instructor_id" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Instructor ID (Optional):</label>
              <input type="text" id="edit_instructor_id" name="instructor_id" value={editingCourse.instructor_id} onChange={handleEditInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
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
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {loading ? 'Updating...' : 'Update Course'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Code</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Units</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Instructor ID</th>
              <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {courses.map(course => (
              <tr key={course.course_id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{course.subject_code}</td>
                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{course.subject_title}</td>
                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{course.units}</td>
                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 hidden md:table-cell">{course.instructor_id || 'N/A'}</td>
                <td className="py-4 px-6 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleStartEdit(course)}
                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-600 mr-2"
                  >
                    <Edit className="h-4 w-4 inline-block" />
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course.course_id)}
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
    </div>
  );
};

export default CourseManagement;