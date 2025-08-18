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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      academic_achievements: {
        Row: {
          academic_year: string | null
          achievement_description: string | null
          achievement_level: string | null
          achievement_name: string
          achievement_type: string
          actual_bacon: number | null
          actual_connections: number | null
          actual_gpa: number | null
          bacon_threshold: number | null
          badge_icon: string | null
          certificate_template: string | null
          created_at: string | null
          department: string | null
          display_order: number | null
          earned_date: string | null
          expires_date: string | null
          gpa_requirement: number | null
          id: string
          is_public: boolean | null
          is_verified: boolean | null
          networking_threshold: number | null
          semester_earned: string | null
          user_id: string | null
        }
        Insert: {
          academic_year?: string | null
          achievement_description?: string | null
          achievement_level?: string | null
          achievement_name: string
          achievement_type: string
          actual_bacon?: number | null
          actual_connections?: number | null
          actual_gpa?: number | null
          bacon_threshold?: number | null
          badge_icon?: string | null
          certificate_template?: string | null
          created_at?: string | null
          department?: string | null
          display_order?: number | null
          earned_date?: string | null
          expires_date?: string | null
          gpa_requirement?: number | null
          id?: string
          is_public?: boolean | null
          is_verified?: boolean | null
          networking_threshold?: number | null
          semester_earned?: string | null
          user_id?: string | null
        }
        Update: {
          academic_year?: string | null
          achievement_description?: string | null
          achievement_level?: string | null
          achievement_name?: string
          achievement_type?: string
          actual_bacon?: number | null
          actual_connections?: number | null
          actual_gpa?: number | null
          bacon_threshold?: number | null
          badge_icon?: string | null
          certificate_template?: string | null
          created_at?: string | null
          department?: string | null
          display_order?: number | null
          earned_date?: string | null
          expires_date?: string | null
          gpa_requirement?: number | null
          id?: string
          is_public?: boolean | null
          is_verified?: boolean | null
          networking_threshold?: number | null
          semester_earned?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "academic_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      academic_transcripts: {
        Row: {
          academic_year: string
          assignments_completed: number | null
          bacon_earned_course: number | null
          completion_date: string | null
          connections_made: number | null
          course_code: string
          course_description: string | null
          course_title: string
          created_at: string | null
          credit_hours: number | null
          deans_list: boolean | null
          department: string
          enrollment_date: string | null
          final_grade: string
          grade_points: number
          honors: boolean | null
          id: string
          learning_outcomes: string[] | null
          networking_efficiency: number | null
          participation_score: number | null
          professor_name: string | null
          quality_points: number
          semester: string
          successful_referrals: number | null
          transcript_locked: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          academic_year: string
          assignments_completed?: number | null
          bacon_earned_course?: number | null
          completion_date?: string | null
          connections_made?: number | null
          course_code: string
          course_description?: string | null
          course_title: string
          created_at?: string | null
          credit_hours?: number | null
          deans_list?: boolean | null
          department: string
          enrollment_date?: string | null
          final_grade: string
          grade_points: number
          honors?: boolean | null
          id?: string
          learning_outcomes?: string[] | null
          networking_efficiency?: number | null
          participation_score?: number | null
          professor_name?: string | null
          quality_points: number
          semester: string
          successful_referrals?: number | null
          transcript_locked?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          academic_year?: string
          assignments_completed?: number | null
          bacon_earned_course?: number | null
          completion_date?: string | null
          connections_made?: number | null
          course_code?: string
          course_description?: string | null
          course_title?: string
          created_at?: string | null
          credit_hours?: number | null
          deans_list?: boolean | null
          department?: string
          enrollment_date?: string | null
          final_grade?: string
          grade_points?: number
          honors?: boolean | null
          id?: string
          learning_outcomes?: string[] | null
          networking_efficiency?: number | null
          participation_score?: number | null
          professor_name?: string | null
          quality_points?: number
          semester?: string
          successful_referrals?: number | null
          transcript_locked?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "academic_transcripts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_actions: {
        Row: {
          action_data: Json | null
          action_type: string
          admin_user_id: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          reason: string | null
          target_id: string | null
          target_type: string | null
        }
        Insert: {
          action_data?: Json | null
          action_type: string
          admin_user_id: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          reason?: string | null
          target_id?: string | null
          target_type?: string | null
        }
        Update: {
          action_data?: Json | null
          action_type?: string
          admin_user_id?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          reason?: string | null
          target_id?: string | null
          target_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_actions_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          last_login: string | null
          permissions: Json | null
          role: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          last_login?: string | null
          permissions?: Json | null
          role?: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          last_login?: string | null
          permissions?: Json | null
          role?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_users_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      advertisements: {
        Row: {
          ad_type: string
          budget: number | null
          clicks: number | null
          content_data: Json
          content_type: string
          conversions: number | null
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string | null
          id: string
          impressions: number | null
          placement: string
          priority: number | null
          spent: number | null
          start_date: string | null
          status: string | null
          target_audience: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          ad_type: string
          budget?: number | null
          clicks?: number | null
          content_data: Json
          content_type: string
          conversions?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          impressions?: number | null
          placement: string
          priority?: number | null
          spent?: number | null
          start_date?: string | null
          status?: string | null
          target_audience?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          ad_type?: string
          budget?: number | null
          clicks?: number | null
          content_data?: Json
          content_type?: string
          conversions?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          impressions?: number | null
          placement?: string
          priority?: number | null
          spent?: number | null
          start_date?: string | null
          status?: string | null
          target_audience?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "advertisements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_metrics: {
        Row: {
          dimensions: Json | null
          id: string
          metric_name: string
          metric_type: string
          metric_value: number
          recorded_at: string | null
        }
        Insert: {
          dimensions?: Json | null
          id?: string
          metric_name: string
          metric_type: string
          metric_value: number
          recorded_at?: string | null
        }
        Update: {
          dimensions?: Json | null
          id?: string
          metric_name?: string
          metric_type?: string
          metric_value?: number
          recorded_at?: string | null
        }
        Relationships: []
      }
      anonymous_profiles: {
        Row: {
          anonymous_avatar: string
          anonymous_bio: string | null
          anonymous_name: string
          created_at: string | null
          display_stats: Json
          id: string
          listing_id: string | null
          location_general: string | null
          member_since: string
          real_seller_id: string | null
          updated_at: string | null
          verification_level: string
        }
        Insert: {
          anonymous_avatar: string
          anonymous_bio?: string | null
          anonymous_name: string
          created_at?: string | null
          display_stats?: Json
          id?: string
          listing_id?: string | null
          location_general?: string | null
          member_since?: string
          real_seller_id?: string | null
          updated_at?: string | null
          verification_level?: string
        }
        Update: {
          anonymous_avatar?: string
          anonymous_bio?: string | null
          anonymous_name?: string
          created_at?: string | null
          display_stats?: Json
          id?: string
          listing_id?: string | null
          location_general?: string | null
          member_since?: string
          real_seller_id?: string | null
          updated_at?: string | null
          verification_level?: string
        }
        Relationships: [
          {
            foreignKeyName: "anonymous_profiles_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "anonymous_profiles_real_seller_id_fkey"
            columns: ["real_seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_trail: {
        Row: {
          action: string
          changed_by: string | null
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string
          table_name: string
          user_agent: string | null
        }
        Insert: {
          action: string
          changed_by?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id: string
          table_name: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          changed_by?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string
          table_name?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      bacon_transactions: {
        Row: {
          amount: number
          chain_id: string | null
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          payout_method: string | null
          payout_reference: string | null
          payout_status: string | null
          processed_at: string | null
          purchase_id: string | null
          running_balance: number
          source_id: string | null
          source_type: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          chain_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          payout_method?: string | null
          payout_reference?: string | null
          payout_status?: string | null
          processed_at?: string | null
          purchase_id?: string | null
          running_balance: number
          source_id?: string | null
          source_type?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          chain_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          payout_method?: string | null
          payout_reference?: string | null
          payout_status?: string | null
          processed_at?: string | null
          purchase_id?: string | null
          running_balance?: number
          source_id?: string | null
          source_type?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bacon_transactions_chain_id_fkey"
            columns: ["chain_id"]
            isOneToOne: false
            referencedRelation: "referral_chains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bacon_transactions_purchase_id_fkey"
            columns: ["purchase_id"]
            isOneToOne: false
            referencedRelation: "purchases"
            referencedColumns: ["id"]
          },
        ]
      }
      chain_links: {
        Row: {
          bacon_amount: number | null
          bacon_paid: boolean | null
          bacon_percentage: number | null
          chain_id: string
          contact_hash: string | null
          contact_lock_expires: string | null
          created_at: string | null
          degree_position: number
          id: string
          referral_code: string
          referrer_id: string
          status: string | null
        }
        Insert: {
          bacon_amount?: number | null
          bacon_paid?: boolean | null
          bacon_percentage?: number | null
          chain_id: string
          contact_hash?: string | null
          contact_lock_expires?: string | null
          created_at?: string | null
          degree_position: number
          id?: string
          referral_code: string
          referrer_id: string
          status?: string | null
        }
        Update: {
          bacon_amount?: number | null
          bacon_paid?: boolean | null
          bacon_percentage?: number | null
          chain_id?: string
          contact_hash?: string | null
          contact_lock_expires?: string | null
          created_at?: string | null
          degree_position?: number
          id?: string
          referral_code?: string
          referrer_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chain_links_chain_id_fkey"
            columns: ["chain_id"]
            isOneToOne: false
            referencedRelation: "referral_chains"
            referencedColumns: ["id"]
          },
        ]
      }
      charity_fund: {
        Row: {
          allocated_at: string | null
          charity_allocation: Json
          disbursed: boolean | null
          disbursed_at: string | null
          id: string
          listing_id: string
          notes: string | null
          purchase_id: string
          unclaimed_amount: number
          unfilled_degrees: number
        }
        Insert: {
          allocated_at?: string | null
          charity_allocation: Json
          disbursed?: boolean | null
          disbursed_at?: string | null
          id?: string
          listing_id: string
          notes?: string | null
          purchase_id: string
          unclaimed_amount: number
          unfilled_degrees: number
        }
        Update: {
          allocated_at?: string | null
          charity_allocation?: Json
          disbursed?: boolean | null
          disbursed_at?: string | null
          id?: string
          listing_id?: string
          notes?: string | null
          purchase_id?: string
          unclaimed_amount?: number
          unfilled_degrees?: number
        }
        Relationships: [
          {
            foreignKeyName: "charity_fund_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "charity_fund_purchase_id_fkey"
            columns: ["purchase_id"]
            isOneToOne: true
            referencedRelation: "purchases"
            referencedColumns: ["id"]
          },
        ]
      }
      click_events: {
        Row: {
          browser: string | null
          chain_code: string | null
          city: string | null
          clicked_at: string | null
          converted_to_purchase: boolean | null
          converted_to_signup: boolean | null
          country: string | null
          device_type: string | null
          id: string
          ip_address: unknown | null
          referral_code: string | null
          share_event_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          browser?: string | null
          chain_code?: string | null
          city?: string | null
          clicked_at?: string | null
          converted_to_purchase?: boolean | null
          converted_to_signup?: boolean | null
          country?: string | null
          device_type?: string | null
          id?: string
          ip_address?: unknown | null
          referral_code?: string | null
          share_event_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          browser?: string | null
          chain_code?: string | null
          city?: string | null
          clicked_at?: string | null
          converted_to_purchase?: boolean | null
          converted_to_signup?: boolean | null
          country?: string | null
          device_type?: string | null
          id?: string
          ip_address?: unknown | null
          referral_code?: string | null
          share_event_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "click_events_share_event_id_fkey"
            columns: ["share_event_id"]
            isOneToOne: false
            referencedRelation: "share_events"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_lockdown: {
        Row: {
          buyer_id: string | null
          contact_revealed: boolean | null
          created_at: string | null
          escrow_payment_id: string | null
          id: string
          listing_id: string | null
          purchase_confirmed: boolean | null
          revelation_date: string | null
          seller_id: string | null
        }
        Insert: {
          buyer_id?: string | null
          contact_revealed?: boolean | null
          created_at?: string | null
          escrow_payment_id?: string | null
          id?: string
          listing_id?: string | null
          purchase_confirmed?: boolean | null
          revelation_date?: string | null
          seller_id?: string | null
        }
        Update: {
          buyer_id?: string | null
          contact_revealed?: boolean | null
          created_at?: string | null
          escrow_payment_id?: string | null
          id?: string
          listing_id?: string | null
          purchase_confirmed?: boolean | null
          revelation_date?: string | null
          seller_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_lockdown_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_lockdown_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_lockdown_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_locks: {
        Row: {
          chain_id: string
          contact_hash: string
          created_at: string | null
          created_by: string | null
          id: string
          listing_id: string
          lock_strength: number | null
          lock_type: string | null
          locked_until: string
        }
        Insert: {
          chain_id: string
          contact_hash: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          listing_id: string
          lock_strength?: number | null
          lock_type?: string | null
          locked_until: string
        }
        Update: {
          chain_id?: string
          contact_hash?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          listing_id?: string
          lock_strength?: number | null
          lock_type?: string | null
          locked_until?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_locks_chain_id_fkey"
            columns: ["chain_id"]
            isOneToOne: false
            referencedRelation: "referral_chains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_locks_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      content_violations: {
        Row: {
          automatic_action: string | null
          created_at: string | null
          filtered_content: string
          id: string
          manual_review_required: boolean | null
          message_id: string | null
          message_type: string | null
          original_content: string
          reviewed: boolean | null
          reviewed_at: string | null
          reviewed_by: string | null
          severity: string | null
          user_id: string
          violation_patterns: string[]
        }
        Insert: {
          automatic_action?: string | null
          created_at?: string | null
          filtered_content: string
          id?: string
          manual_review_required?: boolean | null
          message_id?: string | null
          message_type?: string | null
          original_content: string
          reviewed?: boolean | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          severity?: string | null
          user_id: string
          violation_patterns: string[]
        }
        Update: {
          automatic_action?: string | null
          created_at?: string | null
          filtered_content?: string
          id?: string
          manual_review_required?: boolean | null
          message_id?: string | null
          message_type?: string | null
          original_content?: string
          reviewed?: boolean | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          severity?: string | null
          user_id?: string
          violation_patterns?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "content_violations_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_violations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      degree_progression: {
        Row: {
          academic_standing: string | null
          actual_graduation_date: string | null
          concentration: string | null
          core_requirements_completed: Json | null
          created_at: string | null
          credits_needed_next_level: number | null
          current_degree: string
          deans_list_semesters: number | null
          degree_title: string | null
          elective_requirements_completed: Json | null
          enrollment_date: string | null
          expected_graduation_date: string | null
          graduation_honors: string | null
          honor_roll_semesters: number | null
          id: string
          last_activity_date: string | null
          major: string | null
          major_gpa: number | null
          minor: string | null
          network_reach: number | null
          overall_gpa: number | null
          specialization_requirements: Json | null
          thesis_project_id: string | null
          total_bacon_earned: number | null
          total_connections_made: number | null
          total_credit_hours: number | null
          total_successful_referrals: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          academic_standing?: string | null
          actual_graduation_date?: string | null
          concentration?: string | null
          core_requirements_completed?: Json | null
          created_at?: string | null
          credits_needed_next_level?: number | null
          current_degree?: string
          deans_list_semesters?: number | null
          degree_title?: string | null
          elective_requirements_completed?: Json | null
          enrollment_date?: string | null
          expected_graduation_date?: string | null
          graduation_honors?: string | null
          honor_roll_semesters?: number | null
          id?: string
          last_activity_date?: string | null
          major?: string | null
          major_gpa?: number | null
          minor?: string | null
          network_reach?: number | null
          overall_gpa?: number | null
          specialization_requirements?: Json | null
          thesis_project_id?: string | null
          total_bacon_earned?: number | null
          total_connections_made?: number | null
          total_credit_hours?: number | null
          total_successful_referrals?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          academic_standing?: string | null
          actual_graduation_date?: string | null
          concentration?: string | null
          core_requirements_completed?: Json | null
          created_at?: string | null
          credits_needed_next_level?: number | null
          current_degree?: string
          deans_list_semesters?: number | null
          degree_title?: string | null
          elective_requirements_completed?: Json | null
          enrollment_date?: string | null
          expected_graduation_date?: string | null
          graduation_honors?: string | null
          honor_roll_semesters?: number | null
          id?: string
          last_activity_date?: string | null
          major?: string | null
          major_gpa?: number | null
          minor?: string | null
          network_reach?: number | null
          overall_gpa?: number | null
          specialization_requirements?: Json | null
          thesis_project_id?: string | null
          total_bacon_earned?: number | null
          total_connections_made?: number | null
          total_credit_hours?: number | null
          total_successful_referrals?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "degree_progression_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      direct_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          listing_id: string
          read_at: string | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          listing_id: string
          read_at?: string | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          listing_id?: string
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "direct_messages_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "direct_messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "direct_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          created_at: string | null
          created_by: string | null
          html_content: string
          id: string
          status: string | null
          subject: string
          template_name: string
          template_type: string
          text_content: string | null
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          html_content: string
          id?: string
          status?: string | null
          subject: string
          template_name: string
          template_type: string
          text_content?: string | null
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          html_content?: string
          id?: string
          status?: string | null
          subject?: string
          template_name?: string
          template_type?: string
          text_content?: string | null
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "email_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      escrow_transactions: {
        Row: {
          amount: number
          buyer_id: string
          completed_at: string | null
          created_at: string
          escrow_fee: number
          funded_at: string | null
          id: string
          listing_id: string
          metadata: Json | null
          paypal_order_id: string | null
          referral_pool: number
          seller_amount: number
          seller_id: string
          seller_revealed_at: string | null
          status: string
          stripe_payment_intent_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          buyer_id: string
          completed_at?: string | null
          created_at?: string
          escrow_fee?: number
          funded_at?: string | null
          id?: string
          listing_id: string
          metadata?: Json | null
          paypal_order_id?: string | null
          referral_pool?: number
          seller_amount?: number
          seller_id: string
          seller_revealed_at?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          buyer_id?: string
          completed_at?: string | null
          created_at?: string
          escrow_fee?: number
          funded_at?: string | null
          id?: string
          listing_id?: string
          metadata?: Json | null
          paypal_order_id?: string | null
          referral_pool?: number
          seller_amount?: number
          seller_id?: string
          seller_revealed_at?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      feature_flags: {
        Row: {
          conditions: Json | null
          created_at: string | null
          created_by: string | null
          flag_description: string | null
          flag_name: string
          id: string
          is_enabled: boolean | null
          rollout_percentage: number | null
          target_users: Json | null
          updated_at: string | null
        }
        Insert: {
          conditions?: Json | null
          created_at?: string | null
          created_by?: string | null
          flag_description?: string | null
          flag_name: string
          id?: string
          is_enabled?: boolean | null
          rollout_percentage?: number | null
          target_users?: Json | null
          updated_at?: string | null
        }
        Update: {
          conditions?: Json | null
          created_at?: string | null
          created_by?: string | null
          flag_description?: string | null
          flag_name?: string
          id?: string
          is_enabled?: boolean | null
          rollout_percentage?: number | null
          target_users?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feature_flags_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      fraud_alerts: {
        Row: {
          alert_type: string
          assigned_to: string | null
          created_at: string | null
          detection_method: string | null
          evidence: Json | null
          id: string
          investigated_at: string | null
          related_chain_id: string | null
          related_listing_id: string | null
          related_purchase_id: string | null
          resolution_notes: string | null
          resolved_at: string | null
          risk_score: number | null
          severity: string
          status: string | null
          suspicious_activity: Json | null
          user_id: string | null
        }
        Insert: {
          alert_type: string
          assigned_to?: string | null
          created_at?: string | null
          detection_method?: string | null
          evidence?: Json | null
          id?: string
          investigated_at?: string | null
          related_chain_id?: string | null
          related_listing_id?: string | null
          related_purchase_id?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          risk_score?: number | null
          severity: string
          status?: string | null
          suspicious_activity?: Json | null
          user_id?: string | null
        }
        Update: {
          alert_type?: string
          assigned_to?: string | null
          created_at?: string | null
          detection_method?: string | null
          evidence?: Json | null
          id?: string
          investigated_at?: string | null
          related_chain_id?: string | null
          related_listing_id?: string | null
          related_purchase_id?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          risk_score?: number | null
          severity?: string
          status?: string | null
          suspicious_activity?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fraud_alerts_related_chain_id_fkey"
            columns: ["related_chain_id"]
            isOneToOne: false
            referencedRelation: "referral_chains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fraud_alerts_related_listing_id_fkey"
            columns: ["related_listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fraud_alerts_related_purchase_id_fkey"
            columns: ["related_purchase_id"]
            isOneToOne: false
            referencedRelation: "purchases"
            referencedColumns: ["id"]
          },
        ]
      }
      fraud_reports: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          evidence_urls: string[] | null
          id: string
          priority: string | null
          report_reason: string
          report_type: string
          reported_listing_id: string | null
          reported_share_link_id: string | null
          reported_user_id: string | null
          reporter_user_id: string | null
          resolution_notes: string | null
          resolved_at: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          evidence_urls?: string[] | null
          id?: string
          priority?: string | null
          report_reason: string
          report_type: string
          reported_listing_id?: string | null
          reported_share_link_id?: string | null
          reported_user_id?: string | null
          reporter_user_id?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          evidence_urls?: string[] | null
          id?: string
          priority?: string | null
          report_reason?: string
          report_type?: string
          reported_listing_id?: string | null
          reported_share_link_id?: string | null
          reported_user_id?: string | null
          reporter_user_id?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fraud_reports_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fraud_reports_reported_listing_id_fkey"
            columns: ["reported_listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fraud_reports_reported_share_link_id_fkey"
            columns: ["reported_share_link_id"]
            isOneToOne: false
            referencedRelation: "share_links"
            referencedColumns: ["id"]
          },
        ]
      }
      gpa_calculations: {
        Row: {
          academic_year: string | null
          calculation_date: string | null
          calculation_type: string
          class_rank: number | null
          courses_included: number
          created_at: string | null
          gpa_value: number
          honor_status: string | null
          id: string
          is_official: boolean | null
          networking_efficiency: number | null
          percentile: number | null
          semester: string | null
          successful_referrals_period: number | null
          total_bacon_period: number | null
          total_credit_hours: number
          total_quality_points: number
          user_id: string | null
        }
        Insert: {
          academic_year?: string | null
          calculation_date?: string | null
          calculation_type: string
          class_rank?: number | null
          courses_included: number
          created_at?: string | null
          gpa_value: number
          honor_status?: string | null
          id?: string
          is_official?: boolean | null
          networking_efficiency?: number | null
          percentile?: number | null
          semester?: string | null
          successful_referrals_period?: number | null
          total_bacon_period?: number | null
          total_credit_hours: number
          total_quality_points: number
          user_id?: string | null
        }
        Update: {
          academic_year?: string | null
          calculation_date?: string | null
          calculation_type?: string
          class_rank?: number | null
          courses_included?: number
          created_at?: string | null
          gpa_value?: number
          honor_status?: string | null
          id?: string
          is_official?: boolean | null
          networking_efficiency?: number | null
          percentile?: number | null
          semester?: string | null
          successful_referrals_period?: number | null
          total_bacon_period?: number | null
          total_credit_hours?: number
          total_quality_points?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gpa_calculations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_chat_messages: {
        Row: {
          content: string
          created_at: string | null
          filtered_content: string
          flagged_reason: string | null
          id: string
          listing_id: string
          message_type: string
          sender_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          filtered_content: string
          flagged_reason?: string | null
          id?: string
          listing_id: string
          message_type: string
          sender_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          filtered_content?: string
          flagged_reason?: string | null
          id?: string
          listing_id?: string
          message_type?: string
          sender_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listing_chat_messages_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          listing_id: string
          referral_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          listing_id: string
          referral_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          listing_id?: string
          referral_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listing_events_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_events_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_fees: {
        Row: {
          amount: number
          created_at: string
          id: string
          listing_id: string
          paid_at: string | null
          payment_method: string
          payment_status: string
          paypal_order_id: string | null
          stripe_session_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          listing_id: string
          paid_at?: string | null
          payment_method?: string
          payment_status?: string
          paypal_order_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          listing_id?: string
          paid_at?: string | null
          payment_method?: string
          payment_status?: string
          paypal_order_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      listings: {
        Row: {
          admin_notes: string | null
          admin_status: string | null
          asking_price: number | null
          category: string | null
          created_at: string
          department: string | null
          ends_at: string | null
          flag_reason: string | null
          flagged_at: string | null
          flagged_by: string | null
          general_location: string | null
          id: string
          item_description: string | null
          item_images: Json | null
          item_title: string
          location: string | null
          max_degrees: number
          price_max: number | null
          price_min: number | null
          priority_score: number | null
          reward_percentage: number | null
          seller_rating: number | null
          status: string
          updated_at: string
          user_id: string
          verification_level: Database["public"]["Enums"]["verification_level"]
        }
        Insert: {
          admin_notes?: string | null
          admin_status?: string | null
          asking_price?: number | null
          category?: string | null
          created_at?: string
          department?: string | null
          ends_at?: string | null
          flag_reason?: string | null
          flagged_at?: string | null
          flagged_by?: string | null
          general_location?: string | null
          id?: string
          item_description?: string | null
          item_images?: Json | null
          item_title: string
          location?: string | null
          max_degrees?: number
          price_max?: number | null
          price_min?: number | null
          priority_score?: number | null
          reward_percentage?: number | null
          seller_rating?: number | null
          status?: string
          updated_at?: string
          user_id: string
          verification_level?: Database["public"]["Enums"]["verification_level"]
        }
        Update: {
          admin_notes?: string | null
          admin_status?: string | null
          asking_price?: number | null
          category?: string | null
          created_at?: string
          department?: string | null
          ends_at?: string | null
          flag_reason?: string | null
          flagged_at?: string | null
          flagged_by?: string | null
          general_location?: string | null
          id?: string
          item_description?: string | null
          item_images?: Json | null
          item_title?: string
          location?: string | null
          max_degrees?: number
          price_max?: number | null
          price_min?: number | null
          priority_score?: number | null
          reward_percentage?: number | null
          seller_rating?: number | null
          status?: string
          updated_at?: string
          user_id?: string
          verification_level?: Database["public"]["Enums"]["verification_level"]
        }
        Relationships: [
          {
            foreignKeyName: "listings_flagged_by_fkey"
            columns: ["flagged_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      media_library: {
        Row: {
          alt_text: string | null
          caption: string | null
          created_at: string | null
          file_size: number
          file_type: string
          file_url: string
          filename: string
          id: string
          mime_type: string
          original_filename: string
          tags: string[] | null
          thumbnail_url: string | null
          updated_at: string | null
          uploaded_by: string | null
          usage_count: number | null
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string | null
          file_size: number
          file_type: string
          file_url: string
          filename: string
          id?: string
          mime_type: string
          original_filename: string
          tags?: string[] | null
          thumbnail_url?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
          usage_count?: number | null
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string | null
          file_size?: number
          file_type?: string
          file_url?: string
          filename?: string
          id?: string
          mime_type?: string
          original_filename?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
          usage_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "media_library_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          account_details: string
          account_name: string
          created_at: string | null
          fees: Json | null
          id: string
          is_default: boolean | null
          is_verified: boolean | null
          metadata: Json | null
          payment_type: string
          updated_at: string | null
          user_id: string
          verification_data: Json | null
        }
        Insert: {
          account_details: string
          account_name: string
          created_at?: string | null
          fees?: Json | null
          id?: string
          is_default?: boolean | null
          is_verified?: boolean | null
          metadata?: Json | null
          payment_type: string
          updated_at?: string | null
          user_id: string
          verification_data?: Json | null
        }
        Update: {
          account_details?: string
          account_name?: string
          created_at?: string | null
          fees?: Json | null
          id?: string
          is_default?: boolean | null
          is_verified?: boolean | null
          metadata?: Json | null
          payment_type?: string
          updated_at?: string | null
          user_id?: string
          verification_data?: Json | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          listing_id: string | null
          provider: string | null
          reference: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          listing_id?: string | null
          provider?: string | null
          reference?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          listing_id?: string | null
          provider?: string | null
          reference?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_listing_fk"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      purchases: {
        Row: {
          buyer_id: string
          chain_id: string | null
          completed_at: string | null
          created_at: string | null
          delivered_at: string | null
          delivery_address: Json | null
          delivery_method: string | null
          escrow_confirmed_at: string | null
          escrow_fee: number | null
          escrow_transaction_id: string | null
          final_price: number
          id: string
          listing_id: string
          payment_method: string | null
          payment_processor: string | null
          platform_fee: number | null
          seller_id: string
          seller_payout: number | null
          seller_revealed_at: string | null
          status: string | null
          stripe_payment_intent_id: string | null
          total_amount: number | null
          total_bacon_distributed: number | null
          tracking_info: Json | null
        }
        Insert: {
          buyer_id: string
          chain_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          delivered_at?: string | null
          delivery_address?: Json | null
          delivery_method?: string | null
          escrow_confirmed_at?: string | null
          escrow_fee?: number | null
          escrow_transaction_id?: string | null
          final_price: number
          id?: string
          listing_id: string
          payment_method?: string | null
          payment_processor?: string | null
          platform_fee?: number | null
          seller_id: string
          seller_payout?: number | null
          seller_revealed_at?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          total_amount?: number | null
          total_bacon_distributed?: number | null
          tracking_info?: Json | null
        }
        Update: {
          buyer_id?: string
          chain_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          delivered_at?: string | null
          delivery_address?: Json | null
          delivery_method?: string | null
          escrow_confirmed_at?: string | null
          escrow_fee?: number | null
          escrow_transaction_id?: string | null
          final_price?: number
          id?: string
          listing_id?: string
          payment_method?: string | null
          payment_processor?: string | null
          platform_fee?: number | null
          seller_id?: string
          seller_payout?: number | null
          seller_revealed_at?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          total_amount?: number | null
          total_bacon_distributed?: number | null
          tracking_info?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "purchases_chain_id_fkey"
            columns: ["chain_id"]
            isOneToOne: false
            referencedRelation: "referral_chains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchases_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_chains: {
        Row: {
          chain_code: string
          completed_at: string | null
          created_at: string | null
          current_degree_count: number | null
          degree_distribution: Json | null
          expires_at: string | null
          id: string
          listing_id: string
          max_degrees: number | null
          purchase_completed: boolean | null
          seller_revealed: boolean | null
          status: string | null
          total_bacon_pool: number | null
        }
        Insert: {
          chain_code: string
          completed_at?: string | null
          created_at?: string | null
          current_degree_count?: number | null
          degree_distribution?: Json | null
          expires_at?: string | null
          id?: string
          listing_id: string
          max_degrees?: number | null
          purchase_completed?: boolean | null
          seller_revealed?: boolean | null
          status?: string | null
          total_bacon_pool?: number | null
        }
        Update: {
          chain_code?: string
          completed_at?: string | null
          created_at?: string | null
          current_degree_count?: number | null
          degree_distribution?: Json | null
          expires_at?: string | null
          id?: string
          listing_id?: string
          max_degrees?: number | null
          purchase_completed?: boolean | null
          seller_revealed?: boolean | null
          status?: string | null
          total_bacon_pool?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "referral_chains_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          created_at: string
          degree: number
          id: string
          listing_id: string
          note: string | null
          referrer_id: string
        }
        Insert: {
          created_at?: string
          degree: number
          id?: string
          listing_id: string
          note?: string | null
          referrer_id: string
        }
        Update: {
          created_at?: string
          degree?: number
          id?: string
          listing_id?: string
          note?: string | null
          referrer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      share_clicks: {
        Row: {
          clicked_at: string | null
          conversion_amount: number | null
          conversion_at: string | null
          converted: boolean | null
          created_at: string | null
          id: string
          ip_address: unknown | null
          location: Json | null
          referrer_url: string | null
          session_id: string | null
          share_link_id: string
          user_agent: string | null
        }
        Insert: {
          clicked_at?: string | null
          conversion_amount?: number | null
          conversion_at?: string | null
          converted?: boolean | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          location?: Json | null
          referrer_url?: string | null
          session_id?: string | null
          share_link_id: string
          user_agent?: string | null
        }
        Update: {
          clicked_at?: string | null
          conversion_amount?: number | null
          conversion_at?: string | null
          converted?: boolean | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          location?: Json | null
          referrer_url?: string | null
          session_id?: string | null
          share_link_id?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "share_clicks_share_link_id_fkey"
            columns: ["share_link_id"]
            isOneToOne: false
            referencedRelation: "share_links"
            referencedColumns: ["id"]
          },
        ]
      }
      share_conversions: {
        Row: {
          buyer_id: string | null
          commission_amount: number
          commission_percentage: number
          converted_at: string | null
          created_at: string | null
          degree: number
          id: string
          listing_id: string
          purchase_amount: number
          share_click_id: string
          share_link_id: string
        }
        Insert: {
          buyer_id?: string | null
          commission_amount: number
          commission_percentage: number
          converted_at?: string | null
          created_at?: string | null
          degree: number
          id?: string
          listing_id: string
          purchase_amount: number
          share_click_id: string
          share_link_id: string
        }
        Update: {
          buyer_id?: string | null
          commission_amount?: number
          commission_percentage?: number
          converted_at?: string | null
          created_at?: string | null
          degree?: number
          id?: string
          listing_id?: string
          purchase_amount?: number
          share_click_id?: string
          share_link_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "share_conversions_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "share_conversions_share_click_id_fkey"
            columns: ["share_click_id"]
            isOneToOne: false
            referencedRelation: "share_clicks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "share_conversions_share_link_id_fkey"
            columns: ["share_link_id"]
            isOneToOne: false
            referencedRelation: "share_links"
            referencedColumns: ["id"]
          },
        ]
      }
      share_events: {
        Row: {
          chain_link_id: string
          click_count: number | null
          custom_message: string | null
          id: string
          ip_address: unknown | null
          platform: string
          purchase_conversions: number | null
          referrer_url: string | null
          share_url: string | null
          shared_at: string | null
          signup_conversions: number | null
          user_agent: string | null
          utm_parameters: Json | null
        }
        Insert: {
          chain_link_id: string
          click_count?: number | null
          custom_message?: string | null
          id?: string
          ip_address?: unknown | null
          platform: string
          purchase_conversions?: number | null
          referrer_url?: string | null
          share_url?: string | null
          shared_at?: string | null
          signup_conversions?: number | null
          user_agent?: string | null
          utm_parameters?: Json | null
        }
        Update: {
          chain_link_id?: string
          click_count?: number | null
          custom_message?: string | null
          id?: string
          ip_address?: unknown | null
          platform?: string
          purchase_conversions?: number | null
          referrer_url?: string | null
          share_url?: string | null
          shared_at?: string | null
          signup_conversions?: number | null
          user_agent?: string | null
          utm_parameters?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "share_events_chain_link_id_fkey"
            columns: ["chain_link_id"]
            isOneToOne: false
            referencedRelation: "chain_links"
            referencedColumns: ["id"]
          },
        ]
      }
      share_link_analytics: {
        Row: {
          bounce_rate: boolean | null
          browser: string | null
          chain_degree: number | null
          city: string | null
          conversion_value: number | null
          country: string | null
          device_type: string | null
          event_timestamp: string | null
          event_type: string
          id: string
          ip_address: unknown | null
          operating_system: string | null
          pages_viewed: number | null
          previous_referrer: string | null
          referrer_url: string | null
          region: string | null
          session_id: string | null
          share_link_id: string | null
          time_on_page: number | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          bounce_rate?: boolean | null
          browser?: string | null
          chain_degree?: number | null
          city?: string | null
          conversion_value?: number | null
          country?: string | null
          device_type?: string | null
          event_timestamp?: string | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          operating_system?: string | null
          pages_viewed?: number | null
          previous_referrer?: string | null
          referrer_url?: string | null
          region?: string | null
          session_id?: string | null
          share_link_id?: string | null
          time_on_page?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          bounce_rate?: boolean | null
          browser?: string | null
          chain_degree?: number | null
          city?: string | null
          conversion_value?: number | null
          country?: string | null
          device_type?: string | null
          event_timestamp?: string | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          operating_system?: string | null
          pages_viewed?: number | null
          previous_referrer?: string | null
          referrer_url?: string | null
          region?: string | null
          session_id?: string | null
          share_link_id?: string | null
          time_on_page?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "share_link_analytics_previous_referrer_fkey"
            columns: ["previous_referrer"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "share_link_analytics_share_link_id_fkey"
            columns: ["share_link_id"]
            isOneToOne: false
            referencedRelation: "share_links_enhanced"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "share_link_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      share_link_performance: {
        Row: {
          clicks: number | null
          content_hash: string | null
          conversion_value: number | null
          conversions: number | null
          created_at: string | null
          engagement_score: number | null
          id: string
          impressions: number | null
          last_updated: string | null
          performance_rating: string | null
          platform: string
          share_link_id: string
          shares: number | null
          user_id: string
        }
        Insert: {
          clicks?: number | null
          content_hash?: string | null
          conversion_value?: number | null
          conversions?: number | null
          created_at?: string | null
          engagement_score?: number | null
          id?: string
          impressions?: number | null
          last_updated?: string | null
          performance_rating?: string | null
          platform: string
          share_link_id: string
          shares?: number | null
          user_id: string
        }
        Update: {
          clicks?: number | null
          content_hash?: string | null
          conversion_value?: number | null
          conversions?: number | null
          created_at?: string | null
          engagement_score?: number | null
          id?: string
          impressions?: number | null
          last_updated?: string | null
          performance_rating?: string | null
          platform?: string
          share_link_id?: string
          shares?: number | null
          user_id?: string
        }
        Relationships: []
      }
      share_links: {
        Row: {
          bacon_earned: number | null
          clicks: number | null
          content_generated: string
          conversions: number | null
          created_at: string | null
          custom_message: string | null
          id: string
          last_clicked_at: string | null
          listing_id: string
          platform: string
          share_url: string
          status: string | null
          tracking_code: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bacon_earned?: number | null
          clicks?: number | null
          content_generated: string
          conversions?: number | null
          created_at?: string | null
          custom_message?: string | null
          id?: string
          last_clicked_at?: string | null
          listing_id: string
          platform: string
          share_url: string
          status?: string | null
          tracking_code: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bacon_earned?: number | null
          clicks?: number | null
          content_generated?: string
          conversions?: number | null
          created_at?: string | null
          custom_message?: string | null
          id?: string
          last_clicked_at?: string | null
          listing_id?: string
          platform?: string
          share_url?: string
          status?: string | null
          tracking_code?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "share_links_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      share_links_enhanced: {
        Row: {
          analytics_data: Json | null
          bacon_earned: number | null
          chain_link_id: string | null
          clicks: number | null
          content_template: string | null
          conversions: number | null
          created_at: string | null
          custom_message: string | null
          engagement_score: number | null
          estimated_reach: number | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          last_clicked_at: string | null
          last_updated: string | null
          listing_id: string | null
          platform: string
          share_type: string | null
          share_url: string
          short_url: string | null
          signup_conversions: number | null
          target_audience: string | null
          tracking_code: string
          unique_clicks: number | null
          user_id: string | null
          utm_parameters: Json | null
        }
        Insert: {
          analytics_data?: Json | null
          bacon_earned?: number | null
          chain_link_id?: string | null
          clicks?: number | null
          content_template?: string | null
          conversions?: number | null
          created_at?: string | null
          custom_message?: string | null
          engagement_score?: number | null
          estimated_reach?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          last_clicked_at?: string | null
          last_updated?: string | null
          listing_id?: string | null
          platform: string
          share_type?: string | null
          share_url: string
          short_url?: string | null
          signup_conversions?: number | null
          target_audience?: string | null
          tracking_code: string
          unique_clicks?: number | null
          user_id?: string | null
          utm_parameters?: Json | null
        }
        Update: {
          analytics_data?: Json | null
          bacon_earned?: number | null
          chain_link_id?: string | null
          clicks?: number | null
          content_template?: string | null
          conversions?: number | null
          created_at?: string | null
          custom_message?: string | null
          engagement_score?: number | null
          estimated_reach?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          last_clicked_at?: string | null
          last_updated?: string | null
          listing_id?: string | null
          platform?: string
          share_type?: string | null
          share_url?: string
          short_url?: string | null
          signup_conversions?: number | null
          target_audience?: string | null
          tracking_code?: string
          unique_clicks?: number | null
          user_id?: string | null
          utm_parameters?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "share_links_enhanced_chain_link_id_fkey"
            columns: ["chain_link_id"]
            isOneToOne: false
            referencedRelation: "chain_links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "share_links_enhanced_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "share_links_enhanced_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      share_templates: {
        Row: {
          average_engagement: number | null
          call_to_action: string | null
          content_template: string
          created_at: string | null
          emoji_pack: string | null
          hashtags: string[] | null
          id: string
          is_active: boolean | null
          optimal_times: Json | null
          platform: string
          subject_line: string | null
          success_rate: number | null
          target_demographics: Json | null
          template_name: string
          template_type: string
          updated_at: string | null
          usage_count: number | null
        }
        Insert: {
          average_engagement?: number | null
          call_to_action?: string | null
          content_template: string
          created_at?: string | null
          emoji_pack?: string | null
          hashtags?: string[] | null
          id?: string
          is_active?: boolean | null
          optimal_times?: Json | null
          platform: string
          subject_line?: string | null
          success_rate?: number | null
          target_demographics?: Json | null
          template_name: string
          template_type: string
          updated_at?: string | null
          usage_count?: number | null
        }
        Update: {
          average_engagement?: number | null
          call_to_action?: string | null
          content_template?: string
          created_at?: string | null
          emoji_pack?: string | null
          hashtags?: string[] | null
          id?: string
          is_active?: boolean | null
          optimal_times?: Json | null
          platform?: string
          subject_line?: string | null
          success_rate?: number | null
          target_demographics?: Json | null
          template_name?: string
          template_type?: string
          updated_at?: string | null
          usage_count?: number | null
        }
        Relationships: []
      }
      site_config: {
        Row: {
          config_key: string
          config_type: string
          config_value: Json
          created_at: string | null
          description: string | null
          id: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          config_key: string
          config_type: string
          config_value: Json
          created_at?: string | null
          description?: string | null
          id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          config_key?: string
          config_type?: string
          config_value?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "site_config_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      system_alerts: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          alert_data: Json | null
          alert_type: string
          created_at: string | null
          id: string
          message: string
          resolved_at: string | null
          severity: string
          status: string | null
          title: string
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_data?: Json | null
          alert_type: string
          created_at?: string | null
          id?: string
          message: string
          resolved_at?: string | null
          severity: string
          status?: string | null
          title: string
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_data?: Json | null
          alert_type?: string
          created_at?: string | null
          id?: string
          message?: string
          resolved_at?: string | null
          severity?: string
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "system_alerts_acknowledged_by_fkey"
            columns: ["acknowledged_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity_logs: {
        Row: {
          activity_data: Json | null
          activity_type: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          activity_data?: Json | null
          activity_type: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_reports: {
        Row: {
          admin_notes: string | null
          category: string
          created_at: string | null
          description: string
          id: string
          listing_id: string | null
          message_id: string | null
          reported_user_id: string
          reporter_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          severity: string | null
          status: string | null
        }
        Insert: {
          admin_notes?: string | null
          category: string
          created_at?: string | null
          description: string
          id?: string
          listing_id?: string | null
          message_id?: string | null
          reported_user_id: string
          reporter_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          severity?: string | null
          status?: string | null
        }
        Update: {
          admin_notes?: string | null
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          listing_id?: string | null
          message_id?: string | null
          reported_user_id?: string
          reporter_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          severity?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_reports_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_reports_reported_user_id_fkey"
            columns: ["reported_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_reports_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_badges: {
        Row: {
          anonymous_profile_id: string | null
          badge_icon: string | null
          badge_level: string
          badge_type: string
          display_name: string
          earned_date: string | null
          expires_date: string | null
          id: string
          is_active: boolean | null
        }
        Insert: {
          anonymous_profile_id?: string | null
          badge_icon?: string | null
          badge_level: string
          badge_type: string
          display_name: string
          earned_date?: string | null
          expires_date?: string | null
          id?: string
          is_active?: boolean | null
        }
        Update: {
          anonymous_profile_id?: string | null
          badge_icon?: string | null
          badge_level?: string
          badge_type?: string
          display_name?: string
          earned_date?: string | null
          expires_date?: string | null
          id?: string
          is_active?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "verification_badges_anonymous_profile_id_fkey"
            columns: ["anonymous_profile_id"]
            isOneToOne: false
            referencedRelation: "anonymous_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_documents: {
        Row: {
          created_at: string
          file_path: string
          id: string
          reviewer_note: string | null
          status: Database["public"]["Enums"]["review_status"]
          type: Database["public"]["Enums"]["verification_doc_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          file_path: string
          id?: string
          reviewer_note?: string | null
          status?: Database["public"]["Enums"]["review_status"]
          type: Database["public"]["Enums"]["verification_doc_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          file_path?: string
          id?: string
          reviewer_note?: string | null
          status?: Database["public"]["Enums"]["review_status"]
          type?: Database["public"]["Enums"]["verification_doc_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      verification_requests: {
        Row: {
          approved_at: string | null
          created_at: string | null
          documents: Json | null
          expires_at: string | null
          id: string
          notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          updated_at: string | null
          user_id: string
          verification_data: Json | null
          verification_level: string | null
          verification_type: string
        }
        Insert: {
          approved_at?: string | null
          created_at?: string | null
          documents?: Json | null
          expires_at?: string | null
          id?: string
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          verification_data?: Json | null
          verification_level?: string | null
          verification_type: string
        }
        Update: {
          approved_at?: string | null
          created_at?: string | null
          documents?: Json | null
          expires_at?: string | null
          id?: string
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          verification_data?: Json | null
          verification_level?: string | null
          verification_type?: string
        }
        Relationships: []
      }
      verification_status: {
        Row: {
          created_at: string
          email_verified: boolean
          id_verified: boolean
          notes: Json
          phone_verified: boolean
          trusted_seller: boolean
          updated_at: string
          user_id: string
          utility_bill_verified: boolean
        }
        Insert: {
          created_at?: string
          email_verified?: boolean
          id_verified?: boolean
          notes?: Json
          phone_verified?: boolean
          trusted_seller?: boolean
          updated_at?: string
          user_id: string
          utility_bill_verified?: boolean
        }
        Update: {
          created_at?: string
          email_verified?: boolean
          id_verified?: boolean
          notes?: Json
          phone_verified?: boolean
          trusted_seller?: boolean
          updated_at?: string
          user_id?: string
          utility_bill_verified?: boolean
        }
        Relationships: []
      }
      viral_coefficients: {
        Row: {
          academic_gpa: number | null
          average_order_value: number | null
          clicks_generated: number | null
          conversion_rate: number | null
          created_at: string | null
          degree_level: string | null
          honor_status: string | null
          id: string
          k_factor: number | null
          measurement_period: string
          new_users_brought: number | null
          period_end: string
          period_start: string
          purchases_generated: number | null
          shares_created: number | null
          total_bacon_from_referrals: number | null
          user_id: string | null
          viral_coefficient: number | null
        }
        Insert: {
          academic_gpa?: number | null
          average_order_value?: number | null
          clicks_generated?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          degree_level?: string | null
          honor_status?: string | null
          id?: string
          k_factor?: number | null
          measurement_period: string
          new_users_brought?: number | null
          period_end: string
          period_start: string
          purchases_generated?: number | null
          shares_created?: number | null
          total_bacon_from_referrals?: number | null
          user_id?: string | null
          viral_coefficient?: number | null
        }
        Update: {
          academic_gpa?: number | null
          average_order_value?: number | null
          clicks_generated?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          degree_level?: string | null
          honor_status?: string | null
          id?: string
          k_factor?: number | null
          measurement_period?: string
          new_users_brought?: number | null
          period_end?: string
          period_start?: string
          purchases_generated?: number | null
          shares_created?: number | null
          total_bacon_from_referrals?: number | null
          user_id?: string | null
          viral_coefficient?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "viral_coefficients_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_ban_user: {
        Args: {
          admin_id_param: string
          ban_duration_days?: number
          ban_reason_param: string
          user_id_param: string
        }
        Returns: Json
      }
      admin_forfeit_bacon: {
        Args: {
          admin_id_param: string
          amount_param?: number
          reason_param: string
          user_id_param: string
        }
        Returns: Json
      }
      calculate_semester_gpa: {
        Args: { semester_name: string; user_uuid: string; year: string }
        Returns: number
      }
      generate_anonymous_profile: {
        Args: { listing_id: string; seller_id: string }
        Returns: string
      }
      generate_tracking_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_admin_dashboard_metrics: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_charity_fund_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          charity_breakdown: Json
          disbursed_amount: number
          pending_amount: number
          total_amount: number
          total_listings: number
        }[]
      }
      get_chat_moderation_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          critical_violations: number
          flagged_messages: number
          reports_submitted: number
          total_messages: number
          violations_detected: number
        }[]
      }
      get_share_analytics: {
        Args: { user_id_param: string }
        Returns: Json
      }
      get_share_link_performance: {
        Args: { share_link_id_param: string }
        Returns: Json
      }
      get_share_performance_summary: {
        Args: { user_id_filter?: string }
        Returns: {
          actual_clicks: number
          actual_conversions: number
          actual_earnings: number
          asking_price: number
          bacon_earned: number
          clicks: number
          content_generated: string
          conversions: number
          created_at: string
          custom_message: string
          id: string
          item_description: string
          item_title: string
          last_clicked_at: string
          listing_id: string
          platform: string
          share_url: string
          status: string
          tracking_code: string
          updated_at: string
          user_id: string
        }[]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      record_share_conversion: {
        Args: {
          buyer_id_param: string
          click_id_param: string
          degree_param?: number
          purchase_amount_param: number
        }
        Returns: Json
      }
      track_share_click: {
        Args: {
          ip_address_param?: unknown
          referrer_url_param?: string
          session_id_param?: string
          tracking_code_param: string
          user_agent_param?: string
        }
        Returns: Json
      }
    }
    Enums: {
      review_status: "pending" | "approved" | "rejected"
      verification_doc_type: "id" | "utility_bill"
      verification_level:
        | "none"
        | "professor_verified"
        | "deans_list"
        | "honor_roll"
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
      review_status: ["pending", "approved", "rejected"],
      verification_doc_type: ["id", "utility_bill"],
      verification_level: [
        "none",
        "professor_verified",
        "deans_list",
        "honor_roll",
      ],
    },
  },
} as const
