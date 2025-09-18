import { LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const Signout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("You have been successfully logged out", {
      duration: 3000,
      style: {
        background: "#1e293b",
        color: "#f8fafc",
      },
      icon: "👋",
    });
    navigate("/signup");
  };

  return (
    <div className="mt-auto px-4 pb-6">
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 max-w-48 text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 px-4 py-2 rounded-lg transition-colors duration-200 group cursor-pointer"
      >
        <LogOut className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" />
        <span className="group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
          Sign out
        </span>
      </button>
    </div>
  );
};
