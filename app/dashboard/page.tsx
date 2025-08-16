'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useCustomContext } from '@/component/Context';
import { Links } from '../../data/Links';
import Link from 'next/link';

export default function Dashboard() {
  const { user, setUser, setAlertMessage } = useCustomContext();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setAlertMessage('Logged out successfully', 'success');
    router.push('/');
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2196F3]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen px-4 pt-8 pb-12 bg-gray-100 xl:mx-auto xl:max-w-7xl">
      <div className="flex justify-between items-center mb-6 border-b-2 border-gray-300 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.name}</h1>
          <p className="text-lg text-gray-600">Department: {user.department}</p>
          <p className="text-lg text-gray-600">Unique ID: {user.uniqueID}</p>
          {user.role && <p className="text-lg text-gray-600">Role: {user.role}</p>}
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>

      <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">Available Tests</h2>
      {Links.length === 0 ? (
        <p className="text-center text-gray-500">No tests available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Links.map((link) => (
            <div
              key={link.id}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-800">{link.title}</h3>
              <Link
                href={link.link}
                className="text-[#2196F3] hover:underline text-sm"
              >
                Access {link.title}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}