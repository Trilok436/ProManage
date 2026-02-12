// src/components/AuthAxiosProvider.jsx
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { api } from "../hooks/useAxios";

const AuthAxiosProvider = ({ children }) => {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [isInterceptorSetup, setIsInterceptorSetup] = useState(false);

  useEffect(() => {
    // 1. If Clerk auth hasn't loaded yet, wait.
    if (!isLoaded) return;

    // 2. If the user is NOT signed in, we don't need the token.
    // We mark setup as done so the app can render (and show the login screen).
    if (!isSignedIn) {
      setIsInterceptorSetup(true);
      return;
    }

    // 3. Setup the interceptor
    const interceptor = api.interceptors.request.use(
      async (config) => {
        // Ensure we are catching the token correctly
        const token = await getToken({ template: "spring-boot" });

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          console.warn("AuthAxiosProvider: No token retrieved");
        }

        return config;
      },
      (error) => Promise.reject(error),
    );

    // 4. Mark the interceptor as ready so children can now render
    setIsInterceptorSetup(true);

    // Cleanup: Eject interceptor when unmounting or dependencies change
    return () => {
      setIsInterceptorSetup(false);
      api.interceptors.request.eject(interceptor);
    };
  }, [getToken, isLoaded, isSignedIn]);

  // 5. Block rendering until we are sure the interceptor is attached
  if (!isInterceptorSetup) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        Loading...
      </div>
    );
  }

  return children;
};

export default AuthAxiosProvider;
