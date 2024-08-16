import { createRoot } from 'react-dom/client';
import { ConfigProvider } from '@contexts/ConfigContext';
import App from './App';
const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <ConfigProvider>
    <App />
  </ConfigProvider>,
);
