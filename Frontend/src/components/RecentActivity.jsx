import { useEffect, useState } from "react";
import {
  GitCommit,
  MessageSquare,
  Clock,
  Bug,
  Zap,
  Square,
} from "lucide-react";
import { useSelector } from "react-redux";
import { api } from "../hooks/useAxios";

const typeIcons = {
  BUG: { icon: Bug, color: "text-red-500 dark:text-red-400" },
  FEATURE: { icon: Zap, color: "text-blue-500 dark:text-blue-400" },
  TASK: { icon: Square, color: "text-green-500 dark:text-green-400" },
  IMPROVEMENT: {
    icon: MessageSquare,
    color: "text-amber-500 dark:text-amber-400",
  },
  OTHER: { icon: GitCommit, color: "text-purple-500 dark:text-purple-400" },
};

const statusColors = {
  TODO: "bg-zinc-200 text-zinc-800 dark:bg-zinc-600 dark:text-zinc-200",
  IN_PROGRESS:
    "bg-amber-200 text-amber-800 dark:bg-amber-500 dark:text-amber-900",
  DONE: "bg-emerald-200 text-emerald-800 dark:bg-emerald-500 dark:text-emerald-900",
};

const RecentActivity = () => {
  const [tasks, setTasks] = useState([]);
  const { currentWorkspace } = useSelector((state) => state.workspace);

  useEffect(() => {
    const fetchActivity = async () => {
      if (!currentWorkspace?.id) return;

      try {
        const res = await api.get(`/tasks/workspace/${currentWorkspace.id}`);

        // Sort by the newest first
        const sorted = res.data.sort((a, b) => {
          const dateA = new Date(a.updatedAt || a.createdAt);
          const dateB = new Date(b.updatedAt || b.createdAt);
          return dateB - dateA;
        });

        setTasks(sorted.slice(0, 10)); // Show top 10 recent activities
      } catch (err) {
        console.error("Activity fetch error:", err);
      }
    };

    fetchActivity();
  }, [currentWorkspace?.id]);

  // ... rest of your JSX

  return (
    <div className="bg-white dark:bg-zinc-950 dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-lg transition-all overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 p-4">
        <h2 className="text-lg text-zinc-800 dark:text-zinc-200">
          Recent Activity
        </h2>
      </div>

      <div className="p-0">
        {tasks.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-zinc-600 dark:text-zinc-500" />
            </div>
            <p className="text-zinc-600 dark:text-zinc-400">
              No recent activity
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {tasks.map((task) => {
              const TypeIcon = typeIcons[task.type]?.icon || Square;
              const iconColor =
                typeIcons[task.type]?.color ||
                "text-gray-500 dark:text-gray-400";

              return (
                <div
                  key={task.id}
                  className="p-6 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg">
                      <TypeIcon className={`w-4 h-4 ${iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-zinc-800 dark:text-zinc-200 truncate">
                          {task.title}
                        </h4>
                        <span
                          className={`ml-2 px-2 py-1 rounded text-xs ${statusColors[task.status] || "bg-zinc-300 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300"}`}
                        >
                          {task.status.replace("_", " ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                        <span className="capitalize">
                          {task.type.toLowerCase()}
                        </span>
                        {task.assignee && (
                          <div className="flex items-center gap-2">
                            {task.assignee.image ? (
                              <img
                                src={task.assignee.image}
                                className="w-5 h-5 rounded-full"
                                alt="avatar"
                              />
                            ) : (
                              <div className="w-5 h-5 bg-zinc-300 dark:bg-zinc-700 rounded-full flex items-center justify-center text-[10px]">
                                {task.assignee.name?.[0] || "U"}
                              </div>
                            )}
                            <span className="truncate max-w-[100px]">
                              {task.assignee.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
