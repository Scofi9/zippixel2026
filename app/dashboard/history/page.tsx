import { auth } from "@clerk/nextjs/server";

function getBaseUrl() {
  // Vercel'de doğru domain'i verir, localde localhost olur
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
}

export default async function HistoryPage() {
  const { userId } = await auth();

  if (!userId) {
    return <div className="p-6">Login required</div>;
  }

  const res = await fetch(`${getBaseUrl()}/api/jobs`, {
    cache: "no-store",
  });

  const data = await res.json();
  const jobs = data.jobs || [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">History</h1>

      {jobs.length === 0 && (
        <div className="text-zinc-500">No compressions yet.</div>
      )}

      {jobs.length > 0 && (
        <div className="overflow-x-auto border border-zinc-200 dark:border-zinc-800 rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-zinc-100 dark:bg-zinc-900">
              <tr className="text-left">
                <th className="p-3">File</th>
                <th className="p-3">Original</th>
                <th className="p-3">Compressed</th>
                <th className="p-3">Savings</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job: any) => (
                <tr key={job.id} className="border-t border-zinc-200 dark:border-zinc-800">
                  <td className="p-3">{job.fileName}</td>
                  <td className="p-3">{formatBytes(job.originalBytes)}</td>
                  <td className="p-3">{formatBytes(job.compressedBytes)}</td>
                  <td className="p-3 text-green-600 dark:text-green-400">-{job.savingsPercent}%</td>
                  <td className="p-3">
                    {new Date(job.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}