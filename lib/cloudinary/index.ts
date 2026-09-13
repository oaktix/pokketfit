import { v2 as cloudinary } from 'cloudinary';

/**
 * Configure server-side Cloudinary SDK.
 * Private API Key and Secret are kept exclusively on the server.
 */
if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export { cloudinary };

/**
 * Generates an optimized video streaming URL for exercise playback
 */
export function getOptimizedExerciseVideoUrl(publicId: string): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName || cloudName.includes('your-cloudinary-cloud-name')) {
    return '';
  }
  // Fast loading with auto format (webm/mp4) and quality tuning
  return `https://res.cloudinary.com/${cloudName}/video/upload/q_auto,f_auto,w_720/${publicId}`;
}

/**
 * Generates an optimized video poster thumbnail
 */
export function getExerciseVideoPosterUrl(publicId: string): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName || cloudName.includes('your-cloudinary-cloud-name')) {
    return '';
  }
  return `https://res.cloudinary.com/${cloudName}/video/upload/so_0,q_auto,f_auto,w_720/${publicId}.jpg`;
}
