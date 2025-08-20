
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admissions from "./pages/Admissions";
import StudyGuides from "./pages/StudyGuides";
import Departments from "./pages/Departments";
import Alumni from "./pages/Alumni";
import Account from "./pages/Account";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import CommunityGuidelines from "./pages/CommunityGuidelines";
import GettingStarted from "./pages/study-guides/GettingStarted";
import ListingMastery from "./pages/study-guides/ListingMastery";
import ChainBuilding from "./pages/study-guides/ChainBuilding";
import TrustReputation from "./pages/study-guides/TrustReputation";
import ProfitMaximization from "./pages/study-guides/ProfitMaximization";
import DataDrivenSuccess from "./pages/study-guides/DataDrivenSuccess";
import ListingsPage from "./pages/Listings";
import PurchaseSuccess from "./pages/PurchaseSuccess";
import PurchaseCanceled from "./pages/PurchaseCanceled";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCanceled from "./pages/PaymentCanceled";
import ListingDetailsPage from "./pages/ListingDetails";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/admissions" element={<Admissions />} />
        <Route path="/study-guides" element={<StudyGuides />} />
        <Route path="/study-guides/getting-started" element={<GettingStarted />} />
        <Route path="/study-guides/listing-mastery" element={<ListingMastery />} />
        <Route path="/study-guides/chain-building" element={<ChainBuilding />} />
        <Route path="/study-guides/trust-reputation" element={<TrustReputation />} />
        <Route path="/study-guides/profit-maximization" element={<ProfitMaximization />} />
        <Route path="/study-guides/data-driven-success" element={<DataDrivenSuccess />} />
            
            <Route path="/alumni" element={<Alumni />} />
            <Route path="/account" element={<Account />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/community-guidelines" element={<CommunityGuidelines />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/listings" element={<ListingsPage />} />
            <Route path="/listings/:id" element={<ListingDetailsPage />} />
            <Route path="/purchase-success" element={<PurchaseSuccess />} />
            <Route path="/purchase-canceled" element={<PurchaseCanceled />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-canceled" element={<PaymentCanceled />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
