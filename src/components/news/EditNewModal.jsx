import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const EditNewModal = ({ newsId, onClose, onSave }) => {
  const mockNewsData = [
    { id: 1, title: "Breaking News", content: "Important update on global policies.", type: "Politics", url: "news/breaking-news", createdDate: "2024-01-10", lastEdited: "" },
    { id: 2, title: "Tech Innovations", content: "New AI technology is emerging.", type: "Technology", url: "news/tech-innovations", createdDate: "2024-01-08", lastEdited: "2024-01-12" },
    { id: 3, title: "Sports Update", content: "Team A won the championship.", type: "Sports", url: "news/sports-update", createdDate: "2024-02-05", lastEdited: "" },
  ];

  if (!newsId || !mockNewsData.find(news => news.id === newsId)) return null;

  const [newsData, setNewsData] = useState(mockNewsData.find(news => news.id === newsId));

  const handleChange = (e) => {
    setNewsData({ ...newsData, [e.target.name]: e.target.value });
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 pt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-gray-800 text-gray-100 rounded-xl p-6 w-[400px] shadow-2xl border border-gray-700 relative "
          initial={{ y: 80, opacity: 0, scale: 0.9 }}
          animate={{ y: 30, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <button className="absolute top-3 right-3 text-gray-400 hover:text-white" onClick={onClose}>
            <X size={22} />
          </button>

          <h2 className="text-xl font-semibold mb-5 text-white">Edit News</h2>

          <label className="block text-gray-300 mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={newsData.title || ""}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
          />

          <label className="block text-gray-300 mt-4 mb-1">Content</label>
          <textarea
            name="content"
            value={newsData.content || ""}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
          ></textarea>

          <label className="block text-gray-300 mt-4 mb-1">Type</label>
          <input
            type="text"
            name="type"
            value={newsData.type || ""}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
          />

          <label className="block text-gray-300 mt-4 mb-1">URL</label>
          <input
            type="text"
            name="url"
            value={newsData.url || ""}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
          />

          <label className="block text-gray-300 mt-4 mb-1">Created Date</label>
          <input
            type="date"
            name="createdDate"
            value={newsData.createdDate || ""}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
          />

          <label className="block text-gray-300 mt-4 mb-1">Last Edited</label>
          <input
            type="date"
            name="lastEdited"
            value={newsData.lastEdited || ""}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={() => onSave(newsData)}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-500 p-2 rounded text-white font-semibold transition-all duration-200"
          >
            Save Changes
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditNewModal;


