import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

// Dummy data for most viewed video and subscriber details
const mostViewedVideo = {
  thumbnail: "https://picsum.photos/200/300", // Placeholder thumbnail
  title: "Most Watched Video",
  views: 15000,
};

const subscribers = [
  { avatar: "https://picsum.photos/200/300", name: "Channel One" },
  { avatar: "https://picsum.photos/200/300", name: "Channel Two" },
  { avatar: "https://picsum.photos/200/300", name: "Channel Three" },
];

const Dashboard = ({ data }) => {
  const { videosSize, subscribers } = data;
  const subscribersCountRef = useRef(null);
  const videosCountRef = useRef(null);
  const totalViewsCountRef = useRef(null);

  // GSAP animation to increment counts
  useEffect(() => {
    gsap.fromTo(
      subscribersCountRef.current,
      { innerText: 0 },
      { innerText: subscribers.length, duration: 2, snap: { innerText: 1 } }
    );
    gsap.fromTo(
      videosCountRef.current,
      { innerText: 0 },
      { innerText: videosSize, duration: 2, snap: { innerText: 1 } }
    );
    gsap.fromTo(
      totalViewsCountRef.current,
      { innerText: 0 },
      { innerText: subscribers.length, duration: 2, snap: { innerText: 1 } }
    );

    const xValues = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

    new Chart("myChart", {
      type: "line",
      data: {
        labels: xValues,
        datasets: [
          {
            data: [100, 50, 35],
            borderColor: "green",
            fill: false,
          },
          {
            data: [100, 130, 200],
            borderColor: "blue",
            fill: false,
          },
        ],
      },
      options: {
        legend: { display: false },
      },
    });
  }, []);

  return (
    <div className="max-h-screen w-full grid grid-rows-6 grid-cols-12 gap-4 p-6 bg-black">
      {/* Reserve space for the chart (row-span-2 for 33% height) */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform  col-span-6 row-span-4">
        <h3 className="text-lg text-white p-4">
          Month-wise Subscribers & Views
        </h3>
        <canvas id="myChart" className="h-50 w-100"></canvas>
      </div>

      {/* Number of Subscribers */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform  col-span-6 row-span-1 flex items-center justify-between">
        <h3 className="text-lg text-white">Number of Subscribers</h3>
        <p
          className="text-5xl font-bold text-blue-400"
          ref={subscribersCountRef}
        >
          0
        </p>
      </div>

      {/* Number of Videos */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform  col-span-6 row-span-2 flex items-center justify-between">
        <h3 className="text-lg text-white">No. of Videos</h3>
        <p className="text-5xl font-bold text-blue-400" ref={videosCountRef}>
          0
        </p>
      </div>

      {/* Most Viewed Video */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform  col-span-6 row-span-1 flex items-center">
        <img
          src={mostViewedVideo.thumbnail}
          alt="Thumbnail"
          className="w-32 h-20 rounded-md"
        />
        <div className="ml-6">
          <h4 className="text-white font-semibold">{mostViewedVideo.title}</h4>
          <p className="text-blue-400">
            {mostViewedVideo.views.toLocaleString()} views
          </p>
        </div>
      </div>

      {/* Subscriber Details */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform  col-span-8 row-span-2 overflow-y-auto">
        <h3 className="text-lg text-white mb-4">Subscriber Details</h3>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="text-gray-400">Profile</th>
              <th className="text-gray-400">Name</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((sub, idx) => (
              <tr key={idx} className="border-t border-gray-700">
                <td className="py-4">
                  <img
                    src={sub.avatar}
                    alt="Avatar"
                    className="w-12 h-12 rounded-full"
                  />
                </td>
                <td className="py-4 text-white">{sub.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Total Video Views */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform  col-span-4 row-span-2 flex items-center justify-between">
        <h3 className="text-lg text-white">Total Video Views</h3>
        <p
          className="text-5xl font-bold text-blue-400"
          ref={totalViewsCountRef}
        >
          0
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
