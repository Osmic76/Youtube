export interface Video {
  id: string;
  title: string;
  description: string;
  uploadDate: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  duration: string;
  playlistIds: string[];
  tags: string[];
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  createdDate: string;
  videoCount: number;
  customTags: string[];
}

export interface TakeoutData {
  videos: Video[];
  playlists: Playlist[];
}
