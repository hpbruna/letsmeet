import { useState, useCallback } from "react";

export interface UseAvailabilityGridReturn {
  selectedSlots: Set<string>;
  isDragging: boolean;
  dragMode: "select" | "deselect";
  handleCellMouseDown: (slotKey: string) => void;
  handleCellMouseEnter: (slotKey: string) => void;
  handleMouseUp: () => void;
  toggleSlot: (slotKey: string) => void;
  setSelectedSlots: (slots: Set<string>) => void;
}

export function useAvailabilityGrid(
  initialSelectedSlots: Set<string> = new Set()
): UseAvailabilityGridReturn {
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(
    initialSelectedSlots
  );
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<"select" | "deselect">("select");

  const handleCellMouseDown = useCallback(
    (slotKey: string) => {
      // Determine if we're selecting or deselecting based on first cell
      const mode = selectedSlots.has(slotKey) ? "deselect" : "select";
      setDragMode(mode);
      setIsDragging(true);

      // Toggle the clicked cell
      const newSelected = new Set(selectedSlots);
      if (mode === "select") {
        newSelected.add(slotKey);
      } else {
        newSelected.delete(slotKey);
      }
      setSelectedSlots(newSelected);

      // Prevent text selection during drag
      if (typeof window !== "undefined") {
        document.body.style.userSelect = "none";
      }
    },
    [selectedSlots]
  );

  const handleCellMouseEnter = useCallback(
    (slotKey: string) => {
      if (!isDragging) return;

      const newSelected = new Set(selectedSlots);
      if (dragMode === "select") {
        newSelected.add(slotKey);
      } else {
        newSelected.delete(slotKey);
      }
      setSelectedSlots(newSelected);
    },
    [isDragging, dragMode, selectedSlots]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);

    // Re-enable text selection
    if (typeof window !== "undefined") {
      document.body.style.userSelect = "";
    }
  }, []);

  const toggleSlot = useCallback(
    (slotKey: string) => {
      const newSelected = new Set(selectedSlots);
      if (newSelected.has(slotKey)) {
        newSelected.delete(slotKey);
      } else {
        newSelected.add(slotKey);
      }
      setSelectedSlots(newSelected);
    },
    [selectedSlots]
  );

  return {
    selectedSlots,
    isDragging,
    dragMode,
    handleCellMouseDown,
    handleCellMouseEnter,
    handleMouseUp,
    toggleSlot,
    setSelectedSlots,
  };
}
