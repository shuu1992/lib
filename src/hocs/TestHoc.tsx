import React, { useEffect } from 'react';
import { Subtract } from 'utility-types';

export interface TestHocProps {
  testHocProps: {
    count: number;
    incrementCount: () => void;
  };
}

export const withCounter = <P extends TestHocProps>(Component: React.ComponentType<P>) => {
  const NewComponent = (props: any) => {
    const [count, setCount] = React.useState(10);
    useEffect(() => {
      console.log(props);
    }, []);
    return (
      <Component
        {...(props as P)}
        testHocProps={{ count, incrementCount: () => setCount(count + 1) }}
      />
    );
  };

  return NewComponent;
};
