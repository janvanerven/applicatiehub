import { error } from '@sveltejs/kit';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { RequestHandler } from './$types';
import { getUploadDir, SAFE_FILENAME_RE, EXT_TO_MIME } from '$lib/modules/media';

export const GET: RequestHandler = async ({ params }) => {
  const { filename } = params;

  if (!SAFE_FILENAME_RE.test(filename)) {
    throw error(400, 'Ongeldig bestandsnaam.');
  }

  const ext = filename.split('.').pop()!;
  const mimeType = EXT_TO_MIME[ext];

  if (!mimeType) {
    throw error(500, 'Onbekend bestandstype.');
  }

  const absolutePath = join(getUploadDir(), filename);

  let data: Buffer;
  try {
    data = await readFile(absolutePath);
  } catch {
    throw error(404, 'Bestand niet gevonden.');
  }

  const headers: Record<string, string> = {
    'Content-Type': mimeType,
    'Cache-Control': 'public, max-age=31536000, immutable',
    'Content-Length': data.byteLength.toString(),
    'X-Content-Type-Options': 'nosniff'
  };

  // SVG files can contain embedded scripts — force download to prevent browser execution.
  if (mimeType === 'image/svg+xml') {
    headers['Content-Disposition'] = 'attachment';
    headers['Content-Security-Policy'] = "default-src 'none'; style-src 'unsafe-inline';";
  }

  return new Response(new Uint8Array(data), { headers });
};
