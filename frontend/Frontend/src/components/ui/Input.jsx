import React, { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      type = "text",
      id,
      name,
      label,
      placeholder,
      value,
      onChange,
      onBlur,
      required = false,
      disabled = false,
      error,
      className = "",
      ...rest
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <div className="mb-4">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`input ${
            error
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : ""
          } ${className}`}
          {...rest}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
