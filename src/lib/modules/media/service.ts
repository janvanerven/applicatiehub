import { randomUUID } from 'node:crypto';
import { writeFile, readdir, stat, unlink, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { ALLOWED_MIME_TYPES, MAX_UPLOAD_BYTES, UploadError } from './types';
import type { UploadedFile, UploadResult, AllowedMimeType } from './types';

/** Matches only UUID-based filenames with known image extensions. Prevents path traversal. */
export const SAFE_FILENAME_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp|gif|svg)$/;

export const EXT_TO_MIME: Record<string, string> = {
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  svg: 'image/svg+xml'
};

const MIME_TO_EXT: Record<AllowedMimeType, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/svg+xml': '.svg'
};

export function getUploadDir(): string {
  // process.env is used intentionally here — this lib file is server-only in practice
  // (it uses node:fs) and avoids a $env/dynamic/private dependency in a non-.server.ts file.
  return process.env.UPLOAD_DIR ?? `${process.cwd()}/uploads`;
}

/** Verify file magic bytes match the declared MIME type to catch spoofed uploads. */
function validateMagicBytes(buffer: Buffer, mimeType: string): boolean {
  if (mimeType === 'image/jpeg') {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (mimeType === 'image/png') {
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    );
  }
  if (mimeType === 'image/gif') {
    return buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46;
  }
  if (mimeType === 'image/webp') {
    return (
      buffer.slice(0, 4).toString('ascii') === 'RIFF' &&
      buffer.slice(8, 12).toString('ascii') === 'WEBP'
    );
  }
  if (mimeType === 'image/svg+xml') {
    // Magic bytes can't prevent embedded scripts in SVG — the serve route adds
    // Content-Disposition: attachment so SVGs are never executed in a browser context.
    const text = buffer.slice(0, 512).toString('utf8').trimStart();
    return text.startsWith('<?xml') || text.startsWith('<svg');
  }
  return false;
}

/**
 * Validate and persist an uploaded file under UPLOAD_DIR with a UUID filename.
 * Throws UploadError for user-visible validation failures; re-throws unexpected I/O errors.
 */
export async function saveUpload(file: File, origin: string): Promise<UploadedFile> {
  if (!(ALLOWED_MIME_TYPES as readonly string[]).includes(file.type)) {
    throw new UploadError(`Niet-toegestaan bestandstype: ${file.type}`);
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new UploadError('Bestand te groot (max 10 MB).');
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  if (!validateMagicBytes(bytes, file.type)) {
    throw new UploadError('Bestandsinhoud komt niet overeen met het opgegeven bestandstype.');
  }

  const ext = MIME_TO_EXT[file.type as AllowedMimeType];
  const filename = `${randomUUID()}${ext}`;
  const uploadDir = getUploadDir();

  await mkdir(uploadDir, { recursive: true });

  const absolutePath = join(uploadDir, filename);
  await writeFile(absolutePath, bytes);

  const publicUrl = `/api/media/${filename}`;
  return {
    filename,
    mimeType: file.type,
    sizeBytes: file.size,
    absolutePath,
    publicUrl,
    markdownSnippet: `![afbeelding](${origin}${publicUrl})`
  };
}

/**
 * Delete a previously uploaded file.
 * Throws UploadError for invalid filenames or missing files.
 */
export async function deleteUpload(filename: string): Promise<void> {
  if (!SAFE_FILENAME_RE.test(filename)) {
    throw new UploadError('Ongeldig bestandsnaam.');
  }
  const absolutePath = join(getUploadDir(), filename);
  try {
    await unlink(absolutePath);
  } catch {
    throw new UploadError('Bestand niet gevonden of al verwijderd.');
  }
}

/** List all valid uploads in UPLOAD_DIR, sorted newest-first by modification time. */
export async function listUploads(origin: string): Promise<UploadResult[]> {
  const dir = getUploadDir();
  try {
    const files = await readdir(dir);
    const results = (
      await Promise.all(
        files
          .filter((f) => SAFE_FILENAME_RE.test(f))
          .map(async (filename) => {
            try {
              const ext = filename.split('.').pop()!;
              const mimeType = EXT_TO_MIME[ext] ?? 'application/octet-stream';
              const absolutePath = join(dir, filename);
              const { size, mtimeMs } = await stat(absolutePath);
              const publicUrl = `/api/media/${filename}`;
              return {
                filename,
                mimeType,
                sizeBytes: size,
                publicUrl,
                markdownSnippet: `![afbeelding](${origin}${publicUrl})`,
                _mtimeMs: mtimeMs
              };
            } catch {
              return null;
            }
          })
      )
    ).filter((f): f is NonNullable<typeof f> => f !== null);

    results.sort((a, b) => b._mtimeMs - a._mtimeMs);

    return results.map(({ _mtimeMs: _, ...rest }) => rest);
  } catch {
    return [];
  }
}
