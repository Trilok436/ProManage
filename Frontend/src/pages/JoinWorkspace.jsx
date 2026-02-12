import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../hooks/useAxios";
import toast from "react-hot-toast";

const JoinWorkspace = () => {
  const { inviteId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const acceptInvite = async () => {
      if (!inviteId) return;

      try {
        // Small delay ensures Spring Boot has finished the /users/sync transaction
        await new Promise((resolve) => setTimeout(resolve, 500));

        const response = await api.post(
          `/workspaces/invites/${inviteId}/accept`,
        );
        console.log("Join Response:", response.data); // LOG THIS
        toast.success("Joined workspace successfully!");
        navigate("/");
      } catch (err) {
        console.error("Join Error:", err.response?.data || err.message); // LOG THIS
        toast.error(
          "Failed to join: " + (err.response?.data?.message || "Expired"),
        );
        navigate("/");
      }
    };
    acceptInvite();
  }, [inviteId, navigate]);

  return <div className="p-10 text-center">Joining workspace...</div>;
};
export default JoinWorkspace;
