import { useUser, useAuth } from "@clerk/clerk-react"; // Add useAuth
import { useEffect, useState } from "react";
import { api } from "./useAxios";

export const useSyncUser = () => {
  const { user, isLoaded } = useUser(); // Track if user data is loaded
  const { getToken } = useAuth();
  const [isSynced, setIsSynced] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const sync = async () => {
      // ONLY sync if Clerk is loaded, we have a user, and we aren't already syncing
      if (!isLoaded || !user || isSynced || isSyncing) return;

      setIsSyncing(true);
      try {
        // Force a fresh token to ensure the custom claims (email/name) are included
        const token = await getToken({
          template: "spring-boot",
          skipCache: true,
        });
        await api.post(
          "/users/sync",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setIsSynced(true);
      } catch (error) {
        console.error("Sync failed", error);
      } finally {
        setIsSyncing(false);
      }
    };
    sync();
  }, [isLoaded, user, isSynced, isSyncing, getToken]);

  return isSynced;
};
