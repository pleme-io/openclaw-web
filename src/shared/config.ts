/**
 * Runtime configuration.
 *
 * Source of truth, in order:
 *   1. window.__OPENCLAW_RUNTIME_CONFIG__  (production: ConfigMap → /env.js)
 *   2. import.meta.env.VITE_*              (dev: .env.local)
 *   3. Built-in fallbacks for `vite dev`
 *
 * The lilitu web-runtime-configuration skill documents the same pattern.
 */

declare global {
  interface Window {
    __OPENCLAW_RUNTIME_CONFIG__?: Partial<RuntimeConfig>;
  }
}

export interface RuntimeConfig {
  /** Cartorio's public REST base URL, e.g. https://cartorio.dev.use1.quero.cloud */
  cartorioUrl: string;
}

const fromWindow = (): Partial<RuntimeConfig> => {
  if (typeof window === 'undefined') return {};
  return window.__OPENCLAW_RUNTIME_CONFIG__ ?? {};
};

const fromEnv = (): Partial<RuntimeConfig> => {
  const url = import.meta.env.VITE_CARTORIO_URL;
  return url ? { cartorioUrl: url } : {};
};

const FALLBACK: RuntimeConfig = {
  cartorioUrl: 'http://127.0.0.1:18082',
};

export const runtimeConfig: RuntimeConfig = {
  ...FALLBACK,
  ...Object.fromEntries(Object.entries(fromEnv()).filter(([, v]) => v != null)),
  ...Object.fromEntries(Object.entries(fromWindow()).filter(([, v]) => v != null)),
} as RuntimeConfig;
