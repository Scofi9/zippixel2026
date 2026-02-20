// lib/storage.ts
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function required(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export function storageEnabled() {
  return Boolean(
    process.env.S3_BUCKET &&
      process.env.S3_ACCESS_KEY_ID &&
      process.env.S3_SECRET_ACCESS_KEY &&
      process.env.S3_ENDPOINT
  );
}

export function getS3() {
  const endpoint = required("S3_ENDPOINT");
  const region = process.env.S3_REGION || "auto";

  const forcePathStyle = (process.env.S3_FORCE_PATH_STYLE || "false") === "true";

  return new S3Client({
    region,
    endpoint,
    forcePathStyle,
    credentials: {
      accessKeyId: required("S3_ACCESS_KEY_ID"),
      secretAccessKey: required("S3_SECRET_ACCESS_KEY"),
    },
  });
}

export async function uploadObject(params: {
  key: string;
  body: Buffer;
  contentType: string;
  cacheControl?: string;
}) {
  const bucket = required("S3_BUCKET");
  const s3 = getS3();

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: params.key,
      Body: params.body,
      ContentType: params.contentType,
      CacheControl: params.cacheControl || "public, max-age=31536000, immutable",
    })
  );

  const publicBase = process.env.S3_PUBLIC_BASE_URL; // optional
  const publicUrl = publicBase ? `${publicBase.replace(/\/$/, "")}/${params.key}` : null;

  return { bucket, key: params.key, publicUrl };
}

export async function signedGetUrl(params: { key: string; expiresInSeconds?: number }) {
  const bucket = required("S3_BUCKET");
  const s3 = getS3();

  const url = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: bucket,
      Key: params.key,
    }),
    { expiresIn: params.expiresInSeconds ?? 60 }
  );

  return url;
}