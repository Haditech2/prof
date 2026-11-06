import { v2 as cloudinary } from 'cloudinary';

let configured = false;

function configureCloudinary(): boolean {
  if (configured) return true;

  let cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  let apiKey = process.env.CLOUDINARY_API_KEY;
  let apiSecret = process.env.CLOUDINARY_API_SECRET;

  const cloudinaryUrl = process.env.CLOUDINARY_URL;
  if (cloudinaryUrl && (!cloudName || !apiKey || !apiSecret)) {
    try {
      const parsed = new URL(cloudinaryUrl);
      if (parsed.protocol === 'cloudinary:') {
        cloudName = parsed.hostname;
        apiKey = decodeURIComponent(parsed.username);
        apiSecret = decodeURIComponent(parsed.password);
      }
    } catch {
      return false;
    }
  }

  if (!cloudName || !apiKey || !apiSecret) return false;

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true
  });
  configured = true;
  return true;
}

function safePathPart(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') || 'event';
}

function posterPhotoPublicId(eventId: string, clientKeyHash: string): string {
  return `rsvp-posters/${safePathPart(eventId)}/${clientKeyHash}`;
}

export function isCloudinaryConfigured(): boolean {
  return configureCloudinary();
}

/** Uploads or replaces one guest's lightweight wall portrait. */
export async function uploadPosterPhoto(
  source: string,
  eventId: string,
  clientKeyHash: string
): Promise<string> {
  if (!configureCloudinary()) throw new Error('Cloudinary is not configured');

  const result = await cloudinary.uploader.upload(source, {
    public_id: posterPhotoPublicId(eventId, clientKeyHash),
    overwrite: true,
    invalidate: true,
    resource_type: 'image',
    tags: ['rsvp-poster', safePathPart(eventId)]
  });

  return result.secure_url;
}

/** Removes a superseded portrait without affecting the guest's RSVP record. */
export async function removePosterPhoto(eventId: string, clientKeyHash: string): Promise<void> {
  if (!configureCloudinary()) return;
  await cloudinary.uploader.destroy(posterPhotoPublicId(eventId, clientKeyHash), {
    invalidate: true,
    resource_type: 'image'
  });
}
