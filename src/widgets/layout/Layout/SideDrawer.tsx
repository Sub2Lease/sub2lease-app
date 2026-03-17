import { clearToken, useIsAuthenticated } from "@/app/stores/authStore";
import { useNavigate } from "react-router-dom";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function SideDrawer({ isOpen, onClose }: Props) {
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();

  const handleLogout = () => {
    clearToken();
    navigate("/");
    onClose();
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      <div className={`fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-xl transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-black/10">
          <span className="font-semibold text-lg">Menu</span>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            ✕
          </button>
        </div>
        <nav className="flex flex-col px-4 py-4 gap-1">
          <button
            onClick={() => handleNavigate("/listings")}
            className="text-left px-4 py-3 rounded-xl text-sm font-medium hover:bg-gray-100 transition"
          >
            Browse listings
          </button>
          {isAuthenticated ? (
            <>
              <button
                onClick={() => handleNavigate("/listings/create")}
                className="text-left px-4 py-3 rounded-xl text-sm font-medium hover:bg-gray-100 transition"
              >
                Post a listing
              </button>
              <button
                onClick={() => handleNavigate("/dashboard")}
                className="text-left px-4 py-3 rounded-xl text-sm font-medium hover:bg-gray-100 transition"
              >
                Dashboard
              </button>
              <div className="border-t border-black/10 my-2" />
              <button
                onClick={handleLogout}
                className="text-left px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNavigate("/login")}
                className="text-left px-4 py-3 rounded-xl text-sm font-medium hover:bg-gray-100 transition"
              >
                Login
              </button>
              <button
                onClick={() => handleNavigate("/signup")}
                className="text-left px-4 py-3 rounded-xl text-sm font-medium hover:bg-gray-100 transition"
              >
                Sign up
              </button>
            </>
          )}
        </nav>
      </div>
    </>
  );
}