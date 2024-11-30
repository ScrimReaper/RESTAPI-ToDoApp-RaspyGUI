import * as React from "react";

interface SvgIconProps extends React.SVGProps<SVGSVGElement> {
    color?: string;
    height?: number;
    width?: number;
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
            d="m5.5 5 6.293 6.293a1 1 0 0 1 0 1.414L5.5 19M13.5 5l6.293 6.293a1 1 0 0 1 0 1.414L13.5 19"
        ></path>
    </svg>
);

export default SvgIcon;
