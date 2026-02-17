import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-b from-white to-gray-50">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-700">
            Event Not Found
          </h2>
          <p className="text-gray-600">
            The event you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
        </div>
        <Link href="/">
          <Button size="lg">Go Back Home</Button>
        </Link>
      </div>
    </div>
  );
}
