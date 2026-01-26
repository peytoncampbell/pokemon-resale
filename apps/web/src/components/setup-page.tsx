export function SetupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans">
      <div className="max-w-lg w-full space-y-6">
        <h1 className="text-2xl font-bold">Setup required</h1>
        <p className="text-slate-600 dark:text-slate-400">
          This app uses Supabase for data and authentication. Add your credentials to load the app.
        </p>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>
            Create a file{' '}
            <code className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">
              apps/web/.env.local
            </code>
          </li>
          <li>
            Add (get these from your project’s{' '}
            <a
              href="https://supabase.com/dashboard/project/_/settings/api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 underline"
            >
              Supabase → Settings → API
            </a>
            ):
          </li>
        </ol>
        <pre className="bg-slate-200 dark:bg-slate-800 p-4 rounded-lg text-sm overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`}
        </pre>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Restart the dev server after saving <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">.env.local</code>.
        </p>
      </div>
    </div>
  )
}
