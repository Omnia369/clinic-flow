export default function AdminHome() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold">Admin</h1>
        <p className="mt-2 text-gray-600">Internal tools for keys, test hooks, and diagnostics.</p>
        <ul className="mt-6 list-disc list-inside space-y-2">
          <li><a className="text-blue-600 underline" href="/admin/keys">Keys Manager</a></li>
          <li><a className="text-blue-600 underline" href="/admin/testhooks">Test Hooks (QA)</a></li>
        </ul>
      </div>
    </main>
  );
}
