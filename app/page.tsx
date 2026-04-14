"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobs, setJobs] = useState([]);

  // Database se jobs load karna
  const fetchJobs = async () => {
    const res = await axios.get("/api/jobs");
    setJobs(res.data);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Job add karne ka function
  const addJob = async () => {
    if (!title || !company) return alert("Please fill both fields");

    await axios.post("/api/jobs", { title, company });
    setTitle("");
    setCompany("");
    fetchJobs(); // List refresh karne ke liye
  };

  const deleteJob = async (id) => {
    if (confirm("Are you sure you want to delete this?")) {
      try {
        await axios.delete("/api/jobs", { data: { id } });
        fetchJobs(); // List refresh karne ke liye
      } catch (error) {
        alert("Error deleting job");
      }
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch("/api/jobs", { id, status: newStatus });
      fetchJobs(); // UI refresh karne ke liye
    } catch (error) {
      alert("Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-black">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          DevTrack: My Job Applications
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Application</h2>
          <div className="flex gap-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="Job Title"
              className="border p-2 rounded w-full"
            />
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              type="text"
              placeholder="Company"
              className="border p-2 rounded w-full"
            />
            <button
              onClick={addJob}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Add Job
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Saved Applications</h2>
          {jobs.length === 0 ? (
            <p className="text-gray-500">No applications yet.</p>
          ) : (
            <ul className="divide-y">
              {jobs.map((job) => (
                <li key={job._id} className="py-3 flex justify-between">
                  <div>
                    <span className="font-bold">{job.title}</span> at{" "}
                    <span className="text-blue-500">{job.company}</span>
                  </div>
                  <select
                    value={job.status}
                    onChange={(e) => updateStatus(job._id, e.target.value)}
                    className="bg-[#334155] text-xs font-bold py-1 px-2 rounded-lg border-none outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Interview">Interview</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Hired">Hired 🎉</option>
                  </select>
                  <button
                    onClick={() => deleteJob(job._id)}
                    className="ml-4 text-red-500 hover:text-red-400 font-medium transition-colors"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
