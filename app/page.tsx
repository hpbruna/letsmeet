import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-2xl w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900">
            LetsMeet
          </h1>
          <p className="text-xl text-gray-600">
            Find the perfect time for your group meetings
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/create"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create New Event
          </Link>

          <p className="text-sm text-gray-500">
            No sign-up required. Create an event and share the link with your group.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="text-3xl mb-2">📅</div>
            <h3 className="font-semibold text-gray-900 mb-2">Easy Scheduling</h3>
            <p className="text-sm text-gray-600">
              Select date ranges and times for your event
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="text-3xl mb-2">👥</div>
            <h3 className="font-semibold text-gray-900 mb-2">Group Availability</h3>
            <p className="text-sm text-gray-600">
              Everyone marks their available times on an interactive grid
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-semibold text-gray-900 mb-2">Find the Best Time</h3>
            <p className="text-sm text-gray-600">
              See at a glance when most people are available
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
