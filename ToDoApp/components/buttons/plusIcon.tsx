import * as React from "react";

interface SvgIconProps extends React.SVGProps<SVGSVGElement> {
    color?: string;
    height?: number;
    width?: number;
}

const SvgIcon: React.FC<SvgIconProps> = ({ color = 'black', height= 100, width = 100, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 256 256"
        fill="none"
        {...props}  // Spread any additional props
    >
        <path
            fill={color}  // Use the color prop here
            fillOpacity="0.671"
            strokeMiterlimit="10"
            d="M24 4C12.972 4 4 12.972 4 24s8.972 20 20 20 20-8.972 20-20S35.028 4 24 4m0 3c9.407 0 17 7.593 17 17s-7.593 17-17 17S7 33.407 7 24 14.593 7 24 7m-.023 6.979A1.5 1.5 0 0 0 22.5 15.5v7h-7a1.5 1.5 0 1 0 0 3h7v7a1.5 1.5 0 1 0 3 0v-7h7a1.5 1.5 0 1 0 0-3h-7v-7a1.5 1.5 0 0 0-1.523-1.521"
            fontFamily="none"
            fontSize="none"
            fontWeight="none"
            style={{ mixBlendMode: "normal" }}
            textAnchor="none"
            transform="scale(5.33333)"
        ></path>
    </svg>
);

export default SvgIcon;