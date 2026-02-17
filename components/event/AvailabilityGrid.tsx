"use client";

import { useEffect, useRef } from "react";
import { TimeSlot } from "@/types";
import { getUniqueDates, isSlotOnDate } from "@/lib/utils/time-slots";
import { useAvailabilityGrid } from "@/lib/hooks/useAvailabilityGrid";
import TimeLabels from "./TimeLabels";
import DateHeaders from "./DateHeaders";
import { cn } from "@/lib/utils";

interface AvailabilityGridProps {
  slots: TimeSlot[];
  selectedSlots: Set<string>;
  onSelectionChange: (selectedSlots: Set<string>) => void;
}

export default function AvailabilityGrid({
  slots,
  selectedSlots: externalSelectedSlots,
  onSelectionChange,
}: AvailabilityGridProps) {
  const {
    selectedSlots,
    isDragging,
    handleCellMouseDown,
    handleCellMouseEnter,
    handleMouseUp,
  } = useAvailabilityGrid(externalSelectedSlots);

  // Use ref to track if we should notify parent (only on user interaction, not external updates)
  const isInternalChangeRef = useRef(false);
  const prevSelectedSlotsRef = useRef(selectedSlots);

  // Notify parent of selection changes (only when user interacts)
  useEffect(() => {
    // Check if selection actually changed
    const slotsChanged =
      selectedSlots.size !== prevSelectedSlotsRef.current.size ||
      Array.from(selectedSlots).some(key => !prevSelectedSlotsRef.current.has(key));

    if (slotsChanged) {
      onSelectionChange(selectedSlots);
      prevSelectedSlotsRef.current = selectedSlots;
    }
  }, [selectedSlots]); // Remove onSelectionChange from dependencies

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        document.body.style.userSelect = "";
      }
    };
  }, []);

  // Add global mouse up listener
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseUp]);

  const dates = getUniqueDates(slots);

  // Get unique times for labels
  const firstDateSlots = slots.filter((slot) =>
    dates.length > 0 ? isSlotOnDate(slot, dates[0]) : false
  );

  if (slots.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No time slots available
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
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
                    const isSelected = selectedSlots.has(slot.key);

                    return (
                      <div
                        key={slot.key}
                        data-slot-key={slot.key}
                        className={cn(
                          "h-8 border-b border-gray-200 last:border-b-0 cursor-pointer transition-colors",
                          isSelected
                            ? "bg-blue-500 hover:bg-blue-600"
                            : "bg-white hover:bg-gray-100"
                        )}
                        onMouseDown={() => handleCellMouseDown(slot.key)}
                        onMouseEnter={() => handleCellMouseEnter(slot.key)}
                        onTouchStart={(e) => {
                          e.preventDefault();
                          handleCellMouseDown(slot.key);
                        }}
                        onTouchMove={(e) => {
                          e.preventDefault();
                          const touch = e.touches[0];
                          const element = document.elementFromPoint(
                            touch.clientX,
                            touch.clientY
                          );
                          const slotKey = element?.getAttribute("data-slot-key");
                          if (slotKey) {
                            handleCellMouseEnter(slotKey);
                          }
                        }}
                        onTouchEnd={(e) => {
                          e.preventDefault();
                          handleMouseUp();
                        }}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 text-sm text-gray-600">
        <p>
          <strong>Desktop:</strong> Click and drag to select multiple time
          slots. Click a selected slot to deselect.
        </p>
        <p className="mt-1">
          <strong>Mobile:</strong> Touch and drag to select time slots.
        </p>
      </div>
    </div>
  );
}
