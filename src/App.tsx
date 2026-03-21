import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotFound } from "./apps/not-found";
import { CodeBenderProfile } from "./apps/codebender-profile";
import { ChallengesPage } from "./pages/ChallengesPage";
import { HallOfFamePage } from "./pages/HallOfFamePage";
import { BenderProfilePage } from "./pages/BenderProfilePage";
import { StackRadarPage } from "./pages/StackRadarPage";
import { RecruiterPage } from "./pages/RecruiterPage";
import { CompatibilityPage } from "./pages/CompatibilityPage";
import { Layout } from "@/components/layout/Layout";
import { HomePage } from "./pages/HomePage";
import { TheLastCodeBenderProfile } from "./apps/the-last-code-bender-profile";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Layout-wrapped routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/the-last-code-bender" element={<TheLastCodeBenderProfile />} />
            <Route path="/hall-of-fame" element={<HallOfFamePage />} />
            <Route path="/challenges" element={<ChallengesPage />} />
            <Route path="/stack-radar" element={<StackRadarPage />} />
            <Route path="/benders/:discipline/:handle" element={<BenderProfilePage />} />
            <Route path="/recruit" element={<RecruiterPage />} />
            <Route path="/compat" element={<CompatibilityPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          {/* Legacy full-screen IDE pages — no Layout */}
          <Route path="/codebender/:codebenderId" element={<CodeBenderProfile />} />
          <Route path="/codebender/:codebenderId/:section" element={<CodeBenderProfile />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
