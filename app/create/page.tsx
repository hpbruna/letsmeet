import CreateEventForm from "@/components/create/CreateEventForm";
import Link from "next/link";

export default function CreateEventPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Event
          </h1>
          <p className="text-gray-600 mb-8">
            Set up your event details and share the link with participants
          </p>

          <CreateEventForm />
        </div>
      </div>
    </div>
  );
}
