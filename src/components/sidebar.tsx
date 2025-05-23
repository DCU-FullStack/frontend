import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { 
  Home, 
  Video, 
  AlertTriangle, 
  ClipboardCheck, 
  BarChart3, 
  Settings, 
  LogOut,
  LogIn,
  Lock,
  Cog
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  to: string;
  isActive?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
};

const NavItem = ({ icon, label, to, isActive = false, onClick, disabled = false }: NavItemProps) => (
  <li className="mb-2">
    {disabled ? (
      <div
        className={cn(
          "flex items-center py-3 px-4 text-gray-400 rounded cursor-not-allowed",
          "opacity-50"
        )}
        title="로그인이 필요합니다"
      >
        {icon}
        <span className="hidden ml-3 md:block">{label}</span>
        <Lock className="w-4 h-4 ml-2" />
      </div>
    ) : (
      <Link
        to={to}
        onClick={onClick}
        className={cn(
          "flex items-center py-3 px-4 text-black rounded transition-colors duration-200 ease-in-out",
          isActive 
            ? "bg-lavender" 
            : "hover:bg-secondary"
        )}
      >
        {icon}
        <span className="hidden ml-3 md:block">{label}</span>
      </Link>
    )}
  </li>
);

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logoutMutation, user, isAdmin } = useAuth();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      navigate("/auth");
    }
  };

  const handleProtectedRouteClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      navigate("/auth");
    }
  };

  return (
    <aside className={cn(
      "bg-secondary-dark text-black flex flex-col h-screen",
      isExpanded ? "w-64" : "w-16"
    )}>
      <div className="flex items-center justify-center p-4 md:justify-start">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 13l1.5-4.5A2 2 0 016.4 7h11.2a2 2 0 011.9 1.5L21 13v5a1 1 0 01-1 1h-1a2 2 0 01-4 0H9a2 2 0 01-4 0H4a1 1 0 01-1-1v-5z" />
        <circle cx="7" cy="18" r="1" stroke="currentColor" strokeWidth="2" />
        <circle cx="17" cy="18" r="1" stroke="currentColor" strokeWidth="2" />
      </svg>

        {isExpanded && (
          <span className="hidden ml-2 text-xl font-bold md:block">스마트 도로 시스템</span>
        )}
      </div>
      
      <nav className="flex-1 mt-6">
        <ul>
          <NavItem 
            icon={<Home className="w-5 h-5" />} 
            label="홈" 
            to="/" 
            isActive={location.pathname === "/"} 
          />
          <NavItem 
            icon={<Video className="w-5 h-5" />} 
            label="CCTV 감시" 
            to="/cctv" 
            isActive={location.pathname === "/cctv"} 
            disabled={!user}
            onClick={handleProtectedRouteClick}
          />
          <NavItem 
            icon={<AlertTriangle className="w-5 h-5" />} 
            label="이상 보고" 
            to="/incidents" 
            isActive={location.pathname === "/incidents"} 
            disabled={!user}
            onClick={handleProtectedRouteClick}
          />
          <NavItem 
            icon={<ClipboardCheck className="w-5 h-5" />} 
            label="작업 현황" 
            to="/tasks" 
            isActive={location.pathname === "/tasks"} 
            disabled={!user}
            onClick={handleProtectedRouteClick}
          />
          <NavItem 
            icon={<BarChart3 className="w-5 h-5" />} 
            label="데이터 분석" 
            to="/analytics" 
            isActive={location.pathname === "/analytics"} 
            disabled={!user}
            onClick={handleProtectedRouteClick}
          />
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        
        {user ? (
          <button 
            onClick={handleLogout}
            className="flex items-center w-full py-2 mt-2 text-black transition-colors duration-200 ease-in-out hover:text-gray-700"
          >
            <LogOut className="w-5 h-5" />
            {isExpanded && <span className="hidden ml-3 md:block">로그아웃</span>}
          </button>
        ) : (
          <Link
            to="/auth"
            className="flex items-center w-full py-2 mt-2 text-black transition-colors duration-200 ease-in-out hover:text-gray-700"
          >
            <LogIn className="w-5 h-5" />
            {isExpanded && <span className="hidden ml-3 md:block">로그인</span>}
          </Link>
        )}
      </div>
    </aside>
  );
}
