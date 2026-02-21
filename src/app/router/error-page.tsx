import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/shared/ui/Button";

export const ErrorPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.reload();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleNavigateHome = () => {
    navigate("/");
  };

  const handleReload = () => window.location.reload();

  return (
    <div className="full-height-minus-header-and-footer flex flex-col items-center justify-center gap-5 text-center">
      <div>
        <p>Something went wrong...</p>
        <p className="text-sm text-wise-white/50">Page will automatically reload in 5 seconds</p>
      </div>
      <div className="flex gap-5">
        <Button onClick={handleReload}>Reload now</Button>
        <Button variant="reversed" onClick={handleNavigateHome}>
          Go Home
        </Button>
      </div>
    </div>
  );
};
