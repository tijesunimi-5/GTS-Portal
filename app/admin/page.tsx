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
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [newStudent, setNewStudent] = useState<Omit<Student, 'id'>>({ name: '', department: '', uniqueID: '' });
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const router = useRouter();

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/students');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setStudents(data);
      setFilteredStudents(data);
      console.log(filteredStudents, 'filteredStudents');
    } catch (error) {
      console.error('Failed to fetch students:', error);
      setAlertMessage('Failed to fetch students.', 'error');
    }
  };

  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/links');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data: LinkItem[] = await res.json();
      setLinks(data);
    } catch (error) {
      console.error('Failed to fetch links:', error);
      setAlertMessage('Failed to fetch links.', 'error');
    }
  };

  const addLink = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(link),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      setAlertMessage('Link added successfully!', 'success');
      setLink({ title: '', date: '', url: '' });
      fetchLinks();
    } catch (error) {
      console.error('Failed to add link:', error);
      setAlertMessage('Failed to add link.', 'error');
    }
  };

  const deleteLink = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      try {
        const res = await fetch(`/api/links/${id}`, { method: 'DELETE' });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        setAlertMessage('Link deleted successfully!', 'success');
        fetchLinks();
      } catch (error) {
        console.error('Failed to delete link:', error);
        setAlertMessage('Failed to delete link.', 'error');
      }
    }
  };

  const updateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink || !editingLink.id) return;

    try {
      const res = await fetch(`/api/links/${editingLink.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingLink),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      setAlertMessage('Link updated successfully!', 'success');
      setEditingLink(null);
      fetchLinks();
    } catch (error) {
      console.error('Failed to update link:', error);
      setAlertMessage('Failed to update link.', 'error');
    }
  };

  const handleEditLink = (linkToEdit: LinkItem) => {
    setEditingLink(linkToEdit);
  };

  const handleAddNewStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      setAlertMessage('Student added successfully!', 'success');
      setNewStudent({ name: '', department: '', uniqueID: '' });
      fetchStudents();
    } catch (error) {
      console.error('Failed to add student:', error);
      setAlertMessage('Failed to add student.', 'error');
    }
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    console.log(editingStudent.uniqueID, 'id:', editingStudent.id)
    try {
      const res = await fetch(`/api/students/${editingStudent.id}`, { // Corrected line
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingStudent),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      setAlertMessage('Student updated successfully!', 'success');
      setEditingStudent(null);
      fetchStudents();
    } catch (error) {
      console.error('Failed to update student:', error);
      setAlertMessage('Failed to update student.', 'error');
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        setAlertMessage('Student deleted successfully!', 'success');
        fetchStudents();
      } catch (error) {
        console.error('Failed to delete student:', error);
        setAlertMessage('Failed to delete student.', 'error');
      }
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchStudents();
      fetchLinks();
    }
  }, [user]);

  useEffect(() => {
    const results = students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.uniqueID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(results);
  }, [searchTerm, students]);

  return (
    <AdminLayout>
      <div className="container mx-auto p-4 max-w-7xl pt-16">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Admin Dashboard</h1>

        {/* Link Management Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Manage Links</h2>
          <form onSubmit={addLink} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <input
              type="text"
              placeholder="Title"
              className="w-full p-2 border rounded"
              value={link.title}
              onChange={(e) => setLink({ ...link, title: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Date (e.g., May 20, 2024)"
              className="w-full p-2 border rounded"
              value={link.date}
              onChange={(e) => setLink({ ...link, date: e.target.value })}
              required
            />
            <input
              type="url"
              placeholder="URL"
              className="w-full p-2 border rounded col-span-1 md:col-span-2"
              value={link.url}
              onChange={(e) => setLink({ ...link, url: e.target.value })}
              required
            />
            <Button type="submit" className="w-full col-span-1 md:col-span-4 lg:col-span-1 bg-[#2196F3] hover:bg-[#1565C0] text-white font-bold py-2 px-4 rounded">
              Add Link
            </Button>
          </form>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-200 text-left text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Title</th>
                  <th className="py-3 px-6 text-left">Date</th>
                  <th className="py-3 px-6 text-left">URL</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {links.map((linkItem) => (
                  <tr key={linkItem.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left">{linkItem.title}</td>
                    <td className="py-3 px-6 text-left">{linkItem.date}</td>
                    <td className="py-3 px-6 text-left break-all">
                      <a href={linkItem.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {linkItem.url}
                      </a>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center space-x-2">
                        <Button onClick={() => handleEditLink(linkItem)} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded text-xs">
                          Edit
                        </Button>
                        <Button onClick={() => deleteLink(linkItem.id!)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-xs">
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {editingLink && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
              <h3 className="text-xl font-bold mb-4">Edit Link</h3>
              <form onSubmit={updateLink}>
                <input
                  type="text"
                  placeholder="Title"
                  className="w-full p-2 border rounded mb-2"
                  value={editingLink.title}
                  onChange={(e) => setEditingLink({ ...editingLink, title: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Date"
                  className="w-full p-2 border rounded mb-2"
                  value={editingLink.date}
                  onChange={(e) => setEditingLink({ ...editingLink, date: e.target.value })}
                  required
                />
                <input
                  type="url"
                  placeholder="URL"
                  className="w-full p-2 border rounded mb-2"
                  value={editingLink.url}
                  onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })}
                  required
                />
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    type="button"
                    onClick={() => setEditingLink(null)}
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

        {/* Student Management Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Manage Students</h2>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Search students..."
              className="w-full md:w-1/2 p-2 border rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <form onSubmit={handleAddNewStudent} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <input
              type="text"
              placeholder="Name"
              className="w-full p-2 border rounded"
              value={newStudent.name}
              onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Department"
              className="w-full p-2 border rounded"
              value={newStudent.department}
              onChange={(e) => setNewStudent({ ...newStudent, department: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Unique ID"
              className="w-full p-2 border rounded"
              value={newStudent.uniqueID}
              onChange={(e) => setNewStudent({ ...newStudent, uniqueID: e.target.value })}
              required
            />
            <Button type="submit" className="w-full bg-[#2196F3] hover:bg-[#1565C0] text-white font-bold py-2 px-4 rounded">
              Add Student
            </Button>
          </form>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-200 text-left text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Name</th>
                  <th className="py-3 px-6 text-left">Department</th>
                  <th className="py-3 px-6 text-left">Unique ID</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">{student.name}</td>
                    <td className="py-3 px-6 text-left whitespace-nowrap">{student.department}</td>
                    <td className="py-3 px-6 text-left whitespace-nowrap">{student.uniqueID}</td>
                    <td className="py-3 px-6 text-center whitespace-nowrap">
                      <div className="flex item-center justify-center space-x-2">
                        <Button onClick={() => setEditingStudent(student)} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded text-xs">
                          Edit
                        </Button>
                        <Button onClick={() => handleDeleteStudent(student.id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-xs">
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {editingStudent && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
              <h3 className="text-xl font-bold mb-4">Edit Student</h3>
              <form onSubmit={handleUpdateStudent}>
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full p-2 border rounded mb-2"
                  value={editingStudent.name}
                  onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Department"
                  className="w-full p-2 border rounded mb-2"
                  value={editingStudent.department}
                  onChange={(e) => setEditingStudent({ ...editingStudent, department: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Unique ID"
                  className="w-full p-2 border rounded mb-2"
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
    </AdminLayout>
  );
};

export default AdminDashboard;