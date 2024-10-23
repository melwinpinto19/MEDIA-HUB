import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

// Dummy data for comments
const dummyComments = [
  {
    id: 1,
    avatar: "https://via.placeholder.com/40", // Placeholder for avatar
    name: "John Doe",
    comment: "This is a great video! Thanks for sharing.",
    likes: 12,
  },
  {
    id: 2,
    avatar: "https://via.placeholder.com/40",
    name: "Jane Smith",
    comment: "I learned a lot from this video, well explained!",
    likes: 8,
  },
  {
    id: 3,
    avatar: "https://via.placeholder.com/40",
    name: "Mark Zane",
    comment: "Fantastic tutorial! Keep up the great work.",
    likes: 5,
  },
];

const Comments = ({ videoId }) => {
  const [comments, setComments] = useState(dummyComments);
  const [newComment, setNewComment] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { user } = useSelector((state) => state.auth);

  // Handle comment submission
  const handleAddComment = () => {
    if (newComment.trim()) {
      (async () => {
        const res = await axios.post(`/api/v1/comment/add-comment/${videoId}`, {
          content: newComment,
        });

        if (res.status === 200) {
          toast.success("Comment added successfully");
          setNewComment("");
          setComments([...comments, res.data.data]);
        }
      })();
    }
  };

  useEffect(() => {
    // load comments :
    (async () => {
      try {
        const res = await axios.get(
          "/api/v1/comment/get-video-comments/" + videoId
        );
        setComments(res.data.data);
        console.log(res);
      } catch (error) {}
    })();
  }, []);

  // Toggle comments visibility
  const toggleCommentsVisibility = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="w-full p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg mt-3">
      {/* Add New Comment Section */}
      <div className="flex items-start mb-4">
        <img
          src={user?.avatar}
          alt="user-avatar"
          className="w-10 h-10 rounded-full mr-4"
        />
        <div className="flex-1">
          <textarea
            className="w-full p-3 border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-900"
            rows="3"
            placeholder="Add a public comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <div className="flex justify-end mt-2">
            <button
              className="bg-blue-500 dark:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 dark:hover:bg-blue-800 transition-all"
              onClick={handleAddComment}
            >
              Comment
            </button>
          </div>
        </div>
      </div>

      {/* Toggle Comments Visibility */}
      <div className="flex justify-end mb-2">
        <button
          className="text-sm text-blue-500 dark:text-blue-400 hover:underline"
          onClick={toggleCommentsVisibility}
        >
          {isCollapsed ? "Show Comments" : "Hide Comments"}
        </button>
      </div>

      {/* Display Comments (Collapsible) */}
      {!isCollapsed && (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm"
            >
              <img
                src={comment?.owner?.avatar || "https://via.placeholder.com/40"}
                alt="avatar"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {comment?.owner?.name}
                  </h4>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
                  {comment?.content}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-semibold">
                    👍 <span className="ml-1">{comment.likes}</span>
                  </button>
                  <button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 font-semibold">
                    👎
                  </button>
                  <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-semibold">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comments;
