import * as React from "react";

interface SvgIconProps extends React.SVGProps<SVGSVGElement> {
    height?: string | number; // Optional height prop
    width?: string | number;  // Optional width prop
    color?: string;           // Optional color prop
}

const SvgIcon: React.FC<SvgIconProps> = ({ height = "800", width = "800", color = "#3F51B5", ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        version="1"
        viewBox="0 0 48 48"
        {...props} // Spreads any additional props passed to the component
    >
        <g fill={color}>
            <path d="m17.8 18.1-7.4 7.3-4.2-4.1L4 23.5l6.4 6.4 9.6-9.6zM17.8 5.1l-7.4 7.3-4.2-4.1L4 10.5l6.4 6.4L20 7.3zM17.8 31.1l-7.4 7.3-4.2-4.1L4 36.5l6.4 6.4 9.6-9.6z"></path>
        </g>
        <g fill="#90CAF9">
            <path d="M24 22h20v4H24zM24 9h20v4H24zM24 35h20v4H24z"></path>
        </g>
    </svg>
);

export default SvgIcon;
