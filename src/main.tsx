import { createRoot } from 'react-dom/client'
import "./styles/main.css";
import "./styles/gradients.css";
import { ThemeProvider } from "@/app/theme/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router } from "@/app/router";

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <>
    <ThemeProvider />
    <TooltipProvider delayDuration={100}>
      <QueryClientProvider client={queryClient}>
        <Router />
      </QueryClientProvider>
    </TooltipProvider>
  </>,
)
