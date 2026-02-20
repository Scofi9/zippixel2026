import { auth } from "@clerk/nextjs/server";

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(1) + " " + sizes[i];
}

export default async function HistoryPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="p-6 text-white">
        Please sign in to view your compression history.
      </div>
    );
  }

  const res = await fetch("http://localhost:3001/api/jobs", {
    cache: "no-store",
    headers: {
      Cookie: "", // Clerk zaten server tarafında auth sağlıyor
    },
  });

  const data = await res.json();
  const jobs = data.jobs || [];

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-semibold mb-4">Compression History</h1>

      {jobs.length === 0 ? (
        <div className="text-zinc-400">
          No compression history yet.
        </div>
      ) : (
        <table className="w-full border border-zinc-800 rounded-lg overflow-hidden">
          <thead className="bg-zinc-900">
            <tr className="text-left text-sm text-zinc-400">
              <th className="p-3">File</th>
              <th className="p-3">Format</th>
              <th className="p-3">Original</th>
              <th className="p-3">Compressed</th>
              <th className="p-3">Savings</th>
              <th className="p-3">Date</th>
              <th className="p-3">Download</th>
            </tr>
          </thead>

          <tbody>
            {jobs.map((job: any) => (
              <tr
                key={job.id}
                className="border-t border-zinc-800 hover:bg-zinc-900/50"
              >
                <td className="p-3">{job.fileName}</td>
                <td className="p-3">{job.format}</td>
                <td className="p-3">
                  {formatBytes(job.originalBytes)}
                </td>
                <td className="p-3">
                  {formatBytes(job.compressedBytes)}
                </td>
                <td className="p-3 text-green-400">
                  -{job.savingsPercent}%
                </td>
                <td className="p-3">
                  {new Date(job.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <a
                    href={job.downloadUrl}
                    className="text-blue-400 hover:underline"
                  >
                    Download
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}