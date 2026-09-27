import React, { useState } from "react";
import TasksComponent from "../components/TasksComponent";
import TasksArray from "../components/TasksArray";

const TasksPage = () => {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    return (
        <div className="min-h-screen bg-gray-900 text-white p-5">

            <h1 className="text-3xl font-bold mb-6">
                Tasks
            </h1>

            <TasksComponent />

            <div className="mt-6 flex flex-col md:flex-row gap-3">

                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 outline-none focus:border-blue-500"
                />

                <div className="flex gap-2 flex-wrap">

                    <button
                        onClick={() => setFilter("all")}
                        className={`px-4 py-2 rounded-lg ${filter === "all"
                                ? "bg-blue-600"
                                : "bg-gray-800"
                            }`}
                    >
                        All
                    </button>

                    <button
                        onClick={() => setFilter("pending")}
                        className={`px-4 py-2 rounded-lg ${filter === "pending"
                                ? "bg-yellow-600"
                                : "bg-gray-800"
                            }`}
                    >
                        Pending
                    </button>

                    <button
                        onClick={() => setFilter("completed")}
                        className={`px-4 py-2 rounded-lg ${filter === "completed"
                                ? "bg-green-600"
                                : "bg-gray-800"
                            }`}
                    >
                        Completed
                    </button>

                </div>

            </div>

            <TasksArray
                search={search}
                filter={filter}
            />

        </div>
    );
};

export default TasksPage;