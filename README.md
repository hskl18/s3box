# s3box

A minimal “Dropbox clone” that lets users upload, list, and download files from an AWS S3 bucket—all powered by Next.js API routes and S3 presigned URLs.

---

## 🔑 Features

- **Upload** files directly from the browser using presigned PUT URLs  
- **List** your files with S3’s `ListObjectsV2`  
- **Download** via presigned GET URLs (no extra proxying)  
- **Multi‑tenant** file isolation with simple prefix‑based scoping  
- **Zero server‑storage**: all files live in S3

---

## 🛠️ Tech Stack

- **Frontend / API**: Next.js (React + API routes)  
- **Storage**: AWS S3 (presigned URL flows)  
- **AWS SDK**: `@aws-sdk/client-s3` & `@aws-sdk/s3-request-presigner`  

---

## 🚀 Quick Start

1. **Clone the repo**  
   ```bash
   git clone https://github.com/your‑username/s3box.git
   cd s3box
