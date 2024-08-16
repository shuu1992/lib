import { useContext } from 'react';

// auth provider
import PageContext from '@src/contexts/PageContext';

// ==============================|| AUTH HOOKS ||============================== //

const usePage = () => {
  const context = useContext(PageContext);

  if (!context) throw new Error('context must be use inside provider');

  return context;
};

export default usePage;
