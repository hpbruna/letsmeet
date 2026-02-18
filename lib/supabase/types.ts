export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string | null;
          start_date: string;
          end_date: string;
          start_time: string;
          end_time: string;
          timezone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description?: string | null;
          start_date: string;
          end_date: string;
          start_time: string;
          end_time: string;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          description?: string | null;
          start_date?: string;
          end_date?: string;
          start_time?: string;
          end_time?: string;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      participants: {
        Row: {
          id: string;
          event_id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          name?: string;
          created_at?: string;
        };
      };
      availability_slots: {
        Row: {
          id: string;
          participant_id: string;
          event_id: string;
          slot_start: string;
          slot_end: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          participant_id: string;
          event_id: string;
          slot_start: string;
          slot_end: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          participant_id?: string;
          event_id?: string;
          slot_start?: string;
          slot_end?: string;
          created_at?: string;
        };
      };
    };
  };
}

export type Event = Database['public']['Tables']['events']['Row'];
export type Participant = Database['public']['Tables']['participants']['Row'];
export type AvailabilitySlot = Database['public']['Tables']['availability_slots']['Row'];
