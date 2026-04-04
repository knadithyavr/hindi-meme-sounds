import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

const BUCKET = process.env.R2_BUCKET_NAME!
const PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL!

export async function uploadAudio(file: File): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'mp3'
  const key = `sounds/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const buffer = Buffer.from(await file.arrayBuffer())

  await r2.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: buffer,
    ContentType: file.type || 'audio/mpeg',
    CacheControl: 'public, max-age=31536000, immutable',
  }))

  return `${PUBLIC_URL}/${key}`
}

export async function deleteAudio(audioUrl: string): Promise<void> {
  // Extract key from full URL
  const key = audioUrl.replace(`${PUBLIC_URL}/`, '')
  await r2.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }))
}
