import React from 'react';

interface BackArrowIconProps {
  onClick?: () => void;
  width?: string | number;
  height?: string | number;
  fill?: string;
  style?: React.CSSProperties;
}

export const BackArrowIcon: React.FC<BackArrowIconProps> = ({
  onClick,
  width = "24",
  height = "24",
  fill = "#3182CE",
  style = {},
}) => {
  const defaultStyle: React.CSSProperties = {
    cursor: onClick ? "pointer" : "default",
    ...style,
  };

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      style={defaultStyle}
    >
      <path
        d="M5.58984 8.41L10.1798 13L5.58984 17.59L6.99984 19L12.9998 13L6.99984 7L5.58984 8.41ZM15.9998 7H17.9998V19H15.9998V7Z"
        fill={fill}
      />
    </svg>
  );
};

