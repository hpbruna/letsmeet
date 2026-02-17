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
 * @returns Tailwind CSS class string
 */
export function getHeatmapColor(count: number, maxCount: number): string {
  if (count === 0) {
    return 'bg-gray-100 hover:bg-gray-200';
  }

  const intensity = count / maxCount;

  if (intensity >= 0.8) {
    return 'bg-green-600 hover:bg-green-700 text-white';
  } else if (intensity >= 0.6) {
    return 'bg-green-500 hover:bg-green-600 text-white';
  } else if (intensity >= 0.4) {
    return 'bg-green-400 hover:bg-green-500';
  } else if (intensity >= 0.2) {
    return 'bg-green-300 hover:bg-green-400';
  } else {
    return 'bg-green-200 hover:bg-green-300';
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
