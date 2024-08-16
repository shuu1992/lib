import * as React from 'react';
const SVGComponent = (props: any) => (
  <svg
    fill="#000000"
    width="800px"
    height="800px"
    viewBox="0 0 1920 1920"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M959.921.01 453 506.933l152.28 152.28 246.946-246.944v1095.475L605.28 1260.798 453 1413.078 959.921 1920l506.921-506.921-152.28-152.281-246.946 246.945V412.268l246.945 246.945 152.281-152.281z"
      fillRule="evenodd"
    />
  </svg>
);
export default SVGComponent;
