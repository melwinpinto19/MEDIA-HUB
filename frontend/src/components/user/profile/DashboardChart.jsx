import React from 'react';
import Chart from 'react-apexcharts';
import { useSelector } from 'react-redux';

const MonthWiseChart = () => {
  // Fetch dark mode setting from Redux
  const isDarkMode = useSelector((state) => state.mode.value);

  const chartOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false
      }
    },
    theme: {
      mode: isDarkMode ? 'dark' : 'light',  // Dark mode support
      backgroundColor: 'transparent'
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ]
    },
    yaxis: {
      title: {
        text: 'Count'
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: (val) => val.toLocaleString()
      }
    },
    colors: ['#1f77b4', '#ff7f0e']  // Different colors for subscribers and views
  };

  const chartSeries = [
    {
      name: 'Subscribers',
      data: [100, 200, 150, 300, 250, 400, 350, 450, 300, 500, 600, 550]
    },
    {
      name: 'Views',
      data: [1500, 2000, 1800, 2200, 2100, 2300, 2400, 2500, 2100, 2700, 3000, 2800]
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto  p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center">
        Monthly Subscribers and Views
      </h2>
      <Chart options={chartOptions} series={chartSeries} type="bar" height={350} />
    </div>
  );
};

export default MonthWiseChart;
