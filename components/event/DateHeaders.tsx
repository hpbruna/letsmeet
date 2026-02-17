import { formatDateHeader } from "@/lib/utils/time-slots";

interface DateHeadersProps {
  dates: Date[];
}

export default function DateHeaders({ dates }: DateHeadersProps) {
  return (
    <div className="flex border-b border-gray-300">
      {/* Empty cell for time labels */}
      <div className="w-20 flex-shrink-0 border-r border-gray-300" />

      {/* Date columns */}
      {dates.map((date) => (
        <div
          key={date.toISOString()}
          className="flex-1 min-w-[80px] px-2 py-3 text-center border-r border-gray-300 last:border-r-0 bg-gray-50 font-medium text-sm"
        >
          {formatDateHeader(date)}
        </div>
      ))}
    </div>
  );
}
