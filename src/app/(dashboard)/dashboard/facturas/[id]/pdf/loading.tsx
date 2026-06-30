export default function InvoicePdfLoading() {
  return (
    <div className="mx-auto max-w-[210mm] space-y-4 animate-pulse p-8">
      <div className="flex justify-center gap-4">
        <div className="h-12 w-48 rounded-lg bg-gray-200" />
        <div className="h-12 w-32 rounded-lg bg-gray-200" />
      </div>
      <div className="rounded-xl bg-white p-8">
        <div className="flex items-start justify-between border-b border-gray-200 pb-6">
          <div>
            <div className="h-8 w-56 rounded bg-gray-200" />
            <div className="mt-2 h-4 w-40 rounded bg-gray-100" />
          </div>
          <div className="text-right">
            <div className="h-8 w-40 rounded bg-gray-200" />
            <div className="mt-1 h-4 w-32 rounded bg-gray-100" />
          </div>
        </div>
        <div className="mt-6 h-24 rounded-lg bg-gray-100" />
        <div className="mt-4 h-20 rounded-lg bg-gray-100" />
        <div className="mt-6 space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 w-full rounded bg-gray-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
