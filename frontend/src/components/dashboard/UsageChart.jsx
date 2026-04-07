import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Tooltip, Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function UsageChart({ data }) {
  if (!data || data.length === 0) {
    return <p className="text-muted small">No usage data yet.</p>;
  }

  const chartData = {
    labels: data.map((d) => d.api || "Unknown"),
    datasets: [
      {
        label: "Requests",
        data: data.map((d) => d.count),
        backgroundColor: "#4f46e5cc",
        borderRadius: 6,
      },
    ],
  };

  return (
    <Bar
      data={chartData}
      options={{
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
      }}
    />
  );
}
