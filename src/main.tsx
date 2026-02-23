import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./styles/main.css";
import "./styles/gradients.css";
import { ThemeProvider } from "@/app/theme/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Router } from "@/app/router";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider />
    <TooltipProvider delayDuration={100}>
      <Router />
    </TooltipProvider>
  </StrictMode>,
)
