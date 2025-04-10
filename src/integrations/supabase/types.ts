export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      book_chapters: {
        Row: {
          book_code: string | null
          english_name: string
          id: number
          name: string
          number: number
          verses_count: number
        }
        Insert: {
          book_code?: string | null
          english_name: string
          id?: number
          name: string
          number: number
          verses_count: number
        }
        Update: {
          book_code?: string | null
          english_name?: string
          id?: number
          name?: string
          number?: number
          verses_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "book_chapters_book_code_fkey"
            columns: ["book_code"]
            isOneToOne: false
            referencedRelation: "holy_books"
            referencedColumns: ["code"]
          },
        ]
      }
      book_verses: {
        Row: {
          audio_url: string | null
          book_code: string | null
          chapter_number: number
          english_translation: string | null
          english_transliteration: string | null
          id: number
          malayalam_translation: string | null
          malayalam_transliteration: string | null
          original_text: string
          tamil_translation: string | null
          tamil_transliteration: string | null
          verse_number: number
        }
        Insert: {
          audio_url?: string | null
          book_code?: string | null
          chapter_number: number
          english_translation?: string | null
          english_transliteration?: string | null
          id?: number
          malayalam_translation?: string | null
          malayalam_transliteration?: string | null
          original_text: string
          tamil_translation?: string | null
          tamil_transliteration?: string | null
          verse_number: number
        }
        Update: {
          audio_url?: string | null
          book_code?: string | null
          chapter_number?: number
          english_translation?: string | null
          english_transliteration?: string | null
          id?: number
          malayalam_translation?: string | null
          malayalam_transliteration?: string | null
          original_text?: string
          tamil_translation?: string | null
          tamil_transliteration?: string | null
          verse_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "book_verses_book_code_fkey"
            columns: ["book_code"]
            isOneToOne: false
            referencedRelation: "holy_books"
            referencedColumns: ["code"]
          },
        ]
      }
      holy_books: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          id: number
          language: string | null
          name: string
          total_chapters: number | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          id?: number
          language?: string | null
          name: string
          total_chapters?: number | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          id?: number
          language?: string | null
          name?: string
          total_chapters?: number | null
        }
        Relationships: []
      }
      surahs: {
        Row: {
          english_name: string
          name: string
          number: number
          verses_count: number
        }
        Insert: {
          english_name: string
          name: string
          number: number
          verses_count: number
        }
        Update: {
          english_name?: string
          name?: string
          number?: number
          verses_count?: number
        }
        Relationships: []
      }
      transliterations: {
        Row: {
          created_at: string
          id: number
          language: string
          original_text: string
          transliterated_text: string
        }
        Insert: {
          created_at?: string
          id?: number
          language: string
          original_text: string
          transliterated_text: string
        }
        Update: {
          created_at?: string
          id?: number
          language?: string
          original_text?: string
          transliterated_text?: string
        }
        Relationships: []
      }
      verses: {
        Row: {
          arabic: string
          audio_url: string | null
          ayah_number: number
          english_translation: string | null
          english_transliteration: string | null
          id: number
          malayalam_translation: string | null
          malayalam_transliteration: string | null
          surah_number: number
          tamil_translation: string | null
          tamil_transliteration: string | null
        }
        Insert: {
          arabic: string
          audio_url?: string | null
          ayah_number: number
          english_translation?: string | null
          english_transliteration?: string | null
          id?: number
          malayalam_translation?: string | null
          malayalam_transliteration?: string | null
          surah_number: number
          tamil_translation?: string | null
          tamil_transliteration?: string | null
        }
        Update: {
          arabic?: string
          audio_url?: string | null
          ayah_number?: number
          english_translation?: string | null
          english_transliteration?: string | null
          id?: number
          malayalam_translation?: string | null
          malayalam_transliteration?: string | null
          surah_number?: number
          tamil_translation?: string | null
          tamil_transliteration?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verses_surah_number_fkey"
            columns: ["surah_number"]
            isOneToOne: false
            referencedRelation: "surahs"
            referencedColumns: ["number"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      migrate_quran_verses: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
