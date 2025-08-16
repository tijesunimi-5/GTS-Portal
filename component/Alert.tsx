'use client';
import React from 'react';
import { useCustomContext } from './Context';

const Alert = () => {
  const { alertMessage } = useCustomContext();

  if (!alertMessage) return null;

  const { message, type } = alertMessage;

  const backgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'loading':
        return 'bg-blue-500';
      case 'info':
      default:
        return 'bg-amber-600';
    }
  };

  return (
    <div className={`fixed w-full left-0 top-16 z-40 px-4 py-3 text-white font-semibold text-center ${backgroundColor()}`}>
      {message}
    </div>
  );
};

export default Alert;
