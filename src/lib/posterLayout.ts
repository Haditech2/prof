export const RSVP_POSTER_SRC = '/images/rsvp-poster-purple.jpg';
export const RSVP_POSTER_WIDTH = 1500;
export const RSVP_POSTER_HEIGHT = 2000;
export const RSVP_POSTER_EXPORT_SCALE = 1;

/** Measured inner bounds of the gold portrait oval in the RSVP artwork. */
export const RSVP_PHOTO_OVAL = {
  left: 0.5709,
  top: 0.247,
  width: 0.3819,
  height: 0.432,
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
