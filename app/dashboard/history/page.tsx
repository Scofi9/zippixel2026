import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";

export default async function HistoryPage() {
  const { userId } = await auth();

  if (!userId) {
    return <div>Not logged in</div>;
  }

  const headersList = headers();
  const host = headersList.get("host");

  const res = await fetch(`https://${host}/api/jobs`, {
    cache: "no-store",
  });

  const { jobs } = await res.json();

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h1>History</h1>

      {jobs.length === 0 && (
        <div>No history yet</div>
      )}

      {jobs.map((job: any) => (
        <div key={job.id}>
          {job.fileName}
        </div>
      ))}
    </div>
  );
}