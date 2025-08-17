'use client';
import React, { useRef, useState } from 'react';
import Button from '@/component/Button';
import { useCustomContext } from '@/component/Context';
import { useRouter } from 'next/navigation';

const Auth = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoginMode, setIsLoginMode] = useState<boolean>(false);
  const registrationNumberRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const { setUser, setAlertMessage } = useCustomContext();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const uniqueID = registrationNumberRef.current?.value.trim().toUpperCase();
    const password = passwordRef.current?.value;

    if (!uniqueID || !password) {
      setAlertMessage('Please fill in all fields', 'error');
      setIsLoading(false);
      return;
    }

    // if (!/^[A-Z0-9]{10}$/.test(uniqueID)) {
    //   setAlertMessage('Unique ID must be 10 characters (e.g., 21900631BJ)', 'error');
    //   setIsLoading(false);
    //   return;
    // }

    if (password.length < 6) {
      setAlertMessage('Password must be at least 6 characters', 'error');
      setIsLoading(false);
      return;
    }

    const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/signup';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uniqueID, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      setAlertMessage(
        isLoginMode ? 'Login successful!' : 'Account created successfully!',
        'success'
      );
      router.push('/dashboard');
    } catch (error: any) {
      const errorMessage = error.message || 'Server error';
      setAlertMessage(errorMessage, 'error');
      console.error('API error:', errorMessage, error);
    }

    setIsLoading(false);
  };

  return (
    <div className="center rounded shadow mx-3 flex justify-center flex-col items-center bg-[#2196F3] mt-[200px]">
      <h1 className="text-2xl font-bold text-white py-3">
        {isLoginMode ? 'Student Login' : 'Student Registration'}
      </h1>

      <form className="bg-[#2196F3] mx-2 pb-3 flex flex-col justify-center" onSubmit={handleSubmit}>
        <div className="inputbox md:w-[470px] mt-3">
          <input
            required
            type="text"
            ref={registrationNumberRef}
            className="text-black"
            disabled={isLoading}
          />
          <span>Registration number</span>
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
        <p className="text-white my-4">
          {isLoginMode ? "Haven't registered?" : 'Already registered?'}{' '}
          <b
            className="underline cursor-pointer"
            onClick={() => setIsLoginMode(!isLoginMode)}
          >
            {isLoginMode ? 'Register here!' : 'Sign In!'}
          </b>
        </p>
        <Button type="submit" disabled={isLoading} styles="mt-4">
          {isLoading
            ? isLoginMode
              ? 'Signing In...'
              : 'Creating...'
            : isLoginMode
              ? 'Sign In'
              : 'Create Account'}
        </Button>
      </form>
    </div>
  );
};

export default Auth;
