import React, { useState, useContext } from "react";
import { TaskContext } from "../Context/TaskContext";

const TasksComponent = ({ className }) => {
  const [taskData, setTaskData] = useState("");

  const { createTask } = useContext(TaskContext);

  const saveTask = async () => {
    if (!taskData.trim()) return;

    await createTask(taskData);

    setTaskData("");
  };

  return (
    <div
      className={`flex flex-col items-center pt-10 text-white ${className}`}
    >
      <div className="flex gap-3 w-full px-4">
        <input
          type="text"
          placeholder="Enter a task..."
          value={taskData}
          onChange={(e) => setTaskData(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              saveTask();
            }
          }}
          className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 outline-none focus:border-blue-500"
        />

        <button
          onClick={saveTask}
          className="bg-blue-600 px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 active:scale-95 transition"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default TasksComponent;