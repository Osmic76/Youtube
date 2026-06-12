import React, { useState } from "react";
import "./ExportModal.css";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (type: "json" | "csv", dataType: "videos" | "playlists") => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, onExport }) => {
  const [selectedType, setSelectedType] = useState<"json" | "csv">("json");
  const [selectedData, setSelectedData] = useState<"videos" | "playlists">("videos");

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📥 Export Data</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Export Format</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  value="json"
                  checked={selectedType === "json"}
                  onChange={(e) => setSelectedType(e.target.value as "json" | "csv")}
                />
                JSON
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  value="csv"
                  checked={selectedType === "csv"}
                  onChange={(e) => setSelectedType(e.target.value as "json" | "csv")}
                />
                CSV
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Data Type</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  value="videos"
                  checked={selectedData === "videos"}
                  onChange={(e) => setSelectedData(e.target.value as "videos" | "playlists")}
                />
                Videos
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  value="playlists"
                  checked={selectedData === "playlists"}
                  onChange={(e) => setSelectedData(e.target.value as "videos" | "playlists")}
                />
                Playlists
              </label>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-export"
            onClick={() => {
              onExport(selectedType, selectedData);
              onClose();
            }}
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
