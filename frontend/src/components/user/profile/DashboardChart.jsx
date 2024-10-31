import React from "react";
import Chart from "react-apexcharts";
import { useSelector } from "react-redux";

const MonthWiseChart = ({ subscriberData, viewsData }) => {
  // Fetch dark mode setting from Redux
  const isDarkMode = useSelector((state) => state.mode.value);

  // extracting the data :
  const chartData = {
    2024: new Map([
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [5, 0],
      [6, 0],
      [7, 0],
      [8, 0],
      [9, 0],
      [10, 0],
      [11, 0],
      [12, 0],
    ]),
    views2024: new Map([
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [5, 0],
      [6, 0],
      [7, 0],
      [8, 0],
      [9, 0],
      [10, 0],
      [11, 0],
      [12, 0],
    ]),
  };

  subscriberData.forEach((each) => {
    const month = new Date(each.createdAt).getMonth() + 1;

    chartData[2024].set(month, chartData[2024].get(month) + 1);
  });

  // viewsData.forEach((each) => {
  //   const month = new Date(each.createdAt).getMonth() + 1;

  //   chartData.views2024.set(month, chartData[2024].get(month) + 1);
  // });

  console.log(Array.from(chartData[2024].values()));

  const chartOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: false,
      },
      background: "transparent", // Set background to transparent
    },
    theme: {
      mode: isDarkMode ? "dark" : "light", // Dark mode support
      backgroundColor: "transparent",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    yaxis: {
      title: {
        text: "Count",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val) => val.toLocaleString(),
      },
    },
    colors: ["#1f77b4", "#ff7f0e"], // Different colors for subscribers and views
  };

  const chartSeries = [
    {
      name: "Subscribers",
      data: Array.from(chartData[2024].values()),
    },
    {
      name: "Views",
      data: [0, 0, 6, 30, 0, 0, 50, 20, 40, 0, 0, 0],
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto  p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center">
        Monthly Subscribers and Views
      </h2>
      <Chart
        options={chartOptions}
        series={chartSeries}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default MonthWiseChart;
