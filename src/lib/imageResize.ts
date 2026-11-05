/**
 * Resizes visitor-selected photos to JPEG data URLs entirely in the browser.
 * Avatar output stays database-friendly; flyer output retains enough detail
 * for the high-resolution RSVP artwork.
 */

// Keep each portrait small enough for fast tribute-list responses. These are
// avatar photos rather than full-size gallery images, so 320 px is ample.
const AVATAR_TARGET_LENGTH = 90_000; // ~67 KB after base64 decoding
const AVATAR_DIMENSIONS = [480, 384, 320, 256, 224];
const AVATAR_QUALITIES = [0.78, 0.7, 0.62];

function drawToDataUrl(bitmap: ImageBitmap, maxDim: number, quality: number): string {
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Photo processing is not supported in this browser.');
  ctx.drawImage(bitmap, 0, 0, width, height);
  return canvas.toDataURL('image/jpeg', quality);
}

async function resizeImage(
  file: File,
  dimensions: number[],
  qualities: number[],
  targetLength: number,
  fallbackDimension: number,
  fallbackQuality: number
): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose a photo (JPG, PNG, WebP…).');
  }
  if (file.size > 15 * 1024 * 1024) {
    throw new Error('That photo is very large — please pick one under 15 MB.');
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error('This photo could not be read. Try a different image.');
  }

  try {
    // Walk the ladder until the base64 payload is small enough.
    for (const maxDim of dimensions) {
      for (const quality of qualities) {
        const dataUrl = drawToDataUrl(bitmap, maxDim, quality);
        if (dataUrl.length <= targetLength) return dataUrl;
      }
    }
    return drawToDataUrl(bitmap, fallbackDimension, fallbackQuality);
  } finally {
    bitmap.close?.();
  }
}

export async function fileToAvatarDataUrl(file: File): Promise<string> {
  return resizeImage(file, AVATAR_DIMENSIONS, AVATAR_QUALITIES, AVATAR_TARGET_LENGTH, 180, 0.6);
}

/** Higher-resolution portrait used by the 2× RSVP flyer export. */
export async function fileToFlyerPhotoDataUrl(file: File): Promise<string> {
  return resizeImage(
    file,
    [1200, 1000, 800, 640],
    [0.9, 0.84, 0.78],
    800_000,
    640,
    0.74
  );
}

/**
 * Creates a lightweight copy for the shared poster wall. The full portrait
 * remains on the visitor's device for HD export; only this thumbnail is sent
 * to the public API so the wall stays fast on mobile connections.
 */
export async function flyerPhotoToWallThumbnail(photoUrl: string): Promise<string> {
  if (!photoUrl.startsWith('data:image/')) return photoUrl;

  const response = await fetch(photoUrl);
  const blob = await response.blob();
  const bitmap = await createImageBitmap(blob);

  try {
    const dimensions = [480, 400, 320, 280];
    const qualities = [0.78, 0.7, 0.62];
    const targetLength = 150_000;

    for (const maxDim of dimensions) {
      for (const quality of qualities) {
        const dataUrl = drawToDataUrl(bitmap, maxDim, quality);
        if (dataUrl.length <= targetLength) return dataUrl;
      }
    }

    return drawToDataUrl(bitmap, 240, 0.58);
  } finally {
    bitmap.close?.();
  }
}
