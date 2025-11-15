import React from "react";

const ReEVLogo = ({ variant = "dark", className = "", style = {} }) => {
  const fillColor = variant === "light" ? "#FFFFFF" : "#1B2A41";

  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z"
        fillRule="evenodd"
        fill={fillColor}
      />
    </svg>
  );
};

export default ReEVLogo;
