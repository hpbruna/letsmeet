import { AvailabilitySlot, Participant } from '@/lib/supabase/types';
import { HeatmapData } from '@/types';

/**
 * Calculate heatmap data from availability slots
 * @param slots - Array of availability slots with participant info
 * @param participants - Array of all participants
 * @returns HeatmapData object with counts and participant names per slot
 */
export function calculateHeatmap(
  slots: (AvailabilitySlot & { participants: Participant })[],
  participants: Participant[]
): HeatmapData {
  const heatmap: HeatmapData = {};

  // Group slots by their start time
  slots.forEach(slot => {
    // Normalize the key to ISO string format to match generated time slots
    const date = new Date(slot.slot_start);
    const key = date.toISOString();

    if (!heatmap[key]) {
      heatmap[key] = {
        count: 0,
        participants: [],
      };
    }

    heatmap[key].count++;
    heatmap[key].participants.push(slot.participants.name);
  });

  return heatmap;
}

/**
 * Get heatmap color class based on availability count
 * @param count - Number of people available
 * @param maxCount - Maximum number of people in any slot
 * @returns Object with backgroundColor and textColor as hex values
 */
export function getHeatmapColor(count: number, maxCount: number): {
  backgroundColor: string;
  hoverColor: string;
  textColor: string;
} {
  if (count === 0) {
    return {
      backgroundColor: '#f3f4f6', // gray-100
      hoverColor: '#e5e7eb', // gray-200
      textColor: '#374151', // gray-700
    };
  }

  const intensity = count / maxCount;

  if (intensity >= 0.8) {
    return {
      backgroundColor: '#16a34a', // green-600
      hoverColor: '#15803d', // green-700
      textColor: '#ffffff',
    };
  } else if (intensity >= 0.6) {
    return {
      backgroundColor: '#22c55e', // green-500
      hoverColor: '#16a34a', // green-600
      textColor: '#ffffff',
    };
  } else if (intensity >= 0.4) {
    return {
      backgroundColor: '#4ade80', // green-400
      hoverColor: '#22c55e', // green-500
      textColor: '#1f2937', // gray-800
    };
  } else if (intensity >= 0.2) {
    return {
      backgroundColor: '#86efac', // green-300
      hoverColor: '#4ade80', // green-400
      textColor: '#1f2937', // gray-800
    };
  } else {
    return {
      backgroundColor: '#bbf7d0', // green-200
      hoverColor: '#86efac', // green-300
      textColor: '#1f2937', // gray-800
    };
  }
}

/**
 * Calculate the maximum availability count across all slots
 * @param heatmap - HeatmapData object
 * @returns Maximum count
 */
export function getMaxCount(heatmap: HeatmapData): number {
  let max = 0;
  Object.values(heatmap).forEach(slot => {
    if (slot.count > max) {
      max = slot.count;
    }
  });
  return max;
}
