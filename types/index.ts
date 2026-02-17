export interface TimeSlot {
  start: Date;
  end: Date;
  key: string;
}

export interface HeatmapData {
  [slotKey: string]: {
    count: number;
    participants: string[];
  };
}

export interface EventFormData {
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
}

export interface ParticipantFormData {
  name: string;
  selectedSlots: string[];
}
