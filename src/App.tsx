import { RouterProvider } from 'react-router-dom';
import router from '@router/index';
import ThemeCustomization from './themes';
import { I18nextProvider } from 'react-i18next';
import i18n from '@i18n/index';

const App = () => {
  return (
    <ThemeCustomization>
      <I18nextProvider i18n={i18n}>
        <RouterProvider router={router} />
      </I18nextProvider>
    </ThemeCustomization>
  );
};

export default App;
