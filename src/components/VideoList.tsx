import React, { useState } from "react";
import { Video } from "../types";
import "./VideoList.css";

interface VideoListProps {
  videos: Video[];
  onVideoSelect: (video: Video) => void;
  selectedVideo: Video | null;
}

const VideoList: React.FC<VideoListProps> = ({
  videos,
  onVideoSelect,
  selectedVideo,
}) => {
  const [sortBy, setSortBy] = useState<"title" | "uploadDate" | "views">(
    "uploadDate"
  );
  const [filterText, setFilterText] = useState("");

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(filterText.toLowerCase())
  );

  const sortedVideos = [...filteredVideos].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title);
      case "uploadDate":
        return (
          new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
        );
      case "views":
        return b.viewCount - a.viewCount;
      default:
        return 0;
    }
  });

  return (
    <div className="video-list-container">
      <div className="video-list-header">
        <input
          type="text"
          placeholder="Search videos..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="search-input"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="sort-select"
        >
          <option value="uploadDate">Latest</option>
          <option value="title">Title A-Z</option>
          <option value="views">Most Views</option>
        </select>
      </div>

      <div className="video-list">
        {sortedVideos.length === 0 ? (
          <div className="empty-state">
            <p>No videos found</p>
          </div>
        ) : (
          sortedVideos.map((video) => (
            <div
              key={video.id}
              className={`video-item ${
                selectedVideo?.id === video.id ? "active" : ""
              }`}
              onClick={() => onVideoSelect(video)}
            >
              <div className="video-title">{video.title}</div>
              <div className="video-meta">
                <span className="meta-item">
                  📅 {new Date(video.uploadDate).toLocaleDateString()}
                </span>
                <span className="meta-item">👁️ {video.viewCount.toLocaleString()}</span>
                <span className="meta-item">👍 {video.likeCount}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VideoList;
