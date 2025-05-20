import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MobileNavigation from "./components/MobileNavigation";
import SignalsPage from "./pages/SignalsPage";
import NewsPage from "./pages/NewsPage";
import Dashboard from "./pages/Dashboard";

function Router() {
  const [location] = useLocation();

  return (
    <>
      <Header currentPath={location} />
      <main className="container mx-auto px-4 py-8 mb-16 md:mb-0">
        <Switch>
          <Route path="/" component={SignalsPage} />
          <Route path="/signals" component={SignalsPage} />
          <Route path="/news" component={NewsPage} />
          <Route path="/dashboard" component={Dashboard} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <MobileNavigation currentPath={location} />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
