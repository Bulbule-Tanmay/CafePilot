/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
  /** Dev only. Bypasses route guards so shells can be reviewed. Ignored in production builds. */
  readonly VITE_PREVIEW_SHELLS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
