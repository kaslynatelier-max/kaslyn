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
      admin_notifications: {
        Row: {
          body: string
          created_at: string
          error: string | null
          id: string
          kind: string
          sent: boolean
          sent_at: string | null
          subject: string
        }
        Insert: {
          body: string
          created_at?: string
          error?: string | null
          id?: string
          kind: string
          sent?: boolean
          sent_at?: string | null
          subject: string
        }
        Update: {
          body?: string
          created_at?: string
          error?: string | null
          id?: string
          kind?: string
          sent?: boolean
          sent_at?: string | null
          subject?: string
        }
        Relationships: []
      }
      client_requests: {
        Row: {
          admin_reply: string | null
          brand: string | null
          brief: string
          created_at: string
          email: string
          id: string
          name: string
          project_type: string | null
          replied_at: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          admin_reply?: string | null
          brand?: string | null
          brief: string
          created_at?: string
          email: string
          id?: string
          name: string
          project_type?: string | null
          replied_at?: string | null
          status?: string
          user_id?: string | null
        }
        Update: {
          admin_reply?: string | null
          brand?: string | null
          brief?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          project_type?: string | null
          replied_at?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profile_field_defs: {
        Row: {
          created_at: string
          field_type: string
          id: string
          key: string
          label: string
          options: Json | null
          required: boolean
          show_in_roster: boolean
          sort_order: number
        }
        Insert: {
          created_at?: string
          field_type?: string
          id?: string
          key: string
          label: string
          options?: Json | null
          required?: boolean
          show_in_roster?: boolean
          sort_order?: number
        }
        Update: {
          created_at?: string
          field_type?: string
          id?: string
          key?: string
          label?: string
          options?: Json | null
          required?: boolean
          show_in_roster?: boolean
          sort_order?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          approved: boolean
          avatar_url: string | null
          bio: string | null
          city: string | null
          cover_url: string | null
          created_at: string
          custom_fields: Json
          email: string | null
          eyes: string | null
          full_name: string | null
          hair: string | null
          height_cm: number | null
          id: string
          instagram: string | null
          is_public: boolean
          phone: string | null
          preferences: Json
          roster_code: string | null
          skin_tone: string | null
          updated_at: string
          weight_kg: number | null
        }
        Insert: {
          age?: number | null
          approved?: boolean
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          cover_url?: string | null
          created_at?: string
          custom_fields?: Json
          email?: string | null
          eyes?: string | null
          full_name?: string | null
          hair?: string | null
          height_cm?: number | null
          id: string
          instagram?: string | null
          is_public?: boolean
          phone?: string | null
          preferences?: Json
          roster_code?: string | null
          skin_tone?: string | null
          updated_at?: string
          weight_kg?: number | null
        }
        Update: {
          age?: number | null
          approved?: boolean
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          cover_url?: string | null
          created_at?: string
          custom_fields?: Json
          email?: string | null
          eyes?: string | null
          full_name?: string | null
          hair?: string | null
          height_cm?: number | null
          id?: string
          instagram?: string | null
          is_public?: boolean
          phone?: string | null
          preferences?: Json
          roster_code?: string | null
          skin_tone?: string | null
          updated_at?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          admin_notify_email: string
          developer_credit_name: string
          developer_credit_url: string
          id: boolean
          roster_visible_fields: Json
          updated_at: string
        }
        Insert: {
          admin_notify_email?: string
          developer_credit_name?: string
          developer_credit_url?: string
          id?: boolean
          roster_visible_fields?: Json
          updated_at?: string
        }
        Update: {
          admin_notify_email?: string
          developer_credit_name?: string
          developer_credit_url?: string
          id?: boolean
          roster_visible_fields?: Json
          updated_at?: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_roster_code: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "model" | "client" | "super_admin"
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
      app_role: ["admin", "model", "client", "super_admin"],
    },
  },
} as const
