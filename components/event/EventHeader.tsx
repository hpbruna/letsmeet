"use client";

import { Event } from "@/lib/supabase/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/hooks/use-toast";
import { Share2, Calendar } from "lucide-react";
import { toUtcFromZoned } from "@/lib/utils/time-slots";

interface EventHeaderProps {
  event: Event;
}

export default function EventHeader({ event }: EventHeaderProps) {
  const { toast } = useToast();

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/event/${event.slug}`;

    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied!",
        description: "Event link has been copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Failed to Copy",
        description: "Please copy the link manually",
        variant: "destructive",
      });
    }
  };

  const formatDateRange = () => {
    const start = new Date(event.start_date);
    const end = new Date(event.end_date);

    if (start.toDateString() === end.toDateString()) {
      return start.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    return `${start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} - ${end.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  };

  const formatTimeRange = () => {
    const eventTimezone = event.timezone || "UTC";
    const dateStr = event.start_date;

    const startUtc = toUtcFromZoned(dateStr, event.start_time, eventTimezone);
    const endUtc = toUtcFromZoned(dateStr, event.end_time, eventTimezone);

    const timeOpts: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };

    const viewerTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const tzAbbr =
      new Intl.DateTimeFormat("en-US", {
        timeZoneName: "short",
        timeZone: viewerTz,
      })
        .formatToParts(startUtc)
        .find((p) => p.type === "timeZoneName")?.value ?? viewerTz;

    return `${startUtc.toLocaleTimeString("en-US", timeOpts)} - ${endUtc.toLocaleTimeString("en-US", timeOpts)} ${tzAbbr}`;
  };

  return (
    <div className="bg-white border-b border-gray-200 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {event.title}
            </h1>
            {event.description && (
              <p className="text-gray-600 mb-3">{event.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDateRange()}</span>
              </div>
              <div>
                <span>{formatTimeRange()}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleCopyLink} variant="outline" size="lg">
              <Share2 className="w-4 h-4 mr-2" />
              Share Link
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
