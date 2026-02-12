import { useState, useEffect } from "react";
import { api } from "../hooks/useAxios";
import { useAuth } from "@clerk/clerk-react";
import { useDispatch, useSelector } from "react-redux";
import { XIcon } from "lucide-react";
// 1. We import Redux actions to force the sidebar to update
import { setWorkspaces, setCurrentWorkspace } from "../features/workspaceSlice";

const CreateProjectDialog = ({
  isDialogOpen,
  setIsDialogOpen,
  onProjectCreated,
}) => {
  const dispatch = useDispatch();
  const currentWorkspace = useSelector(
    (state) => state.workspace.currentWorkspace,
  );
  const { isLoaded } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    api.get("/workspaces").catch((err) => console.error(err));
  }, [isLoaded]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "PLANNING",
    priority: "MEDIUM",
    start_date: "",
    end_date: "",
    team_members: [],
    team_lead: "",
    progress: 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        startDate: formData.start_date || null,
        endDate: formData.end_date || null,
        workspaceId: currentWorkspace.id,
      };

      // 1. Create the project in the database
      await api.post("/projects", payload);

      // --- THE FIX: UPDATE REDUX SO SIDEBAR SEES THE CHANGE ---

      // 2. Fetch the fresh project list for this workspace
      const projectsRes = await api.get(
        `/projects/workspace/${currentWorkspace.id}`,
      );

      // 3. Update the Current Workspace in Redux
      // This immediately tells Sidebar & ProjectOverview: "Here is the new list!"
      const updatedWorkspace = {
        ...currentWorkspace,
        projects: projectsRes.data,
      };
      dispatch(setCurrentWorkspace(updatedWorkspace));

      // 4. Update the global workspace list too (good practice)
      const workspacesRes = await api.get("/workspaces");
      const updatedWorkspacesList = workspacesRes.data.map((ws) =>
        ws.id === currentWorkspace.id
          ? { ...ws, projects: projectsRes.data }
          : ws,
      );
      dispatch(setWorkspaces(updatedWorkspacesList));

      // -------------------------------------------------------

      // 5. Trigger local update if onProjectCreated was passed
      if (onProjectCreated) {
        onProjectCreated();
      }

      setIsDialogOpen(false);
      setFormData({
        name: "",
        description: "",
        status: "PLANNING",
        priority: "MEDIUM",
        start_date: "",
        end_date: "",
        team_members: [],
        team_lead: "",
        progress: 0,
      });
    } catch (err) {
      console.error(
        "Failed to create project:",
        err.response?.data || err.message,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeTeamMember = (email) => {
    setFormData((prev) => ({
      ...prev,
      team_members: prev.team_members.filter((m) => m !== email),
    }));
  };

  if (!isDialogOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur flex items-center justify-center text-left z-50">
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 w-full max-w-lg text-zinc-900 dark:text-zinc-200 relative">
        <button
          className="absolute top-3 right-3 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
          onClick={() => setIsDialogOpen(false)}
        >
          <XIcon className="size-5" />
        </button>

        <h2 className="text-xl font-medium mb-1">Create New Project</h2>
        {currentWorkspace && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            In workspace:{" "}
            <span className="text-blue-600 dark:text-blue-400">
              {currentWorkspace.name}
            </span>
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project Name */}
          <div>
            <label className="block text-sm mb-1">Project Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter project name"
              className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe your project"
              className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm h-20"
            />
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm"
              >
                <option value="PLANNING">Planning</option>
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Start Date</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
                className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">End Date</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) =>
                  setFormData({ ...formData, end_date: e.target.value })
                }
                min={
                  formData.start_date &&
                  new Date(formData.start_date).toISOString().split("T")[0]
                }
                className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm"
              />
            </div>
          </div>

          {/* Lead */}
          <div>
            <label className="block text-sm mb-1">Project Lead</label>
            <select
              value={formData.team_lead}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  team_lead: e.target.value,
                  team_members: e.target.value
                    ? [...new Set([...formData.team_members, e.target.value])]
                    : formData.team_members,
                })
              }
              className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm"
            >
              <option value="">No lead</option>
              {currentWorkspace?.members?.map((member) => (
                <option key={member.user.email} value={member.user.email}>
                  {member.user.email}
                </option>
              ))}
            </select>
          </div>

          {/* Team Members */}
          <div>
            <label className="block text-sm mb-1">Team Members</label>
            <select
              className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm"
              onChange={(e) => {
                if (
                  e.target.value &&
                  !formData.team_members.includes(e.target.value)
                ) {
                  setFormData((prev) => ({
                    ...prev,
                    team_members: [...prev.team_members, e.target.value],
                  }));
                }
              }}
            >
              <option value="">Add team members</option>
              {currentWorkspace?.members
                ?.filter((email) => !formData.team_members.includes(email))
                .map((member) => (
                  <option key={member.user.email} value={member.email}>
                    {member.user.email}
                  </option>
                ))}
            </select>

            {formData.team_members.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.team_members.map((email) => (
                  <div
                    key={email}
                    className="flex items-center gap-1 bg-blue-200/50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-md text-sm"
                  >
                    {email}
                    <button
                      type="button"
                      onClick={() => removeTeamMember(email)}
                      className="ml-1 hover:bg-blue-300/30 dark:hover:bg-blue-500/30 rounded"
                    >
                      <XIcon className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2 text-sm">
            <button
              type="button"
              onClick={() => setIsDialogOpen(false)}
              className="px-4 py-2 rounded border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              disabled={isSubmitting || !currentWorkspace}
              className="px-4 py-2 rounded bg-gradient-to-br from-blue-500 to-blue-600 text-white dark:text-zinc-200"
            >
              {isSubmitting ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectDialog;
