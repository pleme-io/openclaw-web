/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CARTORIO_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
