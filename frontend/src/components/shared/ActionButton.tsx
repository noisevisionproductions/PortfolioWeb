import React from 'react';
import {useNavigate} from "react-router-dom";

interface ActionButtonProps {
    label: string;
    to?: string;
    onClick?: () => void;
    icon?: React.ReactNode;
    className?: string;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    type?: 'button' | 'submit' | 'reset';
}

export const ActionButton: React.FC<ActionButtonProps> = ({
                                                              label,
                                                              to,
                                                              onClick,
                                                              icon,
                                                              className = '',
                                                              variant = 'primary',
                                                              size = 'md',
                                                              type = 'button'
                                                          }) => {
    const navigate = useNavigate();

    const getBaseClasses = () => {
        const sizeClasses = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-4 py-2',
            lg: 'px-6 py-3 text-lg'
        };

        const variantClasses = {
            primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
            secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
            outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500'
        }

        return `
            ${sizeClasses[size]}
            ${variantClasses[variant]}
            inline-flex items-center gap-2 
            rounded-md
            font-medium
            transition-colors
            focus:outline-none focus:ring-2 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
        `;
    };
    const handleClick = () => {
        if (to) {
            navigate(to);
        } else if (onClick) {
            onClick();
        }
    };

    return (
        <button
            onClick={handleClick}
            className={getBaseClasses()}
            type={type}
        >
            {icon}
            {label}
        </button>
    );
};