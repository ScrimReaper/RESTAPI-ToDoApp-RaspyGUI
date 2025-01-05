import * as React from "react";

interface SvgIconProps extends React.SVGProps<SVGSVGElement> {
    color?: string; // Optional color prop
    height?: number;
    width?: number;
}

const SvgIcon: React.FC<SvgIconProps> = ({ color = "black", height = 60, width = 60, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height= {height}
        viewBox="0 0 72 72"
        {...props} // Spread any additional props
    >
        <path
            d="M56 48a4 4 0 0 1 0 8H16a4 4 0 0 1 0-8zm0-16a4 4 0 0 1 0 8H16a4 4 0 0 1 0-8zm0-16a4 4 0 0 1 0 8H16a4 4 0 0 1 0-8z"
            fill={color} // Use the color prop here
        ></path>
    </svg>
);

export default SvgIcon;
