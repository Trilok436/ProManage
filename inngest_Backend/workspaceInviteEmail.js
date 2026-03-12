import { inngest } from "./client.js";

export default inngest.createFunction(
  { id: "send-workspace-invite-email" },
  { event: "workspace/invite" },
  async ({ event }) => {
    const { email, workspaceId, inviteId } = event.data;
    const joinLink = `https://pro-manage-frontend-liard.vercel.app/join/${inviteId}`;
    console.log("Workspace invite email sent:", joinLink);
    const response = await fetch("https://promanage-backend-lkfv.onrender.com/api/mail/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, workspaceId, joinLink }),
    });
    if (!response.ok) {
      console.error("Spring Mail API failed with status:", response.status);
    } else {
      console.log("Mail request successful");
    }

  }
);
