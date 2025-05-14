import { Pool } from "pg"

// Create a connection pool
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: Number.parseInt(process.env.POSTGRES_PORT || "5432"),
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
})

// Query helper function
export async function query(text: string, params?: any[]) {
  try {
    const start = Date.now()
    const res = await pool.query(text, params)
    const duration = Date.now() - start

    console.log("Executed query", { text, duration, rows: res.rowCount })

    return res
  } catch (error) {
    console.error("Error executing query:", error)
    throw error
  }
}

// Initialize database tables
export async function initDb() {
  try {
    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        cognito_id VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create files table
    await query(`
      CREATE TABLE IF NOT EXISTS files (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(100) NOT NULL,
        size BIGINT NOT NULL,
        s3_key VARCHAR(512) NOT NULL,
        parent_folder_id INTEGER REFERENCES files(id) ON DELETE CASCADE,
        is_folder BOOLEAN DEFAULT FALSE,
        is_starred BOOLEAN DEFAULT FALSE,
        is_deleted BOOLEAN DEFAULT FALSE,
        deleted_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create shared_files table
    await query(`
      CREATE TABLE IF NOT EXISTS shared_files (
        id SERIAL PRIMARY KEY,
        file_id INTEGER REFERENCES files(id) ON DELETE CASCADE,
        owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        shared_with_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        permission VARCHAR(50) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(file_id, shared_with_id)
      )
    `)

    console.log("Database initialized successfully")
  } catch (error) {
    console.error("Error initializing database:", error)
    throw error
  }
}

// User-related database functions
export const users = {
  // Create a new user
  async create(cognitoId: string, username: string, email: string) {
    const result = await query("INSERT INTO users (cognito_id, username, email) VALUES ($1, $2, $3) RETURNING *", [
      cognitoId,
      username,
      email,
    ])
    return result.rows[0]
  },

  // Get user by Cognito ID
  async getByCognitoId(cognitoId: string) {
    const result = await query("SELECT * FROM users WHERE cognito_id = $1", [cognitoId])
    return result.rows[0] || null
  },

  // Get user by username
  async getByUsername(username: string) {
    const result = await query("SELECT * FROM users WHERE username = $1", [username])
    return result.rows[0] || null
  },
}

// File-related database functions
export const files = {
  // Create a new file
  async create(userId: number, name: string, type: string, size: number, s3Key: string, parentFolderId?: number) {
    const result = await query(
      "INSERT INTO files (user_id, name, type, size, s3_key, parent_folder_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [userId, name, type, size, s3Key, parentFolderId || null],
    )
    return result.rows[0]
  },

  // Create a new folder
  async createFolder(userId: number, name: string, parentFolderId?: number) {
    const result = await query(
      "INSERT INTO files (user_id, name, type, size, s3_key, parent_folder_id, is_folder) VALUES ($1, $2, 'folder', 0, '', $3, TRUE) RETURNING *",
      [userId, name, parentFolderId || null],
    )
    return result.rows[0]
  },

  // Get files by user ID and parent folder
  async getByUserAndFolder(userId: number, parentFolderId?: number) {
    const result = await query(
      "SELECT * FROM files WHERE user_id = $1 AND parent_folder_id IS NOT DISTINCT FROM $2 AND is_deleted = FALSE ORDER BY is_folder DESC, name",
      [userId, parentFolderId || null],
    )
    return result.rows
  },

  // Get starred files by user ID
  async getStarredByUser(userId: number) {
    const result = await query(
      "SELECT * FROM files WHERE user_id = $1 AND is_starred = TRUE AND is_deleted = FALSE ORDER BY updated_at DESC",
      [userId],
    )
    return result.rows
  },

  // Get deleted files by user ID
  async getDeletedByUser(userId: number) {
    const result = await query(
      "SELECT * FROM files WHERE user_id = $1 AND is_deleted = TRUE ORDER BY deleted_at DESC",
      [userId],
    )
    return result.rows
  },

  // Star/unstar a file
  async toggleStar(fileId: number, isStarred: boolean) {
    const result = await query(
      "UPDATE files SET is_starred = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
      [isStarred, fileId],
    )
    return result.rows[0]
  },

  // Soft delete a file
  async softDelete(fileId: number) {
    const result = await query(
      "UPDATE files SET is_deleted = TRUE, deleted_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
      [fileId],
    )
    return result.rows[0]
  },

  // Restore a deleted file
  async restore(fileId: number) {
    const result = await query("UPDATE files SET is_deleted = FALSE, deleted_at = NULL WHERE id = $1 RETURNING *", [
      fileId,
    ])
    return result.rows[0]
  },

  // Permanently delete a file
  async permanentDelete(fileId: number) {
    const result = await query("DELETE FROM files WHERE id = $1 RETURNING *", [fileId])
    return result.rows[0]
  },
}

// Shared files database functions
export const sharedFiles = {
  // Share a file with another user
  async shareFile(fileId: number, ownerId: number, sharedWithId: number, permission: string) {
    const result = await query(
      "INSERT INTO shared_files (file_id, owner_id, shared_with_id, permission) VALUES ($1, $2, $3, $4) RETURNING *",
      [fileId, ownerId, sharedWithId, permission],
    )
    return result.rows[0]
  },

  // Get files shared with a user
  async getSharedWithUser(userId: number) {
    const result = await query(
      `
      SELECT f.*, u.username as owner_username, sf.permission
      FROM shared_files sf
      JOIN files f ON sf.file_id = f.id
      JOIN users u ON sf.owner_id = u.id
      WHERE sf.shared_with_id = $1 AND f.is_deleted = FALSE
      ORDER BY sf.created_at DESC
    `,
      [userId],
    )
    return result.rows
  },

  // Get files shared by a user
  async getSharedByUser(userId: number) {
    const result = await query(
      `
      SELECT f.*, u.username as shared_with_username, sf.permission
      FROM shared_files sf
      JOIN files f ON sf.file_id = f.id
      JOIN users u ON sf.shared_with_id = u.id
      WHERE sf.owner_id = $1 AND f.is_deleted = FALSE
      ORDER BY sf.created_at DESC
    `,
      [userId],
    )
    return result.rows
  },

  // Remove sharing for a file
  async removeSharing(fileId: number, sharedWithId: number) {
    const result = await query("DELETE FROM shared_files WHERE file_id = $1 AND shared_with_id = $2 RETURNING *", [
      fileId,
      sharedWithId,
    ])
    return result.rows[0]
  },
}
