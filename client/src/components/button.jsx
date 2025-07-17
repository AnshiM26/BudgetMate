import React from "react";
import clsx from "clsx";

const variantClasses = {
  default: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
  outline:
    "bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500 border border-gray-200",
  ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
  link: "bg-transparent underline-offset-4 hover:underline text-indigo-600 hover:text-indigo-700",
};

const sizeClasses = {
  default: "h-10 px-4 py-2",
  sm: "h-9 px-3",
  lg: "h-11 px-8",
  icon: "h-10 w-10",
};

const Spinner = () => (
  <svg
    className="animate-spin h-4 w-4 mr-2 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

export function Button({
  children,
  variant = "default",
  size = "default",
  className,
  loading = false,
  ...props
}) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
