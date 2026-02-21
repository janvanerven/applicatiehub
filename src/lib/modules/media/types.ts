/** Client-safe upload representation — no filesystem paths. */
export interface UploadResult {
  filename: string;
  mimeType: string;
  sizeBytes: number;
  /** Public URL path served via /api/media/[filename] */
  publicUrl: string;
  /** Ready-to-paste Markdown image syntax */
  markdownSnippet: string;
}

/** Internal representation used by saveUpload — includes disk path. Never send to the client. */
export interface UploadedFile extends UploadResult {
  /** Absolute path on disk — server-only, must be stripped before returning to clients. */
  absolutePath: string;
}

/** Thrown for user-visible validation failures (wrong type, too large, bad magic bytes). */
export class UploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UploadError';
  }
}

export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml'
] as const;

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB
