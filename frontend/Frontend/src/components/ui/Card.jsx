import React from "react";

const Card = ({
  title,
  children,
  onClick,
  hoverable = false,
  className = "",
  ...rest
}) => {
  return (
    <div
      className={`
        bg-white rounded-md shadow 
        ${hoverable ? "transition-shadow duration-200 hover:shadow-md" : ""} 
        ${onClick ? "cursor-pointer" : ""} 
        ${className}
      `}
      onClick={onClick}
      {...rest}
    >
      {title && (
        <div className="border-b px-4 py-3">
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
};

export const CardHeader = ({ children, className = "", ...rest }) => {
  return (
    <div className={`border-b px-4 py-3 ${className}`} {...rest}>
      {children}
    </div>
  );
};

export const CardBody = ({ children, className = "", ...rest }) => {
  return (
    <div className={`p-4 ${className}`} {...rest}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = "", ...rest }) => {
  return (
    <div className={`border-t px-4 py-3 ${className}`} {...rest}>
      {children}
    </div>
  );
};

export default Card;
