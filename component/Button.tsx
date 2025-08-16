import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  styles?: string;
}

const Button: React.FC<ButtonProps> = ({ children, styles, ...props }) => {
  return (
    <button
      {...props}
      className={`bg-white text-[#2196F3] px-4 py-2 rounded-md hover:bg-gray-100 transition-colors ${styles}`}
      disabled={props.disabled}
    >
      {children}
    </button>
  );
};

export default Button;