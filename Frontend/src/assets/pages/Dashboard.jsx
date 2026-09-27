import React, { useContext } from "react";
import { TaskContext } from "../Context/TaskContext";

const Dashboard = () => {
  const {
    tasks,
    totalTasks,
    completedTasks,
    pendingTasks,
    progress,
  } = useContext(TaskContext);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-5">

      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-gray-800 p-5 rounded-xl shadow">
          <h2 className="text-gray-400 mb-2">
            Total Tasks
          </h2>
          <p className="text-3xl font-bold">
            {totalTasks}
          </p>
        </div>

        <div className="bg-gray-800 p-5 rounded-xl shadow">
          <h2 className="text-gray-400 mb-2">
            Completed
          </h2>
          <p className="text-3xl font-bold text-green-400">
            {completedTasks}
          </p>
        </div>

        <div className="bg-gray-800 p-5 rounded-xl shadow">
          <h2 className="text-gray-400 mb-2">
            Pending
          </h2>
          <p className="text-3xl font-bold text-red-400">
            {pendingTasks}
          </p>
        </div>

        <div className="bg-gray-800 p-5 rounded-xl shadow">
          <h2 className="text-gray-400 mb-3">
            Progress
          </h2>

          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-2xl font-bold text-blue-400 mt-3">
            {progress}%
          </p>
        </div>

      </div>

      {/* Recent Tasks */}
      <div className="mt-8 bg-gray-800 rounded-xl p-5 shadow">

        <h2 className="text-xl font-semibold mb-4">
          Recent Tasks
        </h2>

        {tasks.length === 0 ? (
          <p className="text-gray-400">
            No tasks available
          </p>
        ) : (
          <div className="space-y-3">

            {tasks
              .slice(-5)
              .reverse()
              .map((task) => (
                <div
                  key={task.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between bg-gray-700 p-3 rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {task.title}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(
                        task.created_at
                      ).toLocaleString()}
                    </p>
                  </div>

                  <span
                    className={`font-semibold mt-2 md:mt-0 ${task.is_completed
                        ? "text-green-400"
                        : "text-yellow-400"
                      }`}
                  >
                    {task.is_completed
                      ? "Completed"
                      : "Pending"}
                  </span>
                </div>
              ))}

          </div>
        )}

      </div>

    </div>
  );
};

export default Dashboard;