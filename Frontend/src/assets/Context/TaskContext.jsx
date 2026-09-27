import { createContext, useEffect, useState } from "react";
import api from "../../api";

export const TaskContext = createContext();

const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);


  const getTasks = async () => {
    try {
      setLoading(true);

      const response = await api.get("tasks/");

      const data = response.data;

      setTasks(
        Array.isArray(data)
          ? data
          : data.results || []
      );
    } catch (error) {
      console.log(
        "Get Tasks Error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  // Create Task
  const createTask = async (title) => {
    try {
      const response = await api.post("tasks/", {
        title,
      });

      setTasks((prev) => [
        ...prev,
        response.data,
      ]);
    } catch (error) {
      console.log(
        "Create Task Error:",
        error.response?.data || error.message
      );
    }
  };

  // Update Task
  const updateTask = async (id, data) => {
    try {
      const response = await api.patch(
        `tasks/${id}/`,
        data
      );
      setTasks(prev => prev.map(task => task.id === id ? response.data : task));

    } catch (error) {
      console.log(
        "Update Task Error:",
        error.response?.data || error.message
      );
    }
  };

  // Delete Task
  const deleteTask = async (id) => {
    try {
      await api.delete(
        `tasks/${id}/`
      );

      await getTasks();
    } catch (error) {
      console.log(
        "Delete Task Error:",
        error.response?.data || error.message
      );
    }
  };

  // Statistics
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.is_completed
  ).length;

  const pendingTasks =
    totalTasks - completedTasks;

  const progress =
    totalTasks > 0
      ? Math.round(
          (completedTasks / totalTasks) * 100
        )
      : 0;

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        getTasks,
        createTask,
        updateTask,
        deleteTask,
        totalTasks,
        completedTasks,
        pendingTasks,
        progress,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export default TaskProvider;
