import * as React from "react";

interface SvgIconProps extends React.SVGProps<SVGSVGElement> {
    color?: string;
    height?: number ;
    width?: number ;
}

const SvgIcon: React.FC<SvgIconProps> = ({ color = "white", height = 60, width = 60, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        fill="none"
        viewBox="0 0 24 24"
        {...props}
    >
        <path
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m19 19-6.293-6.293a1 1 0 0 1 0-1.414L19 5M11 19l-6.293-6.293a1 1 0 0 1 0-1.414L11 5"
        ></path>
    </svg>
);

export default SvgIcon;