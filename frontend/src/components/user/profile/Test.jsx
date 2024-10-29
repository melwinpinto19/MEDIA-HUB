import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { DashboardChart } from ".";

const Dashboard = ({ data }) => {
  const { videosCount, subscribersCount, viewsCount, subscribers } = data;
  const subscribersCountRef = useRef(null);
  const videosCountRef = useRef(null);
  const totalViewsCountRef = useRef(null);
  const mostViewedVideo = (() => {
    const maxi = data.videos.reduce(
      (max, current) => (current.views > max ? current.views : max),
      0
    );

    const getmostViewdVideo = data.videos.filter((each) => each.views == maxi);

    if (getmostViewdVideo.length == 0) return {};

    return getmostViewdVideo[0];
  })();

  // GSAP animation to increment counts
  useEffect(() => {
    console.log(subscribers);

    gsap.fromTo(
      subscribersCountRef.current,
      { innerText: 0 },
      { innerText: subscribersCount, duration: 2, snap: { innerText: 1 } }
    );
    gsap.fromTo(
      videosCountRef.current,
      { innerText: 0 },
      { innerText: videosCount, duration: 2, snap: { innerText: 1 } }
    );
    gsap.fromTo(
      totalViewsCountRef.current,
      { innerText: 0 },
      { innerText: viewsCount, duration: 2, snap: { innerText: 1 } }
    );
  }, []);

  return (
    <div className="max-h-screen w-full grid grid-rows-6 grid-cols-12 gap-4 p-6 bg-black">
      {/* Reserve space for the chart (row-span-2 for 33% height) */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform  col-span-6 row-span-4 mb-3">
        <DashboardChart />
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
                    className="w-16 h-16 rounded-full"
                  />
                </td>
                <td className="py-4 text-white">{sub.username}</td>
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
