export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          subdomain: string | null
          logo_url: string | null
          primary_color: string | null
          secondary_color: string | null
          accent_color: string | null
          stripe_customer_id: string | null
          subscription_status: string
          subscription_tier: string
          trial_ends_at: string | null
          subscription_ends_at: string | null
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          subdomain?: string | null
          logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          accent_color?: string | null
          stripe_customer_id?: string | null
          subscription_status?: string
          subscription_tier?: string
          trial_ends_at?: string | null
          subscription_ends_at?: string | null
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          subdomain?: string | null
          logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          accent_color?: string | null
          stripe_customer_id?: string | null
          subscription_status?: string
          subscription_tier?: string
          trial_ends_at?: string | null
          subscription_ends_at?: string | null
          settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          organization_id: string
          email: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          avatar_url: string | null
          role: string
          onboarded: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          organization_id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: string
          onboarded?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: string
          onboarded?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      athletes: {
        Row: {
          id: string
          organization_id: string
          user_id: string | null
          first_name: string
          last_name: string
          date_of_birth: string | null
          weight: number | null
          weight_class: string | null
          grade: string | null
          experience_level: string | null
          status: string
          parent_ids: string[] | null
          emergency_contact: Json | null
          medical_info: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id?: string | null
          first_name: string
          last_name: string
          date_of_birth?: string | null
          weight?: number | null
          weight_class?: string | null
          grade?: string | null
          experience_level?: string | null
          status?: string
          parent_ids?: string[] | null
          emergency_contact?: Json | null
          medical_info?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string | null
          first_name?: string
          last_name?: string
          date_of_birth?: string | null
          weight?: number | null
          weight_class?: string | null
          grade?: string | null
          experience_level?: string | null
          status?: string
          parent_ids?: string[] | null
          emergency_contact?: Json | null
          medical_info?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          organization_id: string
          stripe_subscription_id: string
          stripe_customer_id: string
          stripe_price_id: string
          status: string
          tier: string
          current_period_start: string
          current_period_end: string
          cancel_at_period_end: boolean
          canceled_at: string | null
          trial_start: string | null
          trial_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          stripe_subscription_id: string
          stripe_customer_id: string
          stripe_price_id: string
          status: string
          tier: string
          current_period_start: string
          current_period_end: string
          cancel_at_period_end?: boolean
          canceled_at?: string | null
          trial_start?: string | null
          trial_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          stripe_subscription_id?: string
          stripe_customer_id?: string
          stripe_price_id?: string
          status?: string
          tier?: string
          current_period_start?: string
          current_period_end?: string
          cancel_at_period_end?: boolean
          canceled_at?: string | null
          trial_start?: string | null
          trial_end?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
