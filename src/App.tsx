import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from "./apps/landing-page";
import { NotFound } from "./apps/not-found";
import { CodeBenderProfile } from "./apps/codebender-profile";
import { ChallengesPage } from "./pages/ChallengesPage";
import { HallOfFamePage } from "./pages/HallOfFamePage";
import { BenderProfilePage } from "./pages/BenderProfilePage";
import { StackRadarPage } from "./pages/StackRadarPage";
import { RecruiterPage } from "./pages/RecruiterPage";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/codebender/:codebenderId" element={<CodeBenderProfile />} />
          <Route path="/codebender/:codebenderId/:section" element={<CodeBenderProfile />} />
          <Route path="/challenges" element={<ChallengesPage />} />
          <Route path="/hall-of-fame" element={<HallOfFamePage />} />
          <Route path="/stack-radar" element={<StackRadarPage />} />
          <Route path="/benders/:discipline/:handle" element={<BenderProfilePage />} />
          <Route path="/recruit" element={<RecruiterPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
