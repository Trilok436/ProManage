import { Plus, Save } from "lucide-react";
import { useEffect, useState } from "react";
import AddProjectMember from "./AddProjectMember";
import { api } from "../hooks/useAxios";
import toast from "react-hot-toast";

export default function ProjectSettings({ project }) {
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "PLANNING",
    priority: "MEDIUM",
    startDate: "",
    endDate: "",
    progress: 0,
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch Workspace Members
  useEffect(() => {
    if (!project?.workspace?.id) return;

    api
      .get(`/workspaces/${project.workspace.id}/members`)
      .then((res) => setMembers(res.data))
      .catch(console.error);
  }, [project]);

  // 2. Sync Form with Project Prop
  useEffect(() => {
    if (!project) return;

    setFormData({
      name: project.name || "",
      description: project.description || "",
      status: project.status || "PLANNING",
      priority: project.priority || "MEDIUM",
      progress: project.progress || 0,
      startDate: project.startDate ? project.startDate.slice(0, 10) : "",
      endDate: project.endDate ? project.endDate.slice(0, 10) : "",
    });
  }, [project]);

  // 3. Handle Update Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loadingToast = toast.loading("Updating project...");

    try {
      // Ensure we send camelCase to match Java Entity
      await api.put(`/projects/${project.id}`, formData);

      toast.success("Project updated successfully!", { id: loadingToast });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update project", {
        id: loadingToast,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses =
    "w-full px-3 py-2 rounded mt-2 border text-sm dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-300 focus:ring-1 focus:ring-blue-500 outline-none transition-all";

  const cardClasses =
    "rounded-lg border p-6 bg-white dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border-zinc-300 dark:border-zinc-800 shadow-sm";

  const labelClasses = "text-sm font-medium text-zinc-600 dark:text-zinc-400";

  return (
    <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto p-2">
      {/* Left Column: Project Details Form */}
      <div className={cardClasses}>
        <div className="flex items-center gap-2 mb-6">
          <Save className="size-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Project Configuration
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className={labelClasses}>Project Name</label>
            <input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={inputClasses}
              placeholder="Enter project name"
              required
            />
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className={inputClasses + " h-28 resize-none"}
              placeholder="What is this project about?"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelClasses}>Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className={inputClasses}
              >
                <option value="PLANNING">Planning</option>
                <option value="ACTIVE">Active</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Priority</label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className={inputClasses}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelClasses}>Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className={inputClasses}
              />
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                className={inputClasses}
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <label className={labelClasses}>Project Progress</label>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                {formData.progress}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={formData.progress}
              onChange={(e) =>
                setFormData({ ...formData, progress: Number(e.target.value) })
              }
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto ml-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-md transition-colors disabled:opacity-50"
          >
            <Save className="size-4" />
            {isSubmitting ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Right Column: Team Management */}
      <div className="space-y-6">
        <div className={cardClasses}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Project Team
              <span className="ml-2 text-xs font-normal text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-full">
                {members.length} Members
              </span>
            </h2>
            <button
              type="button"
              onClick={() => setIsDialogOpen(true)}
              className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
            >
              <Plus className="size-5" />
            </button>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
            {members.length > 0 ? (
              members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 group hover:border-blue-300 dark:hover:border-blue-800 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={member.user?.avatarUrl || "/default-avatar.png"}
                      className="size-10 rounded-full object-cover border-2 border-white dark:border-zinc-800 shadow-sm"
                      alt="avatar"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {member.user?.name || "Pending Invite"}
                      </span>
                      <span className="text-xs text-zinc-500 truncate max-w-[150px]">
                        {member.user?.email}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 uppercase">
                    {member.role || "Member"}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-sm text-zinc-500">
                  No members found in this workspace.
                </p>
              </div>
            )}
          </div>
        </div>

        <AddProjectMember
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      </div>
    </div>
  );
}
