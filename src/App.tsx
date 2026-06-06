// @ts-nocheck
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ScrollToTop from "@/components/shared/ScrollToTop";
import SecurityHeaders from "@/components/SecurityHeaders";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

import Index from "./pages/Index";
import Installation from "./pages/Installation";
import HardwoodFlooring from "./pages/HardwoodFlooring";
import Refinishing from "./pages/Refinishing";
import SandingRefinish from "./pages/SandingRefinish";
import VinylPlankFlooring from "./pages/VinylPlankFlooring";
import Staircase from "./pages/Staircase";
import BaseBoards from "./pages/BaseBoards";
import Gallery from "./pages/Gallery";
import StainGallery from "./pages/StainGallery";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Campaign from "./pages/Campaign";
import Quiz from "./pages/Quiz";
import FloorDiagnostic from "./pages/FloorDiagnostic";
import ThankYou from "./pages/ThankYou";
import ScheduleEstimate from "./pages/ScheduleEstimate";
import ReferralProgram from "./pages/ReferralProgram";
import Builders from "./pages/Builders";
import Realtors from "./pages/Realtors";
import BuilderPartnerships from "./pages/BuilderPartnerships";
import PartnerProgram from "./pages/PartnerProgram";
import AxoMasterSystem from "./pages/AxoMasterSystem";
import WowPack from "./pages/WowPack";
import ReviewRequest from "./pages/ReviewRequest";
import Links from "./pages/Links";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SecurityHeaders />
            <ScrollToTop />
            <ErrorBoundary scope="app">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/installation" element={<Installation />} />
                <Route path="/hardwood-flooring" element={<HardwoodFlooring />} />
                <Route path="/refinishing" element={<Refinishing />} />
                <Route path="/sanding-and-refinish" element={<SandingRefinish />} />
                <Route path="/vinyl-plank-flooring" element={<VinylPlankFlooring />} />
                <Route path="/staircase" element={<Staircase />} />
                <Route path="/base-boards" element={<BaseBoards />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/stain-gallery" element={<StainGallery />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                <Route path="/campaign" element={<Campaign />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/floor-diagnostic" element={<FloorDiagnostic />} />
                <Route path="/thank-you" element={<ThankYou />} />
                <Route path="/schedule-estimate" element={<ScheduleEstimate />} />
                <Route path="/referral-program" element={<ReferralProgram />} />
                <Route path="/builders" element={<Builders />} />
                <Route path="/realtors" element={<Realtors />} />
                <Route path="/builder-offer" element={<BuilderPartnerships />} />
                <Route path="/partner-program" element={<PartnerProgram />} />
                <Route path="/axo-master-system" element={<AxoMasterSystem />} />
                <Route path="/wow-pack" element={<WowPack />} />
                <Route path="/review-request" element={<ReviewRequest />} />
                <Route path="/hub" element={<Links />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ErrorBoundary>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
