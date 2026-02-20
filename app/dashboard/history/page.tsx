import { auth } from "@clerk/nextjs/server";

function getBaseUrl() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

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
    return (
      <div style={{ padding: 20 }}>
        Not logged in
      </div>
    );
  }

  let jobs: any[] = [];

  try {
    const res = await fetch(
      `${getBaseUrl()}/api/jobs`,
      {
        cache: "no-store",
      }
    );

    if (res.ok) {
      const data = await res.json();
      jobs = data.jobs || [];
    }
  } catch (err) {
    console.error("History fetch failed:", err);
  }

  return (
    <div style={{ padding: 20, color: "white" }}>
      <h1 style={{ marginBottom: 20 }}>
        History
      </h1>

      {jobs.length === 0 && (
        <div>No compressions yet.</div>
      )}

      {jobs.length > 0 && (
        <table>
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
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.fileName}</td>

                <td>
                  {formatBytes(
                    job.originalBytes
                  )}
                </td>

                <td>
                  {formatBytes(
                    job.compressedBytes
                  )}
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
                  <a
                    href={job.downloadUrl}
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