import 'server-only'
import sharp from 'sharp'

/**
 * Re-encodes an uploaded photo, stripping EXIF (location, device, etc.) in
 * the process — sharp drops all metadata by default unless you ask it to
 * keep it, so a plain re-encode is the strip (Section 7: "optional photo...
 * EXIF stripped"). Always happens server-side; never trust client-side
 * stripping for something privacy-sensitive.
 */
export async function stripExif(
  file: File,
): Promise<{ buffer: Buffer; contentType: string; filename: string }> {
  const input = Buffer.from(await file.arrayBuffer())
  const image = sharp(input, { failOn: 'none' })
  const metadata = await image.metadata()

  // HEIC decodes fine via sharp's libvips build but we re-encode to JPEG for
  // broad compatibility (HEIC has patchy support in browsers/older Studio
  // media viewers). JPEG/PNG re-encode in their own format.
  const isHeic = file.type === 'image/heic' || file.type === 'image/heif'
  const format = isHeic ? 'jpeg' : metadata.format === 'png' ? 'png' : 'jpeg'

  const buffer = await image.rotate().toFormat(format, { quality: 85 }).toBuffer()

  return {
    buffer,
    contentType: format === 'png' ? 'image/png' : 'image/jpeg',
    filename: file.name.replace(/\.[^.]+$/, `.${format === 'png' ? 'png' : 'jpg'}`),
  }
}
