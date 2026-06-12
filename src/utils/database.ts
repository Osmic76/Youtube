import Database from "better-sqlite3";
import * as path from "path";
import * as os from "os";
import { Video, Playlist } from "../types";

let db: Database.Database | null = null;

const DB_PATH = path.join(os.homedir(), ".youtube-manager", "data.db");

export function initializeDatabase(): Database.Database {
  if (db) return db;

  try {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");

    // ビデオテーブル
    db.exec(`
      CREATE TABLE IF NOT EXISTS videos (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        uploadDate TEXT NOT NULL,
        viewCount INTEGER DEFAULT 0,
        likeCount INTEGER DEFAULT 0,
        commentCount INTEGER DEFAULT 0,
        duration TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 再生リストテーブル
    db.exec(`
      CREATE TABLE IF NOT EXISTS playlists (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        createdDate TEXT NOT NULL,
        videoCount INTEGER DEFAULT 0,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ビデオ-再生リスト関連テーブル
    db.exec(`
      CREATE TABLE IF NOT EXISTS video_playlists (
        videoId TEXT NOT NULL,
        playlistId TEXT NOT NULL,
        PRIMARY KEY (videoId, playlistId),
        FOREIGN KEY (videoId) REFERENCES videos(id),
        FOREIGN KEY (playlistId) REFERENCES playlists(id)
      )
    `);

    // タグテーブル
    db.exec(`
      CREATE TABLE IF NOT EXISTS tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        videoId TEXT NOT NULL,
        tag TEXT NOT NULL,
        FOREIGN KEY (videoId) REFERENCES videos(id)
      )
    `);

    // カスタムタグテーブル
    db.exec(`
      CREATE TABLE IF NOT EXISTS custom_tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        playlistId TEXT NOT NULL,
        tag TEXT NOT NULL,
        FOREIGN KEY (playlistId) REFERENCES playlists(id)
      )
    `);

    console.log("Database initialized successfully");
    return db;
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
}

export function getDatabase(): Database.Database {
  if (!db) {
    throw new Error("Database not initialized. Call initializeDatabase() first.");
  }
  return db;
}

export function insertVideos(videos: Video[]): void {
  const database = getDatabase();
  const stmt = database.prepare(`
    INSERT OR REPLACE INTO videos 
    (id, title, description, uploadDate, viewCount, likeCount, commentCount, duration, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMany = database.transaction((vids: Video[]) => {
    vids.forEach((video) => {
      stmt.run(
        video.id,
        video.title,
        video.description,
        video.uploadDate,
        video.viewCount,
        video.likeCount,
        video.commentCount,
        video.duration,
        new Date().toISOString()
      );

      // タグを挿入
      const tagStmt = database.prepare(
        "INSERT INTO tags (videoId, tag) VALUES (?, ?)"
      );
      video.tags.forEach((tag) => {
        tagStmt.run(video.id, tag);
      });

      // 再生リスト関連を挿入
      const playlistStmt = database.prepare(
        "INSERT OR IGNORE INTO video_playlists (videoId, playlistId) VALUES (?, ?)"
      );
      video.playlistIds.forEach((playlistId) => {
        playlistStmt.run(video.id, playlistId);
      });
    });
  });

  insertMany(videos);
}

export function insertPlaylists(playlists: Playlist[]): void {
  const database = getDatabase();
  const stmt = database.prepare(`
    INSERT OR REPLACE INTO playlists
    (id, title, description, createdDate, videoCount, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertMany = database.transaction((pls: Playlist[]) => {
    pls.forEach((playlist) => {
      stmt.run(
        playlist.id,
        playlist.title,
        playlist.description,
        playlist.createdDate,
        playlist.videoCount,
        new Date().toISOString()
      );

      // カスタムタグを挿入
      const tagStmt = database.prepare(
        "INSERT INTO custom_tags (playlistId, tag) VALUES (?, ?)"
      );
      playlist.customTags.forEach((tag) => {
        tagStmt.run(playlist.id, tag);
      });
    });
  });

  insertMany(playlists);
}

export function getAllVideos(): Video[] {
  const database = getDatabase();
  const videos = database
    .prepare("SELECT * FROM videos ORDER BY uploadDate DESC")
    .all() as any[];

  return videos.map((v) => ({
    id: v.id,
    title: v.title,
    description: v.description,
    uploadDate: v.uploadDate,
    viewCount: v.viewCount,
    likeCount: v.likeCount,
    commentCount: v.commentCount,
    duration: v.duration,
    playlistIds: getVideoPlaylists(v.id),
    tags: getVideoTags(v.id),
  }));
}

export function getAllPlaylists(): Playlist[] {
  const database = getDatabase();
  const playlists = database
    .prepare("SELECT * FROM playlists ORDER BY createdDate DESC")
    .all() as any[];

  return playlists.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    createdDate: p.createdDate,
    videoCount: p.videoCount,
    customTags: getPlaylistTags(p.id),
  }));
}

function getVideoTags(videoId: string): string[] {
  const database = getDatabase();
  const tags = database
    .prepare("SELECT tag FROM tags WHERE videoId = ?")
    .all(videoId) as any[];
  return tags.map((t) => t.tag);
}

function getVideoPlaylists(videoId: string): string[] {
  const database = getDatabase();
  const playlists = database
    .prepare("SELECT playlistId FROM video_playlists WHERE videoId = ?")
    .all(videoId) as any[];
  return playlists.map((p) => p.playlistId);
}

function getPlaylistTags(playlistId: string): string[] {
  const database = getDatabase();
  const tags = database
    .prepare("SELECT tag FROM custom_tags WHERE playlistId = ?")
    .all(playlistId) as any[];
  return tags.map((t) => t.tag);
}

export function updateVideoTag(videoId: string, tag: string): void {
  const database = getDatabase();
  database.prepare("INSERT INTO tags (videoId, tag) VALUES (?, ?)").run(videoId, tag);
}

export function deleteVideoTag(videoId: string, tag: string): void {
  const database = getDatabase();
  database.prepare("DELETE FROM tags WHERE videoId = ? AND tag = ?").run(videoId, tag);
}

export function getVideoStatistics(): {
  totalVideos: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  averageViews: number;
} {
  const database = getDatabase();
  const stats = database
    .prepare(
      `
    SELECT
      COUNT(*) as totalVideos,
      COALESCE(SUM(viewCount), 0) as totalViews,
      COALESCE(SUM(likeCount), 0) as totalLikes,
      COALESCE(SUM(commentCount), 0) as totalComments,
      COALESCE(AVG(viewCount), 0) as averageViews
    FROM videos
  `
    )
    .get() as any;

  return {
    totalVideos: stats.totalVideos,
    totalViews: stats.totalViews,
    totalLikes: stats.totalLikes,
    totalComments: stats.totalComments,
    averageViews: Math.round(stats.averageViews),
  };
}

export function getMonthlyStatistics(): Array<{
  month: string;
  views: number;
  uploads: number;
}> {
  const database = getDatabase();
  const stats = database
    .prepare(
      `
    SELECT
      strftime('%Y-%m', uploadDate) as month,
      COALESCE(SUM(viewCount), 0) as views,
      COUNT(*) as uploads
    FROM videos
    GROUP BY strftime('%Y-%m', uploadDate)
    ORDER BY month DESC
    LIMIT 12
  `
    )
    .all() as any[];

  return stats.map((s) => ({
    month: s.month,
    views: s.views,
    uploads: s.uploads,
  }));
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}
