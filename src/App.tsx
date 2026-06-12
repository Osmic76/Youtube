import React, { useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import VideoList from "./components/VideoList";
import VideoDetail from "./components/VideoDetail";
import PlaylistView from "./components/PlaylistView";
import { Video, Playlist } from "./types";

const App: React.FC = () => {
  const [selectedView, setSelectedView] = useState<"videos" | "playlists">(
    "videos"
  );
  const [videos, setVideos] = useState<Video[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(
    null
  );
  const [selectedPlaylistFilter, setSelectedPlaylistFilter] = useState<
    string | null
  >(null);

  // Sample data for testing
  const initializeSampleData = () => {
    const sampleVideos: Video[] = [
      {
        id: "1",
        title: "Learn React Hooks",
        description: "Complete guide to React Hooks",
        uploadDate: "2024-01-15",
        viewCount: 15000,
        likeCount: 450,
        commentCount: 120,
        duration: "45:30",
        playlistIds: ["playlist1"],
        tags: ["react", "javascript"],
      },
      {
        id: "2",
        title: "TypeScript Advanced",
        description: "Advanced TypeScript patterns",
        uploadDate: "2024-01-20",
        viewCount: 8500,
        likeCount: 280,
        commentCount: 95,
        duration: "52:15",
        playlistIds: ["playlist1"],
        tags: ["typescript", "javascript"],
      },
      {
        id: "3",
        title: "Electron Desktop Apps",
        description: "Building desktop apps with Electron",
        uploadDate: "2024-02-01",
        viewCount: 12000,
        likeCount: 350,
        commentCount: 85,
        duration: "38:45",
        playlistIds: ["playlist2"],
        tags: ["electron", "desktop"],
      },
    ];

    const samplePlaylists: Playlist[] = [
      {
        id: "playlist1",
        title: "Web Development Series",
        description: "Learn web development from scratch",
        createdDate: "2024-01-01",
        videoCount: 15,
        customTags: ["web", "tutorial"],
      },
      {
        id: "playlist2",
        title: "Desktop Development",
        description: "Build desktop applications",
        createdDate: "2024-02-01",
        videoCount: 8,
        customTags: ["desktop", "electron"],
      },
    ];

    setVideos(sampleVideos);
    setPlaylists(samplePlaylists);
  };

  const handleLoadTakeout = () => {
    // In a real implementation, this would open a file dialog
    // and parse the Takeout data
    alert("Takeout loading feature will be implemented soon!");
    // For testing, load sample data
    initializeSampleData();
  };

  const handleAddTag = (tag: string) => {
    if (selectedVideo) {
      const updatedVideo = {
        ...selectedVideo,
        tags: [...(selectedVideo.tags || []), tag],
      };
      setSelectedVideo(updatedVideo);
      setVideos(
        videos.map((v) => (v.id === selectedVideo.id ? updatedVideo : v))
      );
    }
  };

  const handleRemoveTag = (tag: string) => {
    if (selectedVideo) {
      const updatedVideo = {
        ...selectedVideo,
        tags: (selectedVideo.tags || []).filter((t) => t !== tag),
      };
      setSelectedVideo(updatedVideo);
      setVideos(
        videos.map((v) => (v.id === selectedVideo.id ? updatedVideo : v))
      );
    }
  };

  const filteredVideos = selectedPlaylistFilter
    ? videos.filter((v) => v.playlistIds.includes(selectedPlaylistFilter))
    : videos;

  return (
    <div className="app">
      <Sidebar
        onLoadTakeout={handleLoadTakeout}
        selectedView={selectedView}
        onViewChange={setSelectedView}
        playlists={playlists}
        onPlaylistSelect={setSelectedPlaylistFilter}
        selectedPlaylist={selectedPlaylistFilter}
      />

      <div className="main-content">
        {selectedView === "videos" ? (
          <>
            <VideoList
              videos={filteredVideos}
              onVideoSelect={setSelectedVideo}
              selectedVideo={selectedVideo}
            />
            <VideoDetail
              video={selectedVideo}
              onAddTag={handleAddTag}
              onRemoveTag={handleRemoveTag}
            />
          </>
        ) : (
          <PlaylistView
            playlists={playlists}
            onPlaylistSelect={setSelectedPlaylist}
            selectedPlaylist={selectedPlaylist}
          />
        )}
      </div>
    </div>
  );
};

export default App;
