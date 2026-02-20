// lib/storage.ts
import fs from "node:fs/promises";
import path from "node:path";

export type StoredJob = {
  id: string;
  userId: string;

  originalName: string;
  storedName: string;

  inputBytes: number;
  outputBytes: number;

  outputFormat: "jpg" | "png" | "webp" | "avif";
  mime: string;

  savingsPercent: number;
  createdAt: string; // ISO
};

const ROOT = process.cwd();
const STORAGE_DIR = path.join(ROOT, "storage");

function userDir(userId: string) {
  return path.join(STORAGE_DIR, userId);
}

function metaPath(userId: string) {
  return path.join(userDir(userId), "meta.json");
}

async function ensureUserDir(userId: string) {
  await fs.mkdir(userDir(userId), { recursive: true });
}

async function readMeta(userId: string): Promise<StoredJob[]> {
  try {
    const p = metaPath(userId);
    const raw = await fs.readFile(p, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredJob[]) : [];
  } catch {
    return [];
  }
}

async function writeMeta(userId: string, jobs: StoredJob[]) {
  await ensureUserDir(userId);
  await fs.writeFile(metaPath(userId), JSON.stringify(jobs, null, 2), "utf8");
}

export async function addJob(params: Omit<StoredJob, "createdAt">) {
  const jobs = await readMeta(params.userId);
  const job: StoredJob = { ...params, createdAt: new Date().toISOString() };
  jobs.unshift(job); // newest first
  // İstersen burada limit koyarız (örn 200 kayıt)
  await writeMeta(params.userId, jobs);
  return job;
}

export async function listJobs(userId: string) {
  return readMeta(userId);
}

export async function getJob(userId: string, id: string) {
  const jobs = await readMeta(userId);
  return jobs.find((j) => j.id === id) ?? null;
}

export async function saveFileForJob(userId: string, storedName: string, buffer: Buffer) {
  await ensureUserDir(userId);
  const p = path.join(userDir(userId), storedName);
  await fs.writeFile(p, buffer);
  return p;
}

export async function readFileForJob(userId: string, storedName: string) {
  const p = path.join(userDir(userId), storedName);
  return fs.readFile(p);
}