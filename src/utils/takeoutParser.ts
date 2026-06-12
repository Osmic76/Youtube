import { Video, Playlist, TakeoutData } from "../types";
import * as fs from "fs";
import * as path from "path";

export function parseTakeoutData(folderPath: string): TakeoutData {
  const videos: Video[] = [];
  const playlists: Playlist[] = [];

  try {
    // Parse watch-history.json
    const watchHistoryPath = path.join(
      folderPath,
      "YouTube and YouTube Music",
      "history",
      "watch-history.json"
    );

    if (fs.existsSync(watchHistoryPath)) {
      const watchData = JSON.parse(fs.readFileSync(watchHistoryPath, "utf-8"));
      // Process watch history
    }

    // Parse playlists
    const playlistsPath = path.join(
      folderPath,
      "YouTube and YouTube Music",
      "playlists"
    );

    if (fs.existsSync(playlistsPath)) {
      const playlistFiles = fs.readdirSync(playlistsPath);
      playlistFiles.forEach((file) => {
        if (file.endsWith(".json")) {
          const playlistData = JSON.parse(
            fs.readFileSync(path.join(playlistsPath, file), "utf-8")
          );
          // Process playlist data
        }
      });
    }

    // Parse subscriptions
    const subscriptionsPath = path.join(
      folderPath,
      "YouTube and YouTube Music",
      "subscriptions",
      "subscriptions.json"
    );

    if (fs.existsSync(subscriptionsPath)) {
      const subscriptionsData = JSON.parse(
        fs.readFileSync(subscriptionsPath, "utf-8")
      );
      // Process subscriptions
    }

    return { videos, playlists };
  } catch (error) {
    console.error("Error parsing Takeout data:", error);
    return { videos: [], playlists: [] };
  }
}
