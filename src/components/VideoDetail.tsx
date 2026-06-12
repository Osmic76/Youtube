import React, { useState } from "react";
import { Video } from "../types";
import "./VideoDetail.css";

interface VideoDetailProps {
  video: Video | null;
  onAddTag?: (tag: string) => void;
  onRemoveTag?: (tag: string) => void;
}

const VideoDetail: React.FC<VideoDetailProps> = ({
  video,
  onAddTag,
  onRemoveTag,
}) => {
  const [newTag, setNewTag] = useState("");

  if (!video) {
    return (
      <div className="video-detail empty">
        <p>Select a video to view details</p>
      </div>
    );
  }

  const handleAddTag = () => {
    if (newTag.trim() && onAddTag) {
      onAddTag(newTag);
      setNewTag("");
    }
  };

  return (
    <div className="video-detail">
      <div className="detail-header">
        <h2>{video.title}</h2>
      </div>

      <div className="detail-content">
        <div className="detail-section">
          <h3>📝 Description</h3>
          <p className="description">{video.description || "No description"}</p>
        </div>

        <div className="detail-section">
          <h3>📊 Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Views</span>
              <span className="stat-value">{video.viewCount.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Likes</span>
              <span className="stat-value">{video.likeCount}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Comments</span>
              <span className="stat-value">{video.commentCount}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Duration</span>
              <span className="stat-value">{video.duration || "N/A"}</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>📅 Upload Date</h3>
          <p>{new Date(video.uploadDate).toLocaleString()}</p>
        </div>

        <div className="detail-section">
          <h3>🏷️ Tags</h3>
          <div className="tags-container">
            {video.tags && video.tags.length > 0 ? (
              video.tags.map((tag, idx) => (
                <div key={idx} className="tag">
                  {tag}
                  {onRemoveTag && (
                    <button
                      className="tag-remove"
                      onClick={() => onRemoveTag(tag)}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="no-tags">No tags yet</p>
            )}
          </div>

          {onAddTag && (
            <div className="add-tag">
              <input
                type="text"
                placeholder="Add a new tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
              />
              <button onClick={handleAddTag}>Add</button>
            </div>
          )}
        </div>

        <div className="detail-section">
          <h3>📋 Playlists</h3>
          <p>
            {video.playlistIds && video.playlistIds.length > 0
              ? `In ${video.playlistIds.length} playlist(s)`
              : "Not in any playlists"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;
