export const RSVP_POSTER_SRC = '/images/rsvp-poster-purple.jpg';
export const RSVP_POSTER_WIDTH = 1920;
export const RSVP_POSTER_HEIGHT = 2560;
export const RSVP_POSTER_EXPORT_SCALE = 1;

/**
 * Measured inner bounds of the gold portrait oval in the supplied artwork.
 * A small inset keeps the guest photo behind the original gold border.
 */
export const RSVP_PHOTO_OVAL = {
  left: 0.5526,
  top: 0.2516,
  width: 0.3896,
  height: 0.3941,
};

/** Keeps faces slightly above centre while retaining the shoulders. */
export const RSVP_PHOTO_FOCUS_Y = 0.36;

/**
 * Adds enough automatic zoom to prevent empty edges when a portrait is moved.
 * The same calculation is used by the editor, HD export, and public wall.
 */
export function safePosterPhotoScale(scale: number, offsetX: number, offsetY: number): number {
  return Math.max(
    scale,
    1 + (Math.abs(offsetX) / 100) / 0.5,
    offsetY >= 0
      ? 1 + (offsetY / 100) / RSVP_PHOTO_FOCUS_Y
      : 1 + (Math.abs(offsetY) / 100) / (1 - RSVP_PHOTO_FOCUS_Y)
  );
}
