import * as React from 'react';
const SVGComponent = (props: any) => (
  <svg
    version="1.1"
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 32 32"
    enableBackground="new 0 0 32 32"
    xmlSpace="preserve"
    {...props}
  >
    <rect x="10" y="15" width="12" height="2" />
    <rect x="15" y="10" width="2" height="12" />
    <circle
      fill="none"
      stroke="#000000"
      strokeWidth="2"
      strokeMiterlimit="10"
      cx="16"
      cy="16"
      r="12"
    />
  </svg>
);
export default SVGComponent;
