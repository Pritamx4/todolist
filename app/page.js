"use client";
import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "./ThemeContext";

const Page = () => {
  const { theme, toggleTheme } = useTheme();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [mainTask, setMainTask] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editTime, setEditTime] = useState("");
  const [error, setError] = useState("");

  // Load tasks from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("tasks");
    if (stored) setMainTask(JSON.parse(stored));
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(mainTask));
  }, [mainTask]);

  // Add new task, prevent duplicates
  const submitHandler = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    if (mainTask.some((task) => task.title.trim().toLowerCase() === title.trim().toLowerCase())) {
      setError("Task with this title already exists!");
      return;
    }
    setMainTask([
      ...mainTask,
      { id: Date.now() + Math.random(), title, description, time, completed: false },
    ]);
    setTitle("");
    setDescription("");
    setTime("");
    setError("");
  };

  const deleteHandler = (id) => {
    setMainTask(mainTask.filter((task) => task.id !== id));
    if (editId === id) {
      setEditId(null);
      setEditTitle("");
      setEditDescription("");
    }
  };

  const startEditHandler = (task) => {
    setEditId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditTime(task.time);
    setError("");
  };

  const cancelEditHandler = () => {
    setEditId(null);
    setEditTitle("");
    setEditDescription("");
    setError("");
  };

  const saveEditHandler = (id) => {
    if (!editTitle.trim() || !editDescription.trim()) return;
    if (
      mainTask.some(
        (task) =>
          task.title.trim().toLowerCase() === editTitle.trim().toLowerCase() &&
          task.id !== id
      )
    ) {
      setError("Task with this title already exists!");
      return;
    }
    setMainTask(
      mainTask.map((task) =>
        task.id === id
          ? { ...task, title: editTitle, description: editDescription, time: editTime }
          : task
      )
    );
    setEditId(null);
    setEditTitle("");
    setEditDescription("");
    setEditTime("");
    setError("");
  };

  // Toggle completed state
  const toggleComplete = (id) => {
    setMainTask(
      mainTask.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Clear all tasks
  const clearAllHandler = () => {
    if (window.confirm("Are you sure you want to clear all tasks?")) {
      setMainTask([]);
      setEditId(null);
      setEditTitle("");
      setEditDescription("");
      setError("");
    }
  };

  // Auto-dismiss error message after 3.5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="flex flex-col items-center w-full min-h-screen pt-12 pb-20 bg-[#F2F2F7] dark:bg-[#000000] text-[#000000] dark:text-[#FFFFFF] transition-colors duration-300 font-sans">

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors duration-200 z-50 text-[#007AFF] dark:text-[#0A84FF]"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? (
          <MoonIcon className="w-6 h-6" />
        ) : (
          <SunIcon className="w-6 h-6" />
        )}
      </button>

      {/* Main Container */}
      <div className="w-full max-w-3xl px-4 md:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-left">
            Reminders
          </h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        {/* Task List Container */}
        <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-sm overflow-hidden mb-6">
          <ul className="divide-y divide-gray-100 dark:divide-neutral-800">
            {mainTask.length === 0 ? (
              <li className="p-6 text-center text-gray-500 dark:text-neutral-400">
                No reminders
              </li>
            ) : (
              mainTask.map((t) => {
                const isEditing = editId === t.id;
                return (
                  <li key={t.id} className="p-4 pl-14 relative group hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors duration-150">

                    {/* Toggle Circle */}
                    {!isEditing && (
                      <button
                        onClick={() => toggleComplete(t.id)}
                        className="absolute left-4 top-5 w-6 h-6 rounded-full border-[1.5px] border-gray-300 dark:border-neutral-600 flex items-center justify-center focus:outline-none"
                        aria-label={t.completed ? "Mark as not completed" : "Mark as completed"}
                      >
                        {t.completed && (
                          <div className="w-3.5 h-3.5 rounded-full bg-[#007AFF] dark:bg-[#0A84FF]" />
                        )}
                      </button>
                    )}

                    <div className="flex justify-between items-start">
                      {/* Content */}
                      <div className="flex-1 pr-4">
                        {isEditing ? (
                          <div className="flex flex-col gap-2">
                            <input
                              type="text"
                              autoFocus
                              className="w-full bg-transparent border-b border-gray-200 dark:border-neutral-700 outline-none pb-1 text-lg"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              placeholder="Title"
                            />
                            <input
                              type="text"
                              className="w-full bg-transparent border-b border-gray-200 dark:border-neutral-700 outline-none pb-1 text-sm text-gray-500"
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                              placeholder="Notes"
                            />
                            <input
                              type="time"
                              className="w-full bg-transparent outline-none text-sm text-gray-500"
                              value={editTime}
                              onChange={(e) => setEditTime(e.target.value)}
                            />
                          </div>
                        ) : (
                          <div className={t.completed ? "opacity-50" : ""}>
                            <h3 className={`text-lg leading-tight ${t.completed ? "text-gray-500 line-through" : ""}`}>
                              {t.title}
                            </h3>
                            {t.description && (
                              <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">
                                {t.description}
                              </p>
                            )}
                            {t.time && (
                              <p className="text-sm text-gray-400 dark:text-neutral-500 mt-1">
                                {t.time}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => saveEditHandler(t.id)}
                              className="text-sm text-[#007AFF] dark:text-[#0A84FF] font-medium"
                            >
                              Done
                            </button>
                            <button
                              onClick={cancelEditHandler}
                              className="text-sm text-gray-500"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditHandler(t)}
                              className="text-sm text-[#007AFF] dark:text-[#0A84FF]"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteHandler(t.id)}
                              className="text-sm text-red-500"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </div>

        {/* Input Form */}
        <form
          onSubmit={submitHandler}
          className="bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-sm p-4 flex flex-col gap-3"
        >
          <div className="flex items-center gap-3">
             <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center text-gray-400">
                <PlusIcon className="w-5 h-5" />
             </div>
            <input
              type="text"
              className="w-full bg-transparent outline-none text-lg placeholder-gray-400 dark:placeholder-neutral-500"
              placeholder="New Reminder"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="pl-9 flex flex-col md:flex-row gap-3">
             <input
              type="text"
              className="w-full bg-transparent outline-none text-sm text-gray-500 placeholder-gray-400 dark:placeholder-neutral-600 border-b border-gray-100 dark:border-neutral-800 pb-2 md:border-none md:pb-0"
              placeholder="Notes"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="time"
              className="w-full md:w-32 bg-transparent outline-none text-sm text-gray-500"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={!title.trim()}
              className="text-[#007AFF] dark:text-[#0A84FF] font-medium disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </form>

        {/* Clear all button */}
        {mainTask.length > 0 && (
          <div className="flex justify-center mt-8">
             <button
              onClick={clearAllHandler}
              className="text-sm text-red-500 hover:underline"
            >
              Clear Completed Reminders
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Page;
