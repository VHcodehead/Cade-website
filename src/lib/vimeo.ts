interface VimeoOembedData {
  thumbnail_url?: string;
  thumbnail_url_with_play_button?: string;
  title?: string;
  author_name?: string;
  author_url?: string;
  html?: string;
  width?: number;
  height?: number;
}

/**
 * Fetches the thumbnail URL for a Vimeo video via the oEmbed API.
 * Results are cached for 24 hours (86400 seconds).
 * Falls back to vumbnail.com CDN if oEmbed returns no thumbnail.
 */
export async function getVimeoThumbnail(vimeoId: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${vimeoId}&width=1280`,
      { next: { revalidate: 86400 } }
    );

    if (!res.ok) {
      return `https://vumbnail.com/${vimeoId}.jpg`;
    }

    const data: VimeoOembedData = await res.json();

    if (data.thumbnail_url) {
      return data.thumbnail_url;
    }

    // Fallback to vumbnail.com CDN
    return `https://vumbnail.com/${vimeoId}.jpg`;
  } catch {
    return `https://vumbnail.com/${vimeoId}.jpg`;
  }
}

/**
 * Fetches thumbnails for multiple projects in parallel.
 * Returns a slug-keyed map of thumbnail URLs (or null on failure).
 */
export async function getProjectThumbnails(
  projects: Array<{ slug: string; vimeoId: string }>
): Promise<Record<string, string | null>> {
  const results = await Promise.all(
    projects.map(async (project) => {
      const thumbnail = await getVimeoThumbnail(project.vimeoId);
      return [project.slug, thumbnail] as const;
    })
  );

  return Object.fromEntries(results);
}
