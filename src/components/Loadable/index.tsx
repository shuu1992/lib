import { ElementType, Suspense } from 'react';

// project import
import Loader from './components/Loader';

// ==============================|| LOADABLE - LAZY LOADING ||============================== //

const Loadable = (Component: ElementType) => (props: any) =>
  (
    <Suspense fallback={<Loader />}>
      <Component {...props} />
    </Suspense>
  );

export default Loadable;
