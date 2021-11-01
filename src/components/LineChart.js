import React from "react";
import { Line } from "react-chartjs-2";

const LineChart = ({ data }) => {
  const labels = data?.map((d) => d.month);
  const high = data?.map((d) => d.high);
  const low = data?.map((d) => d.low);

  return (
    <div>
      <Line
        data={{
          labels: labels,
          datasets: [
            {
              label: "Monthly High Stock price ($USD)",
              data: high,
              // green
              backgroundColor: "#0ecb81",
            },
            {
              label: "Monthly Low Stock Price ($USD)",
              data: low,
              // red
              backgroundColor: "#f6465d",
            },
          ],
        }}
        height={800}
        width={1200}
        options={{
          maintainAspectRatio: false,
        }}
      />
    </div>
  );
};

export default LineChart;
