import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

export const Input = React.forwardRef<HTMLInputElement, Props>(
  ({ className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          {...props}
          className={`w-full px-4 py-2 border border-gray-300 rounded-md mt-2 dark:text-black focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${className}`}
        />
      </div>
    );
  }
);

Input.displayName = "Input";
