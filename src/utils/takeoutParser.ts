import * as fs from "fs";
import * as path from "path";
import { Video, Playlist } from "../types";

interface TakeoutVideo {
  title: string;
  description?: string;
  date?: string;
  views?: string;
  rating?: string;
  comments?: string;
  duration?: string;
  videoId?: string;
}

interface TakeoutPlaylist {
  title: string;
  description?: string;
  addedDate?: string;
  videos?: string[];
}

export function parseTakeoutData(folderPath: string): {
  videos: Video[];
  playlists: Playlist[];
} {
  const videos: Video[] = [];
  const playlists: Playlist[] = [];
  const videoMap = new Map<string, Video>();

  try {
    // YouTube and YouTube Music フォルダを探す
    const youtubeFolderPath = path.join(folderPath, "YouTube and YouTube Music");

    if (!fs.existsSync(youtubeFolderPath)) {
      throw new Error("YouTube and YouTube Music folder not found");
    }

    // 1. 再生リストのJSONをパース
    const playlistsPath = path.join(youtubeFolderPath, "playlists");
    if (fs.existsSync(playlistsPath)) {
      const playlistFiles = fs.readdirSync(playlistsPath).filter((f) =>
        f.endsWith(".json")
      );

      playlistFiles.forEach((file) => {
        try {
          const filePath = path.join(playlistsPath, file);
          const content = fs.readFileSync(filePath, "utf-8");
          const playlistData = JSON.parse(content);

          if (Array.isArray(playlistData)) {
            playlistData.forEach((item: any, index: number) => {
              const playlist: Playlist = {
                id: `playlist_${file}_${index}`,
                title: item.title || item.name || file.replace(".json", ""),
                description: item.description || "",
                createdDate: item.addedDate || new Date().toISOString(),
                videoCount: item.videos?.length || 0,
                customTags: [],
              };
              playlists.push(playlist);
            });
          }
        } catch (error) {
          console.error(`Error parsing playlist ${file}:`, error);
        }
      });
    }

    // 2. 動画情報をパース
    const myVideosPath = path.join(youtubeFolderPath, "my-uploads");
    if (fs.existsSync(myVideosPath)) {
      const videoFiles = fs.readdirSync(myVideosPath).filter((f) =>
        f.endsWith(".json")
      );

      videoFiles.forEach((file) => {
        try {
          const filePath = path.join(myVideosPath, file);
          const content = fs.readFileSync(filePath, "utf-8");
          const videoData = JSON.parse(content);

          if (Array.isArray(videoData)) {
            videoData.forEach((item: TakeoutVideo) => {
              const video: Video = {
                id: item.videoId || `video_${Date.now()}_${Math.random()}`,
                title: item.title || "Unknown",
                description: item.description || "",
                uploadDate: item.date || new Date().toISOString(),
                viewCount: parseInt(item.views?.replace(/,/g, "") || "0"),
                likeCount: parseInt(item.rating?.replace(/,/g, "") || "0"),
                commentCount: parseInt(item.comments?.replace(/,/g, "") || "0"),
                duration: item.duration || "00:00:00",
                playlistIds: [],
                tags: [],
              };
              videos.push(video);
              videoMap.set(video.id, video);
            });
          }
        } catch (error) {
          console.error(`Error parsing video ${file}:`, error);
        }
      });
    }

    // 3. 再生履歴をパース（オプション）
    const watchHistoryPath = path.join(
      youtubeFolderPath,
      "history",
      "watch-history.json"
    );
    if (fs.existsSync(watchHistoryPath)) {
      try {
        const content = fs.readFileSync(watchHistoryPath, "utf-8");
        const watchHistory = JSON.parse(content);

        if (Array.isArray(watchHistory)) {
          watchHistory.forEach((item: any) => {
            if (item.title && !videoMap.has(item.title)) {
              const video: Video = {
                id: `watch_${Date.now()}_${Math.random()}`,
                title: item.title,
                description: item.description || "",
                uploadDate: item.time || new Date().toISOString(),
                viewCount: 1,
                likeCount: 0,
                commentCount: 0,
                duration: "00:00:00",
                playlistIds: [],
                tags: [],
              };
              videos.push(video);
              videoMap.set(video.id, video);
            }
          });
        }
      } catch (error) {
        console.error("Error parsing watch history:", error);
      }
    }

    return { videos, playlists };
  } catch (error) {
    console.error("Error parsing Takeout data:", error);
    return { videos: [], playlists: [] };
  }
}

// ファイルから複数の JSON オブジェクトをパース（Takeout形式）
export function parseNDJSON(filePath: string): any[] {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");
    const results: any[] = [];

    lines.forEach((line) => {
      if (line.trim()) {
        try {
          results.push(JSON.parse(line));
        } catch (error) {
          // Skip invalid JSON lines
        }
      }
    });

    return results;
  } catch (error) {
    console.error("Error parsing NDJSON:", error);
    return [];
  }
}
