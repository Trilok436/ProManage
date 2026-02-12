import { inngest } from "./client.js";

export default inngest.createFunction(
  { id: "send-workspace-invite-email" },
  { event: "workspace/invite" },
  async ({ event }) => {
    const { email, workspaceId, inviteId } = event.data;
    const joinLink = `http://localhost:5173/join/${inviteId}`;
    console.log("Workspace invite email sent:", joinLink);
    const response = await fetch("http://localhost:8080/api/mail/invite", {
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