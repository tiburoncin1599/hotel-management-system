export default function InvoiceDetailLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-lg bg-gray-200" />
        <div>
          <div className="h-7 w-48 rounded-lg bg-gray-200" />
          <div className="mt-1 h-4 w-64 rounded bg-gray-100" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-64 rounded-xl bg-gray-100" />
          <div className="h-48 rounded-xl bg-gray-100" />
        </div>
        <div className="space-y-6">
          <div className="h-40 rounded-xl bg-gray-100" />
          <div className="h-48 rounded-xl bg-gray-100" />
        </div>
      </div>
    </div>
  );
}
