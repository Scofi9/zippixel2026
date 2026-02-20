import { auth } from "@clerk/nextjs/server";
import { redis } from "@/lib/redis";

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
}

export default async function HistoryPage() {

  const { userId } = await auth();

  if (!userId) {
    return <div>Login required</div>;
  }

  const rawJobs = await redis.lrange(
    `jobs:${userId}`,
    0,
    100
  );

  const jobs = rawJobs.map((j: any) =>
    typeof j === "string" ? JSON.parse(j) : j
  );

  return (
    <div className="p-6">

      <h1 className="text-xl mb-4">
        History
      </h1>

      {jobs.length === 0 && (
        <div>No compressions yet.</div>
      )}

      {jobs.map((job: any) => (

        <div key={job.id}
             className="border-b border-zinc-800 py-2">

          {job.fileName}

          <span className="ml-4 text-green-400">
            -{job.savingsPercent}%
          </span>

          <span className="ml-4 text-zinc-500">
            {formatBytes(job.originalBytes)}
          </span>

        </div>

      ))}

    </div>
  );
}