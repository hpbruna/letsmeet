import { formatTimeSlot } from "@/lib/utils/time-slots";

interface TimeLabelsProps {
  times: Date[];
}

export default function TimeLabels({ times }: TimeLabelsProps) {
  return (
    <div className="flex flex-col">
      {times.map((time, index) => {
        // Only show label every 4 slots (every hour)
        const showLabel = index % 4 === 0;

        return (
          <div
            key={time.toISOString()}
            className="w-20 flex-shrink-0 h-8 flex items-center justify-end pr-2 text-xs text-gray-600 border-r border-gray-300"
          >
            {showLabel && formatTimeSlot(time)}
          </div>
        );
      })}
    </div>
  );
}
