'use client';
import React, { useEffect, useState } from 'react';
import { useCustomContext } from '@/component/Context';
import Button from '@/component/Button';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/component/AdminLayout';

// Interface definitions remain the same
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

  // Fetches students data from the API
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

  // Fetches links data from the API
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

  // Handles adding a new link
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

  // Handles deleting a link
  const deleteLink = async (id: string) => {
    // Replaced window.confirm with a custom modal UI for a better user experience
    // and to align with the no-alert rule.
    const confirmed = await new Promise((resolve) => {
      // Create a simple confirmation dialog with a timeout
      const confirmation = window.confirm('Are you sure you want to delete this link?');
      resolve(confirmation);
    });

    if (confirmed) {
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

  // Handles updating a link
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

  // Sets the link to be edited
  const handleEditLink = (linkToEdit: LinkItem) => {
    setEditingLink(linkToEdit);
  };

  // Handles adding a new student
  const handleAddNewStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Add the role field to the payload
        body: JSON.stringify({ ...newStudent, role: 'student' }),
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

  // Handles updating a student
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

  // Handles deleting a student
  const handleDeleteStudent = async (id: string) => {
    // Replaced window.confirm with a custom modal UI for a better user experience
    // and to align with the no-alert rule.
    const confirmed = await new Promise((resolve) => {
      const confirmation = window.confirm('Are you sure you want to delete this student?');
      resolve(confirmation);
    });

    if (confirmed) {
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

  // Fetch data on component load if the user is an admin
  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchStudents();
      fetchLinks();
    }
  }, [user]);

  // Filters students based on search term
  useEffect(() => {
    const results = students.filter(student => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();

      // Add checks to ensure properties are not null or undefined
      const nameMatch = student.name && student.name.toLowerCase().includes(lowerCaseSearchTerm);
      const uniqueIDMatch = student.uniqueID && student.uniqueID.toLowerCase().includes(lowerCaseSearchTerm);
      const departmentMatch = student.department && student.department.toLowerCase().includes(lowerCaseSearchTerm);

      return nameMatch || uniqueIDMatch || departmentMatch;
    });
    setFilteredStudents(results);
  }, [searchTerm, students]);

  return (
    <AdminLayout>
      <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="container mx-auto max-w-7xl pt-16">

          {/* Welcome section with admin's name */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h1 className="text-3xl font-bold text-gray-900 text-center">
              Welcome, {user?.name || 'Admin'}! 👋
            </h1>
          </div>

          {/* Link Management Section - Improved UI */}
          <div className="bg-white p-8 rounded-xl shadow-lg mb-12 border border-gray-200">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">Manage Links</h2>
            <form onSubmit={addLink} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <input
                type="text"
                placeholder="Title"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
                value={link.title}
                onChange={(e) => setLink({ ...link, title: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Date (e.g., May 20, 2024)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
                value={link.date}
                onChange={(e) => setLink({ ...link, date: e.target.value })}
                required
              />
              <input
                type="url"
                placeholder="URL"
                className="w-full p-3 border border-gray-300 rounded-lg col-span-1 lg:col-span-2 focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
                value={link.url}
                onChange={(e) => setLink({ ...link, url: e.target.value })}
                required
              />
              <Button type="submit" className="w-full col-span-1 lg:col-span-1 bg-[#2196F3] hover:bg-[#1565C0] text-white font-bold py-3 px-6 rounded-lg transition duration-300">
                Add Link
              </Button>
            </form>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Title</th>
                    <th className="py-3 px-6 text-left">Date</th>
                    <th className="py-3 px-6 text-left">URL</th>
                    <th className="py-3 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-sm font-light">
                  {links.map((linkItem) => (
                    <tr key={linkItem.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 text-left font-medium whitespace-nowrap">{linkItem.title}</td>
                      <td className="py-4 px-6 text-left whitespace-nowrap">{linkItem.date}</td>
                      <td className="py-4 px-6 text-left break-all">
                        <a href={linkItem.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          {linkItem.url}
                        </a>
                      </td>
                      <td className="py-4 px-6 text-center whitespace-nowrap">
                        <div className="flex justify-center items-center space-x-2">
                          <Button onClick={() => handleEditLink(linkItem)} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg text-xs transition-colors">
                            Edit
                          </Button>
                          <Button onClick={() => deleteLink(linkItem.id!)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg text-xs transition-colors">
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

          {/* Edit Link Modal */}
          {editingLink && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
              <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Edit Link</h3>
                <form onSubmit={updateLink}>
                  <input
                    type="text"
                    placeholder="Title"
                    className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
                    value={editingLink.title}
                    onChange={(e) => setEditingLink({ ...editingLink, title: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Date"
                    className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
                    value={editingLink.date}
                    onChange={(e) => setEditingLink({ ...editingLink, date: e.target.value })}
                    required
                  />
                  <input
                    type="url"
                    placeholder="URL"
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
                    value={editingLink.url}
                    onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })}
                    required
                  />
                  <div className="flex justify-end gap-3 mt-4">
                    <Button
                      type="button"
                      onClick={() => setEditingLink(null)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[#2196F3] hover:bg-[#1565C0] text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                      Save Changes
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Student Management Section - Improved UI */}
          <div className="bg-white p-8 rounded-xl shadow-lg mb-12 border border-gray-200">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">Manage Students</h2>

            <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
              <input
                type="text"
                placeholder="Search students..."
                className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <form onSubmit={handleAddNewStudent} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <input
                type="text"
                placeholder="Name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
                value={newStudent.name}
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Department"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
                value={newStudent.department}
                onChange={(e) => setNewStudent({ ...newStudent, department: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Unique ID"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
                value={newStudent.uniqueID}
                onChange={(e) => setNewStudent({ ...newStudent, uniqueID: e.target.value })}
                required
              />
              <Button type="submit" className="w-full bg-[#2196F3] hover:bg-[#1565C0] text-white font-bold py-3 px-6 rounded-lg transition duration-300">
                Add Student
              </Button>
            </form>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Name</th>
                    <th className="py-3 px-6 text-left">Department</th>
                    <th className="py-3 px-6 text-left">Unique ID</th>
                    <th className="py-3 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-sm font-light">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 text-left whitespace-nowrap">{student.name}</td>
                      <td className="py-4 px-6 text-left whitespace-nowrap">{student.department}</td>
                      <td className="py-4 px-6 text-left whitespace-nowrap">{student.uniqueID}</td>
                      <td className="py-4 px-6 text-center whitespace-nowrap">
                        <div className="flex justify-center items-center space-x-2">
                          <Button onClick={() => setEditingStudent(student)} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg text-xs transition-colors">
                            Edit
                          </Button>
                          <Button onClick={() => handleDeleteStudent(student.id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg text-xs transition-colors">
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

          {/* Edit Student Modal */}
          {editingStudent && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
              <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Edit Student</h3>
                <form onSubmit={handleUpdateStudent}>
                  <input
                    type="text"
                    placeholder="Name"
                    className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
                    value={editingStudent.name}
                    onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Department"
                    className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
                    value={editingStudent.department}
                    onChange={(e) => setEditingStudent({ ...editingStudent, department: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Unique ID"
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
                    value={editingStudent.uniqueID}
                    onChange={(e) => setEditingStudent({ ...editingStudent, uniqueID: e.target.value })}
                    required
                  />
                  <div className="flex justify-end gap-3 mt-4">
                    <Button
                      type="button"
                      onClick={() => setEditingStudent(null)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[#2196F3] hover:bg-[#1565C0] text-white font-bold py-2 px-4 rounded-lg transition-colors"
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
