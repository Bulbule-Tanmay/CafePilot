/**
 * PLACEHOLDER. Replace with generated types once a Supabase project exists:
 *   npx supabase gen types typescript --project-id <ref> > src/types/database.ts
 * Schema is introduced from Stage 1 onward (see docs/implementation-plan.md section 6).
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: Record<string, never>
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
