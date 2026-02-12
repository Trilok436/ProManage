import { inngest } from "./client.js";

export default inngest.createFunction(
  { id: "send-workspace-invite-email" },
  { event: "workspace/invite" },
  async ({ event }) => {
    const { email, workspaceId } = event.data;
    console.log("Function triggered", event.data);

    await fetch("http://localhost:8080/api/mail/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, workspaceId }),
    });

    console.log(`Mail sent to ${email} for workspace ${workspaceId}`);
  }
);