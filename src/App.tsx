import { useEffect, useState } from "react";
import { RouterProvider } from "react-router"
import Router from "./routes/Router"
import { Toaster } from 'sonner';
import { QueryClient } from "@tanstack/react-query";
import { TooltipLayer } from "./components/ui/Tooltip";
import GlobalModalHost from "./components/global/GlobalModalHost";

export const queryClient = new QueryClient();
const MOBILE_TOAST_QUERY = "(max-width: 767px)";

const getIsMobileToastViewport = () => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }

  return window.matchMedia(MOBILE_TOAST_QUERY).matches;
};

function ResponsiveToaster() {
  const [isMobileViewport, setIsMobileViewport] = useState(getIsMobileToastViewport);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia(MOBILE_TOAST_QUERY);
    const handleViewportChange = (event: MediaQueryListEvent) => {
      setIsMobileViewport(event.matches);
    };
    const legacyMediaQuery = mediaQuery as MediaQueryList & {
      addListener?: (listener: (event: MediaQueryListEvent) => void) => void;
      removeListener?: (listener: (event: MediaQueryListEvent) => void) => void;
    };

    setIsMobileViewport(mediaQuery.matches);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleViewportChange);
    } else {
      legacyMediaQuery.addListener?.(handleViewportChange);
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", handleViewportChange);
      } else {
        legacyMediaQuery.removeListener?.(handleViewportChange);
      }
    };
  }, []);

  return (
    <Toaster
      position={isMobileViewport ? "top-center" : "bottom-left"}
      richColors
    />
  );
}

function App() {

  return (
    <>
    <RouterProvider router={Router} />
    <GlobalModalHost />
    <TooltipLayer />
    <ResponsiveToaster />
    </>
  )
}

export default App
