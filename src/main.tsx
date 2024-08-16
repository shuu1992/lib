import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { ConfigProvider } from '@src/contexts/ConfigContext';
import { store } from './store';
import App from './App';
import '@assets/css/index.scss';
import '@assets/css/app.scss';
const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <ReduxProvider store={store}>
    <ConfigProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConfigProvider>
  </ReduxProvider>,
);
