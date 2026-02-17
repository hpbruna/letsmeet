"use client";

import { TimeSlot, HeatmapData } from "@/types";
import { getUniqueDates, isSlotOnDate } from "@/lib/utils/time-slots";
import { getHeatmapColor, getMaxCount } from "@/lib/utils/heatmap-calculator";
import TimeLabels from "./TimeLabels";
import DateHeaders from "./DateHeaders";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface HeatmapGridProps {
  slots: TimeSlot[];
  heatmap: HeatmapData;
}

export default function HeatmapGrid({ slots, heatmap }: HeatmapGridProps) {
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const dates = getUniqueDates(slots);
  const maxCount = getMaxCount(heatmap);

  // Get unique times for labels
  const firstDateSlots = slots.filter((slot) =>
    dates.length > 0 ? isSlotOnDate(slot, dates[0]) : false
  );

  if (slots.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 border border-dashed border-gray-300 rounded-lg">
        <p className="font-medium">No time slots available</p>
        <p className="text-sm mt-2">There was an issue generating the time slots for this event.</p>
      </div>
    );
  }

  const handleMouseEnter = (slotKey: string, e: React.MouseEvent) => {
    setHoveredSlot(slotKey);
    setTooltipPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredSlot(null);
    setTooltipPosition(null);
  };

  return (
    <div className="w-full overflow-x-auto relative">
      <div className="inline-block min-w-full border border-gray-300 rounded-lg overflow-hidden">
        {/* Date Headers */}
        <DateHeaders dates={dates} />

        {/* Grid Body */}
        <div className="flex">
          {/* Time Labels */}
          <TimeLabels times={firstDateSlots.map((slot) => slot.start)} />

          {/* Grid Cells */}
          <div className="flex flex-1">
            {dates.map((date) => {
              const dateSlots = slots.filter((slot) =>
                isSlotOnDate(slot, date)
              );

              return (
                <div
                  key={date.toISOString()}
                  className="flex-1 min-w-[80px] border-r border-gray-300 last:border-r-0"
                >
                  {dateSlots.map((slot) => {
                    const slotData = heatmap[slot.key];
                    const count = slotData?.count || 0;
                    const colors = getHeatmapColor(count, maxCount);

                    return (
                      <div
                        key={slot.key}
                        className={cn(
                          "h-8 border-b border-gray-200 last:border-b-0 transition-all duration-150 flex items-center justify-center text-xs font-medium",
                          count > 0 && "cursor-pointer"
                        )}
                        style={{
                          backgroundColor: colors.backgroundColor,
                          color: colors.textColor,
                          ['--hover-bg' as any]: colors.hoverColor,
                        }}
                        onMouseEnter={(e) => {
                          if (count > 0) {
                            e.currentTarget.style.backgroundColor = colors.hoverColor;
                            handleMouseEnter(slot.key, e);
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = colors.backgroundColor;
                          handleMouseLeave();
                        }}
                      >
                        {count > 0 && count}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredSlot && tooltipPosition && heatmap[hoveredSlot] && (
        <div
          className="fixed z-50 bg-gray-900 text-white text-xs rounded-lg shadow-lg p-3 pointer-events-none"
          style={{
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y + 10,
          }}
        >
          <div className="font-semibold mb-1">
            {heatmap[hoveredSlot].count}{" "}
            {heatmap[hoveredSlot].count === 1 ? "person" : "people"} available
          </div>
          <ul className="space-y-0.5">
            {heatmap[hoveredSlot].participants.map((name, idx) => (
              <li key={idx}>{name}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-sm">
        <span className="text-gray-600 font-medium">Availability:</span>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border border-gray-300 rounded" style={{ backgroundColor: '#f3f4f6' }} />
          <span className="text-gray-600 text-xs">0</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded" style={{ backgroundColor: '#bbf7d0' }} />
          <span className="text-gray-600 text-xs">Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded" style={{ backgroundColor: '#4ade80' }} />
          <span className="text-gray-600 text-xs">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded" style={{ backgroundColor: '#16a34a' }} />
          <span className="text-gray-600 text-xs">High</span>
        </div>
      </div>
    </div>
  );
}
