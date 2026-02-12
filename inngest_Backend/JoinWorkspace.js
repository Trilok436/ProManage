// Inside JoinWorkspace.jsx
const { inviteId } = useParams();

useEffect(() => {
  api.post(`/workspaces/invites/${inviteId}/accept`)
    .then(() => {
      toast.success("Welcome to the team!");
      navigate("/dashboard");
    })
    .catch(() => toast.error("Invite invalid or expired"));
}, [inviteId]);