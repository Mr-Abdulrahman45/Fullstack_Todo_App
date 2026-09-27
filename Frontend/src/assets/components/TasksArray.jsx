import React, { useContext, useEffect, useState } from "react";
import { TaskContext } from "../Context/TaskContext";

const TasksArray = ({ search = "", filter = "all" }) => {
  const {
    tasks,
    getTasks,
    updateTask,
    deleteTask,
  } = useContext(TaskContext);

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    getTasks();
  }, []);

  const handleEditClick = (task) => {
    setEditingId(task.id);
    setEditText(task.title);
  };

  const handleSave = async (id) => {
    if (!editText.trim()) return;

    await updateTask(id, {
      title: editText,
    });

    setEditingId(null);
    setEditText("");
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditText("");
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    if (filter === "completed") {
      return matchesSearch && task.is_completed;
    }

    if (filter === "pending") {
      return matchesSearch && !task.is_completed;
    }

    return matchesSearch;
  });

  return (
    <div className="mt-6">
      {filteredTasks.length === 0 ? (
        <div className="bg-gray-800 p-6 rounded-lg text-center text-gray-400">
          No tasks found.
        </div>
      ) : (
        <ul className="space-y-3 text-white">
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between bg-gray-800 p-4 rounded-lg shadow"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">

                <input
                  type="checkbox"
                  checked={task.is_completed}
                  className="w-6 h-6 accent-green-600 cursor-pointer shrink-0"
                  onChange={(e) =>{              
                    updateTask(task.id, {
                      is_completed: e.target.checked,
                    })
                  }}
                />

                {editingId === task.id ? (
                  <input
                    type="text"
                    value={editText}
                    autoFocus
                    className="flex-1 bg-gray-700 px-3 py-2 rounded outline-none"
                    onChange={(e) =>
                      setEditText(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSave(task.id);
                      }
                    }}
                  />
                ) : (
                  <div className="flex-1">
                    <p
                      onDoubleClick={() =>
                        handleEditClick(task)
                      }
                      className={`cursor-pointer break-words ${task.is_completed
                          ? "line-through text-gray-400"
                          : ""
                        }`}
                    >
                      {task.title}
                    </p>

                    {task.created_at && (
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(
                          task.created_at
                        ).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-3 md:mt-0">

                {editingId === task.id ? (
                  <>
                    <button
                      onClick={() =>
                        handleSave(task.id)
                      }
                      className="bg-green-600 px-3 py-2 rounded hover:bg-green-700 transition"
                    >
                      Save
                    </button>

                    <button
                      onClick={handleCancel}
                      className="bg-gray-600 px-3 py-2 rounded hover:bg-gray-700 transition"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() =>
                        handleEditClick(task)
                      }
                      className="bg-blue-600 px-3 py-2 rounded hover:bg-blue-700 transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteTask(task.id)
                      }
                      className="bg-red-600 px-3 py-2 rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </>
                )}

              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TasksArray;