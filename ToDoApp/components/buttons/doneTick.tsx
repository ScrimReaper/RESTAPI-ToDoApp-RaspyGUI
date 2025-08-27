import * as React from "react";

interface SvgIconProps extends React.SVGProps<SVGSVGElement> {
    height?: number;
    width?: number;
    color?: string;
}

const SvgIcon: React.FC<SvgIconProps> = ({ width = 50, height = 50, color = "black", ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 50 50"
        {...props}  // Spread any additional props
    >
        <path
            d="M42.875 8.625a1 1 0 0 0-.094.031 1 1 0 0 0-.625.469L21.72 40.813 7.656 28.124a.997.997 0 0 0-1.773.473 1 1 0 0 0 .46.996l14.907 13.5a.999.999 0 0 0 1.5-.219l21.094-32.687a1 1 0 0 0-.969-1.563"
            fill={color}  // Apply color prop to the fill attribute
        ></path>
    </svg>
);

export default SvgIcon;
