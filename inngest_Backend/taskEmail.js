import { inngest } from "./client.js";

export default inngest.createFunction(
  { id: "send-task-email" },
  { event: "task/assigned" },
  async ({ event }) => {
    const { title, email } = event.data;

    await fetch("http://10.66.43.133:8080/api/mail/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, workspaceId: 0 }),
    });

    console.log("Task email sent");
  }
);