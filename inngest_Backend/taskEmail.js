import { inngest } from "./client.js";

export default inngest.createFunction(
  { id: "send-task-email" },
  { event: "task/assigned" },
  async ({ event }) => {
    const { title, email } = event.data;

    await fetch("https://promanage-backend-lkfv.onrender.com/api/mail/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, workspaceId: 0 }),
    });

    console.log("Task email sent");
  }
);
