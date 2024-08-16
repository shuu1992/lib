import { ElementType, Suspense } from 'react';

// project import
import Loader from './Loaders';

// ==============================|| LOADABLE - LAZY LOADING ||============================== //

type LoadableProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

const Loadable = ({ children, fallback = <Loader /> }: LoadableProps) => (
  <Suspense fallback={fallback}>{children}</Suspense>
);

export default Loadable;
