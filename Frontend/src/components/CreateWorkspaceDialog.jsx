import { useState } from "react";
import { api } from "../hooks/useAxios";
import { XIcon } from "lucide-react";
import { useDispatch } from "react-redux";
// Import Redux actions
import { setWorkspaces, setCurrentWorkspace } from "../features/workspaceSlice";

const CreateWorkspaceDialog = ({ open, setOpen }) => {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  if (!open) return null;

  const handleCreate = async () => {
    if (!name.trim()) return;
    setIsSubmitting(true);

    try {
      // 1. Create the workspace
      await api.post("/workspaces", { name });

      // 2. Refresh the list of workspaces in Redux
      const res = await api.get("/workspaces");
      dispatch(setWorkspaces(res.data));

      // 3. Automatically switch to the new workspace (optional but recommended)
      // Assuming the new workspace is the last one, or you can find it by name
      const newWorkspace = res.data.find((w) => w.name === name);
      if (newWorkspace) {
        dispatch(setCurrentWorkspace(newWorkspace));
      }

      setOpen(false);
      setName("");
    } catch (err) {
      console.error("Failed to create workspace:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded w-96 border border-zinc-200 dark:border-zinc-800">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
            Create Workspace
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            <XIcon size={20} />
          </button>
        </div>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Workspace name"
          className="w-full border border-zinc-300 dark:border-zinc-700 p-2 rounded bg-transparent text-zinc-900 dark:text-zinc-100 mb-4"
          autoFocus
        />

        <button
          onClick={handleCreate}
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Creating..." : "Create"}
        </button>
      </div>
    </div>
  );
};

export default CreateWorkspaceDialog;
