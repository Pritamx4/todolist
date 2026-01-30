"use client";
import React, { useState, useEffect } from "react";
import {
  PlusCircleIcon as PlusCircleIconOutline,
  CheckCircleIcon as CheckCircleIconOutline,
  XCircleIcon as XCircleIconOutline,
  ClipboardDocumentListIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import {
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
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
// Array of punchlines for empty task list
  const punchlines = [
  "No tasks yet ✨",
  "All clear 🎉",
  "Nothing here... 💤",
  "You're done for now ✅",
  "Task list is empty 🌸",
  "No pending work 😎"
];
const randomPunchline = punchlines[Math.floor(Math.random() * punchlines.length)];

  // Auto-dismiss error message after 3.5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="flex flex-col items-center w-full min-h-screen px-2 pt-10 bg-gradient-to-br from-indigo-200 via-slate-100 to-pink-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950">
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-3 bg-white dark:bg-slate-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50 hover:scale-110 active:scale-95"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? (
          <MoonIcon className="w-6 h-6 text-indigo-600" />
        ) : (
          <SunIcon className="w-6 h-6 text-yellow-400" />
        )}
      </button>
      {/* Header */}
      <div className="relative flex flex-col items-center w-full mb-8">
        <h1
          aria-label="My Todo List"
          className="flex items-center gap-3 px-6 py-4 mx-auto text-3xl font-extrabold text-white border-4 shadow-xl font-orbitron md:text-5xl bg-gradient-to-r from-indigo-600 via-indigo-400 to-pink-400 dark:from-indigo-900 dark:via-purple-700 dark:to-pink-600 md:px-10 rounded-2xl border-white/30 dark:border-white/20"
          style={{
            letterSpacing: "0.08em",
            textShadow: "0 2px 16px rgba(80, 0, 120, 0.18)",
          }}
        >
          <ClipboardDocumentListIcon className="text-indigo-200 h-9 w-9 md:h-10 md:w-10 drop-shadow-lg" />
          My Todo List
        </h1>
        <p className="mt-2 text-xl italic text-grey-500 dark:text-slate-300 font-kodemono md:text-xl"
          style={{
            letterSpacing: "0.08em",
            textShadow: "0 2px 16px rgba(80, 0, 120, 0.18) ",
          }}>"Turn chaos into clarity"</p>
        <div className="absolute w-24 h-2 -translate-x-1/2 bg-pink-300 dark:bg-pink-600 rounded-full -bottom-4 left-1/2 blur-sm opacity-70"></div>
      </div>

      {/* Form */}
      <form
        onSubmit={submitHandler}
        aria-label="Add new task form"
        className="flex flex-col items-center w-full max-w-2xl gap-4 px-4 py-5 mb-4 shadow-lg md:flex-row bg-white/80 dark:bg-slate-800/80 rounded-xl md:px-6"
      >
        <input
          type="text"
          className="w-full px-4 py-3 text-indigo-700 dark:text-indigo-300 transition-all duration-200 border-2 border-indigo-200 dark:border-indigo-700 shadow-inner outline-none font-kodemono bg-white/90 dark:bg-slate-700/90 focus:border-pink-400 dark:focus:border-pink-500 focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-800 placeholder:text-indigo-300 dark:placeholder:text-indigo-500 rounded-xl md:w-1/3 focus-visible:ring-4 focus-visible:ring-indigo-300 dark:focus-visible:ring-indigo-700"
          placeholder="Add a new task..."
          value={title}
          aria-label="Task title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          className="w-full px-4 py-3 text-pink-700 dark:text-pink-300 transition-all duration-200 border-2 border-pink-200 dark:border-pink-700 shadow-inner outline-none font-kodemono bg-white/90 dark:bg-slate-700/90 focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 placeholder:text-pink-300 dark:placeholder:text-pink-500 rounded-xl md:w-1/2 focus-visible:ring-4 focus-visible:ring-pink-300 dark:focus-visible:ring-pink-700"
          placeholder="Write a description..."
          value={description}
          aria-label="Task description"
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="time"
          className="w-full px-4 py-3 text-indigo-700 dark:text-indigo-300 transition-all duration-200 border-2 border-indigo-200 dark:border-indigo-700 shadow-inner outline-none font-kodemono bg-white/90 dark:bg-slate-700/90 focus:border-pink-400 dark:focus:border-pink-500 focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-800 placeholder:text-indigo-300 dark:placeholder:text-indigo-500 rounded-xl md:w-1/3 focus-visible:ring-4 focus-visible:ring-indigo-300 dark:focus-visible:ring-indigo-700"
          value={time}
          aria-label="Task time"
          onChange={(e) => setTime(e.target.value)}
        />
        <button
          className="flex items-center justify-center px-3 py-2 text-white transition-all duration-200 bg-indigo-500 dark:bg-indigo-600 rounded-full shadow-lg hover:bg-pink-400 dark:hover:bg-pink-500 active:scale-95 aspect-square focus-visible:ring-4 focus-visible:ring-indigo-300 dark:focus-visible:ring-indigo-700"
          aria-label="Add Task"
          type="submit"
        >
          <PlusCircleIconOutline className="w-6 h-6" />
        </button>
      </form>
      {error && (
        <div className="flex items-center gap-2 px-4 py-2 mb-2 text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded shadow font-kodemono">
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="ml-2 text-red-400 hover:text-red-700 dark:hover:text-red-300 focus:outline-none"
            aria-label="Dismiss error"
            title="Dismiss"
          >
            <XCircleIconOutline className="w-5 h-5" />
          </button>
        </div>
      )}
      {mainTask.length > 0 && (
        <button
          onClick={clearAllHandler}
          className="px-4 py-2 mb-4 text-white transition-all duration-200 bg-red-400 dark:bg-red-600 shadow hover:bg-red-500 dark:hover:bg-red-700 font-kodemono rounded-xl"
        >
          Clear All Tasks
        </button>
      )}

      {/* Task List */}
      <div className="w-full max-w-2xl p-4 shadow-lg bg-white/80 dark:bg-slate-800/80 rounded-xl">
        <ul>
          {mainTask.length === 0 ? (
            <li>
              <h2 className="py-8 text-xl font-semibold text-center font-kodemono text-zinc-500 dark:text-slate-400">
                {randomPunchline}
              </h2>
            </li>
          ) : (
            mainTask.map((t, idx) => {
              const isEditing = editId === t.id;
              return (
                <React.Fragment key={t.id}>
                  <li
                    className={`flex flex-col md:flex-row items-start md:items-center justify-between mb-6 p-4 rounded-xl bg-gradient-to-r from-indigo-100 to-pink-100 dark:from-slate-700 dark:to-indigo-900 shadow hover:shadow-2xl hover:scale-[1.025] transition-all duration-200 group ${
                      t.completed ? "opacity-60 line-through" : ""
                    }`}
                  >
                    <div className="flex flex-col flex-1 gap-2">
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            autoFocus
                            className="w-full px-4 py-2 mb-2 text-indigo-700 dark:text-indigo-300 transition-all duration-200 border-2 border-indigo-200 dark:border-indigo-700 shadow-inner outline-none font-kodemono bg-white/90 dark:bg-slate-700/90 focus:border-pink-400 dark:focus:border-pink-500 focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-800 placeholder:text-indigo-300 dark:placeholder:text-indigo-500 rounded-xl focus-visible:ring-4 focus-visible:ring-indigo-300 dark:focus-visible:ring-indigo-700"
                            value={editTitle}
                            aria-label="Edit task title"
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="Edit title..."
                          />
                          <input
                            type="text"
                            className="w-full px-4 py-2 text-pink-700 dark:text-pink-300 transition-all duration-200 border-2 border-pink-200 dark:border-pink-700 shadow-inner outline-none font-kodemono bg-white/90 dark:bg-slate-700/90 focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 placeholder:text-pink-300 dark:placeholder:text-pink-500 rounded-xl focus-visible:ring-4 focus-visible:ring-pink-300 dark:focus-visible:ring-pink-700"
                            value={editDescription}
                            aria-label="Edit task description"
                            onChange={(e) => setEditDescription(e.target.value)}
                            placeholder="Edit description..."
                          />
                          <input
                            type="time"
                            className="w-full px-4 py-2 text-indigo-700 dark:text-indigo-300 transition-all duration-200 border-2 border-indigo-200 dark:border-indigo-700 shadow-inner outline-none font-kodemono bg-white/90 dark:bg-slate-700/90 focus:border-pink-400 dark:focus:border-pink-500 focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-800 placeholder:text-indigo-300 dark:placeholder:text-indigo-500 rounded-xl focus-visible:ring-4 focus-visible:ring-indigo-300 dark:focus-visible:ring-indigo-700"
                            value={editTime}
                            aria-label="Edit task time"
                            onChange={(e) => setEditTime(e.target.value)}
                          />
                        </>
                      ) : (
                        <>
                          <h5 className="flex items-center gap-2 text-2xl font-semibold text-indigo-700 dark:text-indigo-300 font-asimovian">
                            {t.title}
                            {/* Mark as completed button (right of title) */}
                            <button
                              onClick={() => toggleComplete(t.id)}
                              className={`ml-2 transition-all duration-200 rounded-full border-2 ${
                                t.completed
                                  ? "bg-green-400 border-green-500 text-white"
                                  : "bg-white dark:bg-slate-600 border-indigo-300 dark:border-indigo-600 text-indigo-400 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800"
                              } p-1 shadow focus-visible:ring-2 focus-visible:ring-green-300 dark:focus-visible:ring-green-700`}
                              aria-label={t.completed ? "Mark as not completed" : "Mark as completed"}
                              title={t.completed ? "Mark as not completed" : "Mark as completed"}
                            >
                              <CheckCircleIconOutline
                                className={`h-6 w-6 ${
                                  t.completed ? "text-white" : "text-indigo-400 dark:text-indigo-300"
                                }`}
                              />
                            </button>
                          </h5>
                          <p className="text-lg font-kodemono text-zinc-700 dark:text-slate-300">
                            {t.description}
                          </p>
                          <p className="text-sm font-kodemono text-pink-500 dark:text-pink-400">
                            {t.time}
                          </p>
                        </>
                      )}
                    </div>
                    <div className="flex gap-2 mt-4 md:mt-0 md:ml-4">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => saveEditHandler(t.id)}
                            className="bg-green-500 dark:bg-green-600 hover:bg-emerald-500 dark:hover:bg-emerald-600 active:scale-95 text-white px-2.5 py-2 rounded-full shadow-md transition-all duration-200 flex items-center justify-center aspect-square focus-visible:ring-4 focus-visible:ring-green-300 dark:focus-visible:ring-green-700"
                            aria-label={`Save edit for task: ${t.title}`}
                          >
                            <CheckCircleIconOutline className="w-5 h-5" />
                          </button>
                          <button
                            onClick={cancelEditHandler}
                            className="bg-gray-400 dark:bg-gray-600 hover:bg-zinc-400 dark:hover:bg-zinc-500 active:scale-95 text-white px-2.5 py-2 rounded-full shadow-md transition-all duration-200 flex items-center justify-center aspect-square focus-visible:ring-4 focus-visible:ring-gray-300 dark:focus-visible:ring-gray-600"
                            aria-label={`Cancel edit for task: ${t.title}`}
                          >
                            <XCircleIconOutline className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditHandler(t)}
                            className="bg-blue-500 dark:bg-blue-600 hover:bg-indigo-500 dark:hover:bg-indigo-600 active:scale-95 text-white px-2.5 py-2 rounded-full shadow-md transition-all duration-200 flex items-center justify-center aspect-square focus-visible:ring-4 focus-visible:ring-blue-300 dark:focus-visible:ring-blue-700"
                            aria-label={`Edit task: ${t.title}`}
                          >
                            <PencilSquareIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => deleteHandler(t.id)}
                            className="bg-red-500 dark:bg-red-600 hover:bg-pink-500 dark:hover:bg-pink-600 active:scale-95 text-white px-2.5 py-2 rounded-full shadow-md transition-all duration-200 flex items-center justify-center aspect-square focus-visible:ring-4 focus-visible:ring-red-300 dark:focus-visible:ring-red-700"
                            aria-label={`Delete task: ${t.title}`}
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </li>
                  {/* Divider except after last item */}
                  {idx !== mainTask.length - 1 && (
                    <div className="w-full h-[1px] bg-gradient-to-r from-indigo-200 via-pink-200 to-transparent dark:from-indigo-800 dark:via-pink-800 my-2 opacity-60" />
                  )}
                </React.Fragment>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
};

export default Page;
