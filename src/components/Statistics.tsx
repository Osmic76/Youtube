import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { Video } from "../types";
import "./Statistics.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface StatisticsProps {
  videos: Video[];
}

const Statistics: React.FC<StatisticsProps> = ({ videos }) => {
  // 基本統計
  const totalVideos = videos.length;
  const totalViews = videos.reduce((sum, v) => sum + v.viewCount, 0);
  const totalLikes = videos.reduce((sum, v) => sum + v.likeCount, 0);
  const totalComments = videos.reduce((sum, v) => sum + v.commentCount, 0);
  const avgViews = totalVideos > 0 ? Math.round(totalViews / totalVideos) : 0;

  // 月別データ
  const monthlyData = videos.reduce(
    (acc, video) => {
      const date = new Date(video.uploadDate);
      const month = date.toLocaleString("default", { month: "short", year: "numeric" });

      if (!acc[month]) {
        acc[month] = { uploads: 0, views: 0 };
      }
      acc[month].uploads += 1;
      acc[month].views += video.viewCount;
      return acc;
    },
    {} as Record<string, { uploads: number; views: number }>
  );

  const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });

  const monthlyChartData = {
    labels: sortedMonths,
    datasets: [
      {
        label: "Uploads",
        data: sortedMonths.map((m) => monthlyData[m].uploads),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const viewsChartData = {
    labels: sortedMonths,
    datasets: [
      {
        label: "Views",
        data: sortedMonths.map((m) => monthlyData[m].views),
        backgroundColor: "rgba(34, 197, 94, 0.8)",
      },
    ],
  };

  // トップ10ビデオ（再生数）
  const topVideos = [...videos].sort((a, b) => b.viewCount - a.viewCount).slice(0, 10);
  const topVideosChartData = {
    labels: topVideos.map((v) => v.title.substring(0, 20)),
    datasets: [
      {
        label: "Views",
        data: topVideos.map((v) => v.viewCount),
        backgroundColor: [
          "#3b82f6",
          "#ef4444",
          "#10b981",
          "#f59e0b",
          "#8b5cf6",
          "#ec4899",
          "#06b6d4",
          "#f97316",
          "#6366f1",
          "#14b8a6",
        ],
      },
    ],
  };

  // エンゲージメント率
  const engagementRates = videos
    .map((v) => ({
      title: v.title,
      rate: v.viewCount > 0 ? ((v.likeCount + v.commentCount) / v.viewCount) * 100 : 0,
    }))
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 10);

  const engagementChartData = {
    labels: engagementRates.map((e) => e.title.substring(0, 20)),
    datasets: [
      {
        label: "Engagement Rate (%)",
        data: engagementRates.map((e) => e.rate),
        backgroundColor: "rgba(139, 92, 246, 0.8)",
      },
    ],
  };

  return (
    <div className="statistics-container">
      <div className="stats-header">
        <h2>📊 Statistics</h2>
      </div>

      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon">🎬</div>
          <div className="stat-content">
            <div className="stat-label">Total Videos</div>
            <div className="stat-value">{totalVideos}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👁️</div>
          <div className="stat-content">
            <div className="stat-label">Total Views</div>
            <div className="stat-value">{totalViews.toLocaleString()}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👍</div>
          <div className="stat-content">
            <div className="stat-label">Total Likes</div>
            <div className="stat-value">{totalLikes.toLocaleString()}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💬</div>
          <div className="stat-content">
            <div className="stat-label">Total Comments</div>
            <div className="stat-value">{totalComments.toLocaleString()}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <div className="stat-label">Average Views</div>
            <div className="stat-value">{avgViews.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-section">
          <h3>Monthly Uploads</h3>
          <Line data={monthlyChartData} options={{ responsive: true, maintainAspectRatio: true }} />
        </div>

        <div className="chart-section">
          <h3>Monthly Views</h3>
          <Bar data={viewsChartData} options={{ responsive: true, maintainAspectRatio: true }} />
        </div>

        <div className="chart-section full-width">
          <h3>Top 10 Videos by Views</h3>
          <Bar data={topVideosChartData} options={{ responsive: true, maintainAspectRatio: true }} />
        </div>

        <div className="chart-section full-width">
          <h3>Top 10 Videos by Engagement Rate</h3>
          <Bar data={engagementChartData} options={{ responsive: true, maintainAspectRatio: true }} />
        </div>
      </div>
    </div>
  );
};

export default Statistics;
