import { Video, Playlist } from "../types";
import * as fs from "fs";
import * as path from "path";

export function exportToJSON(
  videos: Video[],
  playlists: Playlist[],
  filePath: string
): void {
  const data = {
    exportedAt: new Date().toISOString(),
    videos,
    playlists,
  };

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function exportToCSV(videos: Video[], filePath: string): void {
  const headers = [
    "ID",
    "Title",
    "Description",
    "Upload Date",
    "Views",
    "Likes",
    "Comments",
    "Duration",
    "Tags",
  ];

  const rows = videos.map((video) => [
    `"${video.id}"`,
    `"${video.title.replace(/"/g, '""')}"`,
    `"${(video.description || "").replace(/"/g, '""')}"`,
    `"${video.uploadDate}"`,
    video.viewCount,
    video.likeCount,
    video.commentCount,
    `"${video.duration}"`,
    `"${video.tags.join(", ")}"`,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  fs.writeFileSync(filePath, csvContent);
}

export function exportPlaylistsToCSV(playlists: Playlist[], filePath: string): void {
  const headers = ["ID", "Title", "Description", "Created Date", "Video Count", "Tags"];

  const rows = playlists.map((playlist) => [
    `"${playlist.id}"`,
    `"${playlist.title.replace(/"/g, '""')}"`,
    `"${(playlist.description || "").replace(/"/g, '""')}"`,
    `"${playlist.createdDate}"`,
    playlist.videoCount,
    `"${playlist.customTags.join(", ")}"`,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  fs.writeFileSync(filePath, csvContent);
}

export function getExportFileName(type: "json" | "csv", dataType: "videos" | "playlists"): string {
  const timestamp = new Date().toISOString().split("T")[0];
  return `youtube-${dataType}-${timestamp}.${type}`;
}
