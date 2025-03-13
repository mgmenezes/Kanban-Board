import React, { useState, useRef, useEffect } from "react";

const Dropdown = ({
  trigger,
  children,
  align = "left",
  width = "auto",
  className = "",
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  const alignClasses = {
    left: "left-0",
    right: "right-0",
    center: "left-1/2 transform -translate-x-1/2",
  };

  const widthClasses = {
    auto: "min-w-[120px]",
    sm: "w-32",
    md: "w-48",
    lg: "w-64",
    xl: "w-80",
    full: "w-full",
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  const closeDropdown = () => setIsOpen(false);

  return (
    <div className="relative inline-block" ref={dropdownRef} {...rest}>
      {/* Elemento de trigger com evento de clique */}
      <div onClick={toggleDropdown} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`absolute z-10 mt-1 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 ${
            alignClasses[align] || alignClasses.left
          } ${widthClasses[width] || widthClasses.auto} ${className}`}
        >
          <div className="py-1">
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child, {
                  onClick: (e) => {
                    if (child.props.onClick) {
                      child.props.onClick(e);
                    }

                    if (!child.props.stopPropagation) {
                      closeDropdown();
                    }
                  },
                });
              }
              return child;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export const DropdownItem = ({
  onClick,
  disabled = false,
  children,
  className = "",
  ...rest
}) => {
  return (
    <button
      className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
      {...rest}
    >
      {children}
    </button>
  );
};

export const DropdownDivider = () => {
  return <hr className="my-1 border-gray-200" />;
};

export default Dropdown;
