import React, { useState } from "react";
import { Playlist } from "../types";
import "./PlaylistView.css";

interface PlaylistViewProps {
  playlists: Playlist[];
  onPlaylistSelect: (playlist: Playlist) => void;
  selectedPlaylist: Playlist | null;
}

const PlaylistView: React.FC<PlaylistViewProps> = ({
  playlists,
  onPlaylistSelect,
  selectedPlaylist,
}) => {
  const [filterText, setFilterText] = useState("");

  const filteredPlaylists = playlists.filter((playlist) =>
    playlist.title.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="playlist-view">
      <div className="playlist-header">
        <input
          type="text"
          placeholder="Search playlists..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="playlist-grid">
        {filteredPlaylists.length === 0 ? (
          <div className="empty-state">
            <p>No playlists found</p>
          </div>
        ) : (
          filteredPlaylists.map((playlist) => (
            <div
              key={playlist.id}
              className={`playlist-card ${
                selectedPlaylist?.id === playlist.id ? "active" : ""
              }`}
              onClick={() => onPlaylistSelect(playlist)}
            >
              <div className="playlist-card-icon">📋</div>
              <h3>{playlist.title}</h3>
              <p className="playlist-count">{playlist.videoCount} videos</p>
              <p className="playlist-date">
                Created: {new Date(playlist.createdDate).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>

      {selectedPlaylist && (
        <div className="playlist-detail">
          <div className="detail-header">
            <h2>{selectedPlaylist.title}</h2>
          </div>
          <div className="detail-content">
            <p>
              <strong>Videos:</strong> {selectedPlaylist.videoCount}
            </p>
            <p>
              <strong>Created:</strong>{" "}
              {new Date(selectedPlaylist.createdDate).toLocaleString()}
            </p>
            {selectedPlaylist.description && (
              <p>
                <strong>Description:</strong> {selectedPlaylist.description}
              </p>
            )}
            {selectedPlaylist.customTags && selectedPlaylist.customTags.length > 0 && (
              <div>
                <strong>Tags:</strong>
                <div className="tags-list">
                  {selectedPlaylist.customTags.map((tag, idx) => (
                    <span key={idx} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistView;
