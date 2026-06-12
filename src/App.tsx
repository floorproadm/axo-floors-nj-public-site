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
import Refinishing from "./pages/Refinishing";
import VinylPlankFlooring from "./pages/VinylPlankFlooring";
import Staircase from "./pages/Staircase";
import BaseBoards from "./pages/BaseBoards";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import About from "./pages/About";
import StainGallery from "./pages/StainGallery";
import BuilderPartnerships from "./pages/BuilderPartnerships";
import PartnerProgram from "./pages/PartnerProgram";
import Quiz from "./pages/Quiz";
import ThankYou from "./pages/ThankYou";
import ScheduleEstimate from "./pages/ScheduleEstimate";
import ReferralProgram from "./pages/ReferralProgram";
import Builders from "./pages/Builders";
import Realtors from "./pages/Realtors";
import ShareBeforeAfter from "./pages/ShareBeforeAfter";
import Auth from "./pages/Auth";
import Campaign from "./pages/Campaign";

import WowPack from "./pages/WowPack";
import AxoMasterSystem from "./pages/AxoMasterSystem";
import ReviewRequest from "./pages/ReviewRequest";
import NotFound from "./pages/NotFound";
import SharedPost from "./pages/SharedPost";
import PublicInvoice from "./pages/PublicInvoice";
import PublicProposal from "./pages/PublicProposal";
import PublicDepositInvoice from "./pages/PublicDepositInvoice";
import PublicPortal from "./pages/PublicPortal";
import Links from "./pages/Links";
import ReferralAuth from "./pages/ReferralAuth";
import ResetPassword from "./pages/ResetPassword";
import CityLocationPage from "./pages/locations/CityLocationPage";
import NewJerseyServiceAreasPage from "./pages/locations/NewJerseyServiceAreasPage";

const queryClient = new QueryClient();

const App = () => {
  return (
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
                  <Route path="/hardwood-flooring" element={<Navigate to="/installation" replace />} />
                  <Route path="/refinishing" element={<Refinishing />} />
                  <Route path="/sanding-and-refinish" element={<Navigate to="/refinishing" replace />} />
                  <Route path="/vinyl-plank-flooring" element={<VinylPlankFlooring />} />
                  <Route path="/staircase" element={<Staircase />} />
                  <Route path="/base-boards" element={<BaseBoards />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/stain-gallery" element={<StainGallery />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/campaign" element={<Campaign />} />
                  <Route path="/quiz" element={<Quiz />} />
                  <Route path="/thank-you" element={<ThankYou />} />
                  <Route path="/schedule-estimate" element={<ScheduleEstimate />} />
                  <Route path="/referral-program" element={<ReferralProgram />} />
                  <Route path="/referral/auth" element={<ReferralAuth />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/builders" element={<Builders />} />
                  <Route path="/realtors" element={<Realtors />} />
                  <Route path="/builder-offer" element={<BuilderPartnerships />} />
                  <Route path="/partner-program" element={<PartnerProgram />} />
                  <Route path="/floor-diagnostic" element={<Navigate to="/quiz" replace />} />
                  
                  <Route path="/wow-pack" element={<WowPack />} />
                  <Route path="/review-request" element={<ReviewRequest />} />
                  <Route path="/shared/:token" element={<SharedPost />} />
                  <Route path="/share/before-after/:token" element={<ShareBeforeAfter />} />
                  <Route path="/invoice/:token" element={<PublicInvoice />} />
                  <Route path="/proposal/:token" element={<PublicProposal />} />
                  <Route path="/proposal/:token/invoice" element={<PublicDepositInvoice />} />
                  <Route path="/portal/:token" element={<PublicPortal />} />
                  <Route path="/hub" element={<Links />} />
                  <Route path="/auth" element={<Auth />} />
                  {/* Programmatic local SEO — Phase 2 pilot: single dynamic route, gated by `published` in the dataset */}
                  <Route path="/service-areas/new-jersey" element={<NewJerseyServiceAreasPage />} />
                  <Route path="/service-areas/new-jersey/:slug" element={<CityLocationPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ErrorBoundary>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
