/**
 * YouTube Video URL Parser, Embed Generator, and Thumbnail Extractor Utilities
 */

/**
 * Extracts the 11-character YouTube video ID from various YouTube URL formats.
 * Supports:
 * - https://www.youtube.com/watch?v=dQw4w9WgXcQ
 * - https://youtu.be/dQw4w9WgXcQ
 * - https://www.youtube.com/shorts/dQw4w9WgXcQ
 * - https://youtube.com/embed/dQw4w9WgXcQ
 * - https://m.youtube.com/watch?v=dQw4w9WgXcQ
 * - https://www.youtube.com/live/dQw4w9WgXcQ
 * - Direct 11-char ID
 */
export function extractYouTubeId(url?: string | null): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();

  // If already 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // 1. YouTube Shorts format
  const shortsMatch = trimmed.match(/(?:youtube\.com\/shorts\/|youtu\.be\/shorts\/)([a-zA-Z0-9_-]{11})/i);
  if (shortsMatch && shortsMatch[1]) return shortsMatch[1];

  // 2. youtu.be shortlinks
  const youtuBeMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/i);
  if (youtuBeMatch && youtuBeMatch[1]) return youtuBeMatch[1];

  // 3. youtube.com/watch?v=
  const watchMatch = trimmed.match(/(?:youtube\.com\/watch\?(?:.*&)?v=)([a-zA-Z0-9_-]{11})/i);
  if (watchMatch && watchMatch[1]) return watchMatch[1];

  // 4. /embed/
  const embedMatch = trimmed.match(/(?:youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/)([a-zA-Z0-9_-]{11})/i);
  if (embedMatch && embedMatch[1]) return embedMatch[1];

  // 5. /live/
  const liveMatch = trimmed.match(/youtube\.com\/live\/([a-zA-Z0-9_-]{11})/i);
  if (liveMatch && liveMatch[1]) return liveMatch[1];

  // 6. Generic regex fallback
  const genericMatch = trimmed.match(
    /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i
  );
  if (genericMatch && genericMatch[1]) return genericMatch[1];

  return null;
}

/**
 * Checks if the given URL is a valid YouTube video or Shorts link.
 */
export function isYouTubeUrl(url?: string | null): boolean {
  if (!url) return false;
  return extractYouTubeId(url) !== null;
}

/**
 * Generates privacy-enhanced YouTube embed iframe URL.
 */
export function getYouTubeEmbedUrl(
  url?: string | null,
  options: {
    autoplay?: boolean;
    mute?: boolean;
    loop?: boolean;
    rel?: number;
    controls?: boolean;
  } = {}
): string | null {
  const videoId = extractYouTubeId(url);
  if (!videoId) return null;

  const {
    autoplay = true,
    mute = true,
    loop = true,
    rel = 0,
    controls = true,
  } = options;

  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    mute: mute ? '1' : '0',
    rel: rel.toString(),
    controls: controls ? '1' : '0',
    enablejsapi: '1',
    modestbranding: '1',
    playsinline: '1',
    origin: typeof window !== 'undefined' ? window.location.origin : '',
  });

  if (loop) {
    params.set('loop', '1');
    params.set('playlist', videoId);
  }

  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

/**
 * Generates YouTube Thumbnail URLs.
 * maxres: 1280x720 (if available)
 * hq: 480x360
 * mq: 320x180
 */
export function getYouTubeThumbnailUrl(
  url?: string | null,
  quality: 'maxres' | 'hq' | 'mq' = 'hq'
): string | null {
  const videoId = extractYouTubeId(url);
  if (!videoId) return null;

  if (quality === 'maxres') {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
  if (quality === 'mq') {
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  }
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}
