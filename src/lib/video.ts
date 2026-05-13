// Helpers for embedding videos from common providers or direct URLs
export type EmbedKind = "iframe" | "video";
export function embedUrl(url?: string | null): { kind: EmbedKind; src: string } | null {
  if (!url) return null;
  const u = url.trim();
  if (!u) return null;
  // YouTube
  const yt = u.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([\w-]{6,})/);
  if (yt) return { kind: "iframe", src: `https://www.youtube.com/embed/${yt[1]}` };
  // Vimeo
  const vi = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vi) return { kind: "iframe", src: `https://player.vimeo.com/video/${vi[1]}` };
  // Direct file
  if (/\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(u)) return { kind: "video", src: u };
  // Fallback: treat as iframe
  return { kind: "iframe", src: u };
}
