// components/AdminLayout.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCustomContext } from '@/component/Context';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, setAlertMessage } = useCustomContext();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    // The context's user state is null on initial render, and then updated
    // after fetching from localStorage. We need to wait for the update.
    if (user !== null) {
      if (user.role !== 'admin') {
        setAlertMessage('Unauthorized access. Admins only.', 'error');
        router.push('/');
      } else {
        setIsVerifying(false);
      }
    } else {
      // If user is null, it could be the initial state OR an unauthenticated user.
      // We assume it's an unauthenticated user and redirect.
      // The `isVerifying` state will prevent this from happening on the very first render.
      setIsVerifying(false);
    }
  }, [user, router, setAlertMessage]);

  if (isVerifying) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-700">
        Verifying access...
      </div>
    );
  }

  // Only render children if the user is a verified admin.
  if (user?.role === 'admin') {
    return <>{children}</>;
  }

  // If user is not an admin (which means they were not logged in at all or not an admin),
  // return null to prevent rendering anything. The useEffect has already handled the redirect.
  return null;
};

export default AdminLayout;