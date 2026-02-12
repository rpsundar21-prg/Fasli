import React from 'react';
import { Loader2 } from 'lucide-react';

// --- Buttons ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'admin';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  isLoading,
  ...props 
}) => {
  const baseStyles = "w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 shadow-sm";
  
  const variants = {
    primary: "bg-green-600 hover:bg-green-700 text-white shadow-green-200",
    secondary: "bg-yellow-500 hover:bg-yellow-600 text-white shadow-yellow-200",
    outline: "border-2 border-green-600 text-green-700 hover:bg-green-50",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    admin: "bg-blue-700 hover:bg-blue-800 text-white shadow-blue-200"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
      {children}
    </button>
  );
};

// --- Inputs ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <input 
        ref={ref}
        className={`w-full px-4 py-3 rounded-lg border ${error ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
});
Input.displayName = "Input";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, className = '', ...props }) => {
    return (
        <div className="mb-4">
            {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
            <select
                className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white ${className}`}
                {...props}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    );
};


// --- Cards ---
export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', onClick, ...props }) => (
  <div 
    onClick={onClick}
    className={`bg-white p-4 rounded-xl shadow-md border border-gray-100 ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''} ${className}`}
    {...props}
  >
    {children}
  </div>
);

// --- Layout Wrapper ---
export const MobileLayout: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`min-h-screen max-w-md mx-auto bg-gray-50 flex flex-col relative overflow-hidden shadow-2xl ${className}`}>
    {children}
  </div>
);

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="min-h-screen bg-slate-50 w-full">
        {children}
    </div>
);