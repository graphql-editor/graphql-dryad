import React from 'react';

// export const ErrorIcon: React.FC<{
//   colorMiddle?: string;
//   colorSuround?: string;
//   svgProps: React.SVGProps<SVGSVGElement>;
// }> = ({ svgProps, colorMiddle = '#F94646', colorSuround = '#FFF' }) => {
//   return (
//     <svg
//       {...svgProps}
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 64 64"
//       width="1em"
//       height="1em"
//     >
//       <path
//         fill={colorMiddle}
//         d="M32 0c17.7 0 32 14.3 32 32S49.7 64 32 64 0 49.7 0 32 14.3 0 32 0z"
//       />
//       <path fill={colorSuround} d="M29 16h6l-1 20h-4z" />
//       <circle fill={colorSuround} cx={32} cy={44} r={4} />
//     </svg>
//   );
// };

export const ErrorIcon = ({
  iconColor = '#871723',
  size = 1,
  ...props
}: React.SVGProps<SVGSVGElement> & {
  iconColor?: string;
  size?: number;
}) => {
  return (
    <svg
      {...props}
      width={`${size * 1}em`}
      height={`${size * 1}em`}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M44.634 14.935h0c.236.236.366.554.366.89V32.18c0 .334-.135.658-.366.89l-11.56 11.558-.002.002a1.277 1.277 0 01-.892.369H15.82c-.333 0-.657-.135-.889-.366l-.707.707.707-.707L3.366 33.07A1.252 1.252 0 013 32.181V15.824c0-.333.135-.657.366-.889h0l11.565-11.57s0 0 0 0c.236-.235.554-.365.89-.365H32.18c.333 0 .657.135.889.366 0 0 0 0 0 0l11.565 11.57z"
        stroke={iconColor}
        strokeWidth={2}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23 30V9h2v21h-2z"
        fill={iconColor}
      />
      <path d="M24 32.56v2.466" stroke={iconColor} strokeWidth={2} />
    </svg>
  );
};
