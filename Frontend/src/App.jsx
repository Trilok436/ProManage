import { Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Team from "./pages/Team";
import ProjectDetails from "./pages/ProjectDetails";
import TaskDetails from "./pages/TaskDetails";
import {
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  SignInButton,
} from "@clerk/clerk-react";
import AuthAxiosProvider from "./components/AuthAxiosProvider";
import JoinWorkspace from "./pages/JoinWorkspace";
import UserSyncWrapper from "./components/UserSyncWrapper";

const App = () => {
  return (
    <>
      <AuthAxiosProvider>
        <SignedIn>
          <UserSyncWrapper>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="join/:inviteId" element={<JoinWorkspace />} />
                <Route path="team" element={<Team />} />
                <Route path="projects" element={<Projects />} />
                <Route path="projectsDetail" element={<ProjectDetails />} />
                <Route path="taskDetails" element={<TaskDetails />} />
              </Route>
            </Routes>
          </UserSyncWrapper>
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </AuthAxiosProvider>
    </>
  );
};

export default App;
