import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { generateTimeSlots } from "@/lib/utils/time-slots";
import { calculateHeatmap } from "@/lib/utils/heatmap-calculator";
import EventHeader from "@/components/event/EventHeader";
import HeatmapGrid from "@/components/event/HeatmapGrid";
import ParticipantList from "@/components/event/ParticipantList";
import ParticipantModal from "@/components/event/ParticipantModal";

interface EventPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch event details
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  if (eventError || !event) {
    notFound();
  }

  // Fetch participants
  const { data: participantsData } = await supabase
    .from("participants")
    .select("*")
    .eq("event_id", event.id)
    .order("created_at", { ascending: true });

  const participants = participantsData || [];

  // Fetch availability slots with participant info
  const { data: availabilitySlotsData } = await supabase
    .from("availability_slots")
    .select(
      `
      *,
      participants (
        id,
        name
      )
    `
    )
    .eq("event_id", event.id);

  const availabilitySlots = availabilitySlotsData || [];

  // Generate time slots for the event
  const timeSlots = generateTimeSlots(
    new Date(event.start_date),
    new Date(event.end_date),
    event.start_time,
    event.end_time
  );

  // Calculate heatmap data
  const heatmap = calculateHeatmap(availabilitySlots as any, participants);

  return (
    <div className="min-h-screen bg-gray-50">
      <EventHeader event={event} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Add Availability Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Group Availability
              </h2>
              <ParticipantModal
                eventId={event.id}
                timeSlots={timeSlots}
              />
            </div>

            {/* Heatmap Grid */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <HeatmapGrid slots={timeSlots} heatmap={heatmap} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <ParticipantList participants={participants} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: EventPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("title, description")
    .eq("slug", slug)
    .single();

  if (!event) {
    return {
      title: "Event Not Found",
    };
  }

  return {
    title: `${event.title} - LetsMeet`,
    description: event.description || "Find the perfect time for your group meeting",
  };
}
