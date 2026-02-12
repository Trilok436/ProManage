import { format } from "date-fns";
import { api } from "../hooks/useAxios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CalendarIcon, MessageCircle, PenIcon } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

const TaskDetails = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");
  const taskId = searchParams.get("taskId");
  const { user: clerkUser } = useUser();
  const user = { id: "user_1" };
  const [task, setTask] = useState(null);
  const [project, setProject] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    if (!taskId) return; // Guard clause
    try {
      const res = await api.get(`/comments/task/${taskId}`);
      setComments(res.data);
    } catch (err) {
      console.error("Fetch Comments Error:", err);
    }
  };

  const fetchTaskDetails = async () => {
    setLoading(true);
    try {
      // 1. Get tasks of this project
      const tasksRes = await api.get(`/tasks/project/${projectId}`);
      const foundTask = tasksRes.data.find((t) => t.id === Number(taskId));

      setTask(foundTask);

      // 2. Get project directly by id
      const projectRes = await api.get(`/projects/${projectId}`);
      setProject(projectRes.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !clerkUser) {
      toast.error("You must be logged in to comment");
      return;
    }

    try {
      toast.loading("Adding comment...");

      await api.post("/comments", {
        taskId: taskId,
        content: newComment,
        clerkId: clerkUser.id, // <--- Sending the real ID from Clerk
      });

      setNewComment("");
      await fetchComments(); // Reload the list immediately

      toast.dismiss();
      toast.success("Comment added.");
    } catch (error) {
      toast.dismiss();
      console.error(error);
      toast.error("Failed to post comment");
    }
  };
  useEffect(() => {
    fetchTaskDetails();
  }, [taskId]);

  useEffect(() => {
    if (taskId && task) {
      fetchComments();
      const interval = setInterval(() => {
        fetchComments();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [taskId, task]);

  if (loading)
    return (
      <div className="text-gray-500 dark:text-zinc-400 px-4 py-6">
        Loading task details...
      </div>
    );
  if (!task)
    return <div className="text-red-500 px-4 py-6">Task not found.</div>;

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-6 sm:p-4 text-gray-900 dark:text-zinc-100 max-w-6xl mx-auto">
      {/* Left: Comments / Chatbox */}
      <div className="w-full lg:w-2/3">
        <div className="p-5 rounded-md  border border-gray-300 dark:border-zinc-800  flex flex-col lg:h-[80vh]">
          <h2 className="text-base font-semibold flex items-center gap-2 mb-4 text-gray-900 dark:text-white">
            <MessageCircle className="size-5" /> Task Discussion (
            {comments.length})
          </h2>

          <div className="flex-1 md:overflow-y-scroll no-scrollbar">
            {comments.length > 0 ? (
              <div className="flex flex-col gap-4 mb-6 mr-2">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`sm:max-w-[80%] p-3 rounded-md border border-gray-300 dark:border-zinc-700 ${
                      comment.user?.clerkId === clerkUser?.id
                        ? "ml-auto bg-blue-50 dark:bg-blue-900/20"
                        : "mr-auto bg-white dark:bg-zinc-800"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1 text-sm">
                      <img
                        src={comment.user?.avatarUrl || "/default-avatar.png"} // Check if it's image or imageUrl
                        alt="avatar"
                        className="size-5 rounded-full"
                      />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {comment.user?.name || "Anonymous"}
                      </span>
                      <span className="text-xs text-gray-400">
                        •{" "}
                        {comment.createdAt
                          ? format(new Date(comment.createdAt), "HH:mm")
                          : "—"}
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-zinc-500 mb-4 text-sm">
                No comments yet. Be the first!
              </p>
            )}
          </div>

          {/* Add Comment */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md p-2 text-sm text-gray-900 dark:text-zinc-200 resize-none focus:outline-none focus:ring-1 focus:ring-blue-600"
              rows={3}
            />
            <button
              onClick={handleAddComment}
              className="bg-gradient-to-l from-blue-500 to-blue-600 transition-colors text-white text-sm px-5 py-2 rounded "
            >
              Post
            </button>
          </div>
        </div>
      </div>

      {/* Right: Task + Project Info */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        {/* Task Info */}
        <div className="p-5 rounded-md bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 ">
          <div className="mb-3">
            <h1 className="text-lg font-medium text-gray-900 dark:text-zinc-100">
              {task.title}
            </h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-300 text-xs">
                {task.status}
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-300 text-xs">
                {task.type}
              </span>
              <span className="px-2 py-0.5 rounded bg-green-200 dark:bg-emerald-900 text-green-900 dark:text-emerald-300 text-xs">
                {task.priority}
              </span>
            </div>
          </div>

          {task.description && (
            <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed mb-4">
              {task.description}
            </p>
          )}

          <hr className="border-zinc-200 dark:border-zinc-700 my-3" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700 dark:text-zinc-300">
            <div className="flex items-center gap-2">
              <img
                src={task.assignee?.image}
                className="size-5 rounded-full"
                alt="avatar"
              />
              {task.assignee?.name || "Unassigned"}
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="size-4 text-gray-500 dark:text-zinc-500" />
              {project.startDate
                ? format(new Date(project.startDate), "dd MMM yyyy")
                : "N/A"}
            </div>
          </div>
        </div>

        {/* Project Info */}
        {project && (
          <div className="p-4 rounded-md bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 border border-gray-300 dark:border-zinc-800 ">
            <p className="text-xl font-medium mb-4">Project Details</p>
            <h2 className="text-gray-900 dark:text-zinc-100 flex items-center gap-2">
              {" "}
              <PenIcon className="size-4" /> {project.name}
            </h2>
            <p className="text-xs mt-3">
              Project Start Date:{" "}
              {project.startDate
                ? format(new Date(project.startDate), "dd MMM yyyy")
                : "N/A"}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-zinc-400 mt-3">
              <span>Status: {project.status}</span>
              <span>Priority: {project.priority}</span>
              <span>Progress: {project.progress}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetails;
