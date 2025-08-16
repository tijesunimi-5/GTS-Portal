'use client';
import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/component/Button'; // Replace with your actual button component
import { useCustomContext } from '@/component/Context';

const AdminLogin = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { setUser, setAlertMessage } = useCustomContext(); // You can rename setStudent → setUser for generality

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const email = emailRef.current?.value.trim();
    const password = passwordRef.current?.value;

    if (!email || !password) {
      setAlertMessage('Please fill in all fields', 'error');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const user = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: 'admin' as 'admin',
      };

      localStorage.setItem('user', JSON.stringify(user));
      setUser(user); // Or setAdmin if you're separating admin/student in context
      setAlertMessage('Admin login successful', 'success');
      router.push('/admin');
    } catch (error: any) {
      setAlertMessage(error.message || 'Something went wrong', 'error');
      console.error('Admin login error:', error);
    }

    setIsLoading(false);
  };

  return (
    <div className="center rounded shadow mx-3 flex justify-center flex-col items-center bg-[#333] mt-[200px] pb-1">
      <h1 className="text-2xl font-bold text-white py-3">Admin Login</h1>
      <form className="bg-[#2196F3] mx-2 pb-3 flex flex-col justify-center" onSubmit={handleSubmit}>
        <div className="inputbox md:w-[470px] mt-3">
          <input
            required
            type="email"
            ref={emailRef}
            className="text-black"
            disabled={isLoading}
          />
          <span>Email</span>
          <i></i>
        </div>
        <div className="inputbox md:w-[470px] mt-2">
          <input
            required
            type="password"
            ref={passwordRef}
            className="text-black"
            disabled={isLoading}
          />
          <span>Password</span>
          <i></i>
        </div>

        <Button type="submit" disabled={isLoading} styles="mt-4">
          {isLoading ? 'Signing In...' : 'Login as Admin'}
        </Button>
      </form>
    </div>
  );
};

export default AdminLogin;
