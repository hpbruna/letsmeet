import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventId, name, slots } = body;

    // Validate required fields
    if (!eventId || !name || !slots || !Array.isArray(slots)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (slots.length === 0) {
      return NextResponse.json(
        { error: 'No time slots selected' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if event exists
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, slug')
      .eq('id', eventId)
      .single();

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if participant already exists, or create new one
    let participantId: string;

    const { data: existingParticipant } = await supabase
      .from('participants')
      .select('id')
      .eq('event_id', eventId)
      .eq('name', name.trim())
      .single();

    if (existingParticipant) {
      // Participant exists - delete their old availability slots
      participantId = existingParticipant.id;

      await supabase
        .from('availability_slots')
        .delete()
        .eq('participant_id', participantId);
    } else {
      // Create new participant
      const { data: newParticipant, error: participantError } = await supabase
        .from('participants')
        .insert({
          event_id: eventId,
          name: name.trim(),
        })
        .select('id')
        .single();

      if (participantError || !newParticipant) {
        console.error('Failed to create participant:', participantError);
        return NextResponse.json(
          { error: 'Failed to create participant' },
          { status: 500 }
        );
      }

      participantId = newParticipant.id;
    }

    // Insert availability slots
    const availabilitySlots = slots.map(slotStart => {
      const start = new Date(slotStart);
      const end = new Date(start);
      end.setMinutes(end.getMinutes() + 15);

      return {
        participant_id: participantId,
        event_id: eventId,
        slot_start: start.toISOString(),
        slot_end: end.toISOString(),
      };
    });

    const { error: slotsError } = await supabase
      .from('availability_slots')
      .insert(availabilitySlots);

    if (slotsError) {
      console.error('Failed to insert slots:', slotsError);
      return NextResponse.json(
        { error: 'Failed to save availability' },
        { status: 500 }
      );
    }

    // Revalidate the event page to show updated data
    revalidatePath(`/event/${event.slug}`);

    return NextResponse.json(
      { success: true, message: 'Availability saved successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
