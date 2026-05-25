export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_label: string | null
          entity_type: string
          id: string
          user_email: string | null
          user_id: string | null
          user_role: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_label?: string | null
          entity_type: string
          id?: string
          user_email?: string | null
          user_id?: string | null
          user_role?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_label?: string | null
          entity_type?: string
          id?: string
          user_email?: string | null
          user_id?: string | null
          user_role?: string | null
        }
        Relationships: []
      }
      advisory_team: {
        Row: {
          bio: string | null
          created_at: string
          id: string
          name: string
          photo_url: string | null
          position: string | null
          sort_order: number
        }
        Insert: {
          bio?: string | null
          created_at?: string
          id?: string
          name: string
          photo_url?: string | null
          position?: string | null
          sort_order?: number
        }
        Update: {
          bio?: string | null
          created_at?: string
          id?: string
          name?: string
          photo_url?: string | null
          position?: string | null
          sort_order?: number
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          category: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          published_at: string | null
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          address: string
          created_at: string
          email: string
          first_name: string
          id: string
          is_read: boolean
          last_name: string | null
          message: string
          phone: string
          status: string
        }
        Insert: {
          address: string
          created_at?: string
          email: string
          first_name: string
          id?: string
          is_read?: boolean
          last_name?: string | null
          message: string
          phone: string
          status?: string
        }
        Update: {
          address?: string
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          is_read?: boolean
          last_name?: string | null
          message?: string
          phone?: string
          status?: string
        }
        Relationships: []
      }
      csr_applications: {
        Row: {
          aadhaar: string | null
          address: string | null
          admin_notes: string | null
          age: number | null
          alternate_phone: string | null
          assigned_manager: string | null
          budget_range: string | null
          city: string | null
          company: string | null
          company_address: string | null
          company_name: string | null
          company_pan: string | null
          company_tan: string | null
          company_type: string | null
          company_website: string | null
          contact_name: string | null
          created_at: string
          csr_budget: string | null
          declaration: boolean | null
          designation: string | null
          email: string | null
          focus_areas: string | null
          full_name: string | null
          gender: string | null
          heard_from: string | null
          id: string
          linkedin: string | null
          message: string | null
          num_employees: string | null
          official_email: string | null
          pan: string | null
          phone: string | null
          pin_code: string | null
          preferred_program: string | null
          previous_experience: string | null
          primary_focus: string | null
          proposal_stage: string | null
          purpose: string | null
          secondary_focus: string | null
          state: string | null
          status: Database["public"]["Enums"]["volunteer_status"]
          submitted_at: string | null
          type: string | null
          updated_at: string
        }
        Insert: {
          aadhaar?: string | null
          address?: string | null
          admin_notes?: string | null
          age?: number | null
          alternate_phone?: string | null
          assigned_manager?: string | null
          budget_range?: string | null
          city?: string | null
          company?: string | null
          company_address?: string | null
          company_name?: string | null
          company_pan?: string | null
          company_tan?: string | null
          company_type?: string | null
          company_website?: string | null
          contact_name?: string | null
          created_at?: string
          csr_budget?: string | null
          declaration?: boolean | null
          designation?: string | null
          email?: string | null
          focus_areas?: string | null
          full_name?: string | null
          gender?: string | null
          heard_from?: string | null
          id?: string
          linkedin?: string | null
          message?: string | null
          num_employees?: string | null
          official_email?: string | null
          pan?: string | null
          phone?: string | null
          pin_code?: string | null
          preferred_program?: string | null
          previous_experience?: string | null
          primary_focus?: string | null
          proposal_stage?: string | null
          purpose?: string | null
          secondary_focus?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["volunteer_status"]
          submitted_at?: string | null
          type?: string | null
          updated_at?: string
        }
        Update: {
          aadhaar?: string | null
          address?: string | null
          admin_notes?: string | null
          age?: number | null
          alternate_phone?: string | null
          assigned_manager?: string | null
          budget_range?: string | null
          city?: string | null
          company?: string | null
          company_address?: string | null
          company_name?: string | null
          company_pan?: string | null
          company_tan?: string | null
          company_type?: string | null
          company_website?: string | null
          contact_name?: string | null
          created_at?: string
          csr_budget?: string | null
          declaration?: boolean | null
          designation?: string | null
          email?: string | null
          focus_areas?: string | null
          full_name?: string | null
          gender?: string | null
          heard_from?: string | null
          id?: string
          linkedin?: string | null
          message?: string | null
          num_employees?: string | null
          official_email?: string | null
          pan?: string | null
          phone?: string | null
          pin_code?: string | null
          preferred_program?: string | null
          previous_experience?: string | null
          primary_focus?: string | null
          proposal_stage?: string | null
          purpose?: string | null
          secondary_focus?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["volunteer_status"]
          submitted_at?: string | null
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      donations: {
        Row: {
          aadhaar: string | null
          address: string | null
          admin_notes: string | null
          age: number | null
          amount: number
          created_at: string
          email: string
          full_name: string
          gender: string | null
          id: string
          pan: string | null
          phone: string
          purpose: string | null
          status: Database["public"]["Enums"]["donation_status"]
          updated_at: string
        }
        Insert: {
          aadhaar?: string | null
          address?: string | null
          admin_notes?: string | null
          age?: number | null
          amount: number
          created_at?: string
          email: string
          full_name: string
          gender?: string | null
          id?: string
          pan?: string | null
          phone: string
          purpose?: string | null
          status?: Database["public"]["Enums"]["donation_status"]
          updated_at?: string
        }
        Update: {
          aadhaar?: string | null
          address?: string | null
          admin_notes?: string | null
          age?: number | null
          amount?: number
          created_at?: string
          email?: string
          full_name?: string
          gender?: string | null
          id?: string
          pan?: string | null
          phone?: string
          purpose?: string | null
          status?: Database["public"]["Enums"]["donation_status"]
          updated_at?: string
        }
        Relationships: []
      }
      gallery_items: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          media_type: Database["public"]["Enums"]["media_type"]
          media_url: string
          ratio: Database["public"]["Enums"]["media_ratio"]
          title: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          media_type?: Database["public"]["Enums"]["media_type"]
          media_url: string
          ratio?: Database["public"]["Enums"]["media_ratio"]
          title?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          media_type?: Database["public"]["Enums"]["media_type"]
          media_url?: string
          ratio?: Database["public"]["Enums"]["media_ratio"]
          title?: string | null
        }
        Relationships: []
      }
      impact_stats: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          label: string
          sort_order: number
          suffix: string | null
          value: number
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          label: string
          sort_order?: number
          suffix?: string | null
          value?: number
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          label?: string
          sort_order?: number
          suffix?: string | null
          value?: number
        }
        Relationships: []
      }
      news_banner: {
        Row: {
          headline: string | null
          id: string
          image_url: string | null
          is_active: boolean
          link_url: string | null
          tag_label: string | null
          updated_at: string
        }
        Insert: {
          headline?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          link_url?: string | null
          tag_label?: string | null
          updated_at?: string
        }
        Update: {
          headline?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          link_url?: string | null
          tag_label?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      programs: {
        Row: {
          banner_url: string | null
          category: string | null
          created_at: string
          description: string | null
          id: string
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          summary: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          banner_url?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          summary?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          banner_url?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          summary?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          banner_url: string | null
          created_at: string
          description: string | null
          gallery_urls: string[]
          id: string
          location: string | null
          project_date: string | null
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          banner_url?: string | null
          created_at?: string
          description?: string | null
          gallery_urls?: string[]
          id?: string
          location?: string | null
          project_date?: string | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          banner_url?: string | null
          created_at?: string
          description?: string | null
          gallery_urls?: string[]
          id?: string
          location?: string | null
          project_date?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          content: string
          created_at: string
          id: string
          is_featured: boolean
          name: string
          photo_url: string | null
          rating: number | null
          role: string | null
          role_location: string | null
          status: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_featured?: boolean
          name: string
          photo_url?: string | null
          rating?: number | null
          role?: string | null
          role_location?: string | null
          status?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_featured?: boolean
          name?: string
          photo_url?: string | null
          rating?: number | null
          role?: string | null
          role_location?: string | null
          status?: string
        }
        Relationships: []
      }
      trusted_members: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          photo_url: string | null
          role: string | null
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          photo_url?: string | null
          role?: string | null
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          photo_url?: string | null
          role?: string | null
          sort_order?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      voices_of_appreciation: {
        Row: {
          created_at: string
          display_order: number
          highlight_words: string | null
          id: string
          name: string
          photo_url: string | null
          quote: string
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          highlight_words?: string | null
          id?: string
          name: string
          photo_url?: string | null
          quote: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          highlight_words?: string | null
          id?: string
          name?: string
          photo_url?: string | null
          quote?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      volunteer_applications: {
        Row: {
          aadhaar: string | null
          address: string | null
          admin_notes: string | null
          age: number | null
          assigned_date: string | null
          assigned_program: string | null
          availability: string | null
          city: string | null
          created_at: string
          declaration: boolean | null
          education: string | null
          email: string
          full_name: string
          gender: string | null
          heard_from: string | null
          hours_per_week: string | null
          id: string
          languages: string | null
          mode: string | null
          occupation: string | null
          organization: string | null
          pan: string | null
          phone: string | null
          primary_interest: string | null
          reason: string | null
          secondary_interest: string | null
          special_skills: string | null
          state: string | null
          status: string
          submitted_at: string
          type: string | null
          updated_at: string
        }
        Insert: {
          aadhaar?: string | null
          address?: string | null
          admin_notes?: string | null
          age?: number | null
          assigned_date?: string | null
          assigned_program?: string | null
          availability?: string | null
          city?: string | null
          created_at?: string
          declaration?: boolean | null
          education?: string | null
          email: string
          full_name: string
          gender?: string | null
          heard_from?: string | null
          hours_per_week?: string | null
          id?: string
          languages?: string | null
          mode?: string | null
          occupation?: string | null
          organization?: string | null
          pan?: string | null
          phone?: string | null
          primary_interest?: string | null
          reason?: string | null
          secondary_interest?: string | null
          special_skills?: string | null
          state?: string | null
          status?: string
          submitted_at?: string
          type?: string | null
          updated_at?: string
        }
        Update: {
          aadhaar?: string | null
          address?: string | null
          admin_notes?: string | null
          age?: number | null
          assigned_date?: string | null
          assigned_program?: string | null
          availability?: string | null
          city?: string | null
          created_at?: string
          declaration?: boolean | null
          education?: string | null
          email?: string
          full_name?: string
          gender?: string | null
          heard_from?: string | null
          hours_per_week?: string | null
          id?: string
          languages?: string | null
          mode?: string | null
          occupation?: string | null
          organization?: string | null
          pan?: string | null
          phone?: string | null
          primary_interest?: string | null
          reason?: string | null
          secondary_interest?: string | null
          special_skills?: string | null
          state?: string | null
          status?: string
          submitted_at?: string
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      volunteers: {
        Row: {
          aadhaar: string | null
          address: string | null
          admin_notes: string | null
          age: number | null
          area_of_interest: string | null
          availability: string | null
          city: string | null
          created_at: string
          education: string | null
          email: string
          full_name: string
          gender: string | null
          id: string
          message: string | null
          pan: string | null
          phone: string
          purpose: string | null
          state: string | null
          status: Database["public"]["Enums"]["volunteer_status"]
          updated_at: string
        }
        Insert: {
          aadhaar?: string | null
          address?: string | null
          admin_notes?: string | null
          age?: number | null
          area_of_interest?: string | null
          availability?: string | null
          city?: string | null
          created_at?: string
          education?: string | null
          email: string
          full_name: string
          gender?: string | null
          id?: string
          message?: string | null
          pan?: string | null
          phone: string
          purpose?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["volunteer_status"]
          updated_at?: string
        }
        Update: {
          aadhaar?: string | null
          address?: string | null
          admin_notes?: string | null
          age?: number | null
          area_of_interest?: string | null
          availability?: string | null
          city?: string | null
          created_at?: string
          education?: string | null
          email?: string
          full_name?: string
          gender?: string | null
          id?: string
          message?: string | null
          pan?: string | null
          phone?: string
          purpose?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["volunteer_status"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_role: {
        Args: { _access_code: string; _role: string }
        Returns: Json
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
      list_staff_users: {
        Args: never
        Returns: {
          email: string
          full_name: string
          joined_at: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "user" | "staff"
      content_status: "draft" | "active" | "inactive" | "published" | "archived"
      donation_status: "pending" | "approved" | "rejected" | "paid"
      media_ratio: "16:9" | "9:16" | "1:1" | "4:3"
      media_type: "image" | "video"
      volunteer_status: "pending" | "approved" | "rejected" | "active"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor", "user", "staff"],
      content_status: ["draft", "active", "inactive", "published", "archived"],
      donation_status: ["pending", "approved", "rejected", "paid"],
      media_ratio: ["16:9", "9:16", "1:1", "4:3"],
      media_type: ["image", "video"],
      volunteer_status: ["pending", "approved", "rejected", "active"],
    },
  },
} as const
