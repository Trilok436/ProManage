import { useSyncUser } from "../hooks/useSyncUser";

export default function UserSyncWrapper({ children }) {
  const isSynced = useSyncUser(); // Use the hook to get the status

  if (!isSynced) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Connecting your account...</p>
      </div>
    );
  }

  return <>{children}</>;
}
