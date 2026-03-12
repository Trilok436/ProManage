import { serve } from "inngest/express";
import { inngest } from "../client.js";

import taskEmail from "../taskEmail.js";
import workspaceInviteEmail from "../workspaceInviteEmail.js";

export default serve({
  client: inngest,
  functions: [taskEmail, workspaceInviteEmail],
});
