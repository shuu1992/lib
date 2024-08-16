/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/react" />
/// <reference types="vite-plugin-pwa/info" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_HTML_TITLE: string;
  readonly VITE_TITLE: string;
  readonly VITE_VERSION: string;
  readonly VITE_DEFAULT_LANG: string;
  readonly VITE_IMG_URL: string;
  readonly VITE_API_URL: string;
  readonly VITE_FILE_URL: string;
  readonly VITE_CF_KEY: string;
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
