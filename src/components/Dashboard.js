import React, { useEffect, useState } from "react";
import axios from 'axios';
import "./Dashboard.css";

const Dashboard = () => {
  let [totalTasksCount, setTotalTasks] = useState(0);
  let [totalCompletedTasks, setTotalCompletedTasks] = useState(0);
  let [totalPendingTasks, setTotalPendingTasks] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const totalTasks = await axios.get('http://localhost:3001/tasks')
      totalTasksCount = totalTasks.data;
      
      // console.log(totalTasksCount.data)
      // totalTasks.data.filter((res)=>{
      //   if(res.status === 'done'){
      //     totalCompletedTasks = []
      //     totalCompletedTasks.push(res)
      //   } else {
      //     totalPendingTasks = []
      //     totalPendingTasks.push(res)
      //   }
      // })
      totalCompletedTasks = totalTasks.data.filter((res)=>{ return res.status === 'done'});
      totalPendingTasks = totalTasks.data.filter((res)=>{ return res.status !== 'done'});

     
      console.log(totalTasks.data,'totalTasks');
      console.log(totalCompletedTasks,'totalCompletedTasks');
      console.log(totalPendingTasks,'totalPendingTasks');

      setTotalTasks(totalTasksCount);
      setTotalCompletedTasks(totalCompletedTasks);
      setTotalPendingTasks(totalPendingTasks)

    } catch (error) {
      console.error("Error fetching data:", error);
    }
    console.log(totalPendingTasks,'totalCompletedTasks')
  };

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Dashboard</h2>
      <div className="dashboard-item">
        <h3 className="dashboard-item-title">Total Tasks</h3>
        <p className="dashboard-item-count">{totalTasksCount.length}</p>
      </div>
      <div className="dashboard-item">
        <h3 className="dashboard-item-title">Total Completed Tasks</h3>
        <p className="dashboard-item-count">{totalCompletedTasks.length}</p>
      </div>
      <div className="dashboard-item">
        <h3 className="dashboard-item-title">Total Pending Tasks</h3>
        <p className="dashboard-item-count">{totalPendingTasks.length}</p>
      </div>
    </div>
  );
};

export default Dashboard;
