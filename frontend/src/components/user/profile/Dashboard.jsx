import React, { useEffect, useState } from "react";
import { Test } from "./index";
import axios from "axios";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});

  useEffect(() => {
    // setTimeout(() => {
    //   setLoading(false);
    // }, 2000);
    (async () => {
      try {
        const res = await axios.get("/api/v1/users/get-user-dashboard");
        setData(res.data);
        setLoading(false);
      } catch (error) {}
    })();
  }, []);

  return (
    <>
      {loading && <div>Loading ...</div>}
      {!loading && <Test data={data} />}
    </>
  );
};

export default Dashboard;
