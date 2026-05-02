/** Frame sequence constants — derived from the actual asset audit */
export const TOTAL_FRAMES = 240;
export const FRAME_EXT = "jpg";

/** Returns the path for a given 1-based frame index */
export function framePath(index: number): string {
  const padded = String(index).padStart(4, "0");
  return `/frames/frame_${padded}.${FRAME_EXT}`;
}
