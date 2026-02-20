import { auth } from "@clerk/nextjs/server";

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (
    (bytes / Math.pow(1024, i)).toFixed(1) +
    " " +
    sizes[i]
  );
}

export default async function HistoryPage() {
  const { userId } = await auth();

  if (!userId) {
    return <div className="p-6 text-white">Not logged in</div>;
  }

  const res = await fetch(
    "http://localhost:3001/api/jobs",
    { cache: "no-store" }
  );

  const { jobs } = await res.json();

  return (
    <div className="p-6 text-white">
      <h1 className="text-xl mb-4">History</h1>

      {jobs.length === 0 && (
        <div>No compressions yet.</div>
      )}

      {jobs.length > 0 && (
        <table className="w-full">
          <thead>
            <tr>
              <th>File</th>
              <th>Original</th>
              <th>Compressed</th>
              <th>Savings</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {jobs.map((job: any) => (
              <tr key={job.id}>
                <td>{job.fileName}</td>

                <td>
                  {formatBytes(job.originalBytes)}
                </td>

                <td>
                  {formatBytes(job.compressedBytes)}
                </td>

                <td>
                  -{job.savingsPercent}%
                </td>

                <td>
                  {new Date(
                    job.createdAt
                  ).toLocaleDateString()}
                </td>

                <td>
                  <a href={job.downloadUrl}>
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