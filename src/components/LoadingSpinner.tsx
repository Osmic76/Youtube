import React from "react";
import "./LoadingSpinner.css";

const LoadingSpinner: React.FC<{ message?: string }> = ({ message = "Loading..." }) => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
};

export default LoadingSpinner;
