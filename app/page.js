"use client";
import { useSelectedLayoutSegments } from "next/navigation";
import React, { useState, useEffect } from "react";

const Page = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mainTask, setMainTask] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Log mainTask after updates
  useEffect(() => {
    console.log(mainTask);
  }, [mainTask]);

  const submitHandler = (e) => {
    e.preventDefault();
    // Prevent empty title or description
    if (!title.trim() || !description.trim()) {
      return;
    }
    setMainTask([
      ...mainTask,
      { id: Date.now() + Math.random(), title, description },
    ]);
    setTitle("");
    setDescription("");
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
  };

  const cancelEditHandler = () => {
    setEditId(null);
    setEditTitle("");
    setEditDescription("");
  };

  const saveEditHandler = (id) => {
    if (!editTitle.trim() || !editDescription.trim()) return;
    setMainTask(
      mainTask.map((task) =>
        task.id === id
          ? { ...task, title: editTitle, description: editDescription }
          : task
      )
    );
    setEditId(null);
    setEditTitle("");
    setEditDescription("");
  };

  let renderTask = <h1>No Tasks Available</h1>;
  if (mainTask.length > 0) {
    renderTask = mainTask.map((t) => {
      const isEditing = editId === t.id;
      return (
        <li key={t.id} className="items-center flex justify-between mb-5">
          <div className="w-2/3 flex items-center gap-2">
            {isEditing ? (
              <>
                <input
                  type="text"
                  className="border-zinc-800 mb-2 px-2 py-1 border-2 outline-none w-full"
                  value={editTitle}
                  aria-label="Edit task title"
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <input
                  type="text"
                  className="border-zinc-800 mb-2 px-2 py-1 border-2 outline-none w-full"
                  value={editDescription}
                  aria-label="Edit task description"
                  onChange={(e) => setEditDescription(e.target.value)}
                />
              </>
            ) : (
              <>
                <h5 className="text-2xl font-semibold">{t.title}</h5>
                <p className="text-xl font-semibold">{t.description}</p>
              </>
            )}
          </div>
          <div className="flex gap-2 items-center">
            {isEditing ? (
              <>
                <button
                  onClick={() => saveEditHandler(t.id)}
                  className="bg-green-500 text-white px-3 py-2 rounded font-semibold"
                  aria-label={`Save edit for task: ${t.title}`}
                >
                  Save
                </button>
                <button
                  onClick={cancelEditHandler}
                  className="bg-gray-400 text-white px-3 py-2 rounded font-semibold"
                  aria-label={`Cancel edit for task: ${t.title}`}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => startEditHandler(t)}
                  className="bg-blue-500 text-white px-3 py-2 rounded font-semibold"
                  aria-label={`Edit task: ${t.title}`}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteHandler(t.id)}
                  className="bg-red-500 text-white px-3 py-2 rounded font-semibold"
                  aria-label={`Delete task: ${t.title}`}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </li>
      );
    });
  }
  return (
    <>
      <h1 className="bg-black text-white font-bold p-5 text-2xl text-center">
        My Todo List
      </h1>
      <form
        onSubmit={submitHandler}
        aria-label="Add new task form"
        className="flex flex-wrap items-center gap-2"
      >
        import React from 'react'
        
        <input
          type="text"
          className="border-zinc-800 m-5 px-4 py-2 border-2 outline-none"
          placeholder="Add a new task..."
          value={title}
          aria-label="Task title"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <input
          type="text"
          className="border-zinc-800 m-5 px-4 py-2 border-2 outline-none w-[400px]"
          placeholder="Write a description..."
          value={description}
          aria-label="Task description"
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
        <button
          className="bg-black text-white font-bold p-2 rounded-md m-5"
          aria-label="Add Task"
        >
          Add Task
        </button>
      </form>
      <div className="m-5 p-3  bg-slate-200">
        <ul>{renderTask}</ul>
      </div>
    </>
  );
};

export default Page;
