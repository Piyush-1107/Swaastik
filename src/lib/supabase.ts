import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Client for public operations (with RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for server-side operations (bypasses RLS)
// If service key is not available, fall back to anon key with warning
export const supabaseAdmin = createClient(
  supabaseUrl, 
  supabaseServiceKey || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

if (!supabaseServiceKey) {
  console.warn('SUPABASE_SERVICE_ROLE_KEY not found, using anon key. This may cause RLS issues.')
}

// Database types
export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          price: number
          category: string
          images: string[]
          specifications: {
            metal: string
            purity: string
            weight: string
            stones: string[]
            hallmarked: boolean
          }
          stock: number
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description: string
          price: number
          category: string
          images?: string[]
          specifications: {
            metal: string
            purity: string
            weight: string
            stones: string[]
            hallmarked: boolean
          }
          stock: number
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string
          price?: number
          category?: string
          images?: string[]
          specifications?: {
            metal: string
            purity: string
            weight: string
            stones: string[]
            hallmarked: boolean
          }
          stock?: number
          featured?: boolean
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          customer_email: string
          customer_phone: string
          customer_name: string
          items: {
            productId: string
            quantity: number
            price: number
            name: string
          }[]
          total_amount: number
          status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
          shipping_address: {
            name: string
            phone: string
            address: string
            city: string
            state: string
            pincode: string
          }
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_email: string
          customer_phone: string
          customer_name: string
          items: {
            productId: string
            quantity: number
            price: number
            name: string
          }[]
          total_amount: number
          status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
          shipping_address: {
            name: string
            phone: string
            address: string
            city: string
            state: string
            pincode: string
          }
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_email?: string
          customer_phone?: string
          customer_name?: string
          items?: {
            productId: string
            quantity: number
            price: number
            name: string
          }[]
          total_amount?: number
          status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
          shipping_address?: {
            name: string
            phone: string
            address: string
            city: string
            state: string
            pincode: string
          }
          updated_at?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          email: string
          role: 'admin' | 'shop_owner'
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          role?: 'admin' | 'shop_owner'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'admin' | 'shop_owner'
        }
      }
    }
  }
}
