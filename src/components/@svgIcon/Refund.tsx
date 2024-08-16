import * as React from 'react';
const SVGComponent = (props: any) => (
  <svg
    width="800px"
    height="800px"
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    strokeWidth={3}
    stroke="#000000"
    fill="none"
    {...props}
  >
    <path d="M55.47,31.14A23.51,23.51,0,0,1,12.69,45.6" strokeLinecap="round" />
    <path d="M8.46,32.74a24,24,0,0,1,.42-5,23.51,23.51,0,0,1,42.29-9.14" strokeLinecap="round" />
    <polyline points="40.6 17.6 51.45 18.87 52.53 8.69" strokeLinecap="round" />
    <polyline points="23.05 46.33 12.21 45.06 11.12 55.24" strokeLinecap="round" />
    <path d="M39,25.57a7.09,7.09,0,0,0-6.65-4.29c-6,0-6.21,4.29-6.21,4.29s-.9,5.28,6.43,5.85C40.18,32,39,37.26,39,37.26s-.78,4.58-6.43,4.87-7.41-5.65-7.41-5.65" />
    <line x1={32.33} y1={17.48} x2={32.33} y2={46.52} />
  </svg>
);
export default SVGComponent;
