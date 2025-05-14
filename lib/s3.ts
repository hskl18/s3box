import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
})

const BUCKET_NAME = process.env.S3_BUCKET_NAME || ""

// Generate a unique key for S3 storage
export function generateS3Key(userId: string, fileName: string) {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 10)
  return `${userId}/${timestamp}-${randomString}-${fileName}`
}

// Upload a file to S3
export async function uploadFile(file: Buffer, key: string, contentType: string) {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
    })

    const response = await s3Client.send(command)
    return { success: true, data: response }
  } catch (error) {
    console.error("Error uploading file to S3:", error)
    return { success: false, error }
  }
}

// Get a file from S3
export async function getFile(key: string) {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    const response = await s3Client.send(command)
    return { success: true, data: response }
  } catch (error) {
    console.error("Error getting file from S3:", error)
    return { success: false, error }
  }
}

// Delete a file from S3
export async function deleteFile(key: string) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    const response = await s3Client.send(command)
    return { success: true, data: response }
  } catch (error) {
    console.error("Error deleting file from S3:", error)
    return { success: false, error }
  }
}

// Generate a presigned URL for downloading a file
export async function getPresignedUrl(key: string, expiresIn = 3600) {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    const url = await getSignedUrl(s3Client, command, { expiresIn })
    return { success: true, url }
  } catch (error) {
    console.error("Error generating presigned URL:", error)
    return { success: false, error }
  }
}

// Generate a presigned URL for uploading a file
export async function getPresignedUploadUrl(key: string, contentType: string, expiresIn = 3600) {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    })

    const url = await getSignedUrl(s3Client, command, { expiresIn })
    return { success: true, url }
  } catch (error) {
    console.error("Error generating presigned upload URL:", error)
    return { success: false, error }
  }
}

// List files in a directory
export async function listFiles(prefix: string) {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: prefix,
    })

    const response = await s3Client.send(command)
    return { success: true, data: response }
  } catch (error) {
    console.error("Error listing files in S3:", error)
    return { success: false, error }
  }
}
