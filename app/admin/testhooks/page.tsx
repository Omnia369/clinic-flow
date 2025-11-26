export default function TestHooksPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold">Test Hooks</h1>
        <p className="mt-2 text-gray-600">Replay and inspect captured webhook events (scaffold).</p>
        <div className="mt-6 rounded border p-4">
          <p className="text-sm text-gray-500">No events captured yet. This UI will list incoming events and allow replay once persistence is wired.</p>
        </div>
      </div>
    </main>
  );
}
