import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotFound } from "./apps/not-found";
import { ChallengesPage } from "./apps/challenges";
import { HallOfFamePage } from "./apps/hall-of-fame";
import { BenderProfilePage } from "./apps/bender-profile";
import { StackRadarPage } from "./apps/stack-radar";
import { RecruiterPage } from "./apps/recruit";
import { CompatibilityPage } from "./apps/compat";
import { DocsPage } from "./apps/docs";
import { Layout } from "@/components/layout/Layout";
import { HomePage } from "./apps/landing-page";
import { LoginPage } from "./apps/auth";
import { Dashboard } from "./apps/dash-board";
import { ProfileWorkspacePage } from "./apps/profile-workspace";
import { AuthProvider } from "@/contexts/AuthContext";
import { RequireAuth } from "@/components/auth/RequireAuth";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Full-screen pages — no Layout */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={
              <RequireAuth><Dashboard /></RequireAuth>
            } />
            <Route path="/dashboard/workspace" element={
              <RequireAuth><ProfileWorkspacePage /></RequireAuth>
            } />

            {/* Layout-wrapped routes */}
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/hall-of-fame" element={<HallOfFamePage />} />
              <Route path="/challenges" element={<ChallengesPage />} />
              <Route path="/stack-radar" element={<StackRadarPage />} />
              <Route path="/benders/:discipline/:handle" element={<BenderProfilePage />} />
              <Route path="/recruit" element={<RecruiterPage />} />
              <Route path="/compat" element={<CompatibilityPage />} />
              <Route path="/docs" element={<DocsPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
