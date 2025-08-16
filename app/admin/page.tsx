// app/admin/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useCustomContext } from '@/component/Context';
import Button from '@/component/Button';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/component/AdminLayout';

interface Student {
  id: string;
  name: string;
  department: string;
  uniqueID: string;
}

interface LinkItem {
  id?: string;
  title: string;
  date: string;
  url: string;
}

const AdminDashboard = () => {
  const { user, setAlertMessage } = useCustomContext();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [link, setLink] = useState<LinkItem>({ title: '', date: '', url: '' });
  const [newStudent, setNewStudent] = useState<Omit<Student, 'id'>>({ name: '', department: '', uniqueID: '' });
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Do NOT use useRouter or the redirect useEffect here.
  // The redirection logic is now handled by AdminLayout.
  // const router = useRouter();
  // useEffect(() => { ... }, [...]); 

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/students');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data: Student[] = await res.json();
      setStudents(data);
      setFilteredStudents(data);
    } catch (error) {
      console.error('Failed to fetch students:', error);
      setAlertMessage('Could not load student data. Please try again later.', 'error');
      setStudents([]);
      setFilteredStudents([]);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const filtered = students.filter((student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.uniqueID.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/links/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(link),
      });

      if (!res.ok) {
        throw new Error('Failed to add link');
      }
      const data = await res.json();
      setAlertMessage(data.message || 'Link added successfully!', 'success');
      setLink({ title: '', date: '', url: '' });
    } catch (error: any) {
      setAlertMessage(error.message || 'Failed to add link.', 'error');
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add student.');
      }
      const data = await res.json();
      setAlertMessage(data.message || 'Student added successfully!', 'success');
      setNewStudent({ name: '', department: '', uniqueID: '' });
      fetchStudents();
    } catch (error: any) {
      setAlertMessage(error.message || 'Failed to add student.', 'error');
    }
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    try {
      const res = await fetch(`/api/students/${editingStudent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingStudent),
      });

      if (!res.ok) {
        throw new Error('Failed to update student.');
      }
      const data = await res.json();
      setAlertMessage(data.message || 'Student updated successfully!', 'success');
      setEditingStudent(null);
      fetchStudents();
    } catch (error: any) {
      setAlertMessage(error.message || 'Failed to update student.', 'error');
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return;
    }
    try {
      const res = await fetch(`/api/students/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete student.');
      }
      const data = await res.json();
      setAlertMessage(data.message || 'Student deleted successfully!', 'success');
      fetchStudents();
    } catch (error: any) {
      setAlertMessage(error.message || 'Failed to delete student.', 'error');
    }
  };

  return (
    <AdminLayout>
      <div className="p-5 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-extrabold text-[#2196F3] mb-6 text-center">Admin Dashboard</h1>

          {/* Admin Info */}
          <div className="mb-8 p-6 bg-white rounded-lg shadow-md border-t-4 border-[#2196F3]">
            <p className="text-gray-700"><b>Name:</b> {user?.name}</p>
            <p className="text-gray-700"><b>Email:</b> {(user as any)?.email}</p>
            <p className="text-gray-700"><b>Role:</b> {user?.role}</p>
          </div>

          {/* Add Student & Link Forms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Add Student Form */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Student</h2>
              <form onSubmit={handleAddStudent} className="space-y-4">
                <input
                  type="text"
                  placeholder="Student Name"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Department"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
                  value={newStudent.department}
                  onChange={(e) => setNewStudent({ ...newStudent, department: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Unique ID"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
                  value={newStudent.uniqueID}
                  onChange={(e) => setNewStudent({ ...newStudent, uniqueID: e.target.value })}
                  required
                />
                <Button type="submit" className="w-full bg-[#2196F3] hover:bg-[#1565C0] text-white font-bold py-2 px-4 rounded transition-colors">
                  Add Student
                </Button>
              </form>
            </div>

            {/* Add Link Form */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Link</h2>
              <form onSubmit={handleAddLink} className="space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
                  value={link.title}
                  onChange={(e) => setLink({ ...link, title: e.target.value })}
                  required
                />
                <input
                  type="date"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
                  value={link.date}
                  onChange={(e) => setLink({ ...link, date: e.target.value })}
                  required
                />
                <input
                  type="url"
                  placeholder="Link URL"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
                  value={link.url}
                  onChange={(e) => setLink({ ...link, url: e.target.value })}
                  required
                />
                <Button type="submit" className="w-full bg-[#2196F3] hover:bg-[#1565C0] text-white font-bold py-2 px-4 rounded transition-colors">
                  Save Link
                </Button>
              </form>
            </div>
          </div>

          {/* Student List & Search */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Manage Students</h2>
            <div className="mb-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search students..."
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unique ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((s) => (
                      <tr key={s.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{s.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{s.department}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{s.uniqueID}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button
                            onClick={() => setEditingStudent(s)}
                            className="text-sm font-medium text-[#2196F3] hover:text-[#1565C0] mr-2"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDeleteStudent(s.id)}
                            className="text-sm font-medium text-red-600 hover:text-red-900"
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center py-4 text-gray-500">No students found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Edit Student Modal */}
          {editingStudent && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4">
              <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Edit Student</h2>
                <form onSubmit={handleUpdateStudent} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Student Name"
                    className="w-full p-2 border rounded"
                    value={editingStudent.name}
                    onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Department"
                    className="w-full p-2 border rounded"
                    value={editingStudent.department}
                    onChange={(e) => setEditingStudent({ ...editingStudent, department: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Unique ID"
                    className="w-full p-2 border rounded"
                    value={editingStudent.uniqueID}
                    onChange={(e) => setEditingStudent({ ...editingStudent, uniqueID: e.target.value })}
                    required
                  />
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      type="button"
                      onClick={() => setEditingStudent(null)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[#2196F3] hover:bg-[#1565C0] text-white font-bold py-2 px-4 rounded"
                    >
                      Save Changes
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;