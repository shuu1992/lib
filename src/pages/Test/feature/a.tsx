import React, { useContext, useEffect } from 'react';

import { TestHocProps, withCounter } from '@hocs/TestHoc';

interface TestProps extends TestHocProps {
  text: string;
}

function A({ text, testHocProps }: TestProps) {
  useEffect(() => {
    console.log(text);
  }, []);
  return (
    <>
      <h4>A</h4>
      <button onClick={testHocProps.incrementCount}>Click me!</button>

      <p style={{ fontSize: testHocProps.count }}>Count : {testHocProps.count}</p>
    </>
  );
}

export default withCounter(A);
