"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/lib/hooks/use-toast";
import { TimeSlot } from "@/types";
import AvailabilityGrid from "./AvailabilityGrid";
import { Plus } from "lucide-react";

interface ParticipantModalProps {
  eventId: string;
  timeSlots: TimeSlot[];
}

export default function ParticipantModal({
  eventId,
  timeSlots,
}: ParticipantModalProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }

    if (selectedSlots.size === 0) {
      toast({
        title: "No Slots Selected",
        description: "Please select at least one time slot",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId,
          name: name.trim(),
          slots: Array.from(selectedSlots),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save availability");
      }

      toast({
        title: "Success!",
        description: "Your availability has been saved",
      });

      // Reset form
      setName("");
      setSelectedSlots(new Set());
      setIsOpen(false);

      // Refresh the page to show updated data
      router.refresh();
    } catch (error) {
      console.error("Error saving availability:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save availability",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectionChange = useCallback((newSelectedSlots: Set<string>) => {
    setSelectedSlots(newSelectedSlots);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Add Your Availability
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Your Availability</DialogTitle>
          <DialogDescription>
            Enter your name and select the times you&apos;re available
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="participant-name">
              Your Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="participant-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              maxLength={100}
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500">
              If you&apos;ve already submitted, using the same name will update your
              availability
            </p>
          </div>

          {/* Availability Grid */}
          <div className="space-y-2">
            <Label>
              Select Your Available Times{" "}
              <span className="text-red-500">*</span>
            </Label>
            <div className="border rounded-lg p-4 bg-gray-50">
              <AvailabilityGrid
                slots={timeSlots}
                selectedSlots={selectedSlots}
                onSelectionChange={handleSelectionChange}
              />
            </div>
            <p className="text-sm text-gray-600">
              Selected {selectedSlots.size} time slot
              {selectedSlots.size !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Availability"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
