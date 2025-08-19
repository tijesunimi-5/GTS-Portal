'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCustomContext } from '@/component/Context';
import Link from 'next/link';

interface LinkItem {
  id: string;
  title: string;
  date: string;
  url: string;
}

export default function Dashboard() {
  const { user, setUser, setAlertMessage } = useCustomContext();
  const router = useRouter();
  const [links, setLinks] = useState<LinkItem[]>([]); // New state to hold fetched links
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setAlertMessage('Logged out successfully', 'success');
    router.push('/');
  };

  const fetchLinks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/links');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data: LinkItem[] = await res.json();
      setLinks(data);
    } catch (error) {
      console.error('Failed to fetch links:', error);
      setAlertMessage('Failed to load links.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch links when the component mounts
    fetchLinks();
  }, []);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2196F3]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen px-4 pt-16 pb-12 bg-gray-100 xl:mx-auto xl:max-w-7xl">
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
      {isLoading ? (
        <p className="text-center text-gray-500">Loading links...</p>
      ) : links.length === 0 ? (
        <p className="text-center text-gray-500">No tests available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {links.map((link) => (
            <div
              key={link.id}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{link.title}</h3>
              <p className="text-gray-500 text-sm mb-4">{link.date}</p>
              <div className="text-right">
                <Link
                  href={link.url}
                  className="inline-block bg-[#2196F3] text-white font-bold py-2 px-4 rounded-md hover:bg-[#1565C0] transition-colors"
                >
                  Go to Test
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}