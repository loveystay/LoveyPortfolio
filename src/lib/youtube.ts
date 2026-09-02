export const getYouTubeVideoId = (url?: string): string | null => {
  if (!url) return null;

  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.replace(/^www\./, '').toLowerCase();

    if (hostname === 'youtu.be') {
      return parsedUrl.pathname.slice(1).split('/')[0] || null;
    }

    if (hostname === 'youtube.com' || hostname === 'm.youtube.com' || hostname === 'youtube-nocookie.com') {
      const watchId = parsedUrl.searchParams.get('v');
      if (watchId) return watchId;

      const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
      if (pathParts[0] === 'embed' || pathParts[0] === 'shorts' || pathParts[0] === 'live') {
        return pathParts[1] || null;
      }
    }
  } catch {
    return null;
  }

  return null;
};

export const getYouTubeThumbnailUrl = (url?: string): string | null => {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
};
