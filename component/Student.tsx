'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useCustomContext } from './Context';

export default function Student() {
  const [name, setName] = useState('');
  const [uniqueID, setUniqueID] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const { setAlertMessage } = useCustomContext();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/auth/students',
        { name, uniqueID, password, department, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAlertMessage('User created successfully', 'success');
    } catch (error: any) {
      setAlertMessage(error.response?.data?.message || 'Server error', 'error');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Add New User</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Unique ID (e.g., 21900631BJ)"
          value={uniqueID}
          onChange={(e) => setUniqueID(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value as 'student' | 'admin')}>
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add User
        </button>
      </form>
    </div>
  );
}