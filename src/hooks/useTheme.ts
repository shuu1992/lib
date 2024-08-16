import { useContext } from 'react';
import { ThemeContext } from '@src/contexts/ThemeContext';

// ==============================|| CONFIG - HOOKS  ||============================== //

const useConfig = () => useContext(ThemeContext);

export default useConfig;
