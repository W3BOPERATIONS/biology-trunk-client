export const getEmbedUrl = (url) => {
  if (!url) return ""
  try {
    let videoId = ""

    // Handle youtube.com/watch?v=VIDEO_ID format
    if (url.includes("youtube.com/watch")) {
      videoId = url.split("v=")[1]?.split("&")[0]
    }
    // Handle youtube.com/live/VIDEO_ID format
    else if (url.includes("youtube.com/live")) {
      videoId = url.split("/live/")[1]?.split("?")[0]
    }
    // Handle youtu.be/VIDEO_ID format
    else if (url.includes("youtu.be")) {
      videoId = url.split("/").pop()?.split("?")[0]
    }
    // Handle vimeo.com format
    else if (url.includes("vimeo.com")) {
      videoId = url.split("/").pop()?.split("?")[0]
      return `https://player.vimeo.com/video/${videoId}`
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : ""
  } catch (error) {
    console.error("Error parsing video URL:", error)
    return ""
  }
}

export const isValidVideoUrl = (url) => {
  if (!url) return false
  return getEmbedUrl(url) !== ""
}
