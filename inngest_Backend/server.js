import express from "express";
import { serve } from "inngest/express";
import { inngest } from "./client.js";

import taskEmail from "./taskEmail.js";
import workspaceInviteEmail from "./workspaceInviteEmail.js";

const app = express();
app.use(express.json());
app.use(
  "https://pro-manage-inngest.vercel.app/api/inngest",
  serve({
    client: inngest,
    functions: [taskEmail, workspaceInviteEmail], // ✅ BOTH
  })
);

app.listen(3000, () => {
  console.log("🚀 Inngest running at http://localhost:3000/api/inngest");
});
