import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import Index from "./pages/Index";
import DocumentationLearning from "./pages/DocumentationLearning.jsx";
import VideoLearning from "./pages/VideoLearning.jsx";
import CropsVideo from "./pages/CropsVideo.jsx";
import CropVideoDetail from "./pages/CropVideoDetail.jsx";
import PesticidesFertilizerVideo from "./pages/PesticidesFertilizerVideo.jsx";
import PesticideFertilizerVideoDetail from "./pages/PesticideFertilizerVideoDetail.jsx";
import SeasonalFarmingVideo from "./pages/SeasonalFarmingVideo.jsx";
import SeasonalFarmingVideoDetail from "./pages/SeasonalFarmingVideoDetail.jsx";
import FarmingVideo from "./pages/FarmingVideo.jsx";
import FarmingVideoDetail from "./pages/FarmingVideoDetail.jsx";
import Crops from "./pages/Crops";
import CropDetails from "./pages/CropDetails.jsx";
import Pesticides from "./pages/Pesticides";
import PesticideDetails from "./pages/PesticideDetails.jsx";
import Fertilizers from "./pages/Fertilizers";
import FertilizerDetails from "./pages/FertilizerDetails.jsx";
import SeasonFarming from "./pages/SeasonFarming";
import Farming from "./pages/Farming";
import LearningHub from "./pages/LearningHub";
import SchemeSupport from "./pages/SchemeSupport";
import ExpertAdvice from "./pages/ExpertAdvice";
import BuyerRegistration from "./pages/BuyerRegistration";
import SellerRegistration from "./pages/SellerRegistration";
import BuyerMarketplace from "./pages/BuyerMarketplace";
import SellerMarketplace from "./pages/SellerMarketplace";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import AdminPanel from "./pages/AdminPanel";
import ServerStatus from "./components/ServerStatus";

const queryClient = new QueryClient();

const App = () => (
  <ServerStatus>
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/learning" element={<LearningHub />} />
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
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/login/:type" element={<Login />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  </ServerStatus>
);

export default App;
