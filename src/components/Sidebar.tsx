import React from "react";
import "./Sidebar.css";

interface SidebarProps {
  onLoadTakeout: () => void;
  selectedView: "videos" | "playlists";
  onViewChange: (view: "videos" | "playlists") => void;
  playlists: Array<{ id: string; title: string }>;
  onPlaylistSelect: (playlistId: string | null) => void;
  selectedPlaylist: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({
  onLoadTakeout,
  selectedView,
  onViewChange,
  playlists,
  onPlaylistSelect,
  selectedPlaylist,
}) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>YouTube Manager</h1>
      </div>

      <button className="load-button" onClick={onLoadTakeout}>
        📁 Load Takeout
      </button>

      <div className="navigation">
        <div className="nav-section">
          <h3>Main Views</h3>
          <button
            className={`nav-item ${selectedView === "videos" ? "active" : ""}`}
            onClick={() => onViewChange("videos")}
          >
            🎬 All Videos
          </button>
          <button
            className={`nav-item ${selectedView === "playlists" ? "active" : ""}`}
            onClick={() => onViewChange("playlists")}
          >
            📋 Playlists
          </button>
        </div>

        {playlists.length > 0 && (
          <div className="nav-section">
            <h3>Your Playlists</h3>
            <button
              className={`nav-item ${selectedPlaylist === null ? "active" : ""}`}
              onClick={() => onPlaylistSelect(null)}
            >
              All Playlists
            </button>
            {playlists.map((playlist) => (
              <button
                key={playlist.id}
                className={`nav-item playlist-item ${
                  selectedPlaylist === playlist.id ? "active" : ""
                }`}
                onClick={() => onPlaylistSelect(playlist.id)}
                title={playlist.title}
              >
                {playlist.title.substring(0, 20)}
                {playlist.title.length > 20 ? "..." : ""}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
