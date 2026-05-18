import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import ServerStatus from "./components/ServerStatus";

// Lazy load pages for code splitting
const DocumentationLearning = lazy(() => import("./pages/DocumentationLearning.jsx"));
const VideoLearning = lazy(() => import("./pages/VideoLearning.jsx"));
const CropsVideo = lazy(() => import("./pages/CropsVideo.jsx"));
const CropVideoDetail = lazy(() => import("./pages/CropVideoDetail.jsx"));
const PesticidesFertilizerVideo = lazy(() => import("./pages/PesticidesFertilizerVideo.jsx"));
const PesticideFertilizerVideoDetail = lazy(() => import("./pages/PesticideFertilizerVideoDetail.jsx"));
const SeasonalFarmingVideo = lazy(() => import("./pages/SeasonalFarmingVideo.jsx"));
const SeasonalFarmingVideoDetail = lazy(() => import("./pages/SeasonalFarmingVideoDetail.jsx"));
const FarmingVideo = lazy(() => import("./pages/FarmingVideo.jsx"));
const FarmingVideoDetail = lazy(() => import("./pages/FarmingVideoDetail.jsx"));
const Crops = lazy(() => import("./pages/Crops"));
const CropDetails = lazy(() => import("./pages/CropDetails.jsx"));
const Pesticides = lazy(() => import("./pages/Pesticides"));
const PesticideDetails = lazy(() => import("./pages/PesticideDetails.jsx"));
const Fertilizers = lazy(() => import("./pages/Fertilizers"));
const FertilizerDetails = lazy(() => import("./pages/FertilizerDetails.jsx"));
const SeasonFarming = lazy(() => import("./pages/SeasonFarming"));
const Farming = lazy(() => import("./pages/Farming"));
const LearningHub = lazy(() => import("./pages/LearningHub"));
const SchemeSupport = lazy(() => import("./pages/SchemeSupport"));
const ExpertAdvice = lazy(() => import("./pages/ExpertAdvice"));
const BuyerRegistration = lazy(() => import("./pages/BuyerRegistration"));
const SellerRegistration = lazy(() => import("./pages/SellerRegistration"));
const BuyerMarketplace = lazy(() => import("./pages/BuyerMarketplace"));
const SellerMarketplace = lazy(() => import("./pages/SellerMarketplace"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const About = lazy(() => import("./pages/About"));
const BuyerProfile = lazy(() => import("./pages/BuyerProfile"));
const SellerProfile = lazy(() => import("./pages/SellerProfile"));
const IndianCropMap = lazy(() => import("./pages/IndianCropMap"));

const queryClient = new QueryClient();

const App = () => (
  <ServerStatus>
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>}>
              <Routes>
                <Route path="/" element={<Index />} />
              <Route path="/learning" element={<LearningHub />} />
              <Route path="/crop-map" element={<IndianCropMap />} />
              <Route path="/scheme-support" element={<SchemeSupport />} />
              <Route path="/expert-advice" element={<ExpertAdvice />} />
              <Route path="/documentation-learning" element={<DocumentationLearning />} />
              <Route path="/docs/crops" element={<Crops />} />
              <Route path="/docs/crops/:crop" element={<CropDetails />} />
              <Route path="/docs/pesticides" element={<Pesticides />} />
              <Route path="/docs/pesticides/:pesticide" element={<PesticideDetails />} />
              <Route path="/docs/fertilizers" element={<Fertilizers />} />
              <Route path="/docs/fertilizers/:fertilizer" element={<FertilizerDetails />} />
              <Route path="/docs/season-farming" element={<SeasonFarming />} />
              <Route path="/docs/farming" element={<Farming />} />
               <Route path="/video-learning" element={<VideoLearning />} />
               <Route path="/video/crops" element={<CropsVideo />} />
               <Route path="/video/crops/:crop" element={<CropVideoDetail />} />
               <Route path="/video/pesticides-fertilizer" element={<PesticidesFertilizerVideo />} />
               <Route path="/video/pesticides-fertilizer/:name" element={<PesticideFertilizerVideoDetail />} />
               <Route path="/video/seasonal-farming" element={<SeasonalFarmingVideo />} />
               <Route path="/video/seasonal-farming/:season" element={<SeasonalFarmingVideoDetail />} />
               <Route path="/video/farming" element={<FarmingVideo />} />
               <Route path="/video/farming/:crop" element={<FarmingVideoDetail />} />
              <Route path="/buyer-register" element={<BuyerRegistration />} />
              <Route path="/seller-register" element={<SellerRegistration />} />
              <Route path="/buyer-marketplace" element={<BuyerMarketplace />} />
              <Route path="/seller-marketplace" element={<SellerMarketplace />} />
              <Route path="/about" element={<About />} />
              <Route path="/buyer-profile" element={<BuyerProfile />} />
              <Route path="/seller-profile" element={<SellerProfile />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/login/:type" element={<Login />} />
              <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  </ServerStatus>
);

export default App;
