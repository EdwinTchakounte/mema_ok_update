import { createClient } from '@supabase/supabase-js'

// Get environment variables
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
// const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY


const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY


// Check if all required environment variables are present
export const isSupabaseConfigured = !!(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseServiceKey &&
  supabaseUrl.includes('supabase.co') &&
  supabaseAnonKey.length > 20 &&
  supabaseServiceKey.length > 20
)

// Create clients only if properly configured
let supabase: any = null
let supabaseAdmin: any = null

if (isSupabaseConfigured) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
} else {
  // Create dummy clients that will show helpful error messages
  const createDummyClient = () => ({
    from: () => ({
      select: () => Promise.resolve({ data: [], error: { message: 'Supabase non configuré' } }),
      insert: () => Promise.resolve({ data: null, error: { message: 'Supabase non configuré' } }),
      update: () => Promise.resolve({ data: null, error: { message: 'Supabase non configuré' } }),
      delete: () => Promise.resolve({ data: null, error: { message: 'Supabase non configuré' } })
    }),
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: { message: 'Supabase non configuré' } }),
        getPublicUrl: () => ({ data: { publicUrl: '' } })
      })
    },
    auth: {
      signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase non configuré' } }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase non configuré' } }),
      signOut: () => Promise.resolve({ error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    }
  })
  
  supabase = createDummyClient()
  supabaseAdmin = createDummyClient()
}
export { supabase, supabaseAdmin }

console.log('Supabase configured:', isSupabaseConfigured)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          role: string | null
          subscription_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          role?: string | null
          subscription_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          role?: string | null
          subscription_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      news: {
        Row: {
          id: string
          image_url: string | null
          title_fr: string
          description_fr: string | null
          title_en: string
          description_en: string | null
          scheduled_at: string | null
          share_count: number | null
          is_published: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          image_url?: string | null
          title_fr?: string
          description_fr?: string | null
          title_en?: string
          description_en?: string | null
          scheduled_at?: string | null
          share_count?: number | null
          is_published?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          image_url?: string | null
          title_fr?: string
          description_fr?: string | null
          title_en?: string
          description_en?: string | null
          scheduled_at?: string | null
          share_count?: number | null
          is_published?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      audios: {
        Row: {
          id: string
          news_id: string | null
          audio_url: string
          title_fr: string | null
          description_fr: string | null
          title_en: string | null
          description_en: string | null
          scheduled_at: string | null
          share_count: number | null
          download_count: number | null
          is_published: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          news_id?: string | null
          audio_url: string
          title_fr?: string | null
          description_fr?: string | null
          title_en?: string | null
          description_en?: string | null
          scheduled_at?: string | null
          share_count?: number | null
          download_count?: number | null
          is_published?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          news_id?: string | null
          audio_url?: string
          title_fr?: string | null
          description_fr?: string | null
          title_en?: string | null
          description_en?: string | null
          scheduled_at?: string | null
          share_count?: number | null
          download_count?: number | null
          is_published?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      videos: {
        Row: {
          id: string
          youtube_url: string
          title_fr: string | null
          description_fr: string | null
          title_en: string | null
          description_en: string | null
          scheduled_at: string | null
          is_published: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          youtube_url: string
          title_fr?: string | null
          description_fr?: string | null
          title_en?: string | null
          description_en?: string | null
          scheduled_at?: string | null
          is_published?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          youtube_url?: string
          title_fr?: string | null
          description_fr?: string | null
          title_en?: string | null
          description_en?: string | null
          scheduled_at?: string | null
          is_published?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
  }
}