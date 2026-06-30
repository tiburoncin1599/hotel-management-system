export default function FacturasLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 rounded-lg bg-gray-200" />
      <div className="h-4 w-64 rounded-lg bg-gray-100" />
      <div className="h-10 w-80 rounded-lg bg-gray-100" />
      <div className="rounded-xl border border-gray-200 bg-white">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-gray-100 px-4 py-3">
            <div className="h-4 w-24 rounded bg-gray-100" />
            <div className="h-4 w-32 rounded bg-gray-100" />
            <div className="h-4 w-16 rounded bg-gray-100" />
            <div className="ml-auto h-4 w-16 rounded bg-gray-100" />
            <div className="h-6 w-20 rounded-full bg-gray-100" />
            <div className="h-4 w-24 rounded bg-gray-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
